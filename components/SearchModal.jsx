"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Static searchable data — services
const servicesData = [
  { title: "Website Development", description: "Custom websites built with Next.js, React & modern tech", type: "service", href: "/#services" },
  { title: "SEO & Marketing", description: "Search engine optimization and digital marketing strategies", type: "service", href: "/#services" },
  { title: "AI Chatbots", description: "Intelligent chatbots that automate customer queries 24/7", type: "service", href: "/#services" },
  { title: "Cloud & AI Solutions", description: "Cloud infrastructure and AI-powered business tools", type: "service", href: "/#services" },
  { title: "App Development", description: "Cross-platform mobile apps with React Native & Flutter", type: "service", href: "/#services" },
  { title: "Maintenance & Support", description: "Ongoing website maintenance, updates, and technical support", type: "service", href: "/#services" },
];

const pageData = [
  { title: "Home", description: "NexCraft Technologies main page", type: "page", href: "/" },
  { title: "Blog", description: "Insights, tutorials, and industry news", type: "page", href: "/blog" },
  { title: "Terms of Service", description: "Our terms and conditions", type: "page", href: "/terms" },
  { title: "Privacy Policy", description: "How we handle your data", type: "page", href: "/privacy" },
  { title: "Sitemap", description: "Full site overview", type: "page", href: "/sitemap-page" },
  { title: "About Us", description: "Who we are and our mission", type: "section", href: "/#about" },
  { title: "Pricing", description: "Transparent pricing plans", type: "section", href: "/#pricing" },
  { title: "FAQ", description: "Frequently asked questions", type: "section", href: "/#faq" },
  { title: "Contact", description: "Get in touch with us", type: "section", href: "/#contact" },
  { title: "Portfolio", description: "Our latest work and case studies", type: "section", href: "/#portfolio" },
];

const typeIcons = {
  blog: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  portfolio: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  ),
  service: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  page: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  section: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

const typeLabels = {
  blog: "Blog",
  portfolio: "Project",
  service: "Service",
  page: "Page",
  section: "Section",
};

export default function SearchModal({ isOpen, onClose, blogPosts = [], portfolioProjects = [] }) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Build full searchable index
  const searchIndex = useMemo(() => {
    const blogItems = blogPosts.map((p) => ({
      title: p.title,
      description: p.excerpt || "",
      type: "blog",
      href: `/blog/${p.slug}`,
      category: p.category,
    }));

    const portfolioItems = portfolioProjects.map((p) => ({
      title: p.title,
      description: p.tagline || "",
      type: "portfolio",
      href: `/portfolio/${p.slug}`,
    }));

    return [...blogItems, ...portfolioItems, ...servicesData, ...pageData];
  }, [blogPosts, portfolioProjects]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          item.type.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, searchIndex]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [results]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIdx]) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, results, selectedIdx]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIdx];
      if (selectedEl) selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "min(20vh, 160px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: 560,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(17,17,20,0.95)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
              boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Search input */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blog, portfolio, services..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "inherit",
                }}
              />
              <kbd
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={{ maxHeight: 360, overflowY: "auto", padding: "6px" }}>
              {query.trim() && results.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No results found for &ldquo;{query}&rdquo;</p>
                </div>
              )}

              {results.map((item, i) => (
                <Link
                  key={`${item.type}-${item.href}`}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    textDecoration: "none",
                    background: i === selectedIdx ? "rgba(201,169,110,0.08)" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <div style={{ color: i === selectedIdx ? "#c9a96e" : "rgba(255,255,255,0.25)", flexShrink: 0, display: "flex" }}>
                    {typeIcons[item.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: i === selectedIdx ? "#fff" : "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>
                      {item.description}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 9.5, fontWeight: 600,
                    color: i === selectedIdx ? "rgba(201,169,110,0.8)" : "rgba(255,255,255,0.2)",
                    textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0,
                  }}>
                    {typeLabels[item.type]}
                  </span>
                </Link>
              ))}

              {!query.trim() && (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12.5 }}>
                    Type to search across blog posts, portfolio projects, and services
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
                    {["blog", "portfolio", "service"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setQuery(type)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 11, color: "rgba(255,255,255,0.3)",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, padding: "4px 10px",
                          cursor: "pointer",
                          transition: "color 0.2s, border-color 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#c9a96e"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                      >
                        {typeIcons[type]}
                        {typeLabels[type]}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div style={{
                padding: "8px 18px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                gap: 16,
                fontSize: 10.5,
                color: "rgba(255,255,255,0.2)",
              }}>
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
