"use client";

import { useState, useEffect, useRef } from "react";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getWASession } from "@/lib/whatsapp-crm/supabase";
import { requestQRCode, getSessionStatus, disconnectSession, getSocketURL } from "@/lib/whatsapp-crm/api";

const PROVIDERS = [
  { id: "baileys",    name: "Baileys",    description: "Primary — lightweight, fast, multi-device", badge: "Recommended" },
  { id: "wweb",       name: "WWebJS",     description: "Fallback 1 — browser-based, stable" },
  { id: "wppconnect", name: "WPPConnect", description: "Fallback 2 — enterprise grade" },
];

const STEPS = [
  "Open WhatsApp on your phone",
  "Tap Menu or Settings → Linked Devices",
  "Tap 'Link a Device'",
  "Point your phone camera at the QR code below",
];

export default function ConnectPage() {
  const { user } = useWACRMAuth();
  const [session, setSession]       = useState(null);
  const [qr, setQR]                 = useState(null);
  const [provider, setProvider]     = useState("baileys");
  const [status, setStatus]         = useState("idle");
  const [phone, setPhone]           = useState("");
  const [errorMsg, setErrorMsg]     = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [token, setToken]           = useState(null);
  const [needsRescan, setNeedsRescan] = useState(false); // true when session_data is null in DB
  const socketRef = useRef(null);

  // Fetch Supabase access token (must run first)
  useEffect(() => {
    import("@/lib/whatsapp-crm/supabase").then(({ getSupabase }) => {
      getSupabase()?.auth.getSession().then(({ data }) => {
        setToken(data?.session?.access_token ?? null);
      });
    });
  }, []);

  // Load status: first from Supabase DB, then confirm from Railway API
  useEffect(() => {
    if (!user || !token) return;

    async function loadStatus() {
      // 1. Read from Supabase DB first (fast)
      try {
        const s = await getWASession(user.id);
        if (s?.status) {
          setStatus(s.status);
          if (s.phone) setPhone(s.phone);
        }
        // If session_data is null, credentials aren't persisted yet — flag for rescan
        if (!s?.session_data) setNeedsRescan(true);
      } catch { /* table may not exist yet */ }

      // 2. Confirm with Railway live status (source of truth)
      try {
        const live = await getSessionStatus(token);
        if (live?.status) {
          setStatus(live.status);
          if (live.phone) setPhone(live.phone);
        }
      } catch { /* Railway may be waking up */ }

      setLoadingSession(false);
    }

    loadStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token]);

  // Socket.IO — connect once and listen for events
  useEffect(() => {
    if (!user || !token) return;

    let io;
    async function connectSocket() {
      const [{ io: socketIO }] = await Promise.all([import("socket.io-client")]);
      const url = getSocketURL();

      io = socketIO(url, {
        auth: { userId: user.id, token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      io.on("connect", () => {
        console.log("[Socket] Connected:", io.id);
      });

      io.on("connect_error", (err) => {
        console.warn("[Socket] Connection error:", err.message);
      });

      // QR code received from backend
      io.on("wa:qr", ({ qr: qrData, provider: prov }) => {
        setQR(qrData);
        setStatus("qr_pending");
        if (prov) setProvider(prov);
      });

      // WhatsApp connected
      io.on("wa:ready", ({ phone: p, provider: prov }) => {
        setStatus("connected");
        setNeedsRescan(false);
        setQR(null);
        if (p) setPhone(p);
        if (prov) setProvider(prov);
      });

      // Disconnected
      io.on("wa:disconnected", ({ reason }) => {
        setStatus("disconnected");
        setQR(null);
        setPhone("");
      });

      // Error from backend
      io.on("wa:error", ({ message }) => {
        setErrorMsg(message || "WhatsApp connection error");
        setStatus("error");
      });

      socketRef.current = io;
    }

    connectSocket().catch(console.error);

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user, token]);

  async function handleConnect() {
    if (!token) { setErrorMsg("Not authenticated. Please refresh."); return; }
    setStatus("loading");
    setErrorMsg("");
    setQR(null);
    try {
      await requestQRCode(token);
      // QR will arrive via socket wa:qr event
    } catch (err) {
      setErrorMsg(err.message || "Failed to reach WhatsApp service. Is Railway running?");
      setStatus("error");
    }
  }

  async function handleDisconnect() {
    if (!token) return;
    setStatus("loading");
    try {
      await disconnectSession(token);
      setStatus("disconnected");
      setQR(null);
      setPhone("");
    } catch (err) {
      setErrorMsg(err.message || "Disconnect failed.");
      setStatus("error");
    }
  }

  const isConnected = status === "connected";
  const isLoading   = status === "loading";
  const isPending   = status === "qr_pending";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
          Connect WhatsApp
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)" }}>
          Link your WhatsApp number to start sending campaigns.
        </p>
      </div>

      {/* ── One-time rescan banner ── */}
      {needsRescan && !loadingSession && (
        <div style={{
          marginBottom: "1.25rem",
          padding: "1rem 1.25rem",
          borderRadius: "0.875rem",
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.3)",
          display: "flex", alignItems: "flex-start", gap: "0.875rem",
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "#f59e0b", margin: "0 0 0.25rem" }}>
              One-time QR scan required
            </p>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
              Your credentials aren't saved yet. Scan the QR code below <strong style={{ color: "rgba(255,255,255,0.75)" }}>one more time</strong> — after this, your session will be stored securely in Supabase and you'll <strong style={{ color: "rgba(255,255,255,0.75)" }}>never need to scan again</strong> after a Railway restart.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="connect-grid">

        {/* ── Left: QR / Status card ── */}
        <div style={{
          borderRadius: "1rem",
          background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))",
          border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden",
        }}>
          <div style={{
            height: 3,
            background: `linear-gradient(90deg,transparent,${
              isConnected ? "#25D366" : isPending ? "#f59e0b" : "rgba(255,255,255,0.1)"
            },transparent)`,
          }} />

          <div style={{ padding: "2rem", textAlign: "center" }}>
            {/* Loading spinner */}
            {(loadingSession || isLoading) && (
              <div style={{ padding: "3rem 0" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "2px solid rgba(37,211,102,0.2)", borderTopColor: "#25D366",
                  animation: "spin 0.8s linear infinite", margin: "0 auto 1rem",
                }} />
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                  {isLoading ? "Requesting QR code…" : "Loading…"}
                </p>
              </div>
            )}

            {/* Connected state */}
            {!loadingSession && !isLoading && isConnected && (
              <>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg,#25D36625,#25D36610)",
                  border: "2px solid #25D36650",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: "0 0 40px rgba(37,211,102,0.2)",
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#25D366", marginBottom: "0.5rem" }}>Connected!</h3>
                {phone && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>+{phone}</p>}
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem" }}>
                  Your WhatsApp is linked and ready to send campaigns.
                </p>
                <button onClick={handleDisconnect} style={{
                  padding: "10px 22px", borderRadius: 100,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  Disconnect
                </button>
              </>
            )}

            {/* QR code waiting */}
            {!loadingSession && !isLoading && isPending && qr && (
              <>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 100,
                  background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                  color: "#f59e0b", fontSize: 11.5, fontWeight: 600, marginBottom: "1.25rem",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.5s infinite", display: "inline-block" }} />
                  Waiting for scan…
                </div>

                <div style={{
                  width: 200, height: 200, margin: "0 auto 1rem",
                  borderRadius: 12, background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", border: "4px solid rgba(255,255,255,0.1)",
                }}>
                  <img src={qr} alt="WhatsApp QR Code" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>
                  QR refreshes every 60 seconds
                </p>
                <button onClick={handleConnect} style={{
                  padding: "8px 20px", borderRadius: 100,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer",
                }}>
                  Refresh QR
                </button>
              </>
            )}

            {/* QR pending but no QR yet (waiting for socket) */}
            {!loadingSession && !isLoading && isPending && !qr && (
              <div style={{ padding: "3rem 0" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "2px solid rgba(245,158,11,0.3)", borderTopColor: "#f59e0b",
                  animation: "spin 0.8s linear infinite", margin: "0 auto 1rem",
                }} />
                <p style={{ color: "#f59e0b", fontSize: 13 }}>Generating QR…</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 6 }}>This takes 5–10 seconds</p>
              </div>
            )}

            {/* Idle / error / disconnected */}
            {!loadingSession && !isLoading && !isConnected && !isPending && (
              <>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(37,211,102,0.08)", border: "2px solid rgba(37,211,102,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                  {status === "error" ? "Connection failed" : "Not connected"}
                </h3>

                {errorMsg && (
                  <div style={{
                    margin: "0 0 1.25rem", padding: "10px 14px", borderRadius: 8,
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                    color: "#ef4444", fontSize: 12, lineHeight: 1.5, textAlign: "left",
                  }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleConnect}
                  style={{
                    padding: "12px 28px", borderRadius: 100,
                    background: "linear-gradient(135deg,#25D366,#128C7E)",
                    border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    margin: "0 auto", boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                    transition: "all 0.15s",
                  }}
                >
                  {status === "error" ? "Retry" : "Connect WhatsApp"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Provider + Instructions ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Provider selector */}
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "0.875rem" }}>Provider</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PROVIDERS.map((p) => (
                <button key={p.id} onClick={() => setProvider(p.id)} style={{
                  padding: "10px 14px", borderRadius: 8,
                  background: provider === p.id ? "rgba(37,211,102,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${provider === p.id ? "rgba(37,211,102,0.3)" : "rgba(255,255,255,0.05)"}`,
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: provider === p.id ? "#25D366" : "rgba(255,255,255,0.2)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: provider === p.id ? "#25D366" : "#fff" }}>{p.name}</span>
                      {p.badge && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: "rgba(37,211,102,0.1)", color: "#25D366", border: "1px solid rgba(37,211,102,0.2)", textTransform: "uppercase" }}>{p.badge}</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{p.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* How to scan */}
          <div style={{ borderRadius: "1rem", background: "linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))", border: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "0.875rem" }}>How to connect</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#25D366" }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div style={{ borderRadius: "0.875rem", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                Multi-device connection — your phone doesn&apos;t need to stay online after linking. Session is encrypted on Railway.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @media (max-width: 768px) { .connect-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
