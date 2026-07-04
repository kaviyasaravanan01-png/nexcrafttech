"use client";

import { useState, useEffect, useRef } from "react";
import { useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getWASession } from "@/lib/whatsapp-crm/supabase";
import { requestQRCode, getSessionStatus, disconnectSession, getSocketURL } from "@/lib/whatsapp-crm/api";

const PROVIDERS = [
  { id: "baileys", name: "Baileys", description: "Primary — lightweight, fast, multi-device", badge: "Recommended" },
  { id: "wweb", name: "WWebJS", description: "Fallback 1 — browser-based, stable" },
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
  const [session, setSession] = useState(null);
  const [qr, setQR] = useState(null);
  const [provider, setProvider] = useState("baileys");
  const [status, setStatus] = useState("idle"); // idle | loading | qr_pending | connected | disconnected | error
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [token, setToken] = useState(null);
  const pollRef = useRef(null);

  // Load user's Supabase session token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { getSupabase } = require("@/lib/whatsapp-crm/supabase");
      getSupabase()?.auth.getSession().then(({ data }) => {
        setToken(data?.session?.access_token ?? null);
      });
    }
  }, []);

  // Load existing WA session from DB
  useEffect(() => {
    if (!user) return;
    getWASession(user.id)
      .then((s) => {
        setSession(s);
        if (s?.status) setStatus(s.status);
      })
      .catch(() => {})
      .finally(() => setLoadingSession(false));
  }, [user]);

  // Poll status while waiting for QR scan
  useEffect(() => {
    if (status !== "qr_pending" || !token) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await getSessionStatus(token);
        if (res?.status === "connected") {
          setStatus("connected");
          setQR(null);
          clearInterval(pollRef.current);
        }
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [status, token]);

  async function handleConnect() {
    if (!token) { setErrorMsg("Not authenticated. Please refresh."); return; }
    setStatus("loading");
    setErrorMsg("");
    setQR(null);
    try {
      const res = await requestQRCode(token);
      if (res?.qr) {
        setQR(res.qr);
        setStatus("qr_pending");
      } else if (res?.status === "connected") {
        setStatus("connected");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to connect to WhatsApp service. Make sure the Railway backend is running.");
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
    } catch (err) {
      setErrorMsg(err.message || "Disconnect failed.");
      setStatus("error");
    }
  }

  const isConnected = status === "connected";
  const isLoading = status === "loading";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
          Connect WhatsApp
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)" }}>
          Link your WhatsApp number to start sending campaigns. Your session is encrypted and stored securely.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="connect-grid">
        {/* Left — QR / status */}
        <div style={{
          borderRadius: "1rem",
          background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}>
          {/* Top accent */}
          <div style={{
            height: 3,
            background: `linear-gradient(90deg, transparent, ${isConnected ? "#25D366" : status === "qr_pending" ? "#f59e0b" : "rgba(255,255,255,0.1)"}, transparent)`,
          }} />

          <div style={{ padding: "2rem", textAlign: "center" }}>
            {loadingSession ? (
              <div style={{ padding: "3rem 0" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "2px solid rgba(37,211,102,0.2)", borderTopColor: "#25D366",
                  animation: "spin 0.8s linear infinite", margin: "0 auto 1rem",
                }} />
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading session…</p>
              </div>
            ) : isConnected ? (
              <>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg,#25D36625,#25D36610)",
                  border: "2px solid #25D36650",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: "0 0 40px rgba(37,211,102,0.2)",
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#25D366", marginBottom: "0.5rem" }}>Connected!</h3>
                {session?.phone && (
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>
                    +{session.phone}
                  </p>
                )}
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem" }}>
                  Your WhatsApp is linked and ready to send messages.
                </p>
                <button
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  style={{
                    padding: "10px 22px", borderRadius: 100,
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  Disconnect
                </button>
              </>
            ) : status === "qr_pending" && qr ? (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 12px", borderRadius: 100,
                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                    color: "#f59e0b", fontSize: 11.5, fontWeight: 600,
                    marginBottom: "1.25rem",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.5s infinite" }} />
                    Waiting for scan…
                  </div>
                </div>

                {/* QR code image from backend */}
                <div style={{
                  width: 200, height: 200, margin: "0 auto 1.25rem",
                  borderRadius: 12,
                  background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                  border: "4px solid rgba(255,255,255,0.1)",
                }}>
                  {qr.startsWith("data:image") ? (
                    <img src={qr} alt="WhatsApp QR Code" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ padding: "0.5rem", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {/* Fallback if QR is a text string */}
                      <div style={{ fontSize: 8, wordBreak: "break-all", color: "#000", textAlign: "center", lineHeight: 1.4 }}>
                        {qr}
                      </div>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                  QR refreshes every 60 seconds
                </p>
              </>
            ) : (
              <>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(37,211,102,0.08)",
                  border: "2px solid rgba(37,211,102,0.15)",
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
                    margin: "0 0 1.25rem",
                    padding: "10px 14px", borderRadius: 8,
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                    color: "#ef4444", fontSize: 12, lineHeight: 1.5, textAlign: "left",
                  }}>
                    {errorMsg}
                    {status === "error" && (
                      <div style={{ marginTop: 6, fontSize: 11, color: "rgba(239,68,68,0.7)" }}>
                        Make sure the Railway backend is running and NEXT_PUBLIC_WA_SERVICE_URL is set.
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  style={{
                    padding: "12px 28px", borderRadius: 100,
                    background: isLoading ? "rgba(37,211,102,0.4)" : "linear-gradient(135deg, #25D366, #128C7E)",
                    border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    margin: "0 auto",
                    boxShadow: isLoading ? "none" : "0 4px 20px rgba(37,211,102,0.3)",
                    transition: "all 0.15s",
                  }}
                >
                  {isLoading && (
                    <span style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                      animation: "spin 0.8s linear infinite", display: "inline-block",
                    }} />
                  )}
                  {isLoading ? "Connecting…" : status === "error" ? "Retry" : "Connect WhatsApp"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right — instructions + provider selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Provider selector */}
          <div style={{
            borderRadius: "1rem",
            background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "1.25rem",
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "0.875rem" }}>
              Provider
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: provider === p.id ? "rgba(37,211,102,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${provider === p.id ? "rgba(37,211,102,0.3)" : "rgba(255,255,255,0.05)"}`,
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: provider === p.id ? "#25D366" : "rgba(255,255,255,0.2)",
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: provider === p.id ? "#25D366" : "#fff" }}>
                        {p.name}
                      </span>
                      {p.badge && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.07em",
                          padding: "2px 6px", borderRadius: 100,
                          background: "rgba(37,211,102,0.1)", color: "#25D366",
                          border: "1px solid rgba(37,211,102,0.2)",
                          textTransform: "uppercase",
                        }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                      {p.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: "0.75rem", lineHeight: 1.5 }}>
              The system automatically falls back to the next provider if one fails.
            </p>
          </div>

          {/* How to scan */}
          <div style={{
            borderRadius: "1rem",
            background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "1.25rem",
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: "0.875rem" }}>
              How to connect
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#25D366",
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important note */}
          <div style={{
            borderRadius: "0.875rem",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.2)",
            padding: "1rem 1.25rem",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
              <div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                  This connects via the WhatsApp multi-device feature (no phone needs to stay online). Your session is encrypted and stored on our Railway server. You can connect one WhatsApp number per account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 768px) {
          .connect-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
