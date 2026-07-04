/**
 * API client for the Railway WhatsApp backend service.
 * Base URL is set in NEXT_PUBLIC_WA_SERVICE_URL env variable.
 * Falls back to localhost:3001 in development.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_WA_SERVICE_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const { token, ...fetchOptions } = options;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

// --- Session / QR endpoints ---

/** Request a new QR code for connecting WhatsApp */
export function requestQRCode(token) {
  return request("/api/session/qr", { method: "POST", token });
}

/** Get current session status */
export function getSessionStatus(token) {
  return request("/api/session/status", { token });
}

/** Disconnect current WhatsApp session */
export function disconnectSession(token) {
  return request("/api/session/disconnect", { method: "POST", token });
}

// --- Campaign endpoints ---

/** Queue a campaign for sending */
export function queueCampaign(token, campaignId) {
  return request("/api/campaign/queue", {
    method: "POST",
    token,
    body: JSON.stringify({ campaignId }),
  });
}

/** Pause a running campaign */
export function pauseCampaign(token, campaignId) {
  return request(`/api/campaign/${campaignId}/pause`, { method: "POST", token });
}

/** Resume a paused campaign */
export function resumeCampaign(token, campaignId) {
  return request(`/api/campaign/${campaignId}/resume`, { method: "POST", token });
}

/** Stop / cancel a campaign */
export function stopCampaign(token, campaignId) {
  return request(`/api/campaign/${campaignId}/stop`, { method: "POST", token });
}

// --- Payment / billing endpoints ---

/** Create a Razorpay order for a plan upgrade */
export function createPaymentOrder(token, planId) {
  return request("/api/payment/create-order", {
    method: "POST", token,
    body: JSON.stringify({ planId }),
  });
}

/** Verify a completed Razorpay payment and activate the subscription */
export function verifyPayment(token, { paymentId, orderId, signature, planId }) {
  return request("/api/payment/verify", {
    method: "POST", token,
    body: JSON.stringify({ paymentId, orderId, signature, planId }),
  });
}

/** Get current subscription details */
export function getSubscription(token) {
  return request("/api/payment/subscription", { token });
}

// --- Socket.IO helper ---

/**
 * Returns the socket.io server URL.
 * The frontend connects directly to this for live progress updates.
 */
export function getSocketURL() {
  return BASE_URL;
}
