"use client";
import Link from "next/link";

const FAQS = [
  { q: "My messages are failing — what should I do?", a: "First, check that WhatsApp is connected (green dot in sidebar). Then verify the phone numbers in your contacts are in the correct format (e.g. 919876543210 for India). Check the campaign logs in History for specific error messages." },
  { q: "My WhatsApp shows disconnected after I restart the app", a: "Go to Connect page and scan the QR code once. After that, your session is saved permanently and won't disconnect on restarts." },
  { q: "Can I cancel my subscription?", a: "Currently subscriptions are monthly one-time payments. Contact us at the email below to request a refund or manage your billing." },
  { q: "How do I import contacts from Excel?", a: "Export your Excel sheet as a .CSV file (File → Save As → CSV). Then go to Contacts → Import CSV. Ensure columns are named: name, phone." },
  { q: "Why did my campaign stop mid-way?", a: "You likely hit the daily message limit for your plan. The campaign auto-pauses. It will resume when you re-run it the next day (after midnight reset). Upgrade your plan to send more per day." },
];

export default function SupportPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
          Help & Support
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
          We're here to help you get the most out of NexCraft WhatsApp CRM
        </p>
      </div>

      {/* Contact card */}
      <div style={{
        padding: "1.75rem",
        borderRadius: "1rem",
        background: "linear-gradient(135deg,rgba(37,211,102,0.06),rgba(37,211,102,0.02))",
        border: "1px solid rgba(37,211,102,0.2)",
        marginBottom: "1.5rem",
        display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap",
      }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(37,211,102,0.15)", border: "2px solid rgba(37,211,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          💬
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 0.5rem" }}>Contact Support</h2>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", margin: "0 0 1rem", lineHeight: 1.6 }}>
            Have a question, found a bug, or need help setting up? Reach out to us directly and we'll get back to you as soon as possible.
          </p>
          <a
            href="mailto:anandanathurelangovan94@gmail.com"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 100,
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              color: "#fff", fontSize: 13.5, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            anandanathurelangovan94@gmail.com
          </a>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: "0.75rem" }}>
            Response time: usually within 24 hours · Mon–Sat
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.75rem", marginBottom: "1.75rem" }}>
        {[
          { href: "/whatsapp-crm/docs",        icon: "📖", title: "Read the Docs",       desc: "Step-by-step guides for all features" },
          { href: "/whatsapp-crm/connect",     icon: "📱", title: "Connect WhatsApp",    desc: "Scan QR to link your number" },
          { href: "/whatsapp-crm/settings#billing", icon: "💳", title: "Manage Billing", desc: "Upgrade or check your plan" },
          { href: "/whatsapp-crm/campaigns",   icon: "📤", title: "My Campaigns",        desc: "View and manage campaigns" },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "1rem", borderRadius: "0.875rem", textDecoration: "none",
            background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))",
            border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        <div>
          {FAQS.map((item, i) => (
            <details key={i} style={{ borderBottom: i < FAQS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <summary style={{
                padding: "1rem 1.5rem", cursor: "pointer", fontSize: 13.5,
                fontWeight: 500, color: "rgba(255,255,255,0.8)", listStyle: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                {item.q}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 12 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div style={{ padding: "0 1.5rem 1.25rem", fontSize: 13.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "2rem" }}>
        NexCraft WhatsApp CRM is built by{" "}
        <a href="https://nexcrafttech.com" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>NexCraft Tech</a>
        {" "}· Support:{" "}
        <a href="mailto:anandanathurelangovan94@gmail.com" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
          anandanathurelangovan94@gmail.com
        </a>
      </p>
    </div>
  );
}
