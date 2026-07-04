"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getContacts, updateCampaign, uploadAttachment } from "@/lib/whatsapp-crm/supabase";

const EMOJIS = ["😊", "👋", "🎉", "💯", "✅", "🔥", "💬", "📱", "🙏", "❤️", "⭐", "🎁"];

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", outline: "none", boxSizing: "border-box",
};
const labelStyle = { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };
const cardStyle = { borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem", marginBottom: "1.25rem" };

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{sub}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 100, border: "none", cursor: "pointer",
          background: checked ? "#25D366" : "rgba(255,255,255,0.1)",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", display: "block",
        }} />
      </button>
    </div>
  );
}

export default function EditCampaignPage() {
  const { user } = useWACRMAuth();
  const router   = useRouter();
  const { id }   = useParams();

  const [contacts, setContacts]             = useState([]);
  const [selectedContacts, setSelected]     = useState(new Set());
  const [contactSearch, setContactSearch]   = useState("");
  const [campaignName, setName]             = useState("");
  const [message, setMessage]               = useState("");
  const [delayMin, setDelayMin]             = useState(2);
  const [delayMax, setDelayMax]             = useState(8);
  const [spinEnabled, setSpin]              = useState(true);
  const [typingEnabled, setTyping]          = useState(true);
  const [attachments, setAttachments]       = useState([]);
  const [showEmoji, setShowEmoji]           = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [originalStatus, setOriginalStatus] = useState("draft");
  const textareaRef = useRef(null);
  const fileRef     = useRef(null);

  // Load campaign + contacts
  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      import("@/lib/whatsapp-crm/supabase").then(({ getSupabase }) =>
        getSupabase()
          .from("wa_campaigns")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single()
      ),
      getContacts(user.id, ""),
    ]).then(([{ data: campaign, error: campErr }, allContacts]) => {
      if (campErr || !campaign) { setError("Campaign not found."); setLoading(false); return; }
      setName(campaign.name);
      setMessage(campaign.message_template);
      setDelayMin(campaign.delay_min_sec ?? 2);
      setDelayMax(campaign.delay_max_sec ?? 8);
      setSpin(campaign.spin_enabled ?? true);
      setTyping(campaign.typing_sim ?? true);
      setOriginalStatus(campaign.status);
      setAttachments(campaign.attachments ?? []);
      setSelected(new Set(campaign.contact_ids ?? []));
      setContacts(allContacts);
      setLoading(false);
    });
  }, [user, id]);

  // Filter contacts by search
  useEffect(() => {
    if (!user) return;
    getContacts(user.id, contactSearch).then(setContacts);
  }, [user, contactSearch]);

  const toggleContact = (cid) => setSelected((s) => {
    const n = new Set(s); n.has(cid) ? n.delete(cid) : n.add(cid); return n;
  });
  const toggleAll = () => setSelected((s) => s.size === contacts.length ? new Set() : new Set(contacts.map((c) => c.id)));

  const insertVar = (v) => {
    const el = textareaRef.current; if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    setMessage((m) => m.slice(0, start) + v + m.slice(end));
    setTimeout(() => { el.focus(); el.setSelectionRange(start + v.length, start + v.length); }, 0);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const tempId = `${Date.now()}_${file.name}`;
      setAttachments((a) => [...a, { tempId, name: file.name, type: file.type.split("/")[0], mimetype: file.type, size: file.size, uploading: true }]);
      try {
        const { url } = await uploadAttachment(user.id, file);
        setAttachments((a) => a.map((x) => x.tempId === tempId ? { ...x, url, uploading: false } : x));
      } catch (err) {
        setAttachments((a) => a.filter((x) => x.tempId !== tempId));
        alert(`Upload failed: ${err.message}`);
      }
    }
    e.target.value = "";
  };

  async function handleSave() {
    setError("");
    if (!campaignName.trim()) { setError("Campaign name is required."); return; }
    if (selectedContacts.size === 0) { setError("Select at least one contact."); return; }
    if (!message.trim()) { setError("Message cannot be empty."); return; }
    if (delayMin > delayMax) { setError("Min delay must be ≤ max delay."); return; }
    if (attachments.some((a) => a.uploading)) { setError("Please wait for all uploads to complete."); return; }

    setSaving(true);
    try {
      await updateCampaign(id, {
        name: campaignName.trim(),
        message_template: message,
        contact_ids: [...selectedContacts],
        total_contacts: selectedContacts.size,
        pending_count: selectedContacts.size,
        delay_min_sec: delayMin,
        delay_max_sec: delayMax,
        spin_enabled: spinEnabled,
        typing_sim: typingEnabled,
        attachments: attachments.filter((a) => a.url).map((a) => ({ type: a.type, name: a.name, url: a.url, mimetype: a.mimetype })),
        // Reset to draft if it was failed/cancelled so it can be re-run
        status: ["failed", "cancelled", "completed"].includes(originalStatus) ? "draft" : originalStatus,
        sent_count: ["failed", "cancelled", "completed"].includes(originalStatus) ? 0 : undefined,
        failed_count: ["failed", "cancelled", "completed"].includes(originalStatus) ? 0 : undefined,
      });
      router.push("/whatsapp-crm/campaigns");
    } catch (err) {
      setError(err.message || "Failed to save campaign.");
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(37,211,102,0.2)", borderTopColor: "#25D366", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error && !campaignName) return (
    <div style={{ textAlign: "center", padding: "3rem", color: "#ef4444" }}>{error}</div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div>
          <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
            Edit Campaign
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
            {campaignName}
          </p>
        </div>
      </div>

      {/* Campaign Name */}
      <div style={cardStyle}>
        <label style={labelStyle}>Campaign Name</label>
        <input
          value={campaignName}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. July Offer Blast"
          style={inputStyle}
        />
      </div>

      {/* Contact Selection */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <label style={{ ...labelStyle, margin: 0 }}>Contacts ({selectedContacts.size} selected)</label>
          <button onClick={toggleAll} style={{ fontSize: 12, color: "#25D366", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            {selectedContacts.size === contacts.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <input
          value={contactSearch}
          onChange={(e) => setContactSearch(e.target.value)}
          placeholder="Search contacts…"
          style={{ ...inputStyle, marginBottom: "0.75rem" }}
        />
        <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {contacts.length === 0 ? (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "1rem" }}>
              No contacts found.{" "}
              <a href="/whatsapp-crm/contacts" style={{ color: "#25D366" }}>Add some first →</a>
            </p>
          ) : contacts.map((c) => (
            <label key={c.id} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
              borderRadius: 8, cursor: "pointer",
              background: selectedContacts.has(c.id) ? "rgba(37,211,102,0.07)" : "transparent",
              border: `1px solid ${selectedContacts.has(c.id) ? "rgba(37,211,102,0.2)" : "transparent"}`,
              transition: "all 0.1s",
            }}>
              <input
                type="checkbox"
                checked={selectedContacts.has(c.id)}
                onChange={() => toggleContact(c.id)}
                style={{ accentColor: "#25D366", width: 15, height: 15 }}
              />
              <span style={{ flex: 1, fontSize: 13.5, color: "#fff" }}>{c.name}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>+{c.phone}</span>
              {c.tags?.length > 0 && (
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                  {c.tags[0]}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Message Template */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <label style={{ ...labelStyle, margin: 0 }}>Message Template</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["{{name}}", "{{phone}}"].map((v) => (
              <button key={v} onClick={() => insertVar(v)} style={{
                fontSize: 11, padding: "3px 9px", borderRadius: 100,
                background: "rgba(99,102,241,0.15)", color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.2)", cursor: "pointer", fontWeight: 600,
              }}>{v}</button>
            ))}
            <button onClick={() => setShowEmoji((s) => !s)} style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 100,
              background: "rgba(245,158,11,0.1)", color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.2)", cursor: "pointer",
            }}>😊 Emoji</button>
          </div>
        </div>
        {showEmoji && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "0.75rem", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => { insertVar(e); setShowEmoji(false); }} style={{
                fontSize: 20, background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6,
              }}>{e}</button>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"Hi {{name}}, we have a special offer for you! 🎉"}
          rows={5}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
        />
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
          {message.length} chars · {selectedContacts.size} recipients
        </div>
      </div>

      {/* Attachments */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
          <div>
            <label style={labelStyle}>Attachments <span style={{ textTransform: "none", fontWeight: 400, color: "rgba(255,255,255,0.25)" }}>optional</span></label>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", margin: 0 }}>Images, PDFs, or videos to send with each message</p>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer" }}
          >
            + Add file
          </button>
          <input ref={fileRef} type="file" accept="image/*,.pdf,video/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
        </div>
        {attachments.length === 0 ? (
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.25)", margin: 0 }}>No attachments. Click "Add file" to upload.</p>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {attachments.map((a, i) => (
              <div key={a.tempId || i} style={{ padding: "6px 12px", borderRadius: 8, background: a.uploading ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.05)", border: `1px solid ${a.uploading ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{a.uploading ? "⏳" : a.type === "image" ? "🖼️" : a.type === "video" ? "🎬" : "📄"}</span>
                <span style={{ fontSize: 12, color: a.uploading ? "#f59e0b" : "rgba(255,255,255,0.7)", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.uploading ? `Uploading…` : a.name}
                </span>
                {!a.uploading && (
                  <button onClick={() => setAttachments((x) => x.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div style={cardStyle}>
        <label style={labelStyle}>Sending Settings</label>

        {/* Delay slider */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Random delay between messages</span>
            <span style={{ fontSize: 13, color: "#25D366", fontWeight: 600 }}>{delayMin}s – {delayMax}s</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[["Min (s)", delayMin, setDelayMin, 1, 30], ["Max (s)", delayMax, setDelayMax, 1, 120]].map(([lbl, val, set, mn, mx]) => (
              <div key={lbl}>
                <label style={{ ...labelStyle, marginBottom: 4 }}>{lbl}</label>
                <input
                  type="number" min={mn} max={mx} value={val}
                  onChange={(e) => set(Math.max(mn, Math.min(mx, Number(e.target.value))))}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>

        <Toggle
          label="Message Spinning"
          sub="Randomly vary emojis per message to avoid spam detection"
          checked={spinEnabled}
          onChange={setSpin}
        />
        <Toggle
          label="Typing Simulation"
          sub="Show 'typing...' indicator before each message"
          checked={typingEnabled}
          onChange={setTyping}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "0.875rem 1.25rem", borderRadius: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: 13.5, marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button
          onClick={() => router.back()}
          style={{ padding: "11px 24px", borderRadius: 100, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "11px 28px", borderRadius: 100, fontSize: 13.5, fontWeight: 700,
            background: saving ? "rgba(37,211,102,0.4)" : "linear-gradient(135deg,#25D366,#128C7E)",
            color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "none" : "0 4px 16px rgba(37,211,102,0.3)",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
