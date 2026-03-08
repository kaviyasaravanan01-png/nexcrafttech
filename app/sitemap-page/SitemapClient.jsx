"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sitemapData = [
  {
    title: "Main Pages",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    links: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Sections",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Services", href: "/#services" },
      { label: "3D Service Showcase", href: "/#service-showcase" },
      { label: "Our Process", href: "/#process" },
      { label: "Portfolio", href: "/#portfolio" },
      { label: "Testimonials", href: "/#testimonials" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Portfolio Projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
    links: [
      { label: "SpaceCrafts", href: "/portfolio/spacecrafts" },
      { label: "Living Fire Australia", href: "/portfolio/living-fire-australia" },
      { label: "Blendora Collections", href: "/portfolio/blendora-collections" },
      { label: "Spark Metal Fabrications", href: "/portfolio/spark-metal-fabrications" },
      { label: "DeliverEase", href: "/portfolio/deliverease" },
      { label: "PixelForge Studio", href: "/portfolio/pixelforge-studio" },
    ],
  },
  {
    title: "Blog Posts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    links: [
      { label: "Why Next.js Is Best in 2026", href: "/blog/why-nextjs-best-framework-2026" },
      { label: "AI Chatbots for Small Business", href: "/blog/ai-chatbots-small-business-guide" },
      { label: "SEO Strategies That Work", href: "/blog/seo-strategies-that-actually-work-2026" },
      { label: "Website vs Social Media", href: "/blog/website-vs-social-media-presence" },
      { label: "React Native vs Flutter", href: "/blog/react-native-vs-flutter-2026" },
      { label: "Design Trends 2026", href: "/blog/web-design-trends-2026" },
    ],
  },
];

export default function SitemapClient() {
  return (
    <section style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "5rem", background: "#09090b" }}>
      <div style={{ maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h1 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#fff", marginBottom: "0.5rem",
          }}>
            Site{" "}
            <span style={{ background: "linear-gradient(135deg, #c9a96e, #e8d5b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Map
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            A complete overview of everything on our website.
          </p>
          <div style={{ width: 48, height: 2, background: "linear-gradient(90deg, #c9a96e, #d4b883)", borderRadius: 1, margin: "1rem auto 0" }} />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
          {sitemapData.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              style={{
                padding: "1.5rem",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(17,17,20,0.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", color: "#c9a96e" }}>
                {group.icon}
                <h2 style={{ fontSize: 15, fontWeight: 600, color: "#e8d5b0" }}>
                  {group.title}
                </h2>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 0",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                    >
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(201,169,110,0.3)", flexShrink: 0 }} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
