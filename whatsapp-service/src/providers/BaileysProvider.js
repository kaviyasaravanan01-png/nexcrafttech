const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode");
const pino = require("pino");
const IWhatsAppProvider = require("./IWhatsAppProvider");
const { useSupabaseAuthState } = require("./useSupabaseAuthState");
const { supabase } = require("../middleware/auth");

const log = pino({ transport: { target: "pino-pretty" } });

class BaileysProvider extends IWhatsAppProvider {
  constructor(userId) {
    super(userId);
    this.name = "baileys";
    this.sock = null;
    this.status = "disconnected";
  }

  /**
   * Initialise the WhatsApp socket.
   * Uses Supabase-backed auth state so sessions survive Railway restarts.
   *
   * @param {Function} [onQR]          - called with QR data-URL
   * @param {Function} [onReady]       - called with Baileys user info when connected
   * @param {Function} [onDisconnected] - called with reason string on disconnect
   */
  async init(onQR, onReady, onDisconnected) {
    // Load / create credentials from Supabase
    const { state, saveCreds } = await useSupabaseAuthState(supabase, this.userId);

    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["NexCraft WA CRM", "Chrome", "130.0"],
    });

    // Persist credentials on every update
    this.sock.ev.on("creds.update", saveCreds);

    this.sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        const qrDataUrl = await qrcode.toDataURL(qr);
        this.status = "qr_pending";
        log.info(`[Baileys] QR ready for user ${this.userId}`);
        onQR?.(qrDataUrl);
      }

      if (connection === "open") {
        this.status = "connected";
        log.info(`[Baileys] Connected: ${this.userId}`);
        onReady?.(this.sock.user);
      }

      if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = code !== DisconnectReason.loggedOut;
        this.status = shouldReconnect ? "reconnecting" : "disconnected";
        log.warn(`[Baileys] Disconnected user=${this.userId} code=${code} reconnect=${shouldReconnect}`);

        if (!shouldReconnect) {
          // Clear Supabase session data on logout
          try {
            await supabase
              .from("wa_sessions")
              .update({ session_data: null, status: "disconnected", updated_at: new Date().toISOString() })
              .eq("user_id", this.userId);
          } catch { /* ignore */ }
          onDisconnected?.("logged_out");
        } else {
          // Auto-reconnect in 5 s using stored credentials (no new QR needed)
          setTimeout(() => this.init(onQR, onReady, onDisconnected), 5000);
        }
      }
    });
  }

  async getStatus() {
    return this.status;
  }

  async sendText(phone, text) {
    if (!this.sock || this.status !== "connected") throw new Error("Not connected");
    const jid = `${phone}@s.whatsapp.net`;
    const result = await this.sock.sendMessage(jid, { text });
    return { id: result.key.id };
  }

  async sendTyping(phone, durationMs = 2000) {
    if (!this.sock || this.status !== "connected") return;
    const jid = `${phone}@s.whatsapp.net`;
    try {
      await this.sock.sendPresenceUpdate("composing", jid);
      await new Promise((r) => setTimeout(r, durationMs));
      await this.sock.sendPresenceUpdate("paused", jid);
    } catch { /* non-critical */ }
  }

  async disconnect() {
    this.status = "disconnected";
    try {
      await this.sock?.logout();
      // Clear stored credentials
      await supabase
        .from("wa_sessions")
        .update({ session_data: null, status: "disconnected", updated_at: new Date().toISOString() })
        .eq("user_id", this.userId);
    } catch { /* ignore */ }
    this.sock = null;
  }
}

module.exports = BaileysProvider;
