"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getCampaigns, getContacts, getWASession, getUserSubscription, getTodaySentCount } from "@/lib/whatsapp-crm/supabase";

const STAT_CONFIG = [
  { key: "contacts", label: "Total Contacts", icon: "👥", color: "#6366f1" },
  { key: "campaigns", label: "Total Campaigns", icon: "📢", color: "#f59e0b" },
  { key: "sent", label: "Messages Sent", icon: "✅", color: "#25D366" },
  { key: "successRate", label: "Success Rate", icon: "📊", color: "#8b5cf6", suffix: "%" },
];

function StatCard({ label, icon, value, color, suffix = "" }) {
  return (
    <div style={{
      padding: "1.25rem 1.5rem",
      borderRadius: "1rem",
      background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
      border: "1px solid rgba(255,255,255,0.07)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{
          padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600,
          color, background: `${color}15`, border: `1px solid ${color}25`,
          letterSpacing: "0.05em",
        }}>Live</span>
      </div>
      <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        {value ?? "—"}{suffix}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function CampaignRow({ campaign }) {
  const statusColors = {
    completed: "#25D366", running: "#f59e0b", paused: "#6366f1",
    draft: "rgba(255,255,255,0.3)", failed: "#ef4444", cancelled: "#ef4444",
  };
  const color = statusColors[campaign.status] || "rgba(255,255,255,0.3)";
  const successRate = campaign.total_contacts > 0
    ? Math.round((campaign.sent_count / campaign.total_contacts) * 100)
    : 0;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 90px 80px 80px 80px 90px",
      gap: "1rem",
      alignItems: "center",
      padding: "0.875rem 1rem",
      borderRadius: 8,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      transition: "background 0.15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{campaign.name}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
          {new Date(campaign.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
      <span style={{
        padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600,
        color, background: `${color}15`, border: `1px solid ${color}30`,
        letterSpacing: "0.05em", textTransform: "capitalize", textAlign: "center",
        display: "inline-block",
      }}>
        {campaign.status}
      </span>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{campaign.total_contacts}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>total</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#25D366" }}>{campaign.sent_count}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>sent</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: campaign.failed_count > 0 ? "#ef4444" : "rgba(255,255,255,0.3)" }}>
          {campaign.failed_count}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>failed</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: successRate >= 90 ? "#25D366" : successRate >= 60 ? "#f59e0b" : "#ef4444" }}>
          {successRate}%
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>success</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useWACRMAuth();
  const [data, setData] = useState({ contacts: [], campaigns: [], waSession: null, subscription: null, todayUsage: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getContacts(user.id),
      getCampaigns(user.id),
      getWASession(user.id),
      getUserSubscription(user.id),
      getTodaySentCount(user.id),
    ]).then(([contacts, campaigns, waSession, subscription, todayUsage]) => {
      setData({ contacts, campaigns, waSession, subscription, todayUsage });
    }).finally(() => setLoading(false));
  }, [user]);

  const totalSent = data.campaigns.reduce((s, c) => s + (c.sent_count || 0), 0);
  const totalFailed = data.campaigns.reduce((s, c) => s + (c.failed_count || 0), 0);
  const successRate = totalSent + totalFailed > 0
    ? Math.round((totalSent / (totalSent + totalFailed)) * 100)
    : 0;

  const recentCampaigns = data.campaigns.slice(0, 5);
  const isConnected = data.waSession?.status === "connected";
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
          Hey, {name} 👋
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)" }}>
          Here&apos;s what&apos;s happening with your WhatsApp campaigns
        </p>
      </div>

      {/* WhatsApp connection alert */}
      {!loading && !isConnected && (
        <div style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.875rem",
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f59e0b" }}>WhatsApp not connected</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Connect your WhatsApp to start sending campaigns</div>
            </div>
          </div>
          <Link
            href="/whatsapp-crm/connect"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "9px 18px", borderRadius: 100,
              background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b", fontSize: 12.5, fontWeight: 600, textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            Connect now →
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        <StatCard label="Total Contacts" icon="👥" value={loading ? null : data.contacts.length} color="#6366f1" />
        <StatCard label="Total Campaigns" icon="📢" value={loading ? null : data.campaigns.length} color="#f59e0b" />
        <StatCard label="Messages Sent" icon="✅" value={loading ? null : totalSent.toLocaleString()} color="#25D366" />
        <StatCard label="Success Rate" icon="📊" value={loading ? null : successRate} color="#8b5cf6" suffix="%" />
      </div>

      {/* Quick actions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "0.75rem",
        marginBottom: "2rem",
      }}>
        {[
          { href: "/whatsapp-crm/campaigns/new", label: "New Campaign", icon: "📤", color: "#25D366" },
          { href: "/whatsapp-crm/contacts", label: "Import Contacts", icon: "📋", color: "#6366f1" },
          { href: "/whatsapp-crm/connect", label: isConnected ? "Connected ✓" : "Connect WA", icon: "📱", color: "#f59e0b" },
          { href: "/whatsapp-crm/history", label: "View History", icon: "🕐", color: "#8b5cf6" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0.875rem 1rem",
              borderRadius: "0.875rem",
              background: `${a.color}0a`,
              border: `1px solid ${a.color}25`,
              color: a.color,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${a.color}18`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${a.color}0a`; }}
          >
            <span style={{ fontSize: 18 }}>{a.icon}</span>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Recent campaigns */}
      <div style={{
        borderRadius: "1rem",
        background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>Recent Campaigns</h2>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", marginTop: 2, margin: 0 }}>Last 5 campaigns</p>
          </div>
          <Link
            href="/whatsapp-crm/history"
            style={{ fontSize: 12, color: "#25D366", textDecoration: "none", fontWeight: 500 }}
          >
            View all →
          </Link>
        </div>

        <div style={{ padding: "1rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Loading campaigns…
            </div>
          ) : recentCampaigns.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <div style={{ fontSize: 36, marginBottom: "0.75rem" }}>📭</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>No campaigns yet</p>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
                Create your first bulk messaging campaign
              </p>
              <Link
                href="/whatsapp-crm/campaigns/new"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "10px 20px", borderRadius: 100,
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.25)",
                }}
              >
                Create Campaign →
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 80px 80px 80px 90px",
                gap: "1rem",
                padding: "0 1rem 0.5rem",
                minWidth: 540,
              }}>
                {["Campaign", "Status", "Total", "Sent", "Failed", "Rate"].map((h) => (
                  <div key={h} style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: h === "Campaign" || h === "Status" ? "left" : "right" }}>
                    {h}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 540 }}>
                {recentCampaigns.map((c) => <CampaignRow key={c.id} campaign={c} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Today's Usage + Plan */}
      {!loading && data.todayUsage && (
        <div style={{
          marginTop: "1.5rem",
          borderRadius: "1rem",
          background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))",
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>💎</span>
              <div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#c9a96e" }}>
                  {data.todayUsage.planName} Plan
                </span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>
                  {data.todayUsage.limit === -1 ? "Unlimited messages" : `${data.todayUsage.limit} messages/day`}
                </span>
              </div>
            </div>
            <Link href="/whatsapp-crm/settings#billing" style={{ fontSize: 12, color: "#c9a96e", textDecoration: "none", fontWeight: 600 }}>
              Upgrade plan →
            </Link>
          </div>

          <div style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.625rem" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Today's Usage</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: (() => {
                if (data.todayUsage.limit === -1) return "#25D366";
                const pct = data.todayUsage.sent / data.todayUsage.limit;
                return pct >= 0.9 ? "#ef4444" : pct >= 0.7 ? "#f59e0b" : "#25D366";
              })() }}>
                {data.todayUsage.sent}
                {data.todayUsage.limit !== -1 && ` / ${data.todayUsage.limit}`}
                {" "}<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>messages sent today</span>
              </span>
            </div>
            {data.todayUsage.limit !== -1 && (() => {
              const pct = Math.min(100, Math.round((data.todayUsage.sent / data.todayUsage.limit) * 100));
              const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#25D366";
              return (
                <div>
                  <div style={{ height: 6, borderRadius: 100, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 100, background: barColor, transition: "width 0.5s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                      {data.todayUsage.limit - data.todayUsage.sent > 0
                        ? `${data.todayUsage.limit - data.todayUsage.sent} remaining today`
                        : "Daily limit reached — resets at midnight"}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{pct}%</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
