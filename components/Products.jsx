"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { getAllProducts } from "@/lib/productsData";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const products = getAllProducts();
  const featured = products[0];

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

  if (!featured) return null;

  return (
    <section id="products" ref={sectionRef} className="relative overflow-hidden" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="px-6" style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <span style={{ display: "inline-block", color: "#c9a96e", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Our Products
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Built by <span className="gradient-text">NexCraft</span>
          </h2>
          <p className="font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.05rem", maxWidth: "32rem", marginLeft: "auto", marginRight: "auto", marginTop: "1rem" }}>
            SaaS tools we design, build, and ship — solving real problems for developers and businesses.
          </p>
        </motion.div>

        <div className="products-line" style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)", marginLeft: "auto", marginRight: "auto", marginBottom: "2.5rem", transformOrigin: "center" }} />

        {/* Featured product card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            alignItems: "center",
            padding: "2rem",
            borderRadius: "1rem",
            background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
          className="products-card"
        >
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
            background: `linear-gradient(90deg, transparent, ${featured.color}40, transparent)`,
          }} />

          {/* Video */}
          <div style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: `linear-gradient(145deg, ${featured.color}10, rgba(17,17,20,0.8))`,
            aspectRatio: "9/16",
            maxHeight: 420,
            margin: "0 auto",
            width: "100%",
          }}>
            <video
              src={featured.video}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Content */}
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <span style={{
                padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 600,
                color: featured.color, background: `${featured.color}15`, border: `1px solid ${featured.color}30`,
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                {featured.status}
              </span>
              <span style={{
                padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500,
                color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {featured.year}
              </span>
            </div>

            <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
              {featured.name}
            </h3>
            <p style={{ fontSize: 12, color: featured.color, fontWeight: 500, marginBottom: "0.75rem" }}>
              {featured.subtitle}
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem" }}>
              {featured.tagline}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
              {featured.tags.slice(0, 5).map((tag) => (
                <span key={tag} style={{
                  padding: "4px 10px", borderRadius: 8, fontSize: 10.5, fontWeight: 500,
                  color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <motion.a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${featured.color}40` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", borderRadius: 100,
                  background: `linear-gradient(135deg, ${featured.color}, ${featured.color}cc)`,
                  color: "#fff", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  textDecoration: "none", boxShadow: `0 4px 20px ${featured.color}30`,
                }}
              >
                Visit camtocode.com
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </motion.a>

              <motion.a
                href={featured.tryUrl}
                target="_blank"
                rel="noopener noreferrer"
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
                Try free
              </motion.a>

              <Link
                href={`/products/${featured.slug}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "11px 18px", fontSize: 12, fontWeight: 500,
                  color: "#c9a96e", textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                Learn more
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>

        {products.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            style={{ textAlign: "center", marginTop: "2rem" }}
          >
            <Link
              href="/products"
              style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              View all products →
            </Link>
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
