const pino = require("pino");
const { supabase } = require("../middleware/auth");
const { getOrRestoreProvider } = require("../providers/WhatsAppFactory");

const log = pino({ transport: { target: "pino-pretty" } });

const SPIN_VARIANTS = {
  "😊": ["😊", "😄", "🙂", "😀"],
  "👋": ["👋", "🖐️", "✋"],
  "🎉": ["🎉", "🎊", "🥳"],
  "💯": ["💯", "✅", "👍"],
  "🔥": ["🔥", "⚡", "💪"],
};

/**
 * Apply message spinning — randomly vary emojis and add small phrasing tweaks.
 * @param {string} template
 * @returns {string}
 */
function spinMessage(template) {
  let msg = template;
  // Vary known emojis
  for (const [base, variants] of Object.entries(SPIN_VARIANTS)) {
    if (msg.includes(base) && Math.random() > 0.4) {
      const replacement = variants[Math.floor(Math.random() * variants.length)];
      msg = msg.replace(base, replacement);
    }
  }
  return msg;
}

/**
 * Replace {{name}}, {{phone}}, and custom {{var}} placeholders.
 * @param {string} template
 * @param {object} vars - { name, phone, ...custom }
 * @returns {string}
 */
function applyVariables(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || "");
}

/**
 * Random delay between min and max seconds.
 * @param {number} minSec
 * @param {number} maxSec
 */
