import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Singleton Supabase client — reused across all WhatsApp CRM pages
let _client = null;

export function getSupabase() {
  if (!_client && supabaseUrl && supabaseAnonKey) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "wa_crm_session",
      },
    });
  }
  return _client;
}

// --- Auth helpers ---

export async function signInWithEmail(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email, password, name) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

export async function getSession() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data?.session ?? null;
}

export async function getUser() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data?.user ?? null;
}

// --- Subscription helpers ---

export async function getUserSubscription(userId) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("wa_subscriptions")
    .select("*, wa_plans(*)")
    .eq("user_id", userId)
    .single();
  return data;
}

// --- Session (WA connection) helpers ---

export async function getWASession(userId) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("wa_sessions")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

// --- Contacts helpers ---

export async function getContacts(userId, search = "") {
  const sb = getSupabase();
  if (!sb) return [];
  let q = sb.from("wa_contacts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (search) {
    q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  const { data } = await q;
  return data ?? [];
}

export async function upsertContact(userId, contact) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { data, error } = await sb
    .from("wa_contacts")
    .upsert({ ...contact, user_id: userId }, { onConflict: "user_id,phone" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteContacts(ids) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { error } = await sb.from("wa_contacts").delete().in("id", ids);
  if (error) throw error;
}

// --- Campaign helpers ---

export async function getCampaigns(userId) {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("wa_campaigns")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createCampaign(userId, payload) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { data, error } = await sb
    .from("wa_campaigns")
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCampaign(id, updates) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { data, error } = await sb
    .from("wa_campaigns")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Message logs helpers ---

export async function getCampaignLogs(campaignId, limit = 100) {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("wa_message_logs")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
