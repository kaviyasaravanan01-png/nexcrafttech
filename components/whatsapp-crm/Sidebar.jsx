"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/whatsapp-crm/supabase";

const NAV = [
  {
    href: "/whatsapp-crm/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/whatsapp-crm/connect",
    label: "Connect",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.58 12 19.79 19.79 0 0 1 1.53 3.47 2 2 0 0 1 3.5 1.29h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.07-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    href: "/whatsapp-crm/contacts",
    label: "Contacts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/whatsapp-crm/campaigns",
    label: "Bulk Messenger",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
  {
    href: "/whatsapp-crm/history",
    label: "History",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/whatsapp-crm/settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83" />
      </svg>
    ),
  },
  {
    href: "/whatsapp-crm/docs",
    label: "Docs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: "/whatsapp-crm/support",
    label: "Help & Support",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function Sidebar({ user, waStatus = "disconnected", onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const statusColor = waStatus === "connected" ? "#25D366" : waStatus === "qr_pending" ? "#f59e0b" : "#ef4444";
  const statusLabel = waStatus === "connected" ? "Connected" : waStatus === "qr_pending" ? "Scanning…" : "Disconnected";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/whatsapp-crm/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside style={{
      width: collapsed ? 68 : 240,
      minHeight: "100vh",
      background: "rgba(10,10,14,0.97)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.2s ease",
      flexShrink: 0,
      position: "relative",
      zIndex: 10,
    }}>
      {/* Logo / brand */}
      <div style={{
        padding: collapsed ? "1.25rem 0" : "1.25rem 1.25rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        overflow: "hidden",
      }}>
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4, marginLeft: "auto", flexShrink: 0, order: 99 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {collapsed ? (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#25D36620,#25D36610)", border: "1px solid #25D36640", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </div>
        ) : (
          <>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#25D36620,#25D36610)", border: "1px solid #25D36640", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>WhatsApp CRM</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>by NexCraft</div>
            </div>
          </>
        )}
      </div>

      {/* WA connection status badge */}
      {!collapsed && (
        <div style={{
          margin: "0.75rem 1rem",
          padding: "8px 12px",
          borderRadius: 8,
          background: `${statusColor}10`,
          border: `1px solid ${statusColor}30`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor, flexShrink: 0, boxShadow: `0 0 6px ${statusColor}` }} />
          <span style={{ fontSize: 11.5, color: statusColor, fontWeight: 500 }}>{statusLabel}</span>
          {waStatus !== "connected" && (
            <Link href="/whatsapp-crm/connect" style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", marginLeft: "auto", textDecoration: "none" }}>
              Connect →
            </Link>
          )}
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0.5rem 0.75rem", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/whatsapp-crm/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px" : "10px 12px",
                borderRadius: 8,
                background: active ? "rgba(37,211,102,0.1)" : "transparent",
                border: `1px solid ${active ? "rgba(37,211,102,0.2)" : "transparent"}`,
                color: active ? "#25D366" : "rgba(255,255,255,0.5)",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
                transition: "all 0.15s",
                justifyContent: collapsed ? "center" : "flex-start",
                overflow: "hidden",
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — user + logout */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "0.75rem" }}>
        {!collapsed && user && (
          <div style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)",
            marginBottom: 6,
            overflow: "hidden",
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Logout" : undefined}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "10px" : "10px 12px",
            borderRadius: 8,
            background: "transparent",
            border: "1px solid transparent",
            color: "rgba(255,100,100,0.7)",
            fontSize: 13,
            fontWeight: 400,
            cursor: "pointer",
            transition: "all 0.15s",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,100,100,0.08)"; e.currentTarget.style.borderColor = "rgba(255,100,100,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && (loggingOut ? "Logging out…" : "Logout")}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-end",
            gap: 8,
            padding: "8px 12px",
            marginTop: 4,
            borderRadius: 8,
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.2)",
            fontSize: 11,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? <path d="M5 12h14M12 5l7 7-7 7" /> : <path d="M19 12H5M12 5l-7 7 7 7" />}
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
