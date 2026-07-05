import { getWASession } from "./supabase";
import { getSessionStatus } from "./api";

/** Statuses where WhatsApp can send messages (or will momentarily after reconnect). */
export function isWAReady(status) {
  return status === "connected" || status === "reconnecting";
}

/**
 * Resolve WhatsApp connection status from Railway (live) with Supabase DB fallback.
 * Connect page reads DB first; campaigns previously only called Railway and showed
 * "not connected" when the API was unreachable even though wa_sessions was connected.
 */
export async function fetchWAConnectionStatus(userId, token) {
  let status = null;

  if (token) {
    try {
      const live = await getSessionStatus(token);
      if (live?.status) status = live.status;
    } catch {
      // Railway cold start / network — fall back to Supabase row
    }
  }

  if (!status && userId) {
    try {
      const row = await getWASession(userId);
      if (row?.status) status = row.status;
    } catch {
      /* table may not exist yet */
    }
  }

  return status || "disconnected";
}
