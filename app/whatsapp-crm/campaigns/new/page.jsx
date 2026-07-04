"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getContacts, createCampaign } from "@/lib/whatsapp-crm/supabase";
import { queueCampaign } from "@/lib/whatsapp-crm/api";

const EMOJIS = ["😊", "👋", "🎉", "💯", "✅", "🔥", "💬", "📱", "🙏", "❤️", "⭐", "🎁"];

export default function NewCampaignPage() {
  const { user } = useWACRMAuth();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1=contacts, 2=message, 3=settings, 4=review
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [contactSearch, setContactSearch] = useState("");
  const [message, setMessage] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [delayMin, setDelayMin] = useState(2);
  const [delayMax, setDelayMax] = useState(8);
  const [spinEnabled, setSpinEnabled] = useState(true);
  const [typingEnabled, setTypingEnabled] = useState(true);
  const [scheduleType, setScheduleType] = useState("now"); // now | later
  const [scheduledAt, setScheduledAt] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    getContacts(user.id, contactSearch).then(setContacts);
  }, [user, contactSearch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { getSupabase } = require("@/lib/whatsapp-crm/supabase");
      getSupabase()?.auth.getSession().then(({ data }) => setToken(data?.session?.access_token ?? null));
    }
  }, []);

  const toggleContact = (id) => setSelectedContacts((s) => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const toggleAll = () => setSelectedContacts((s) => s.size === contacts.length ? new Set() : new Set(contacts.map((c) => c.id)));

  const insertVar = (v) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    setMessage((m) => m.slice(0, start) + v + m.slice(end));
    setTimeout(() => { el.focus(); el.setSelectionRange(start + v.length, start + v.length); }, 0);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttachments((a) => [...a, { name: file.name, type: file.type.split("/")[0], url: ev.target.result, size: file.size }]);
      };
      reader.readAsDataURL(file);
    });
  };

  async function handleSubmit() {
    setError("");
    if (!campaignName.trim()) { setError("Campaign name is required."); return; }
    if (selectedContacts.size === 0) { setError("Select at least one contact."); return; }
    if (!message.trim()) { setError("Message cannot be empty."); return; }
    if (delayMin > delayMax) { setError("Min delay must be ≤ max delay."); return; }
    setSubmitting(true);
    try {
      const campaign = await createCampaign(user.id, {
        name: campaignName.trim(),
        message_template: message,
        contact_ids: [...selectedContacts],
        total_contacts: selectedContacts.size,
        pending_count: selectedContacts.size,
        delay_min_sec: delayMin,
        delay_max_sec: delayMax,
        spin_enabled: spinEnabled,
        typing_sim: typingEnabled,
        scheduled_at: scheduleType === "later" && scheduledAt ? new Date(scheduledAt).toISOString() : null,
        status: scheduleType === "now" ? "queued" : "draft",
        attachments: attachments.map((a) => ({ type: a.type, name: a.name })),
      });

      if (scheduleType === "now" && token) {
        try {
          await queueCampaign(token, campaign.id);
        } catch {
          // Railway might not be running in dev — campaign saved, will queue manually
        }
      }

      router.push("/whatsapp-crm/history");
    } catch (err) {
      setError(err.message || "Failed to create campaign.");
      setSubmitting(false);
    }
  }

  const steps = [
    { n: 1, label: "Contacts" },
    { n: 2, label: "Message" },
    { n: 3, label: "Settings" },
    { n: 4, label: "Review" },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <div>
          <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
            New Campaign
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
            Bulk WhatsApp Messenger
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2rem", position: "relative" }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "unset" }}>
            <div
              onClick={() => s.n < step && setStep(s.n)}
              style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: step > s.n ? "#25D366" : step === s.n ? "rgba(37,211,102,0.2)" : "rgba(255,255,255,0.06)",
                border: `2px solid ${step >= s.n ? "#25D366" : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: step > s.n ? "#fff" : step === s.n ? "#25D366" : "rgba(255,255,255,0.3)",
                fontSize: 12, fontWeight: 700,
                cursor: s.n < step ? "pointer" : "default",
                zIndex: 1, position: "relative",
              }}
            >
              {step > s.n ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : s.n}
            </div>
            <div style={{ position: "absolute", left: 15, top: "calc(100% + 6px)", transform: `translateX(${i * (100 / (steps.length - 1))}%)`, whiteSpace: "nowrap", fontSize: 11, color: step === s.n ? "#25D366" : "rgba(255,255,255,0.3)", display: "none" }}>
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: step > s.n ? "#25D366" : "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 0, marginBottom: "2rem", marginTop: "-1.25rem" }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ flex: 1, textAlign: i === 0 ? "left" : i === steps.length - 1 ? "right" : "center" }}>
            <span style={{ fontSize: 11, color: step === s.n ? "#25D366" : "rgba(255,255,255,0.3)", fontWeight: step === s.n ? 600 : 400 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1 — Contacts */}
      {step === 1 && (
        <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>Select Contacts</h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>{selectedContacts.size} of {contacts.length} selected</p>
            </div>
            <button onClick={toggleAll} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer" }}>
              {selectedContacts.size === contacts.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div style={{ padding: "0.75rem 1.25rem 0" }}>
            <input
              style={{ width: "100%", padding: "9px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              placeholder="Search contacts…"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
            />
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto", padding: "0.5rem 1.25rem 1.25rem" }}>
            {contacts.length === 0 ? (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, padding: "2rem 0" }}>No contacts found. <a href="/whatsapp-crm/contacts" style={{ color: "#25D366" }}>Add contacts first →</a></p>
            ) : contacts.map((c) => (
              <div key={c.id} onClick={() => toggleContact(c.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer", background: selectedContacts.has(c.id) ? "rgba(37,211,102,0.06)" : "transparent", marginBottom: 3, transition: "background 0.1s" }}>
                <input type="checkbox" checked={selectedContacts.has(c.id)} onChange={() => toggleContact(c.id)} onClick={(e) => e.stopPropagation()} style={{ accentColor: "#25D366", cursor: "pointer" }} />
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,211,102,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#25D366", flexShrink: 0 }}>
                  {(c.name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>+{c.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Message */}
      {step === 2 && (
        <div>
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Compose Message</h2>

            {/* Variable chips */}
            <div style={{ display: "flex", gap: 6, marginBottom: "0.875rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", alignSelf: "center", letterSpacing: "0.04em" }}>Variables:</span>
              {["{{name}}", "{{phone}}"].map((v) => (
                <button key={v} onClick={() => insertVar(v)} style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>{v}</button>
              ))}
              <button onClick={() => setShowEmoji((s) => !s)} style={{ padding: "3px 10px", borderRadius: 100, background: showEmoji ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#f59e0b", fontSize: 12, cursor: "pointer" }}>
                😊 Emoji
              </button>
            </div>

            {/* Emoji picker */}
            {showEmoji && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0.75rem", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "0.875rem" }}>
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => insertVar(e)} style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, transition: "background 0.1s" }}>{e}</button>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={"Hi {{name}}, we have a special offer just for you! 🎉\n\nReply to this message to learn more."}
              rows={7}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13.5, outline: "none", resize: "vertical", lineHeight: 1.6, fontFamily: "inherit", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                {spinEnabled && "Message spinning enabled — emojis/phrases will vary per recipient"}
              </span>
              <span style={{ fontSize: 11, color: message.length > 1000 ? "#ef4444" : "rgba(255,255,255,0.3)" }}>
                {message.length} chars
              </span>
            </div>
          </div>

          {/* Attachments */}
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>Attachments <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>optional</span></h3>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer" }}>
                + Add file
              </button>
              <input ref={fileRef} type="file" accept="image/*,.pdf,video/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
            </div>
            {attachments.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)" }}>No attachments. Supports images, PDFs, and videos.</p>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {attachments.map((a, i) => (
                  <div key={i} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{a.type === "image" ? "🖼️" : a.type === "video" ? "🎬" : "📄"}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                    <button onClick={() => setAttachments((x) => x.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3 — Settings */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Campaign name */}
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" }}>
            <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8, letterSpacing: "0.07em" }}>CAMPAIGN NAME *</label>
            <input
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              placeholder="e.g. Diwali Offer 2026"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>

          {/* Delay settings */}
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>Human-like Delays</h3>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem" }}>Random delay between each message to avoid WhatsApp rate limiting</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "MIN DELAY (seconds)", key: "min", value: delayMin, onChange: (v) => setDelayMin(+v) },
                { label: "MAX DELAY (seconds)", key: "max", value: delayMax, onChange: (v) => setDelayMax(+v) },
              ].map(({ label, key, value, onChange }) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.07em" }}>{label}</label>
                  <input type="number" min="1" max="120" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", marginTop: "0.75rem" }}>
              Each message will wait {delayMin}–{delayMax}s before sending the next. Estimated time: ~{Math.round((selectedContacts.size * (delayMin + delayMax) / 2) / 60)} minutes for {selectedContacts.size} contacts
            </p>
          </div>

          {/* Anti-ban options */}
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Anti-Ban Features</h3>
            {[
              { label: "Message Spinning", desc: "Slightly vary emojis and phrases per message", value: spinEnabled, setter: setSpinEnabled },
              { label: "Typing Simulation", desc: "Show typing indicator before each message", value: typingEnabled, setter: setTypingEnabled },
            ].map(({ label, desc, value, setter }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div style={{ fontSize: 13.5, color: "#fff", fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{desc}</div>
                </div>
                <button onClick={() => setter(!value)} style={{ width: 40, height: 22, borderRadius: 11, background: value ? "#25D366" : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <span style={{ position: "absolute", top: 3, left: value ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </button>
              </div>
            ))}
          </div>

          {/* Schedule */}
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Schedule</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
              {[
                { id: "now", label: "Send Now" },
                { id: "later", label: "Schedule Later" },
              ].map((opt) => (
                <button key={opt.id} onClick={() => setScheduleType(opt.id)} style={{ flex: 1, padding: "9px 16px", borderRadius: 8, background: scheduleType === opt.id ? "rgba(37,211,102,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${scheduleType === opt.id ? "rgba(37,211,102,0.3)" : "rgba(255,255,255,0.08)"}`, color: scheduleType === opt.id ? "#25D366" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: scheduleType === opt.id ? 600 : 400, cursor: "pointer" }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {scheduleType === "later" && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            )}
          </div>
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 4 && (
        <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "2rem" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: "1.5rem" }}>Review Campaign</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Campaign Name", value: campaignName || "(not set)" },
              { label: "Recipients", value: `${selectedContacts.size} contacts` },
              { label: "Message Length", value: `${message.length} characters` },
              { label: "Attachments", value: attachments.length > 0 ? attachments.map((a) => a.name).join(", ") : "None" },
              { label: "Delay Range", value: `${delayMin}–${delayMax} seconds per message` },
              { label: "Message Spinning", value: spinEnabled ? "Enabled" : "Disabled" },
              { label: "Typing Simulation", value: typingEnabled ? "Enabled" : "Disabled" },
              { label: "Schedule", value: scheduleType === "now" ? "Send immediately" : (scheduledAt ? new Date(scheduledAt).toLocaleString("en-IN") : "No time set") },
              { label: "Est. Duration", value: `~${Math.round((selectedContacts.size * (delayMin + delayMax) / 2) / 60)} minutes` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", width: 160, flexShrink: 0, fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: 8, background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
            <p style={{ fontSize: 12.5, color: "#25D366", margin: 0 }}>
              ✅ Ready to send {selectedContacts.size} messages{scheduleType === "now" ? " immediately" : ` at ${scheduledAt ? new Date(scheduledAt).toLocaleString("en-IN") : "(schedule not set)"}`}
            </p>
          </div>
          {error && (
            <div style={{ marginTop: "1rem", padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 12.5 }}>
              {error}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={{ padding: "11px 22px", borderRadius: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, cursor: step === 1 ? "not-allowed" : "pointer", opacity: step === 1 ? 0.4 : 1 }}
        >
          ← Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => {
              if (step === 1 && selectedContacts.size === 0) { alert("Select at least one contact."); return; }
              if (step === 2 && !message.trim()) { alert("Message cannot be empty."); return; }
              setStep((s) => s + 1);
            }}
            style={{ padding: "11px 28px", borderRadius: 100, background: "linear-gradient(135deg,#25D366,#128C7E)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: "11px 28px", borderRadius: 100, background: submitting ? "rgba(37,211,102,0.4)" : "linear-gradient(135deg,#25D366,#128C7E)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 4px 20px rgba(37,211,102,0.25)" }}
          >
            {submitting ? "Sending…" : scheduleType === "now" ? "🚀 Launch Campaign" : "📅 Schedule Campaign"}
          </button>
        )}
      </div>
    </div>
  );
}
