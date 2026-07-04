/**
 * Supabase-backed Baileys auth state.
 *
 * Replaces useMultiFileAuthState (disk-based) with a Supabase JSONB store
 * so WhatsApp sessions survive Railway restarts and redeploys.
 *
 * Credentials are stored in wa_sessions.session_data as a JSONB blob:
 *   { creds: {...}, keys: { "type-id": value, ... } }
 *
 * Baileys uses BufferJSON.replacer / .reviver to serialise Uint8Array/Buffer
 * values — we apply the same transformation before writing to / after reading
 * from Supabase so no crypto material is lost.
 */

const { initAuthCreds, BufferJSON } = require("@whiskeysockets/baileys");
const pino = require("pino");

const log = pino({ transport: { target: "pino-pretty" } });

/**
 * Build a Baileys-compatible { state, saveCreds } object backed by Supabase.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 */
async function useSupabaseAuthState(supabase, userId) {
  // ── Load existing credentials from Supabase ─────────────────────────────
  const { data: row } = await supabase
    .from("wa_sessions")
    .select("id, session_data")
    .eq("user_id", userId)
    .maybeSingle();

  let creds;
  let keys = {};

  if (row?.session_data) {
    try {
      // Re-inflate Buffers that were serialised by BufferJSON.replacer
      const raw = JSON.stringify(row.session_data);
      const parsed = JSON.parse(raw, BufferJSON.reviver);
      creds = parsed.creds ?? initAuthCreds();
      keys  = parsed.keys  ?? {};
      log.info(`[SupabaseAuth] Restored session for user ${userId}`);
    } catch (e) {
      log.warn({ e }, "[SupabaseAuth] Failed to parse session_data — starting fresh");
      creds = initAuthCreds();
    }
  } else {
    creds = initAuthCreds();
    log.info(`[SupabaseAuth] No existing session for user ${userId} — fresh auth`);
  }

  // ── Persist helpers ───────────────────────────────────────────────────────
  const saveToSupabase = async () => {
    try {
      // Serialise Buffers so they survive JSONB round-trip
      const data = JSON.parse(JSON.stringify({ creds, keys }, BufferJSON.replacer));
      await supabase
        .from("wa_sessions")
        .update({ session_data: data, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    } catch (err) {
      log.error({ err }, "[SupabaseAuth] Failed to save session to Supabase");
    }
  };

  // ── Build the state object Baileys expects ────────────────────────────────
  const state = {
    creds,
    keys: {
      /**
       * Baileys calls keys.get(type, ids) to retrieve signal keys.
       * Returns { [id]: value } for each id found.
       */
      get(type, ids) {
        const result = {};
        for (const id of ids) {
          const val = keys[`${type}-${id}`];
          if (val !== undefined) result[id] = val;
        }
        return result;
      },

      /**
       * Baileys calls keys.set({ [type]: { [id]: value } }) to save keys.
       * Null value means delete the key.
       */
      async set(data) {
        for (const [category, categoryData] of Object.entries(data)) {
          for (const [id, value] of Object.entries(categoryData ?? {})) {
            const k = `${category}-${id}`;
            if (value != null) {
              keys[k] = value;
            } else {
              delete keys[k];
            }
          }
        }
        await saveToSupabase();
      },
    },
  };

  return { state, saveCreds: saveToSupabase };
}

module.exports = { useSupabaseAuthState };
