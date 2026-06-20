"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function ProductsPageClient({ products }) {
  const pageRef = useRef(null);
  const isInView = useInView(pageRef, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".products-hero-line", { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: ".products-hero-line", start: "top 90%" },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 100,
            background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)",
            marginBottom: "1rem",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: "#c9a96e", letterSpacing: "0.12em", textTransform: "uppercase" }}>Our Products</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "0.6rem" }}>
            SaaS Tools Built by{" "}
            <span className="gradient-text-static">NexCraft</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: "30rem", margin: "0 auto" }}>
            Products we design, build, and ship — solving real problems for developers and businesses.
          </p>

          <div className="products-hero-line" style={{
            width: "4rem", height: 1,
            background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            margin: "1.5rem auto 0", transformOrigin: "center",
          }} />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              style={{
                borderRadius: 14, overflow: "hidden",
                background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{
                aspectRatio: "16/9", overflow: "hidden",
                background: `linear-gradient(145deg, ${product.color}15, rgba(17,17,20,0.8))`,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>
                <video
                  src={product.video}
                  muted
                  loop
                  playsInline
                  autoPlay
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.5rem" }}>
                  <span style={{
                    padding: "3px 8px", borderRadius: 100, fontSize: 9, fontWeight: 600,
                    color: product.color, background: `${product.color}15`, border: `1px solid ${product.color}30`,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    {product.status}
                  </span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{product.year}</span>
                </div>

                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
                  {product.name}
                </h2>
                <p style={{ fontSize: 11.5, color: product.color, marginBottom: "0.5rem" }}>{product.subtitle}</p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.55, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {product.shortDescription}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link
                    href={`/products/${product.slug}`}
                    style={{
                      padding: "8px 16px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                      background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)`,
                      color: "#fff", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase",
                    }}
                  >
                    Learn more
                  </Link>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 16px", borderRadius: 100, fontSize: 11, fontWeight: 500,
                      color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none",
                      letterSpacing: "0.04em", textTransform: "uppercase",
                    }}
                  >
                    Visit site
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
