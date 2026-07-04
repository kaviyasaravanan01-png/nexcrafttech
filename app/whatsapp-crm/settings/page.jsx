"use client";

import { useState } from "react";
import Link from "next/link";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";

const PLANS = [
  { id: "free", name: "Free", price: "₹0", priceUSD: "$0", msgs: "50 msgs/day", contacts: "100 contacts", color: "rgba(255,255,255,0.5)" },
  { id: "starter", name: "Starter", price: "₹499/mo", priceUSD: "$6/mo", msgs: "500 msgs/day", contacts: "1,000 contacts", color: "#6366f1" },
  { id: "pro", name: "Pro", price: "₹1,499/mo", priceUSD: "$18/mo", msgs: "5,000 msgs/day", contacts: "10,000 contacts", color: "#f59e0b", popular: true },
  { id: "business", name: "Business", price: "₹3,999/mo", priceUSD: "$48/mo", msgs: "Unlimited", contacts: "Unlimited", color: "#c9a96e" },
];

export default function SettingsPage() {
  const { user } = useWACRMAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "billing", label: "Billing" },
    { id: "api", label: "API Keys" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
          Manage your account, billing, and preferences
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, border: "1px solid rgba(255,255,255,0.07)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            id={t.id}
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 8, border: "none",
              background: activeTab === t.id ? "rgba(255,255,255,0.08)" : "transparent",
              color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.4)",
              fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "2rem" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#25D36630,#25D36610)", border: "2px solid rgba(37,211,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#25D366" }}>
              {(user?.user_metadata?.full_name || user?.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{user?.user_metadata?.full_name || "Anonymous"}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "FULL NAME", value: user?.user_metadata?.full_name || "" },
              { label: "EMAIL", value: user?.email || "" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.07em" }}>{label}</label>
                <input
                  defaultValue={value}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  readOnly={label === "EMAIL"}
                />
              </div>
            ))}
            <button style={{ padding: "10px 22px", borderRadius: 8, background: "linear-gradient(135deg,#25D366,#128C7E)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start", marginTop: 4 }}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === "billing" && (
        <div>
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: "1.25rem" }}>Choose a Plan</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "0.75rem" }}>
              {PLANS.map((p) => (
                <div key={p.id} style={{ padding: "1rem", borderRadius: 10, background: `${p.color}08`, border: `1px solid ${p.color}25`, position: "relative", cursor: "pointer" }}>
                  {p.popular && (
                    <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "2px 10px", borderRadius: 100, background: "#f59e0b", color: "#000", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Popular
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{p.price}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>{p.priceUSD}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    {p.msgs}<br />{p.contacts}
                  </div>
                  <button style={{
                    marginTop: "0.75rem", width: "100%", padding: "7px", borderRadius: 8,
                    background: `${p.color}15`, border: `1px solid ${p.color}30`,
                    color: p.color, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                  }}>
                    Select
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", marginTop: "1rem" }}>
              Payments powered by Razorpay · INR billing · Cancel anytime
            </p>
          </div>
        </div>
      )}

      {/* API Keys tab */}
      {activeTab === "api" && (
        <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>API Keys</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem" }}>Use these keys to integrate WhatsApp CRM into your own systems.</p>
          <div style={{ padding: "1rem", borderRadius: 8, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <p style={{ fontSize: 12.5, color: "#6366f1", margin: 0 }}>API access requires Pro or Business plan. <Link href="#" onClick={() => setActiveTab("billing")} style={{ color: "#6366f1", fontWeight: 600 }}>Upgrade →</Link></p>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === "notifications" && (
        <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>Notification Preferences</h3>
          {[
            "Email me when a campaign completes",
            "Email me on campaign failures",
            "Email me weekly stats summary",
            "Browser notifications for live campaigns",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)" }}>{item}</span>
              <div style={{ width: 36, height: 20, borderRadius: 10, background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.3)", position: "relative", cursor: "pointer" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#25D366", position: "absolute", top: 2, right: 2, transition: "all 0.2s" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
