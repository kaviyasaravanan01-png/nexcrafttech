import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NexCraft Technologies — Web Development, AI Chatbots & SEO Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative accent circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #c9a96e, #e8d5b0, #c9a96e, transparent)",
          }}
        />

        {/* Diamond logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 21 21" fill="none">
            <path d="M2 10.5L7.5 2L13 10.5L7.5 19L2 10.5Z" fill="#e8d5b0" />
            <path d="M9 10.5L14.5 2L20 10.5L14.5 19L9 10.5Z" fill="#c9a96e" />
          </svg>
        </div>

        {/* Company name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          <span style={{ color: "#ffffff" }}>NexCraft</span>
          <span style={{ color: "#c9a96e", marginLeft: 16 }}>Technologies</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            marginTop: 16,
            letterSpacing: "0.02em",
          }}
        >
          Web Development &bull; AI Chatbots &bull; SEO &amp; Digital Marketing
        </div>

        {/* Pricing badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 40,
            padding: "12px 32px",
            borderRadius: 100,
            border: "1px solid rgba(201,169,110,0.3)",
            background: "rgba(201,169,110,0.08)",
          }}
        >
          <span style={{ color: "#c9a96e", fontSize: 20, fontWeight: 600 }}>
            Starting from ₹6,999 ($85) &bull; Free Consultation
          </span>
        </div>

        {/* Website URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 18,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.05em",
          }}
        >
          nexcrafttech.com
        </div>
      </div>
    ),
    { ...size }
  );
}
