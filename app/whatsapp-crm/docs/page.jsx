"use client";
import { useState } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    id: "getting-started", title: "Getting Started", icon: "🚀",
    content: [
      {
        q: "What is NexCraft WhatsApp CRM?",
        a: "A bulk WhatsApp messaging tool that lets you send personalised messages to hundreds of contacts from a single connected WhatsApp number — with anti-ban features, campaign scheduling, live progress tracking, and message history.",
      },
      {
        q: "What do I need to get started?",
        a: "Just a WhatsApp account on your phone. Register/login → go to Connect → scan the QR code → you're ready. No WhatsApp Business API required.",
      },
      {
        q: "Is this free?",
        a: "Yes! The Free plan allows 50 messages/day with up to 100 contacts. Upgrade anytime for more capacity.",
      },
    ],
  },
  {
    id: "connect", title: "Connecting WhatsApp", icon: "📱",
    content: [
      {
        q: "How do I connect my WhatsApp?",
        a: "Go to Connect page → click 'Connect WhatsApp' → a QR code appears → open WhatsApp on your phone → tap Menu (⋮) → Linked Devices → Link a Device → scan the QR code. Done!",
      },
      {
        q: "Will my WhatsApp contacts or chats be affected?",
        a: "No. Linking a device only adds NexCraft as a linked device — exactly like WhatsApp Web. Your existing chats are untouched.",
      },
      {
        q: "How long does a connection last?",
        a: "Your session is saved securely in our database. After the first scan, your WhatsApp stays connected automatically — even after server restarts. You only need to rescan if you manually disconnect or log out from your phone.",
      },
      {
        q: "What does 'Reconnecting' status mean?",
        a: "It means the connection was briefly interrupted (e.g. phone lost internet). It will auto-reconnect within a few seconds — no action needed.",
      },
    ],
  },
  {
    id: "contacts", title: "Managing Contacts", icon: "👥",
    content: [
      {
        q: "How do I add contacts?",
        a: "Go to Contacts → either add manually (name + phone number) or upload a CSV file. CSV must have columns: name, phone (and optionally email, tags).",
      },
      {
        q: "What format should phone numbers be in?",
        a: "International format without the + sign. Example: for India, use 919876543210 (91 = country code, then 10-digit number). Do not include spaces or dashes.",
      },
      {
        q: "What is the CSV format?",
        a: "First row must be headers. Required: name, phone. Optional: email, tags (comma-separated). Example row: Anand,919876543210,anand@email.com,vip",
      },
      {
        q: "Can I use custom variables in messages?",
        a: "Yes! Add extra columns to your CSV (e.g. 'city', 'order_id') and use {{city}} or {{order_id}} in your message template. These get replaced per contact.",
      },
    ],
  },
  {
    id: "campaigns", title: "Creating Campaigns", icon: "📤",
    content: [
      {
        q: "How do I send bulk messages?",
        a: "Go to Bulk Messenger → New Campaign → (1) Select contacts → (2) Write message → (3) Configure settings → (4) Review → Launch. Simple 4-step wizard.",
      },
      {
        q: "What are message variables?",
        a: "Placeholders like {{name}} and {{phone}} that get replaced with each contact's actual data. Example: 'Hi {{name}}!' becomes 'Hi Anand!' for one contact and 'Hi Priya!' for another.",
      },
      {
        q: "Can I send attachments?",
        a: "Yes! In step 2 of the campaign wizard, click 'Add file' to upload images, PDFs, or videos. Files are uploaded to secure cloud storage and sent as native WhatsApp media.",
      },
      {
        q: "Can I pause or stop a running campaign?",
        a: "Yes. On the Bulk Messenger page, running campaigns show Pause and Stop buttons. Paused campaigns can be resumed later. Stopped campaigns cannot be resumed (but can be re-run from scratch).",
      },
      {
        q: "Can I re-run a completed campaign?",
        a: "Yes! Click Re-run on any completed, failed, or cancelled campaign. This re-queues it from the beginning.",
      },
    ],
  },
  {
    id: "scheduling", title: "Scheduling Messages", icon: "📅",
    content: [
      {
        q: "How do I schedule a campaign for later?",
        a: "In step 3 of the campaign wizard, choose 'Schedule Later' → pick a date and time → click 'Schedule Campaign'. The campaign will automatically start at that time.",
      },
      {
        q: "What timezone does scheduling use?",
        a: "Your browser's local timezone. If you're in IST (India), scheduling 9:00 AM sends at 9:00 AM IST.",
      },
      {
        q: "Can I edit a scheduled campaign?",
        a: "Yes! Click Edit on any campaign card. You can change contacts, message, settings, and reschedule the time before it runs.",
      },
    ],
  },
  {
    id: "anti-ban", title: "Anti-Ban Features", icon: "🛡️",
    content: [
      {
        q: "Will my number get banned?",
        a: "We implement multiple techniques to minimise the risk. No tool can guarantee 100% safety, but our anti-ban features significantly reduce detection risk.",
      },
      {
        q: "What is Message Spinning?",
        a: "Each message sent has slightly different emojis. For example, 😊 randomly becomes 😄 or 🙂. This means 100 recipients receive 100 slightly different messages — avoiding identical-message spam detection.",
      },
      {
        q: "What is Typing Simulation?",
        a: "Before each message, the typing indicator ('typing…') is shown to the recipient for a few seconds — just like a real person typing. This makes your account behave like a human.",
      },
      {
        q: "What is Random Delay?",
        a: "Instead of sending all messages instantly (which looks like a bot), there's a random wait between each message. You set the min and max delay in seconds. A 3–8 second range is recommended for safety.",
      },
      {
        q: "What delay settings should I use?",
        a: "For safety: Min 3s, Max 10s for large campaigns (500+ contacts). For small campaigns (under 50 contacts), 2–5s is fine. Never use 0 delay.",
      },
    ],
  },
  {
    id: "limits", title: "Plans & Limits", icon: "💎",
    content: [
      {
        q: "How many messages can I send per day?",
        a: "Free: 50 · Starter (₹499/mo): 500 · Pro (₹1,499/mo): 5,000 · Business (₹3,999/mo): Unlimited. Limits reset at midnight every day.",
      },
      {
        q: "What happens when I hit the daily limit?",
        a: "The current campaign pauses automatically with a message saying 'Daily limit reached — re-run tomorrow'. The count resets at midnight and you can resume.",
      },
      {
        q: "How do I upgrade my plan?",
        a: "Go to Settings → Billing → click Upgrade → complete payment via Razorpay (UPI, Card, Netbanking). Your plan activates instantly after payment.",
      },
    ],
  },
  {
    id: "history", title: "Message History", icon: "🕐",
    content: [
      {
        q: "Where can I see which messages were delivered?",
        a: "Go to History → select a campaign → see per-contact delivery status (Sent / Failed), timestamp, and error messages for failed ones.",
      },
      {
        q: "What does 'Failed' mean in message logs?",
        a: "The message could not be delivered. Common reasons: invalid phone number, recipient blocked your number, or WhatsApp rate limit hit. The error message in the log shows the specific reason.",
      },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [openQuestions, setOpenQuestions] = useState({});

  const toggle = (id) => setOpenQuestions((s) => ({ ...s, [id]: !s[id] }));
  const current = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
          Documentation
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
          Everything you need to know about NexCraft WhatsApp CRM
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem" }} className="docs-grid">

        {/* Sidebar nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }} className="docs-nav">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 12px", borderRadius: 8, textAlign: "left",
                background: activeSection === s.id ? "rgba(37,211,102,0.1)" : "transparent",
                border: `1px solid ${activeSection === s.id ? "rgba(37,211,102,0.2)" : "transparent"}`,
                color: activeSection === s.id ? "#25D366" : "rgba(255,255,255,0.5)",
                fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s", width: "100%",
              }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}

          {/* Mobile section tabs */}
          <div className="docs-mobile-select" style={{ display: "none" }}>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none" }}
            >
              {SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.title}</option>)}
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            {/* Section header */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{current?.icon}</span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{current?.title}</h2>
            </div>

            {/* Q&A accordion */}
            <div style={{ padding: "0.5rem 0" }}>
              {current?.content.map((item, i) => {
                const key = `${activeSection}-${i}`;
                const open = openQuestions[key];
                return (
                  <div key={key} style={{ borderBottom: i < current.content.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <button
                      onClick={() => toggle(key)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "1rem 1.5rem", background: "none", border: "none",
                        color: open ? "#fff" : "rgba(255,255,255,0.75)", textAlign: "left",
                        cursor: "pointer", fontSize: 13.5, fontWeight: open ? 600 : 400,
                        transition: "color 0.15s", gap: 12,
                      }}
                    >
                      <span>{item.q}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, color: "#25D366" }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {open && (
                      <div style={{ padding: "0 1.5rem 1.25rem", fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
            {[
              { href: "/whatsapp-crm/connect",       label: "Connect WhatsApp", icon: "📱", color: "#25D366" },
              { href: "/whatsapp-crm/contacts",       label: "Add Contacts",     icon: "👥", color: "#6366f1" },
              { href: "/whatsapp-crm/campaigns/new",  label: "New Campaign",     icon: "📤", color: "#f59e0b" },
              { href: "/whatsapp-crm/support",        label: "Get Help",         icon: "💬", color: "#8b5cf6" },
            ].map((a) => (
              <Link key={a.href} href={a.href} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "0.875rem 1rem", borderRadius: "0.875rem",
                background: `${a.color}08`, border: `1px solid ${a.color}20`,
                color: a.color, fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span> {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .docs-grid { grid-template-columns: 1fr !important; }
          .docs-nav  { display: none !important; }
          .docs-mobile-select { display: block !important; }
        }
      `}</style>
    </div>
  );
}