function randomDelay(minSec, maxSec) {
  const ms = (minSec + Math.random() * (maxSec - minSec)) * 1000;
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Send all messages for a campaign.
 * Emits progress events via socket.io.
 *
 * @param {object} opts
 * @param {string} opts.campaignId
 * @param {string} opts.userId
 * @param {object} opts.io - socket.io server
 * @param {Function} opts.onAbort - returns true if campaign should stop
 */
async function sendCampaign({ campaignId, userId, io, onAbort }) {
  const emit = (event, data) => io.to(`user:${userId}`).emit(event, data);

  // Load campaign
  const { data: campaign, error: campErr } = await supabase
    .from("wa_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();
  if (campErr || !campaign) throw new Error("Campaign not found");

  // Load contacts
  const { data: contacts } = await supabase
    .from("wa_contacts")
    .select("id, name, phone, variables")
    .in("id", campaign.contact_ids || []);

  if (!contacts?.length) throw new Error("No contacts found for campaign");

  // ── Daily limit check ───────────────────────────────────────────────────
  const { data: sub } = await supabase
    .from("wa_subscriptions")
    .select("wa_plans(msg_per_day, name)")
    .eq("user_id", userId)
    .maybeSingle();
  const dailyLimit = sub?.wa_plans?.msg_per_day ?? 50;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: todaySentCount } = await supabase
    .from("wa_message_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "sent")
    .gte("sent_at", todayStart.toISOString());

  let remainingToday = dailyLimit === -1 ? Infinity : Math.max(0, dailyLimit - (todaySentCount ?? 0));

  if (remainingToday <= 0) {
    await supabase.from("wa_campaigns").update({
      status: "paused",
      error_message: `Daily limit of ${dailyLimit} messages reached. Re-run tomorrow.`,
      updated_at: new Date().toISOString(),
    }).eq("id", campaignId);
    emit("campaign:error", { campaignId, message: `Daily limit reached (${dailyLimit} msgs/day on ${sub?.wa_plans?.name || "Free"} plan). Campaign paused.` });
    return;
  }
  // ────────────────────────────────────────────────────────────────────────

  // Update status to running
  await supabase.from("wa_campaigns").update({ status: "running", started_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", campaignId);

  emit("campaign:started", { campaignId, total: contacts.length, dailyLimit, remainingToday });

  let sent = 0, failed = 0;
  const attachments = campaign.attachments || [];

  for (const contact of contacts) {
    if (onAbort?.()) break;

    // Re-check daily limit each iteration
    if (remainingToday <= 0) {
      await supabase.from("wa_campaigns").update({
        status: "paused",
        error_message: `Daily limit of ${dailyLimit} messages reached. Re-run tomorrow.`,
        updated_at: new Date().toISOString(),
      }).eq("id", campaignId);
      emit("campaign:error", { campaignId, message: `Daily limit reached (${dailyLimit}/day). Campaign paused — re-run tomorrow.` });
      break;
    }

    let provider;
    try {
      provider = await getOrRestoreProvider(userId, io);
    } catch {
      await supabase.from("wa_campaigns").update({ status: "failed", error_message: "WhatsApp not connected", updated_at: new Date().toISOString() }).eq("id", campaignId);
      emit("campaign:error", { campaignId, message: "WhatsApp session disconnected — please reconnect on the Connect page" });
      return;
    }

    // Build personalised message
    const vars = { name: contact.name || "", phone: contact.phone, ...(contact.variables || {}) };
    let msg = applyVariables(campaign.message_template, vars);
    if (campaign.spin_enabled) msg = spinMessage(msg);

    const delayMs = Math.round((campaign.delay_min_sec + Math.random() * (campaign.delay_max_sec - campaign.delay_min_sec)) * 1000);

    // Log start
    const { data: logEntry } = await supabase.from("wa_message_logs").insert({
      campaign_id: campaignId,
      user_id: userId,
      contact_id: contact.id,
      phone: contact.phone,
      name: contact.name,
      message_sent: msg,
      status: "pending",
      provider: provider.name,
    }).select().single();

    emit("campaign:progress", {
      campaignId,
      phone: contact.phone,
      name: contact.name,
      status: "sending",
      sent,
      failed,
      total: contacts.length,
    });

    try {
      // Typing simulation
      if (campaign.typing_sim) {
        await provider.sendTyping(contact.phone, Math.min(delayMs * 0.3, 3000));
      }

      if (attachments.length > 0) {
        // Send first attachment with text as caption, rest as plain media
        for (let i = 0; i < attachments.length; i++) {
          const att = attachments[i];
          if (att.url) {
            await provider.sendMedia(contact.phone, {
              type: att.type || "document",
              url: att.url,
              mimetype: att.mimetype,
              name: att.name,
              caption: i === 0 ? msg : undefined, // caption only on first attachment
            });
          }
        }
        // If no valid URL attachments were sent, fall back to text
        const hasUrl = attachments.some((a) => a.url);
        if (!hasUrl) await provider.sendText(contact.phone, msg);
      } else {
        await provider.sendText(contact.phone, msg);
      }

      sent++;
      remainingToday = Math.max(0, remainingToday - 1);
      await supabase.from("wa_message_logs").update({ status: "sent", sent_at: new Date().toISOString(), delay_used: delayMs }).eq("id", logEntry?.id);
      await supabase.from("wa_campaigns").update({ sent_count: sent, updated_at: new Date().toISOString() }).eq("id", campaignId);

      emit("campaign:progress", {
        campaignId, phone: contact.phone, name: contact.name, status: "sent",
        sent, failed, total: contacts.length,
        log: `[${new Date().toLocaleTimeString("en-IN")}] [SENT] ${contact.name} +${contact.phone}`,
      });
    } catch (sendErr) {
      failed++;
      const errMsg = sendErr.message || "Send failed";
      await supabase.from("wa_message_logs").update({ status: "failed", error_msg: errMsg }).eq("id", logEntry?.id);
      await supabase.from("wa_campaigns").update({ failed_count: failed, updated_at: new Date().toISOString() }).eq("id", campaignId);

      emit("campaign:progress", {
        campaignId, phone: contact.phone, name: contact.name, status: "failed",
        sent, failed, total: contacts.length,
        log: `[${new Date().toLocaleTimeString("en-IN")}] [FAIL] +${contact.phone} — ${errMsg}`,
      });

      log.warn(`[Sender] Failed +${contact.phone}: ${errMsg}`);
    }

    // Random delay before next message
    emit("campaign:waiting", { campaignId, delayMs, next: contacts.indexOf(contact) + 1 });
    await new Promise((r) => setTimeout(r, delayMs));
  }

  // Finalise
  const finalStatus = failed === contacts.length ? "failed" : "completed";
  const completedAt = new Date().toISOString();
  await supabase.from("wa_campaigns").update({
    status: finalStatus,
    completed_at: completedAt,
    sent_count: sent,
    failed_count: failed,
    pending_count: 0,
    updated_at: completedAt,
  }).eq("id", campaignId);

  emit("campaign:completed", {
    campaignId,
    sent,
    failed,
    total: contacts.length,
    successRate: Math.round((sent / contacts.length) * 100),
  });

  log.info(`[Sender] Campaign ${campaignId} done — ${sent} sent, ${failed} failed`);
}

module.exports = { sendCampaign, spinMessage, applyVariables };
