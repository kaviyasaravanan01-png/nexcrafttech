"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getCampaigns } from "@/lib/whatsapp-crm/supabase";
import {
  queueCampaign, pauseCampaign, resumeCampaign,
  stopCampaign, getSocketURL, getSessionStatus,
} from "@/lib/whatsapp-crm/api";

const STATUS_STYLE = {
  draft:     { color: "rgba(255,255,255,0.4)",  bg: "rgba(255,255,255,0.05)"  },
  queued:    { color: "#8b5cf6",                bg: "rgba(139,92,246,0.1)"    },
  running:   { color: "#f59e0b",                bg: "rgba(245,158,11,0.1)"    },
  paused:    { color: "#6366f1",                bg: "rgba(99,102,241,0.1)"    },
  completed: { color: "#25D366",                bg: "rgba(37,211,102,0.1)"    },
  failed:    { color: "#ef4444",                bg: "rgba(239,68,68,0.1)"     },
  cancelled: { color: "#ef4444",                bg: "rgba(239,68,68,0.08)"    },
};

function ProgressBar({ sent, total, color = "#25D366" }) {
  const pct = total > 0 ? Math.min(100, Math.round((sent / total) * 100)) : 0;
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 5, overflow: "hidden", marginTop: 6 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 100, transition: "width 0.4s ease" }} />
    </div>
  );
}

