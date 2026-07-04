"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { getAllProductSlugs, getProductBySlug } from "@/lib/productsData";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function ProductDetailClient({ product, slug }) {
  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".detail-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: ".detail-line", start: "top 90%" } }
      );
      gsap.utils.toArray(".feature-row").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, x: -20 }, {
          opacity: 1, x: 0, duration: 0.5, delay: i * 0.05,
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const slugs = getAllProductSlugs();
  const currentIdx = slugs.indexOf(slug);
  const prevSlug = currentIdx > 0 ? slugs[currentIdx - 1] : null;
  const nextSlug = currentIdx < slugs.length - 1 ? slugs[currentIdx + 1] : null;
  const prevProduct = prevSlug ? getProductBySlug(prevSlug) : null;
  const nextProduct = nextSlug ? getProductBySlug(nextSlug) : null;

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/products"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "rgba(255,255,255,0.4)",
              textDecoration: "none", marginBottom: "2rem", transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ marginBottom: "3rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{
              padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 600,
              color: product.color, background: `${product.color}15`, border: `1px solid ${product.color}30`,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {product.category}
            </span>
            <span style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500,
              color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              {product.status}
            </span>
            <span style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500,
              color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              {product.year}
            </span>
            <span style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500,
              color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              {product.role}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.5rem" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: 14, color: product.color, fontWeight: 500, marginBottom: "0.75rem" }}>
            {product.subtitle}
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: "40rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            {product.tagline}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
            {product.tags.map((tag) => (
              <span key={tag} style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 500,
                color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <motion.a
              href={product.url}
              target={product.url?.startsWith("/") ? "_self" : "_blank"}
              rel={product.url?.startsWith("/") ? undefined : "noopener noreferrer"}
              whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${product.color}40` }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 24px", borderRadius: 100,
                background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)`,
                color: "#fff", fontSize: 12.5, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                textDecoration: "none", boxShadow: `0 4px 20px ${product.color}30`,
              }}
            >
              {product.primaryCtaLabel || (product.slug === "whatsappcrm" ? "Open Dashboard" : product.slug === "camtocode" ? "Visit camtocode.com" : "Visit Live Site")}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </motion.a>
            {product.tryUrl && (
            <motion.a
              href={product.tryUrl}
              target={product.tryUrl?.startsWith("/") ? "_self" : "_blank"}
              rel={product.tryUrl?.startsWith("/") ? undefined : "noopener noreferrer"}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 24px", borderRadius: 100,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.85)", fontSize: 12.5, fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {product.secondaryCtaLabel || "Try free"}
            </motion.a>
            )}
          </div>
        </motion.div>

        {/* Demo video */}
        {product.video && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              marginBottom: "3rem", borderRadius: 16, overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: `linear-gradient(145deg, ${product.color}10, rgba(17,17,20,0.8))`,
              maxWidth: 360, marginLeft: "auto", marginRight: "auto",
            }}
          >
            <video
              id="demo-video"
              src={product.video}
              controls
              playsInline
              preload="metadata"
              poster={product.videoMeta?.thumbnailUrl}
              title={product.videoMeta?.title ?? `${product.name} demo`}
              aria-label={product.videoMeta?.description ?? `${product.name} product demo video`}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>
        )}

        <div className="detail-line" style={{
          width: "100%", height: 1, transformOrigin: "left",
          background: "linear-gradient(90deg, rgba(201,169,110,0.4), transparent)",
          marginBottom: "3rem",
        }} />

        {/* Description */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
            About
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.55)" }}>
            {product.description}
          </p>
        </motion.div>

        {/* Tool breakdown */}
        {product.toolBreakdown && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
              Tool Breakdown
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {product.toolBreakdown.map((group) => (
                <div key={group.category} style={{
                  padding: "1.25rem", borderRadius: 12,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: product.color, marginBottom: 4 }}>
                    {group.category} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>({group.count})</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{group.summary}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Architecture */}
        {product.architecture && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
              Architecture
            </h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", padding: "1.25rem", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {product.architecture}
            </p>
          </motion.div>
        )}

        {/* Features */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
            Key Features
          </h3>
          <div style={{
            borderRadius: 14, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
          }}>
            {product.features.map((f, i) => (
              <div
                key={i}
                className="feature-row"
                style={{
                  display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderBottom: i < product.features.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{f.name}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{f.benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Who it helps & How it works */}
        <div className="product-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
              Who It Helps
            </h3>
            <div style={{
              padding: "1.5rem", borderRadius: 14,
              background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {product.audience.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, marginBottom: "0.75rem", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>
                    <span style={{ color: product.color, flexShrink: 0 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
              How It Works
            </h3>
            <div style={{
              padding: "1.5rem", borderRadius: 14,
              background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, counterReset: "step" }}>
                {product.howItWorks.map((step, i) => (
                  <li key={i} style={{
                    display: "flex", gap: 12, marginBottom: "0.875rem", fontSize: 13,
                    color: "rgba(255,255,255,0.5)", lineHeight: 1.55,
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: `${product.color}15`, border: `1px solid ${product.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: product.color,
                    }}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>

        {/* Pricing */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
            Pricing (USD)
          </h3>
          <div className="product-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {product.pricing.map((tier, i) => (
              <div key={i} style={{
                padding: "1.25rem", borderRadius: 12, textAlign: "center",
                background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: "0.35rem" }}>
                  {tier.plan}
                </div>
                <div style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 800,
                  background: `linear-gradient(135deg, ${product.color}, ${product.color}aa)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  marginBottom: "0.5rem",
                }}>
                  {tier.price}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                  {tier.highlights}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
            Tech Stack
          </h3>
          <div className="product-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {product.techStack.map((item, i) => (
              <div key={i} style={{
                padding: "1rem 1.25rem", borderRadius: 10,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: product.color, marginBottom: "0.25rem" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Differentiators */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
            {product.differentiatorsTitle || `Why ${product.name}`}
          </h3>
          <div className="product-diff-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {product.differentiators.map((d, i) => (
              <div key={i} style={{
                padding: "1.25rem", borderRadius: 12,
                background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "0.75rem" }}>
                  vs {d.vs}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {d.points.map((p, j) => (
                    <li key={j} style={{ display: "flex", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: "0.4rem" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={product.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Completion status */}
        {product.completionNotes && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
              Project Status
            </h3>
            <div className="product-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ padding: "1.25rem", borderRadius: 12, background: "rgba(37,211,102,0.04)", border: "1px solid rgba(37,211,102,0.15)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#25D366", marginBottom: "0.75rem" }}>✅ Shipped</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {product.completionNotes.shipped.map((item) => (
                    <li key={item} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginBottom: 6, lineHeight: 1.5 }}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: "1.25rem", borderRadius: 12, background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: "0.75rem" }}>⚙️ Phase 2</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {product.completionNotes.phase2.map((item) => (
                    <li key={item} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginBottom: 6, lineHeight: 1.5 }}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Links */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem" }}>
            Links
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {product.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                  color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${product.color}40`; e.currentTarget.style.color = product.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        {slugs.length > 1 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            {prevProduct ? (
              <Link href={`/products/${prevSlug}`} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: 12.5, fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                {prevProduct.name}
              </Link>
            ) : <div />}
            {nextProduct ? (
              <Link href={`/products/${nextSlug}`} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: 12.5, fontWeight: 500 }}>
                {nextProduct.name}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            ) : <div />}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .product-grid-2 { grid-template-columns: 1fr !important; }
          .product-pricing-grid { grid-template-columns: 1fr 1fr !important; }
          .product-diff-grid { grid-template-columns: 1fr !important; }
          .feature-row { grid-template-columns: 1fr !important; gap: 0.35rem !important; }
        }
        @media (max-width: 480px) {
          .product-pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
