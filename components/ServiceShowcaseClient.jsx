"use client";

import dynamic from "next/dynamic";

const ServiceShowcase = dynamic(() => import("./ServiceShowcase"), {
  ssr: false,
  loading: () => (
    <section style={{
      padding: "6rem 1.5rem",
      textAlign: "center",
      minHeight: 400,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: "rgba(201,169,110,0.06)",
        border: "1px solid rgba(201,169,110,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "pulse 2s ease-in-out infinite",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Loading 3D showcase...</p>
      <style>{`@keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </section>
  ),
});

export default ServiceShowcase;
