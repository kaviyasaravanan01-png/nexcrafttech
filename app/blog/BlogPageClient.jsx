"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const categories = ["All", "Web Development", "AI & Automation", "SEO & Marketing", "Business Strategy", "App Development", "Design"];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function BlogPageClient({ posts }) {
  const pageRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".blog-hero-line", { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: ".blog-hero-line", start: "top 90%" },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 100,
            background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)",
            marginBottom: "1rem",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: "#c9a96e", letterSpacing: "0.12em", textTransform: "uppercase" }}>Blog & Insights</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800,
            letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "0.6rem",
          }}>
            Insights for{" "}
            <span className="gradient-text-static">Growing Businesses</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: "30rem", margin: "0 auto" }}>
            Web development, AI, SEO, and digital strategies — practical knowledge from real projects.
          </p>

          <div className="blog-hero-line" style={{
            width: "4rem", height: 1,
            background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            margin: "1.5rem auto 0", transformOrigin: "center",
          }} />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "flex", flexWrap: "wrap", gap: 6,
            justifyContent: "center", marginBottom: "2.5rem",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 500,
                background: activeCategory === cat ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeCategory === cat ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: activeCategory === cat ? "#c9a96e" : "rgba(255,255,255,0.4)",
                cursor: "pointer", transition: "all 0.3s", outline: "none",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="blog-grid">
          {filtered.map((post, i) => (
            <motion.div
              key={post.slug}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="blog-card-link"
                style={{
                  display: "block", textDecoration: "none",
                  borderRadius: 14, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(17,17,20,0.7)",
                  transition: "border-color 0.4s, box-shadow 0.4s",
                }}
              >
                {/* Color bar */}
                <div style={{
                  height: 3, background: `linear-gradient(90deg, ${post.color}, ${post.color}70)`,
                  opacity: 0, transition: "opacity 0.4s",
                }} className="blog-accent" />

                <div style={{ padding: "1.25rem 1.5rem" }}>
                  {/* Category + read time */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600,
                      color: post.color, background: `${post.color}12`, border: `1px solid ${post.color}25`,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.25)" }}>
                      {post.readTime} read
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="blog-title" style={{
                    fontSize: 16, fontWeight: 700, color: "#fff",
                    lineHeight: 1.35, marginBottom: "0.5rem", transition: "color 0.3s",
                  }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p style={{
                    fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.35)",
                    marginBottom: "0.75rem",
                  }}>
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "0.7rem", borderTop: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                      {formatDate(post.date)}
                    </span>
                    <span className="read-more" style={{
                      fontSize: 11, fontWeight: 600, color: "rgba(201,169,110,0.5)",
                      display: "flex", alignItems: "center", gap: 4,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      transition: "color 0.3s",
                    }}>
                      Read
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No articles in this category yet.
          </div>
        )}
      </div>

      <style jsx>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr; }
        }
        .blog-card-link:hover {
          border-color: rgba(255,255,255,0.12) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 30px rgba(201,169,110,0.04) !important;
        }
        .blog-card-link:hover .blog-accent { opacity: 1 !important; }
        .blog-card-link:hover .blog-title { color: #e8d5b0 !important; }
        .blog-card-link:hover .read-more { color: #c9a96e !important; }
      `}</style>
    </div>
  );
}
