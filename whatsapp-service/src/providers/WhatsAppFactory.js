/**
 * WhatsApp Provider Factory + Manager
 *
 * Manages one active provider per user.
 * Auto-falls back:  Baileys → WWebJS → WPPConnect
 *
 * Provider instances are stored in memory on this Railway process.
 * Sessions are persisted to disk (Baileys) or LocalAuth (WWebJS).
 */
const BaileysProvider = require("./BaileysProvider");
const WWebJSProvider = require("./WWebJSProvider");
const pino = require("pino");
const { supabase } = require("../middleware/auth");

const log = pino({ transport: { target: "pino-pretty" } });

const PROVIDER_ORDER = ["baileys", "wweb"];

// Map userId → { provider, instance }
const activeProviders = new Map();

/**
 * Get or create a provider instance for a user.
 * @param {string} userId
 * @param {string} [preferredProvider]
 * @returns {IWhatsAppProvider}
 */
function getProviderInstance(userId, preferredProvider = "baileys") {
  const existing = activeProviders.get(userId);
  if (existing) return existing.instance;

  const ProviderClass = preferredProvider === "wweb" ? WWebJSProvider : BaileysProvider;
  const instance = new ProviderClass(userId);
  activeProviders.set(userId, { provider: preferredProvider, instance });
  return instance;
}

/**
 * Initialise a WhatsApp connection for a user.
 * Returns a QR data URL via the onQR callback.
 * Falls back to next provider if current one throws.
 */
async function initSession(userId, io, providerIndex = 0) {
  if (providerIndex >= PROVIDER_ORDER.length) {
    throw new Error("All WhatsApp providers failed. Please try again later.");
  }

  const providerName = PROVIDER_ORDER[providerIndex];
  log.info(`[Factory] Trying provider ${providerName} for user ${userId}`);

  // Tear down any existing instance
  const existing = activeProviders.get(userId);
  if (existing) {
    try { await existing.instance.disconnect(); } catch { /* ignore */ }
  }

  const ProviderClass = providerName === "wweb" ? WWebJSProvider : BaileysProvider;
  const instance = new ProviderClass(userId);
  activeProviders.set(userId, { provider: providerName, instance });

  try {
    await instance.init(
      // onQR
      async (qrDataUrl) => {
        io.to(`user:${userId}`).emit("wa:qr", { qr: qrDataUrl, provider: providerName });
        await updateSessionStatus(userId, "qr_pending", providerName);
      },
      // onReady
      async (info) => {
        const phone = info?.id?.user || info?.wid?.user || "";
        io.to(`user:${userId}`).emit("wa:ready", { provider: providerName, phone });
        await updateSessionStatus(userId, "connected", providerName, phone);
        log.info(`[Factory] ${providerName} ready for user ${userId} — phone: ${phone}`);
      },
      // onDisconnected
      async (reason) => {
        io.to(`user:${userId}`).emit("wa:disconnected", { reason, provider: providerName });
        await updateSessionStatus(userId, "disconnected", providerName);
        if (reason === "logged_out") {
          activeProviders.delete(userId);
        }
      }
    );
  } catch (err) {
    log.error(err, `[Factory] ${providerName} failed for ${userId} — trying next`);
    // Fallback to next provider
    return initSession(userId, io, providerIndex + 1);
  }

  return instance;
}

/** Get the active provider for a user (throws if not connected) */
function getActiveProvider(userId) {
  const entry = activeProviders.get(userId);
  if (!entry) throw new Error("No active WhatsApp session");
  return entry.instance;
}

/** Disconnect a user's session */
async function disconnectSession(userId) {
  const entry = activeProviders.get(userId);
  if (entry) {
    await entry.instance.disconnect();
    activeProviders.delete(userId);
  }
  await updateSessionStatus(userId, "disconnected");
}

async function updateSessionStatus(userId, status, provider, phone) {
  try {
    const now = new Date().toISOString();
    const payload = {
      user_id: userId,
      status,
      provider: provider || "baileys",
      phone: phone || null,
      last_seen: now,
      updated_at: now,
    };

    // Check if a row already exists for this user
    const { data: existing } = await supabase
      .from("wa_sessions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.id) {
      // Update existing row
      await supabase
        .from("wa_sessions")
        .update({ status, provider: provider || "baileys", phone: phone || null, last_seen: now, updated_at: now })
        .eq("id", existing.id);
    } else {
      // Insert new row
      await supabase.from("wa_sessions").insert(payload);
    }

    log.info(`[DB] wa_sessions updated: user=${userId} status=${status}`);
  } catch (err) {
    log.error(err, "Failed to update wa_sessions");
  }
}

module.exports = { initSession, getActiveProvider, disconnectSession, activeProviders };
