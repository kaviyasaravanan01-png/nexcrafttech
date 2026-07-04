"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { getAllProducts } from "@/lib/productsData";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ArrowIcon = ({ dir }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === "left" ? <path d="M19 12H5M12 5l-7 7 7 7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
  </svg>
);

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export default function Products() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const products = getAllProducts();
  const [activeIndex, setActiveIndex] = useState(0);

  const active = products[activeIndex];

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".products-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!active) return null;

  const prev = () => setActiveIndex((i) => (i - 1 + products.length) % products.length);
  const next = () => setActiveIndex((i) => (i + 1) % products.length);

  const isWA = active.slug === "whatsappcrm";
  const isInternal = isWA || (active.url || "").startsWith("/");
  const primaryHref = isWA ? "/whatsapp-crm/dashboard" : (active.url || "#");
  const primaryLabel = active.primaryCtaLabel || (isWA ? "Open Dashboard" : active.slug === "camtocode" ? "Visit camtocode.com" : `Visit ${active.name}`);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="px-6" style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <span style={{
            display: "inline-block", color: "#c9a96e", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem",
          }}>
            Our Products
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Built by <span className="gradient-text">NexCraft</span>
          </h2>
          <p className="font-light leading-relaxed" style={{
            color: "rgba(255,255,255,0.4)", fontSize: "1.05rem",
            maxWidth: "32rem", marginLeft: "auto", marginRight: "auto", marginTop: "1rem",
          }}>
            SaaS tools we design, build, and ship — solving real problems for developers and businesses.
          </p>
        </motion.div>

        <div className="products-line" style={{
          width: 60, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)",
          marginLeft: "auto", marginRight: "auto", marginBottom: "2.5rem", transformOrigin: "center",
        }} />

        {/* Carousel card */}
        <div style={{ position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0, 1] }}
              className="products-card"
              style={{
                display: "grid",
                gridTemplateColumns: active.video ? "1fr 1fr" : "1fr",
                gap: "2rem",
                alignItems: "center",
                padding: "2rem",
                borderRadius: "1rem",
                background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top gradient line */}
              <div style={{
                position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                background: `linear-gradient(90deg, transparent, ${active.color}40, transparent)`,
              }} />

              {/* Visual side — video or icon */}
              {active.video ? (
                <div style={{
                  borderRadius: 14, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: `linear-gradient(145deg, ${active.color}10, rgba(17,17,20,0.8))`,
                  aspectRatio: "9/16", maxHeight: 420, margin: "0 auto", width: "100%",
                }}>
                  <video
                    src={active.video}
                    autoPlay muted loop playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ) : (
                <div style={{
                  borderRadius: 14, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: `linear-gradient(145deg, ${active.color}18, rgba(17,17,20,0.8))`,
                  aspectRatio: "9/16", maxHeight: 420, margin: "0 auto", width: "100%",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "1.5rem",
                }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: 24,
                    background: `linear-gradient(135deg, ${active.color}30, ${active.color}10)`,
                    border: `1px solid ${active.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: active.color,
                  }}>
                    {active.slug === "whatsappcrm" ? <WhatsAppIcon /> : active.slug === "pdf-ai" ? (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    ) : (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    )}
                  </div>
                  <div style={{ textAlign: "center", padding: "0 2rem" }}>
                    <p style={{ fontSize: 13, color: active.color, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
                      {active.subtitle}
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                      {active.tagline?.split("—")[0]?.trim()}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", padding: "0 1.5rem" }}>
                    {active.tags?.slice(0, 4).map((tag) => (
                      <span key={tag} style={{
                        padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500,
                        color: active.color, background: `${active.color}12`,
                        border: `1px solid ${active.color}25`,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{
                    padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 600,
                    color: active.color, background: `${active.color}15`, border: `1px solid ${active.color}30`,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    {active.status}
                  </span>
                  <span style={{
                    padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500,
                    color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    {active.year}
                  </span>
                </div>

                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
                  {active.name}
                </h3>
                <p style={{ fontSize: 12, color: active.color, fontWeight: 500, marginBottom: "0.75rem" }}>
                  {active.subtitle}
                </p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem" }}>
                  {active.tagline}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
                  {active.tags?.slice(0, 5).map((tag) => (
                    <span key={tag} style={{
                      padding: "4px 10px", borderRadius: 8, fontSize: 10.5, fontWeight: 500,
                      color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Feature highlights */}
                {active.features && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1.5rem" }}>
                    {active.features.slice(0, 4).map((f) => (
                      <div key={f.name} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{
                          width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                          background: `${active.color}20`, border: `1px solid ${active.color}40`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={active.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{f.name}</span>
                          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>— {f.benefit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <motion.a
                    href={primaryHref}
                    target={isInternal ? "_self" : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                    whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${active.color}40` }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "11px 22px", borderRadius: 100,
                      background: `linear-gradient(135deg, ${active.color}, ${active.color}cc)`,
                      color: "#fff", fontSize: 12, fontWeight: 700,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      textDecoration: "none", boxShadow: `0 4px 20px ${active.color}30`,
                    }}
                  >
                    {primaryLabel}
                    <ExternalIcon />
                  </motion.a>

                  {active.tryUrl && (
                    <motion.a
                      href={active.tryUrl}
                      target={isInternal ? "_self" : "_blank"}
                      rel={isInternal ? undefined : "noopener noreferrer"}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "11px 22px", borderRadius: 100,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        textDecoration: "none",
                      }}
                    >
                      {active.secondaryCtaLabel || "Try free"}
                    </motion.a>
                  )}

                  <Link
                    href={`/products/${active.slug}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "11px 18px", fontSize: 12, fontWeight: 500,
                      color: "#c9a96e", textDecoration: "none",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Learn more
                    <ArrowIcon dir="right" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {products.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous product"
                style={{
                  position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)",
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.6)", cursor: "pointer", zIndex: 10,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <ArrowIcon dir="left" />
              </button>
              <button
                onClick={next}
                aria-label="Next product"
                style={{
                  position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.6)", cursor: "pointer", zIndex: 10,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <ArrowIcon dir="right" />
              </button>
            </>
          )}
        </div>

        {/* Dots + thumbnail strip */}
        {products.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", marginTop: "2rem" }}
          >
            {/* Dots */}
            <div style={{ display: "flex", gap: 8 }}>
              {products.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`View ${p.name}`}
                  style={{
                    width: i === activeIndex ? 24 : 8, height: 8, borderRadius: 100,
                    background: i === activeIndex ? active.color : "rgba(255,255,255,0.15)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Product thumbnails */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              {products.map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 14px", borderRadius: 100,
                    background: i === activeIndex ? `${p.color}15` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === activeIndex ? `${p.color}40` : "rgba(255,255,255,0.06)"}`,
                    color: i === activeIndex ? p.color : "rgba(255,255,255,0.4)",
                    fontSize: 11.5, fontWeight: i === activeIndex ? 600 : 400,
                    cursor: "pointer", transition: "all 0.2s",
                    letterSpacing: "0.04em",
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: p.color, flexShrink: 0,
                  }} />
                  {p.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .products-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
