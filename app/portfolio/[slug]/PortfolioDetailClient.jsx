"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { getAllPortfolioSlugs, getPortfolioBySlug } from "@/lib/portfolioData";
import Lightbox from "@/components/Lightbox";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function PortfolioDetailClient({ project, slug }) {
  const pageRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Gallery images for the lightbox
  const galleryImages = [
    { label: `${project.title} — Homepage`, color: `${project.color}20`, caption: "Homepage design" },
    { label: `${project.title} — Dashboard`, color: `${project.color}15`, caption: "Dashboard view" },
    { label: `${project.title} — Mobile`, color: `${project.color}18`, caption: "Mobile responsive" },
    { label: `${project.title} — Features`, color: `${project.color}12`, caption: "Key features" },
  ];

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".detail-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: ".detail-line", start: "top 90%" } }
      );
      gsap.utils.toArray(".result-card").forEach((el, i) => {
        gsap.fromTo(el, { scale: 0.85, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.6, delay: i * 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray(".feature-check").forEach((el, i) => {
        gsap.fromTo(el, { scale: 0 }, {
          scale: 1, duration: 0.4, delay: i * 0.06,
          ease: "back.out(2)",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Get adjacent projects for navigation
  const slugs = getAllPortfolioSlugs();
  const currentIdx = slugs.indexOf(slug);
  const prevSlug = currentIdx > 0 ? slugs[currentIdx - 1] : null;
  const nextSlug = currentIdx < slugs.length - 1 ? slugs[currentIdx + 1] : null;
  const prevProject = prevSlug ? getPortfolioBySlug(prevSlug) : null;
  const nextProject = nextSlug ? getPortfolioBySlug(nextSlug) : null;

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "4rem" }}>
      {/* Back link */}
      <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/#portfolio"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              marginBottom: "2rem",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ marginBottom: "3rem" }}
        >
          {/* Category & Year badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{
              padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 600,
              color: project.color, background: `${project.color}15`, border: `1px solid ${project.color}30`,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {project.category}
            </span>
            <span style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500,
              color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              {project.year}
            </span>
            <span style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500,
              color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              {project.duration}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "0.75rem",
          }}>
            {project.title}
          </h1>

          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: "36rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            {project.tagline}
          </p>

          {/* Tech tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 500,
                color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Live link */}
          <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${project.color}40` }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 24px",
              borderRadius: 100,
              background: `linear-gradient(135deg, ${project.color}, ${project.color}cc)`,
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 4px 20px ${project.color}30`,
            }}
          >
            View Live Site
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Project Screenshot */}
        {project.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              marginBottom: "3rem",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: `linear-gradient(145deg, ${project.color}10, rgba(17,17,20,0.8))`,
            }}
          >
            <img
              src={project.image}
              alt={`${project.title} — ${project.tagline}`}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </motion.div>
        )}

        {/* Divider */}
        <div
          className="detail-line"
          style={{
            width: "100%", height: 1, transformOrigin: "left",
            background: "linear-gradient(90deg, rgba(201,169,110,0.4), transparent)",
            marginBottom: "3rem",
          }}
        />

        {/* Challenge & Solution */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <div style={{
              padding: "1.5rem",
              borderRadius: 14,
              background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
              border: "1px solid rgba(255,255,255,0.06)",
              height: "100%",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ef4444" }}>
                  The Challenge
                </h3>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>
                {project.challenge}
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <div style={{
              padding: "1.5rem",
              borderRadius: 14,
              background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
              border: "1px solid rgba(255,255,255,0.06)",
              height: "100%",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#22c55e" }}>
                  Our Solution
                </h3>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>
                {project.solution}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginBottom: "3rem" }}
        >
          <h3 style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem",
          }}>
            Key Results
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {project.results.map((r, i) => (
              <div
                key={i}
                className="result-card"
                style={{
                  padding: "1.25rem",
                  borderRadius: 12,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textAlign: "center",
                }}
              >
                <div style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: `linear-gradient(135deg, ${project.color}, ${project.color}aa)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "0.25rem",
                }}>
                  {r.value}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "0.2rem" }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)" }}>
                  {r.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginBottom: "3rem" }}
        >
          <h3 style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem",
          }}>
            Key Features
          </h3>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem",
            padding: "1.5rem",
            borderRadius: 14,
            background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {project.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0" }}>
                <div
                  className="feature-check"
                  style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: `${project.color}15`, border: `1px solid ${project.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={project.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gallery with Lightbox */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginBottom: "3rem" }}
        >
          <h3 style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#c9a96e", marginBottom: "1rem",
          }}>
            Project Gallery
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLightboxIndex(i)}
                style={{
                  aspectRatio: "4/3",
                  borderRadius: 12,
                  background: `linear-gradient(145deg, ${img.color || "rgba(201,169,110,0.06)"}, rgba(17,17,20,0.6))`,
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "zoom-in",
                  overflow: "hidden",
                  position: "relative",
                  transition: "border-color 0.3s",
                }}
              >
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(201,169,110,0.03), transparent)",
                }} />
                <div style={{ textAlign: "center", zIndex: 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{img.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {lightboxIndex !== null && (
          <Lightbox
            images={galleryImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() => setLightboxIndex((prev) => Math.min(prev + 1, galleryImages.length - 1))}
            onPrev={() => setLightboxIndex((prev) => Math.max(prev - 1, 0))}
          />
        )}

        {/* Navigation */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          {prevProject ? (
            <Link
              href={`/portfolio/${prevSlug}`}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                textDecoration: "none", color: "rgba(255,255,255,0.5)",
                fontSize: 12.5, fontWeight: 500, transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {prevProject.title}
            </Link>
          ) : <div />}
          {nextProject ? (
            <Link
              href={`/portfolio/${nextSlug}`}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                textDecoration: "none", color: "rgba(255,255,255,0.5)",
                fontSize: 12.5, fontWeight: 500, transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              {nextProject.title}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: \"1fr 1fr\""],
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <style jsx global>{`
        @media (max-width: 768px) {
          .detail-grid-2 { grid-template-columns: 1fr !important; }
          .detail-grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .detail-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
