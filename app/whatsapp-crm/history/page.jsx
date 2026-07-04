"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getCampaigns, getCampaignLogs } from "@/lib/whatsapp-crm/supabase";

const STATUS_COLORS = {
  completed: "#25D366", running: "#f59e0b", paused: "#6366f1",
  draft: "rgba(255,255,255,0.3)", failed: "#ef4444", cancelled: "#ef4444", queued: "#8b5cf6",
};

const LOG_COLORS = {
  sent: "#25D366", failed: "#ef4444", pending: "#f59e0b", skipped: "rgba(255,255,255,0.3)",
};

export default function HistoryPage() {
  const { user } = useWACRMAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getCampaigns(user.id).then(setCampaigns).finally(() => setLoading(false));
  }, [user]);

  async function selectCampaign(c) {
    setSelected(c);
    setLogsLoading(true);
    setLogs([]);
    try {
      const data = await getCampaignLogs(c.id);
      setLogs(data);
    } finally {
      setLogsLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
          Campaign History
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0.25rem 0 0" }}>
          All your campaigns with delivery logs
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: "1.25rem" }} className="history-grid">
        {/* Campaign list */}
        <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>All Campaigns</span>
            <Link href="/whatsapp-crm/campaigns/new" style={{ fontSize: 12, color: "#25D366", textDecoration: "none", fontWeight: 600 }}>
              + New
            </Link>
          </div>
          <div style={{ maxHeight: 600, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading…</div>
            ) : campaigns.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>No campaigns yet</p>
                <Link href="/whatsapp-crm/campaigns/new" style={{ fontSize: 12.5, color: "#25D366", textDecoration: "none" }}>
                  Create your first campaign →
                </Link>
              </div>
            ) : campaigns.map((c) => {
              const color = STATUS_COLORS[c.status] || "rgba(255,255,255,0.3)";
              const rate = c.total_contacts > 0 ? Math.round((c.sent_count / c.total_contacts) * 100) : 0;
              return (
                <div
                  key={c.id}
                  onClick={() => selectCampaign(c)}
                  style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    background: selected?.id === c.id ? "rgba(37,211,102,0.05)" : "transparent",
                    borderLeft: selected?.id === c.id ? "2px solid #25D366" : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (selected?.id !== c.id) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { if (selected?.id !== c.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{c.name}</span>
                    <span style={{
                      padding: "2px 8px", borderRadius: 100, fontSize: 9.5, fontWeight: 600,
                      color, background: `${color}15`, border: `1px solid ${color}25`,
                      textTransform: "capitalize",
                    }}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)" }}>{c.total_contacts} contacts</span>
                    <span style={{ fontSize: 11.5, color: "#25D366" }}>{c.sent_count} sent</span>
                    {c.failed_count > 0 && <span style={{ fontSize: 11.5, color: "#ef4444" }}>{c.failed_count} failed</span>}
                    <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginLeft: "auto" }}>{rate}%</span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                    {new Date(c.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logs panel */}
        {selected && (
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{selected.name}</span>
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>{logs.length} logs</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <div style={{
              fontFamily: "monospace", fontSize: 11.5, maxHeight: 500, overflowY: "auto",
              padding: "0.75rem 1rem", background: "rgba(0,0,0,0.3)",
            }}>
              {logsLoading ? (
                <div style={{ color: "rgba(255,255,255,0.3)", padding: "1rem 0" }}>Loading logs…</div>
              ) : logs.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.3)", padding: "1rem 0" }}>No logs for this campaign yet.</div>
              ) : logs.map((log) => (
                <div key={log.id} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
                    {new Date(log.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  <span style={{ color: LOG_COLORS[log.status], fontWeight: 600, flexShrink: 0, textTransform: "uppercase", width: 50 }}>
                    [{log.status}]
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    {log.name ? `${log.name} ` : ""}+{log.phone}
                    {log.error_msg && <span style={{ color: "#ef4444", marginLeft: 6 }}>— {log.error_msg}</span>}
                    {log.delay_used && <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>({log.delay_used}ms delay)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@media(max-width:768px){.history-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
