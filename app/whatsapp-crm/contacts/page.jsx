"use client";

import { useState, useEffect, useRef } from "react";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getContacts, upsertContact, deleteContacts } from "@/lib/whatsapp-crm/supabase";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return {
      name: obj.name || obj.fullname || obj.full_name || "",
      phone: (obj.phone || obj.mobile || obj.number || "").replace(/\D/g, ""),
      email: obj.email || "",
    };
  }).filter((c) => c.phone.length >= 7);
}

export default function ContactsPage() {
  const { user } = useWACRMAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", phone: "", email: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileRef = useRef(null);

  const loadContacts = () => {
    if (!user) return;
    setLoading(true);
    getContacts(user.id, search).then(setContacts).finally(() => setLoading(false));
  };

  useEffect(() => { loadContacts(); }, [user, search]);

  const toggleSelect = (id) => setSelected((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const toggleAll = () => {
    setSelected((s) => s.size === contacts.length ? new Set() : new Set(contacts.map((c) => c.id)));
  };

  async function handleAddContact(e) {
    e.preventDefault();
    setAddError("");
    if (!addForm.name.trim()) { setAddError("Name is required."); return; }
    if (!addForm.phone.replace(/\D/g, "")) { setAddError("Valid phone number required."); return; }
    setAddLoading(true);
    try {
      await upsertContact(user.id, {
        name: addForm.name.trim(),
        phone: addForm.phone.replace(/\D/g, ""),
        email: addForm.email.trim(),
      });
      setAddForm({ name: "", phone: "", email: "" });
      setShowAddForm(false);
      loadContacts();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleCSVUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg("Parsing CSV…");
    const text = await file.text();
    const parsed = parseCSV(text);
    if (!parsed.length) { setUploadMsg("No valid contacts found in CSV."); return; }
    setUploadMsg(`Uploading ${parsed.length} contacts…`);
    let done = 0;
    for (const c of parsed) {
      try { await upsertContact(user.id, c); done++; } catch { /* skip invalid */ }
    }
    setUploadMsg(`✅ Uploaded ${done} contacts`);
    loadContacts();
    setTimeout(() => setUploadMsg(""), 4000);
  }

  async function handleDelete() {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} contact(s)?`)) return;
    setDeleteLoading(true);
    try {
      await deleteContacts([...selected]);
      setSelected(new Set());
      loadContacts();
    } finally {
      setDeleteLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
            Contacts
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
            {loading ? "Loading…" : `${contacts.length} contacts`}
            {selected.size > 0 && ` · ${selected.size} selected`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {selected.size > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{
                padding: "9px 16px", borderRadius: 8,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              }}
            >
              {deleteLoading ? "Deleting…" : `Delete (${selected.size})`}
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              padding: "9px 16px", borderRadius: 8,
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
              color: "#6366f1", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: "none" }} />
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: "9px 16px", borderRadius: 8,
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              border: "none", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Contact
          </button>
        </div>
      </div>

      {uploadMsg && (
        <div style={{
          marginBottom: "1rem", padding: "10px 14px", borderRadius: 8,
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
          color: "#6366f1", fontSize: 12.5,
        }}>
          {uploadMsg}
        </div>
      )}

      {/* CSV format hint */}
      <div style={{
        marginBottom: "1rem", padding: "10px 14px", borderRadius: 8,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        fontSize: 11.5, color: "rgba(255,255,255,0.35)",
      }}>
        CSV format: <code style={{ color: "rgba(255,255,255,0.6)" }}>name,phone,email</code> — phone must include country code (e.g. 919876543210)
      </div>

      {/* Add contact form */}
      {showAddForm && (
        <div style={{
          marginBottom: "1.25rem", padding: "1.25rem",
          borderRadius: "1rem",
          background: "rgba(37,211,102,0.04)", border: "1px solid rgba(37,211,102,0.2)",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Add Contact</h3>
          <form onSubmit={handleAddContact} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4 }}>NAME *</label>
              <input style={inputStyle} value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Doe" required />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4 }}>PHONE * (with country code)</label>
              <input style={inputStyle} value={addForm.phone} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} placeholder="919876543210" required />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4 }}>EMAIL</label>
              <input style={inputStyle} type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} placeholder="optional" />
            </div>
            {addError && <div style={{ gridColumn: "1/-1", color: "#ef4444", fontSize: 12 }}>{addError}</div>}
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
              <button type="submit" disabled={addLoading} style={{ padding: "9px 18px", borderRadius: 8, background: "linear-gradient(135deg,#25D366,#128C7E)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {addLoading ? "Saving…" : "Save Contact"}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: "9px 18px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          style={{ ...inputStyle, paddingLeft: 36 }}
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 80px", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input type="checkbox" checked={selected.size === contacts.length && contacts.length > 0} onChange={toggleAll} style={{ accentColor: "#25D366", width: 14, height: 14, cursor: "pointer" }} />
          </div>
          {["Name", "Phone", "Email", "Added"].map((h) => (
            <div key={h} style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>

        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading contacts…</div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>No contacts found</p>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>Upload a CSV or add contacts manually above</p>
            </div>
          ) : contacts.map((c) => (
            <div
              key={c.id}
              style={{
                display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 80px", gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: selected.has(c.id) ? "rgba(37,211,102,0.04)" : "transparent",
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onClick={() => toggleSelect(c.id)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} onClick={(e) => e.stopPropagation()} style={{ accentColor: "#25D366", width: 14, height: 14, cursor: "pointer" }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(37,211,102,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#25D366", flexShrink: 0, marginRight: 8 }}>
                  {(c.name || "?")[0].toUpperCase()}
                </div>
                {c.name}
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center" }}>+{c.phone}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>{c.email || "—"}</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>{new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
