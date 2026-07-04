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

// --- Storage helpers ---

/**
 * Upload an attachment file to Supabase Storage (bucket: wa-attachments).
 * Returns the public URL.
 */
export async function uploadAttachment(userId, file) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await sb.storage
    .from("wa-attachments")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data: { publicUrl } } = sb.storage.from("wa-attachments").getPublicUrl(data.path);
  return { url: publicUrl, path: data.path };
}

/** Get number of messages sent today for this user */
export async function getTodaySentCount(userId) {
  const sb = getSupabase();
  if (!sb) return { sent: 0, limit: 50 };
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [{ count }, { data: sub }] = await Promise.all([
    sb.from("wa_message_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "sent")
      .gte("sent_at", todayStart.toISOString()),
    sb.from("wa_subscriptions")
      .select("wa_plans(msg_per_day, name)")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);
  return {
    sent: count ?? 0,
    limit: sub?.wa_plans?.msg_per_day ?? 50,
    planName: sub?.wa_plans?.name ?? "Free",
  };
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
