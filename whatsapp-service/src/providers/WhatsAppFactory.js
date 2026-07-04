/**
 * WhatsApp Provider Factory + Manager
 *
 * Manages one active provider per user.
 * Sessions are stored in Supabase (wa_sessions.session_data) so they survive
 * Railway restarts and redeploys — no QR re-scan needed after a deploy.
 *
 * Auto-falls back:  Baileys → WWebJS
 */
const BaileysProvider = require("./BaileysProvider");
const WWebJSProvider  = require("./WWebJSProvider");
const pino = require("pino");
const { supabase } = require("../middleware/auth");

const log = pino({ transport: { target: "pino-pretty" } });

const PROVIDER_ORDER = ["baileys", "wweb"];

// Map userId → { provider: string, instance: IWhatsAppProvider }
const activeProviders = new Map();

// ─── Provider lifecycle ────────────────────────────────────────────────────

/**
 * Initialise a WhatsApp connection for a user.
 * When session_data exists in Supabase, Baileys reconnects silently (no QR).
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
      // onQR — only fires when no valid creds exist
      async (qrDataUrl) => {
        io.to(`user:${userId}`).emit("wa:qr", { qr: qrDataUrl, provider: providerName });
        await updateSessionStatus(userId, "qr_pending", providerName);
      },
      // onReady — fires when connection is established (with or without QR)
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
    return initSession(userId, io, providerIndex + 1);
  }

  return instance;
}

// ─── Session restore on startup ────────────────────────────────────────────

/**
 * On service startup, find all users whose wa_sessions.status = 'connected'
 * AND have session_data stored.  Re-initialise their provider — Baileys will
 * use the stored credentials and reconnect without a new QR scan.
 *
 * @param {import('socket.io').Server} io
 */
async function restoreAllSessions(io) {
  try {
    const { data: rows, error } = await supabase
      .from("wa_sessions")
      .select("user_id, provider, status, session_data")
      .eq("status", "connected")
      .not("session_data", "is", null);

    if (error) {
      log.warn({ error }, "[Factory] Could not query wa_sessions for restore");
      return;
    }

    if (!rows?.length) {
      log.info("[Factory] No sessions to restore");
      return;
    }

    log.info(`[Factory] Restoring ${rows.length} WhatsApp session(s)…`);

    for (const row of rows) {
      try {
        // Mark as reconnecting in DB while we re-init
        await updateSessionStatus(row.user_id, "reconnecting", row.provider);
        await initSession(row.user_id, io, PROVIDER_ORDER.indexOf(row.provider) >= 0 ? PROVIDER_ORDER.indexOf(row.provider) : 0);
        log.info(`[Factory] Session restored for user ${row.user_id}`);
      } catch (err) {
        log.error({ err, userId: row.user_id }, "[Factory] Failed to restore session");
        await updateSessionStatus(row.user_id, "disconnected", row.provider);
      }
    }
  } catch (err) {
    log.error({ err }, "[Factory] restoreAllSessions error");
  }
}

// ─── Getters ───────────────────────────────────────────────────────────────

/**
 * Get the active in-memory provider for a user.
 * If not in memory but Supabase shows connected+session_data, auto-restores.
 * Throws if truly not connected.
 *
 * @param {string} userId
 * @param {import('socket.io').Server} [io]   - required for auto-restore
 */
async function getOrRestoreProvider(userId, io) {
  // Fast path — already in memory
  const entry = activeProviders.get(userId);
  if (entry && entry.instance.status === "connected") return entry.instance;

  // Slow path — try to restore from Supabase
  if (io) {
    const { data: row } = await supabase
      .from("wa_sessions")
      .select("session_data, provider, status")
      .eq("user_id", userId)
      .maybeSingle();

    if (row?.session_data && row.status === "connected") {
      log.info(`[Factory] Auto-restoring session for user ${userId}`);
      try {
        const providerIdx = Math.max(0, PROVIDER_ORDER.indexOf(row.provider ?? "baileys"));
        return await initSession(userId, io, providerIdx);
      } catch (err) {
        log.error({ err }, "[Factory] Auto-restore failed");
      }
    }
  }

  throw new Error("WhatsApp session disconnected");
}

/** Synchronous getter (used in messageSender — io passed separately) */
function getActiveProvider(userId) {
  const entry = activeProviders.get(userId);
  if (!entry) throw new Error("No active WhatsApp session");
  return entry.instance;
}

// ─── Disconnect ────────────────────────────────────────────────────────────

async function disconnectSession(userId) {
  const entry = activeProviders.get(userId);
  if (entry) {
    await entry.instance.disconnect();
    activeProviders.delete(userId);
  }
  await updateSessionStatus(userId, "disconnected");
}

// ─── DB helper ────────────────────────────────────────────────────────────

async function updateSessionStatus(userId, status, provider, phone) {
  try {
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from("wa_sessions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from("wa_sessions")
        .update({
          status,
          provider: provider || "baileys",
          phone: phone || null,
          last_seen: now,
          updated_at: now,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("wa_sessions").insert({
        user_id: userId,
        status,
        provider: provider || "baileys",
        phone: phone || null,
        last_seen: now,
        updated_at: now,
      });
    }

    log.info(`[DB] wa_sessions: user=${userId} status=${status}`);
  } catch (err) {
    log.error(err, "Failed to update wa_sessions");
  }
}

module.exports = {
  initSession,
  getActiveProvider,
  getOrRestoreProvider,
  disconnectSession,
  restoreAllSessions,
  activeProviders,
};