export default function CampaignsPage() {
  const { user } = useWACRMAuth();
  const [campaigns, setCampaigns]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [token, setToken]           = useState(null);
  const [waConnected, setWaConnected] = useState(null); // null=checking, true/false
  const [activeCampaign, setActive] = useState(null); // campaign being watched for live logs
  const [logs, setLogs]             = useState([]);
  const [liveStats, setLiveStats]   = useState({}); // { [campaignId]: { sent, failed, total } }
  const [actionLoading, setActionLoading] = useState(null);
  const logsEndRef = useRef(null);
  const socketRef  = useRef(null);

  // Load token, then check WA connection status
  useEffect(() => {
    import("@/lib/whatsapp-crm/supabase").then(({ getSupabase }) => {
      getSupabase()?.auth.getSession().then(({ data }) => {
        const t = data?.session?.access_token ?? null;
        setToken(t);
        if (t) {
          getSessionStatus(t)
            .then((s) => setWaConnected(s?.status === "connected"))
            .catch(() => setWaConnected(false));
        }
      });
    });
  }, []);

  // Load campaigns
  const load = () => {
    if (!user) return;
    getCampaigns(user.id).then(setCampaigns).finally(() => setLoading(false));
  };
  useEffect(load, [user]);

  // Socket.IO for live progress
  useEffect(() => {
    if (!user || !token) return;
    let io;
    import("socket.io-client").then(({ io: socketIO }) => {
      io = socketIO(getSocketURL(), {
        auth: { userId: user.id, token },
        transports: ["websocket", "polling"],
        reconnection: true,
      });

      io.on("campaign:started", ({ campaignId, total }) => {
        setCampaigns((prev) => prev.map((c) =>
          c.id === campaignId ? { ...c, status: "running", total_contacts: total } : c
        ));
        setLiveStats((s) => ({ ...s, [campaignId]: { sent: 0, failed: 0, total } }));
        setLogs([]);
      });

      io.on("campaign:progress", ({ campaignId, sent, failed, total, log: logLine }) => {
        setCampaigns((prev) => prev.map((c) =>
          c.id === campaignId ? { ...c, status: "running", sent_count: sent, failed_count: failed } : c
        ));
        setLiveStats((s) => ({ ...s, [campaignId]: { sent, failed, total } }));
        if (logLine) {
          setLogs((l) => [...l.slice(-199), logLine]); // keep last 200 lines
        }
      });

      io.on("campaign:completed", ({ campaignId, sent, failed, total }) => {
        setCampaigns((prev) => prev.map((c) =>
          c.id === campaignId ? { ...c, status: "completed", sent_count: sent, failed_count: failed } : c
        ));
        setLiveStats((s) => ({ ...s, [campaignId]: { sent, failed, total } }));
        setLogs((l) => [...l, `✅ Campaign completed — ${sent} sent, ${failed} failed`]);
      });

      io.on("campaign:error", ({ campaignId, message }) => {
        setCampaigns((prev) => prev.map((c) =>
          c.id === campaignId ? { ...c, status: "failed" } : c
        ));
        setLogs((l) => [...l, `❌ Error: ${message}`]);
      });

      socketRef.current = io;
    });
    return () => { io?.disconnect(); socketRef.current = null; };
  }, [user?.id, token]);

  // Auto-scroll logs
  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  async function handleStart(campaign) {
    if (!token) return;
    setActionLoading(campaign.id + "_start");
    try {
      // If stuck in running, reset counters before re-queuing
      if (campaign.status === "running") {
        const { updateCampaign } = await import("@/lib/whatsapp-crm/supabase");
        await updateCampaign(campaign.id, {
          status: "draft",
          sent_count: 0,
          failed_count: 0,
          pending_count: campaign.total_contacts,
          started_at: null,
          completed_at: null,
          error_message: null,
        });
      }
      await queueCampaign(token, campaign.id);
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: "queued", sent_count: 0, failed_count: 0 } : c));
      setActive(campaign);
      setLogs([`🚀 Campaign queued — waiting for worker…`]);
    } catch (err) {
      alert("Failed to queue: " + err.message);
    } finally { setActionLoading(null); }
  }

  async function handlePause(campaign) {
    if (!token) return;
    setActionLoading(campaign.id + "_pause");
    try {
      await pauseCampaign(token, campaign.id);
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: "paused" } : c));
    } catch (err) { alert("Pause failed: " + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleResume(campaign) {
    if (!token) return;
    setActionLoading(campaign.id + "_resume");
    try {
      await resumeCampaign(token, campaign.id);
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: "queued" } : c));
    } catch (err) { alert("Resume failed: " + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleStop(campaign) {
    if (!token || !confirm("Stop this campaign? This cannot be undone.")) return;
    setActionLoading(campaign.id + "_stop");
    try {
      await stopCampaign(token, campaign.id);
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: "cancelled" } : c));
    } catch (err) { alert("Stop failed: " + err.message); }
    finally { setActionLoading(null); }
  }

  async function handleDelete(campaign) {
    if (!confirm(`Delete "${campaign.name}"? This will also delete all message logs for this campaign.`)) return;
    setActionLoading(campaign.id + "_delete");
    try {
      const { getSupabase } = await import("@/lib/whatsapp-crm/supabase");
      const sb = getSupabase();
      // Delete logs first (FK constraint), then campaign
      await sb.from("wa_message_logs").delete().eq("campaign_id", campaign.id);
      const { error } = await sb.from("wa_campaigns").delete().eq("id", campaign.id);
      if (error) throw new Error(error.message);
      setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
      if (activeCampaign?.id === campaign.id) { setActive(null); setLogs([]); }
    } catch (err) { alert("Delete failed: " + err.message); }
    finally { setActionLoading(null); }
  }

  const BtnStyle = (color, bg) => ({
    padding: "6px 14px", borderRadius: 8, fontSize: 11.5, fontWeight: 600,
    color, background: bg, border: `1px solid ${color}30`,
    cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
            Bulk Messenger
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
            {loading ? "Loading…" : `${campaigns.length} campaigns`}
          </p>
        </div>
        <Link href="/whatsapp-crm/campaigns/new" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 20px", borderRadius: 100,
          background: "linear-gradient(135deg,#25D366,#128C7E)",
          color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Campaign
        </Link>
      </div>

      {/* WhatsApp not connected banner */}
      {waConnected === false && (
        <div style={{
          marginBottom: "1.25rem",
          padding: "1rem 1.25rem",
          borderRadius: "0.875rem",
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1rem", flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: 20 }}>📵</span>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "#ef4444", margin: 0 }}>
                WhatsApp not connected
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>
                You must connect WhatsApp before sending campaigns.
              </p>
            </div>
          </div>
          <Link href="/whatsapp-crm/connect" style={{
            padding: "8px 18px", borderRadius: 100, fontSize: 12.5, fontWeight: 700,
            background: "rgba(239,68,68,0.15)", color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.3)", textDecoration: "none",
            whiteSpace: "nowrap",
          }}>
            → Connect WhatsApp
          </Link>
        </div>
      )}

      {/* Live log console (shown when a campaign is selected) */}
      {activeCampaign && (
        <div style={{
          borderRadius: "1rem", overflow: "hidden",
          border: "1px solid rgba(245,158,11,0.2)",
          background: "rgba(0,0,0,0.4)", marginBottom: "1.5rem",
        }}>
          <div style={{
            padding: "0.75rem 1.25rem",
            background: "rgba(245,158,11,0.07)",
            borderBottom: "1px solid rgba(245,158,11,0.15)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.5s infinite", display: "inline-block" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>Live — {activeCampaign.name}</span>
              {liveStats[activeCampaign.id] && (
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>
                  {liveStats[activeCampaign.id].sent}/{liveStats[activeCampaign.id].total} sent
                  {liveStats[activeCampaign.id].failed > 0 && ` · ${liveStats[activeCampaign.id].failed} failed`}
                </span>
              )}
            </div>
            <button onClick={() => { setActive(null); setLogs([]); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: 11.5, height: 200, overflowY: "auto",
            padding: "0.75rem 1.25rem", color: "rgba(255,255,255,0.7)",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {logs.length === 0 ? (
              <span style={{ color: "rgba(255,255,255,0.25)" }}>Waiting for messages…</span>
            ) : logs.map((line, i) => (
              <div key={i} style={{
                color: line.includes("[FAIL]") || line.includes("❌") ? "#ef4444"
                  : line.includes("[SENT]") || line.includes("✅") ? "#25D366"
                  : "rgba(255,255,255,0.65)",
              }}>{line}</div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* Campaign list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>Loading campaigns…</div>
      ) : campaigns.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          borderRadius: "1rem",
          background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>📭</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>No campaigns yet</h3>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
            Create your first bulk WhatsApp campaign to get started
          </p>
          <Link href="/whatsapp-crm/campaigns/new" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "11px 24px", borderRadius: 100,
            background: "linear-gradient(135deg,#25D366,#128C7E)",
            color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 20px rgba(37,211,102,0.25)",
          }}>
            Create First Campaign →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {campaigns.map((c) => {
            const st  = STATUS_STYLE[c.status] || STATUS_STYLE.draft;
            const live = liveStats[c.id];
            const sent   = live?.sent   ?? c.sent_count   ?? 0;
            const failed = live?.failed ?? c.failed_count ?? 0;
            const total  = live?.total  ?? c.total_contacts ?? 0;
            const rate   = total > 0 ? Math.round((sent / total) * 100) : 0;
            const isActive = activeCampaign?.id === c.id;
            const al = actionLoading;

            return (
              <div key={c.id} style={{
                padding: "1.25rem 1.5rem",
                borderRadius: "1rem",
                background: isActive ? "rgba(245,158,11,0.04)" : "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))",
                border: `1px solid ${isActive ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)"}`,
                transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  {/* Left: name + meta */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{c.name}</span>
                      <span style={{
                        padding: "2px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600,
                        color: st.color, background: st.bg, border: `1px solid ${st.color}30`,
                        textTransform: "capitalize", letterSpacing: "0.05em",
                      }}>
                        {c.status === "running" ? "🔄 Running" : c.status === "queued" ? "⏳ Queued" : c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                      {new Date(c.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      {c.delay_min_sec && ` · ${c.delay_min_sec}–${c.delay_max_sec}s delay`}
                      {c.spin_enabled && " · Spin ✓"}
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {[
                        { label: "Total",   val: total,  col: "rgba(255,255,255,0.6)" },
                        { label: "Sent",    val: sent,   col: "#25D366" },
                        { label: "Failed",  val: failed, col: failed > 0 ? "#ef4444" : "rgba(255,255,255,0.3)" },
                        { label: "Rate",    val: `${rate}%`, col: rate >= 90 ? "#25D366" : rate >= 60 ? "#f59e0b" : rate > 0 ? "#ef4444" : "rgba(255,255,255,0.3)" },
                      ].map(({ label, val, col }) => (
                        <div key={label}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: col }}>{val}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar (show for running/queued) */}
                    {["running", "queued", "completed"].includes(c.status) && total > 0 && (
                      <div style={{ marginTop: 10, maxWidth: 400 }}>
                        <ProgressBar sent={sent} total={total} color={c.status === "completed" ? "#25D366" : "#f59e0b"} />
                      </div>
                    )}
                  </div>

                  {/* Right: action buttons */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-start", paddingTop: 2 }}>
                    {/* Watch live */}
                    {["running", "queued"].includes(c.status) && (
                      <button
                        onClick={() => { setActive(c); setLogs([]); }}
                        style={BtnStyle("#f59e0b", "rgba(245,158,11,0.1)")}
                      >
                        👁 Watch Live
                      </button>
                    )}

                    {/* Start (draft / completed / failed / cancelled / stuck-running) */}
                    {["draft", "completed", "failed", "cancelled", "running"].includes(c.status) && (
                      <button
                        onClick={() => waConnected ? handleStart(c) : null}
                        disabled={al === c.id + "_start" || waConnected === false}
                        title={waConnected === false ? "Connect WhatsApp first" : undefined}
                        style={{
                          ...BtnStyle(
                            waConnected === false ? "rgba(255,255,255,0.2)" : "#25D366",
                            waConnected === false ? "rgba(255,255,255,0.04)" : "rgba(37,211,102,0.1)"
                          ),
                          cursor: waConnected === false ? "not-allowed" : "pointer",
                          opacity: waConnected === false ? 0.5 : 1,
                        }}
                      >
                        {al === c.id + "_start" ? "⏳" : "▶"}{" "}
                        {c.status === "draft" ? "Start" : c.status === "running" ? "Force Re-run" : "Re-run"}
                      </button>
                    )}

                    {/* Pause */}
                    {c.status === "running" && (
                      <button
                        onClick={() => handlePause(c)}
                        disabled={al === c.id + "_pause"}
                        style={BtnStyle("#f59e0b", "rgba(245,158,11,0.08)")}
                      >
                        ⏸ {al === c.id + "_pause" ? "…" : "Pause"}
                      </button>
                    )}

                    {/* Resume */}
                    {c.status === "paused" && (
                      <button
                        onClick={() => handleResume(c)}
                        disabled={al === c.id + "_resume"}
                        style={BtnStyle("#6366f1", "rgba(99,102,241,0.1)")}
                      >
                        ▶ {al === c.id + "_resume" ? "…" : "Resume"}
                      </button>
                    )}

                    {/* Stop */}
                    {["running", "paused", "queued"].includes(c.status) && (
                      <button
                        onClick={() => handleStop(c)}
                        disabled={al === c.id + "_stop"}
                        style={BtnStyle("#ef4444", "rgba(239,68,68,0.08)")}
                      >
                        ⏹ {al === c.id + "_stop" ? "…" : "Stop"}
                      </button>
                    )}

                    {/* Edit — only for non-active */}
                    {!["running", "queued"].includes(c.status) && (
                      <Link href={`/whatsapp-crm/campaigns/${c.id}/edit`} style={BtnStyle("rgba(255,255,255,0.4)", "rgba(255,255,255,0.04)")}>
                        ✏️ Edit
                      </Link>
                    )}

                    {/* View logs */}
                    <Link href={`/whatsapp-crm/history`} style={BtnStyle("rgba(255,255,255,0.4)", "rgba(255,255,255,0.04)")}>
                      📋 Logs
                    </Link>

                    {/* Delete — only for non-active campaigns */}
                    {!["running", "queued"].includes(c.status) && (
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={al === c.id + "_delete"}
                        title="Delete campaign"
                        style={{
                          padding: "6px 10px", borderRadius: 8, fontSize: 13,
                          color: "rgba(239,68,68,0.6)", background: "rgba(239,68,68,0.06)",
                          border: "1px solid rgba(239,68,68,0.15)",
                          cursor: "pointer", transition: "all 0.15s",
                          display: "flex", alignItems: "center",
                        }}
                      >
                        {al === c.id + "_delete" ? "⏳" : "🗑"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
