"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WACRMAuthProvider, useWACRMAuth } from "@/lib/whatsapp-crm/useAuth";
import { getWASession } from "@/lib/whatsapp-crm/supabase";
import Sidebar from "@/components/whatsapp-crm/Sidebar";

const PUBLIC_PATHS = ["/whatsapp-crm/login", "/whatsapp-crm/register"];

function DashboardShell({ children }) {
  const { user, loading } = useWACRMAuth();
  const router    = useRouter();
  const pathname  = usePathname();
  const [waStatus, setWAStatus]       = useState("disconnected");
  const [mobileSidebarOpen, setMobile] = useState(false);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Close mobile sidebar on route change
  useEffect(() => { setMobile(false); }, [pathname]);

  useEffect(() => {
    if (!loading && !user && !isPublic) router.replace("/whatsapp-crm/login");
    if (!loading && user && isPublic)  router.replace("/whatsapp-crm/dashboard");
  }, [user, loading, isPublic, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchStatus() {
      const { getSupabase } = await import("@/lib/whatsapp-crm/supabase");
      const { data } = await getSupabase()?.auth.getSession() ?? {};
      const token = data?.session?.access_token;
      if (!token) return;
      try {
        const { getSessionStatus } = await import("@/lib/whatsapp-crm/api");
        const live = await getSessionStatus(token);
        if (live?.status) setWAStatus(live.status);
      } catch {
        getWASession(user.id).then((s) => { if (s?.status) setWAStatus(s.status); }).catch(() => {});
      }
    }
    fetchStatus();
    const iv = setInterval(fetchStatus, 30000);
    return () => clearInterval(iv);
  }, [user]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(37,211,102,0.2)", borderTopColor: "#25D366", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (isPublic) return <div style={{ minHeight: "100vh", background: "#0a0a0e" }}>{children}</div>;
  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0e" }}>

      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobile(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50,
        transform: mobileSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        display: "block",
      }} className="wa-sidebar-mobile">
        <Sidebar user={user} waStatus={waStatus} onClose={() => setMobile(false)} />
      </div>

      {/* Sidebar — always visible on desktop */}
      <div className="wa-sidebar-desktop">
        <Sidebar user={user} waStatus={waStatus} />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: 56, borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1rem 0 1rem",
          background: "rgba(10,10,14,0.9)", backdropFilter: "blur(10px)", flexShrink: 0,
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Hamburger — mobile only */}
            <button
              className="wa-hamburger"
              onClick={() => setMobile(true)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 6, borderRadius: 8, display: "none" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <a href="/" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span className="wa-header-text">nexcrafttech.com</span>
            </a>
            <span style={{ color: "rgba(255,255,255,0.1)", fontSize: 11 }} className="wa-header-text">/</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }} className="wa-header-text">WhatsApp CRM</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, color: "#25D366", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Beta
            </span>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#25D36630,#25D36610)", border: "1px solid rgba(37,211,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#25D366", fontSize: 12, fontWeight: 700 }}>
              {(user.user_metadata?.full_name || user.email || "?")[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "clamp(1rem, 3vw, 1.75rem)" }}>
          {children}
        </main>
      </div>

      <style>{`
        /* Desktop sidebar */
        .wa-sidebar-desktop { display: flex; flex-shrink: 0; }
        .wa-sidebar-mobile  { display: none !important; }

        @media (max-width: 768px) {
          .wa-sidebar-desktop { display: none !important; }
          .wa-sidebar-mobile  { display: block !important; }
          .wa-hamburger       { display: flex !important; }
          .wa-header-text     { display: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
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
