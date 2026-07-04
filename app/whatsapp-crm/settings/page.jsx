"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { createPaymentOrder, verifyPayment } from "@/lib/whatsapp-crm/api";

// ── Plan definitions (mirror wa_plans seed data) ──────────────────────────
const PLANS = [
  {
    id: "free", name: "Free", priceINR: 0, priceUSD: 0,
    msgPerDay: 50, maxContacts: 100, color: "rgba(255,255,255,0.5)",
    features: ["50 messages/day", "100 contacts", "Basic campaigns", "Message history"],
  },
  {
    id: "starter", name: "Starter", priceINR: 499, priceUSD: 6,
    msgPerDay: 500, maxContacts: 1000, color: "#6366f1",
    features: ["500 messages/day", "1,000 contacts", "Scheduling", "Attachments", "Priority support"],
  },
  {
    id: "pro", name: "Pro", priceINR: 1499, priceUSD: 18,
    msgPerDay: 5000, maxContacts: 10000, color: "#f59e0b", popular: true,
    features: ["5,000 messages/day", "10,000 contacts", "Multi-device", "Advanced analytics", "Priority support"],
  },
  {
    id: "business", name: "Business", priceINR: 3999, priceUSD: 48,
    msgPerDay: -1, maxContacts: -1, color: "#c9a96e",
    features: ["Unlimited messages", "Unlimited contacts", "API access", "Dedicated support", "Custom branding"],
  },
];

