/**
 * Abstract base class for all WhatsApp providers.
 * Every provider (Baileys, WWebJS, WPPConnect) MUST implement these methods.
 */
class IWhatsAppProvider {
  constructor(userId) {
    this.userId = userId;
    this.name = "base";
  }

  /** Initialise the client and emit QR events */
  async init(onQR, onReady, onDisconnected) {
    throw new Error(`${this.name}.init() not implemented`);
  }

  /** Get current connection status */
  async getStatus() {
    throw new Error(`${this.name}.getStatus() not implemented`);
  }

  /**
   * Send a text message to a phone number.
   * @param {string} phone - e.g. "919876543210" (no +)
   * @param {string} text
   * @returns {Promise<{id: string}>}
   */
  async sendText(phone, text) {
    throw new Error(`${this.name}.sendText() not implemented`);
  }

  /**
   * Send a media message (image / video / document).
   * @param {string} phone
   * @param {{ type: string, url: string, mimetype?: string, name?: string, caption?: string }} media
   */
  async sendMedia(phone, media) {
    // Optional — providers that don't support media fall back to text only
  }

  /**
   * Send typing indicator before message.
   * @param {string} phone
   * @param {number} durationMs
   */
  async sendTyping(phone, durationMs = 2000) {
    // Optional — default no-op
  }

  /** Gracefully disconnect */
  async disconnect() {
    throw new Error(`${this.name}.disconnect() not implemented`);
  }
}

module.exports = IWhatsAppProvider;
