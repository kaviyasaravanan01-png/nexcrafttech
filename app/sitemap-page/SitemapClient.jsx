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
      { label: "Products", href: "/products" },
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
      { label: "Process", href: "/#process" },
      { label: "Products", href: "/#products" },
      { label: "Portfolio", href: "/#portfolio" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Interactive Showcase", href: "/#showcase" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Our Products",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    links: [
      { label: "All Products", href: "/products" },
      { label: "CamToCode", href: "/products/camtocode" },
      { label: "WhatsApp CRM", href: "/products/whatsappcrm" },
      { label: "PDF AI", href: "/products/pdf-ai" },
    ],
  },
  {
    title: "WhatsApp CRM",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
    links: [
      { label: "Product Page", href: "/products/whatsappcrm" },
      { label: "Login / Get Started", href: "/whatsapp-crm/login" },
      { label: "Register Free", href: "/whatsapp-crm/register" },
      { label: "Documentation", href: "/whatsapp-crm/docs" },
      { label: "Help & Support", href: "/whatsapp-crm/support" },
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
      { label: "Web Development Company Chennai", href: "/blog/web-development-company-chennai" },
      { label: "Introducing WhatsApp CRM", href: "/blog/introducing-nexcraft-whatsapp-crm" },
      { label: "Bulk WhatsApp Without Ban", href: "/blog/how-to-send-bulk-whatsapp-messages-without-ban" },
      { label: "WhatsApp Marketing India Guide", href: "/blog/whatsapp-marketing-small-business-india-guide" },
      { label: "Introducing CamToCode", href: "/blog/introducing-camtocode-ai-code-scanner" },
      { label: "Why Next.js Is Best in 2026", href: "/blog/why-nextjs-best-framework-2026" },
      { label: "AI Chatbots for Small Business", href: "/blog/ai-chatbots-small-business-guide" },
      { label: "SEO Strategies That Work", href: "/blog/seo-strategies-that-actually-work-2026" },
      { label: "Website vs Social Media", href: "/blog/website-vs-social-media-business" },
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