const PLAN_ORDER = ["free", "starter", "pro", "business"];

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Toggle component ──────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
      background: checked ? "#25D366" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s",
    }}>
      <span style={{ position: "absolute", top: 3, left: checked ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user } = useWACRMAuth();
  const [activeTab, setActiveTab]       = useState("profile");
  const [token, setToken]               = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [payLoading, setPayLoading]     = useState(null); // planId being processed
  const [payMsg, setPayMsg]             = useState(null); // { type: 'success'|'error', text }

  const tabs = [
    { id: "profile",       label: "Profile" },
    { id: "billing",       label: "Billing" },
    { id: "api",           label: "API Keys" },
    { id: "notifications", label: "Notifications" },
  ];

  // Load token + subscription
  useEffect(() => {
    import("@/lib/whatsapp-crm/supabase").then(({ getSupabase, getUserSubscription }) => {
      getSupabase()?.auth.getSession().then(({ data }) => {
        const t = data?.session?.access_token ?? null;
        setToken(t);
      });
      if (user) {
        getUserSubscription(user.id).then(setSubscription);
      }
    });
  }, [user]);

  // Handle URL hash (e.g. #billing from dashboard)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#billing") {
      setActiveTab("billing");
    }
  }, []);

  const currentPlanId = subscription?.plan_id || "free";
  const currentPlanIdx = PLAN_ORDER.indexOf(currentPlanId);

  // ── Razorpay checkout ─────────────────────────────────────────────────
  const handleUpgrade = useCallback(async (plan) => {
    if (!token || !user) return;
    setPayLoading(plan.id);
    setPayMsg(null);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load Razorpay checkout. Check your internet connection.");

      const order = await createPaymentOrder(token, plan.id);

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount:      order.amount,
          currency:    order.currency || "INR",
          name:        "NexCraft WhatsApp CRM",
          description: order.planLabel,
          order_id:    order.orderId,
          image:       "/nct-logo.svg",
          prefill: {
            email: user.email,
            name:  user.user_metadata?.full_name || "",
          },
          theme: { color: plan.color === "rgba(255,255,255,0.5)" ? "#25D366" : plan.color },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
          handler: async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {
            try {
              const result = await verifyPayment(token, {
                paymentId: razorpay_payment_id,
                orderId:   razorpay_order_id,
                signature: razorpay_signature,
                planId:    plan.id,
              });
              setSubscription((s) => ({ ...s, plan_id: plan.id }));
              setPayMsg({ type: "success", text: `🎉 ${result.message || `${plan.name} plan activated!`}` });
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        });
        rzp.open();
      });
    } catch (err) {
      if (err.message !== "Payment cancelled") {
        setPayMsg({ type: "error", text: err.message || "Payment failed. Please try again." });
      }
    } finally {
      setPayLoading(null);
    }
  }, [token, user]);

  const cardBase = { borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem" };

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
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "8px 12px", borderRadius: 8, border: "none",
            background: activeTab === t.id ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.4)",
            fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
            cursor: "pointer", transition: "all 0.15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "2rem" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#25D36630,#25D36610)", border: "2px solid rgba(37,211,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#25D366" }}>
              {(user?.user_metadata?.full_name || user?.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{user?.user_metadata?.full_name || "Anonymous"}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{user?.email}</div>
              <div style={{ marginTop: 4, padding: "2px 10px", borderRadius: 100, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", fontSize: 10, fontWeight: 600, color: "#25D366", display: "inline-block", letterSpacing: "0.05em" }}>
                {(subscription?.plan_id || "free").toUpperCase()} PLAN
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[{ label: "FULL NAME", value: user?.user_metadata?.full_name || "", readOnly: false }, { label: "EMAIL", value: user?.email || "", readOnly: true }].map(({ label, value, readOnly }) => (
              <div key={label}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.07em" }}>{label}</label>
                <input defaultValue={value} readOnly={readOnly} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: readOnly ? "rgba(255,255,255,0.4)" : "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <button style={{ padding: "10px 22px", borderRadius: 8, background: "linear-gradient(135deg,#25D366,#128C7E)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start", marginTop: 4 }}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ── Billing ─────────────────────────────────────────────────────── */}
      {activeTab === "billing" && (
        <div>
          {/* Current plan banner */}
          <div style={{ ...cardBase, marginBottom: "1.25rem", background: `${PLANS.find((p) => p.id === currentPlanId)?.color || "#25D366"}08`, borderColor: `${PLANS.find((p) => p.id === currentPlanId)?.color || "#25D366"}25` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>Current Plan</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
                    {PLANS.find((p) => p.id === currentPlanId)?.name}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                    {currentPlanId === "free" ? "Free forever"
                      : `₹${PLANS.find((p) => p.id === currentPlanId)?.priceINR}/month`}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 4, marginBottom: 0 }}>
                  {(() => { const p = PLANS.find((x) => x.id === currentPlanId); return `${p?.msgPerDay === -1 ? "Unlimited" : p?.msgPerDay} msgs/day · ${p?.maxContacts === -1 ? "Unlimited" : p?.maxContacts?.toLocaleString()} contacts`; })()}
                </p>
              </div>
              <div style={{ padding: "6px 16px", borderRadius: 100, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366", fontSize: 12, fontWeight: 700 }}>
                ✓ Active
              </div>
            </div>
          </div>

          {/* Payment feedback */}
          {payMsg && (
            <div style={{ padding: "0.875rem 1.25rem", borderRadius: "0.75rem", marginBottom: "1.25rem", background: payMsg.type === "success" ? "rgba(37,211,102,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${payMsg.type === "success" ? "rgba(37,211,102,0.25)" : "rgba(239,68,68,0.25)"}`, color: payMsg.type === "success" ? "#25D366" : "#ef4444", fontSize: 13.5, fontWeight: 500 }}>
              {payMsg.text}
            </div>
          )}

          {/* Plan cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "0.875rem", marginBottom: "1.25rem" }}>
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlanId;
              const isDowngrade = PLAN_ORDER.indexOf(plan.id) < currentPlanIdx;
              const isLoading  = payLoading === plan.id;

              return (
                <div key={plan.id} style={{
                  padding: "1.25rem", borderRadius: 12, position: "relative",
                  background: isCurrent ? `${plan.color}12` : `${plan.color}06`,
                  border: `${isCurrent ? 2 : 1}px solid ${isCurrent ? plan.color : `${plan.color}25`}`,
                  transition: "all 0.15s",
                }}>
                  {plan.popular && !isCurrent && (
                    <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "2px 10px", borderRadius: 100, background: "#f59e0b", color: "#000", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      Most Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "2px 10px", borderRadius: 100, background: plan.color, color: "#000", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      Current
                    </div>
                  )}

                  <div style={{ fontSize: 14, fontWeight: 700, color: isCurrent ? plan.color : "#fff", marginBottom: 6 }}>{plan.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                    {plan.priceINR === 0 ? "Free" : `₹${plan.priceINR.toLocaleString()}`}
                  </div>
                  {plan.priceINR > 0 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>/month · ~${plan.priceUSD}</div>}
                  {plan.priceINR === 0 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>forever</div>}

                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 14 }}>
                    {plan.features.slice(0, 3).map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                        <span style={{ color: plan.color, fontSize: 9, marginTop: 3 }}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>

                  {isCurrent ? (
                    <div style={{ width: "100%", padding: "7px", borderRadius: 8, background: `${plan.color}20`, color: plan.color, fontSize: 11.5, fontWeight: 600, textAlign: "center" }}>
                      ✓ Active
                    </div>
                  ) : plan.priceINR === 0 ? (
                    <div style={{ width: "100%", padding: "7px", borderRadius: 8, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", fontSize: 11.5, textAlign: "center" }}>
                      Downgrade
                    </div>
                  ) : (
                    <button
                      onClick={() => !isDowngrade && handleUpgrade(plan)}
                      disabled={isLoading || isDowngrade}
                      style={{
                        width: "100%", padding: "8px", borderRadius: 8,
                        background: isDowngrade ? "rgba(255,255,255,0.04)" : isLoading ? `${plan.color}30` : `${plan.color}18`,
                        border: `1px solid ${isDowngrade ? "rgba(255,255,255,0.08)" : `${plan.color}35`}`,
                        color: isDowngrade ? "rgba(255,255,255,0.3)" : plan.color,
                        fontSize: 11.5, fontWeight: 600, cursor: isDowngrade ? "not-allowed" : "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {isLoading ? "Processing…" : isDowngrade ? "Lower tier" : "Upgrade →"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
            💳 Payments secured by Razorpay · INR billing · Cancel anytime · No hidden fees
          </p>
        </div>
      )}

      {/* ── API Keys ─────────────────────────────────────────────────────── */}
      {activeTab === "api" && (
        <div style={cardBase}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>API Keys</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem" }}>Use these keys to integrate WhatsApp CRM into your own systems.</p>
          {["pro", "business"].includes(currentPlanId) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[{ label: "API Key", value: `wa_live_${user?.id?.slice(0, 16)}` }, { label: "Webhook Secret", value: "wh_secret_••••••••••••" }].map(({ label, value }) => (
                <div key={label}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.07em" }}>{label.toUpperCase()}</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input readOnly value={value} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none" }} />
                    <button onClick={() => navigator.clipboard.writeText(value)} style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 12 }}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "1rem", borderRadius: 8, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <p style={{ fontSize: 12.5, color: "#6366f1", margin: 0 }}>API access requires Pro or Business plan. <button onClick={() => setActiveTab("billing")} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 12.5 }}>Upgrade →</button></p>
            </div>
          )}
        </div>
      )}

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      {activeTab === "notifications" && (
        <div style={cardBase}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>Notification Preferences</h3>
          {[
            "Email me when a campaign completes",
            "Email me on campaign failures",
            "Email me weekly stats summary",
            "Browser notifications for live campaigns",
          ].map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)" }}>{item}</span>
              <Toggle checked={i < 2} onChange={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
