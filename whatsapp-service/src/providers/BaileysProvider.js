const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode");
const path = require("path");
const fs = require("fs");
const pino = require("pino");
const IWhatsAppProvider = require("./IWhatsAppProvider");

const SESSION_DIR = path.resolve(__dirname, "../../sessions/baileys");
const log = pino({ transport: { target: "pino-pretty" } });

class BaileysProvider extends IWhatsAppProvider {
  constructor(userId) {
    super(userId);
    this.name = "baileys";
    this.sock = null;
    this.status = "disconnected";
    this._sessionPath = path.join(SESSION_DIR, userId);
  }

  async init(onQR, onReady, onDisconnected) {
    fs.mkdirSync(this._sessionPath, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(this._sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["NexCraft WA CRM", "Chrome", "130.0"],
    });

    this.sock.ev.on("creds.update", saveCreds);

    this.sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        const qrDataUrl = await qrcode.toDataURL(qr);
        this.status = "qr_pending";
        onQR?.(qrDataUrl);
      }

      if (connection === "open") {
        this.status = "connected";
        log.info(`[Baileys] Connected: ${this.userId}`);
        onReady?.(this.sock.user);
      }

      if (connection === "close") {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        this.status = shouldReconnect ? "reconnecting" : "disconnected";
        log.warn(`[Baileys] Disconnected: ${this.userId} — shouldReconnect=${shouldReconnect}`);
        if (!shouldReconnect) {
          onDisconnected?.("logged_out");
        } else {
          // Auto-reconnect after 5s
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
      fs.rmSync(this._sessionPath, { recursive: true, force: true });
    } catch { /* ignore */ }
    this.sock = null;
  }
}

module.exports = BaileysProvider;
