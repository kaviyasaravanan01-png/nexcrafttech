/**
 * WhatsApp Web.js provider — Fallback 1
 * Uses puppeteer/chromium under the hood.
 * Install: npm install whatsapp-web.js puppeteer
 */
const qrcode = require("qrcode");
const IWhatsAppProvider = require("./IWhatsAppProvider");
const pino = require("pino");

const log = pino({ transport: { target: "pino-pretty" } });

class WWebJSProvider extends IWhatsAppProvider {
  constructor(userId) {
    super(userId);
    this.name = "wweb";
    this.client = null;
    this.status = "disconnected";
  }

  async init(onQR, onReady, onDisconnected) {
    // Lazy-require to avoid crashing if package not installed
    let Client, LocalAuth;
    try {
      ({ Client, LocalAuth } = require("whatsapp-web.js"));
    } catch {
      throw new Error("whatsapp-web.js not installed. Run: npm install whatsapp-web.js puppeteer");
    }

    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: this.userId }),
      puppeteer: {
        args: [
          "--no-sandbox", "--disable-setuid-sandbox",
          "--disable-dev-shm-usage", "--disable-gpu",
          "--single-process", "--no-zygote",
        ],
      },
    });

    this.client.on("qr", async (qr) => {
      const qrDataUrl = await qrcode.toDataURL(qr);
      this.status = "qr_pending";
      onQR?.(qrDataUrl);
    });

    this.client.on("ready", () => {
      this.status = "connected";
      log.info(`[WWebJS] Connected: ${this.userId}`);
      onReady?.(this.client.info);
    });

    this.client.on("disconnected", (reason) => {
      this.status = "disconnected";
      log.warn(`[WWebJS] Disconnected: ${this.userId} — ${reason}`);
      onDisconnected?.(reason);
    });

    await this.client.initialize();
  }

  async getStatus() { return this.status; }

  async sendText(phone, text) {
    if (!this.client || this.status !== "connected") throw new Error("Not connected");
    const chatId = `${phone}@c.us`;
    const result = await this.client.sendMessage(chatId, text);
    return { id: result.id._serialized };
  }

  async sendTyping(phone, durationMs = 2000) {
    if (!this.client || this.status !== "connected") return;
    try {
      const chat = await this.client.getChatById(`${phone}@c.us`);
      await chat.sendStateTyping();
      await new Promise((r) => setTimeout(r, durationMs));
      await chat.clearState();
    } catch { /* non-critical */ }
  }

  async disconnect() {
    this.status = "disconnected";
    try { await this.client?.destroy(); } catch { /* ignore */ }
    this.client = null;
  }
}

module.exports = WWebJSProvider;
