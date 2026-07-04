"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WACRMAuthProvider, useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getWASession } from "@/lib/whatsapp-crm/supabase";
import Sidebar from "@/components/whatsapp-crm/Sidebar";

// Auth pages that don't need the dashboard shell
const PUBLIC_PATHS = ["/whatsapp-crm/login", "/whatsapp-crm/register"];

function DashboardShell({ children }) {
  const { user, loading } = useWACRMAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [waStatus, setWAStatus] = useState("disconnected");
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/whatsapp-crm/login");
    }
    if (!loading && user && isPublic) {
      router.replace("/whatsapp-crm/dashboard");
    }
  }, [user, loading, isPublic, router]);

  // Load WA session status from Railway (source of truth)
  useEffect(() => {
    if (!user) return;

    async function fetchStatus() {
      // Get token first
      const { getSupabase } = await import("@/lib/whatsapp-crm/supabase");
      const { data } = await getSupabase()?.auth.getSession() ?? {};
      const token = data?.session?.access_token;
      if (!token) return;

      try {
        const { getSessionStatus } = await import("@/lib/whatsapp-crm/api");
        const live = await getSessionStatus(token);
        if (live?.status) setWAStatus(live.status);
      } catch {
        // fallback to DB
        getWASession(user.id)
          .then((s) => { if (s?.status) setWAStatus(s.status); })
          .catch(() => {});
      }
    }

    fetchStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Loading spinner
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "2px solid rgba(37,211,102,0.2)",
            borderTopColor: "#25D366",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem",
          }} />
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Auth pages (login / register) — no sidebar
  if (isPublic) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0e" }}>
        {children}
      </div>
    );
  }

  // Dashboard shell with sidebar
  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0e" }}>
      <Sidebar user={user} waStatus={waStatus} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 56,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          background: "rgba(10,10,14,0.8)",
          backdropFilter: "blur(10px)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              nexcrafttech.com
            </a>
            <span style={{ color: "rgba(255,255,255,0.1)", fontSize: 11 }}>/</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>WhatsApp CRM</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600,
              color: "#25D366", background: "rgba(37,211,102,0.1)",
              border: "1px solid rgba(37,211,102,0.25)", letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Beta
            </span>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg,#25D36630,#25D36610)",
              border: "1px solid rgba(37,211,102,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#25D366", fontSize: 12, fontWeight: 700,
            }}>
              {(user.user_metadata?.full_name || user.email || "?")[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "1.5rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function WACRMLayout({ children }) {
  return (
    <WACRMAuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </WACRMAuthProvider>
  );
}
