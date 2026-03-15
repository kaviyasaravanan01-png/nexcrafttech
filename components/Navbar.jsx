"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view
  useEffect(() => {
    const elements = NAV_LINKS.map((l) => document.getElementById(l.href.replace("#", ""))).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = NAV_LINKS.find((l) => l.href === `#${entry.target.id}`);
            if (found) setActiveSection(found.label);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const isActive = (label) => activeSection === label;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
    >
      {/* ── Top gold accent line (appears on scroll) ── */}
      <motion.div
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0) 8%, rgba(201,169,110,0.7) 30%, rgba(232,213,176,1) 50%, rgba(201,169,110,0.7) 70%, rgba(201,169,110,0) 92%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Frosted glass background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: scrolled ? "rgba(9,9,11,0.88)" : "rgba(9,9,11,0)",
          backdropFilter: scrolled ? "blur(28px) saturate(200%)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          transition: "background-color 0.5s, backdrop-filter 0.5s, border-color 0.5s",
          pointerEvents: "none",
        }}
      />

      {/* ── Subtle shadow glow on scroll ── */}
      <motion.div
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          bottom: -1,
          left: "25%",
          right: "25%",
          height: 1,
          background: "rgba(201,169,110,0.08)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Main content row ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: scrolled ? 70 : 90,
            transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* ─── LOGO ─── */}
          <a
            href="#hero"
            style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
          >
            {/* Icon mark */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "linear-gradient(145deg, rgba(201,169,110,0.14) 0%, rgba(201,169,110,0.04) 100%)",
                border: "1.5px solid rgba(201,169,110,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                transition: "border-color 0.4s, box-shadow 0.4s",
              }}
              className="logo-icon-box"
            >
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true">
                <path d="M2 10.5L7.5 2L13 10.5L7.5 19L2 10.5Z" fill="url(#nc-g1)" />
                <path d="M9 10.5L14.5 2L20 10.5L14.5 19L9 10.5Z" fill="url(#nc-g2)" />
                <defs>
                  <linearGradient id="nc-g1" x1="2" y1="2" x2="13" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e8d5b0" />
                    <stop offset="1" stopColor="#c9a96e" />
                  </linearGradient>
                  <linearGradient id="nc-g2" x1="9" y1="2" x2="20" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c9a96e" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#c9a96e" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Corner glow dot */}
              <div
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "rgba(201,169,110,0.5)",
                  filter: "blur(3px)",
                }}
              />
            </div>

            {/* Text block */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: 1.15,
                  letterSpacing: "-0.025em",
                }}
              >
                NexCraft
              </span>
              <span
                style={{
                  color: "rgba(201,169,110,0.5)",
                  fontSize: 9.5,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                Technologies
              </span>
            </div>
          </a>

          {/* ─── DESKTOP NAVIGATION ─── */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 2 }}
          >
            {/* Link group */}
            <div style={{ display: "flex", alignItems: "center", gap: 1, padding: "5px 6px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.label)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: "relative",
                    padding: "8px 17px",
                    fontSize: 12.5,
                    fontWeight: 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: isActive(link.label)
                      ? "rgba(201,169,110,0.95)"
                      : hovered === link.label
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(255,255,255,0.42)",
                    textDecoration: "none",
                    transition: "color 0.28s",
                    borderRadius: 10,
                    userSelect: "none",
                  }}
                >
                  {/* Hover pill bg */}
                  <AnimatePresence>
                    {hovered === link.label && !isActive(link.label) && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.05)",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Active pill bg */}
                  {isActive(link.label) && (
                    <motion.span
                      layoutId="nav-active-pill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 10,
                        background: "rgba(201,169,110,0.1)",
                        border: "1px solid rgba(201,169,110,0.18)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 36 }}
                    />
                  )}

                  {/* Active bottom dot */}
                  {isActive(link.label) && (
                    <motion.span
                      layoutId="nav-dot"
                      style={{
                        position: "absolute",
                        bottom: 3,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "#c9a96e",
                        boxShadow: "0 0 5px rgba(201,169,110,0.8)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 36 }}
                    />
                  )}

                  <span style={{ position: "relative", zIndex: 1 }}>{link.label}</span>
                </a>
              ))}
            </div>

            {/* Separator */}
            <div
              style={{
                width: 1,
                height: 28,
                background: "rgba(255,255,255,0.07)",
                margin: "0 14px",
                flexShrink: 0,
              }}
            />

            {/* ── Search Button ── */}
            <button
              onClick={() => window.__openSearch?.()}
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
                marginRight: 8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden lg:inline" style={{ fontSize: 11 }}>Search</span>
              <kbd className="hidden lg:inline" style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", marginLeft: 2 }}>⌘K</kbd>
            </button>

            {/* ── CTA Button ── */}
            <motion.a
              href="#contact"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 32px rgba(201,169,110,0.45), 0 6px 20px rgba(0,0,0,0.45)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 26px",
                borderRadius: 100,
                background: "linear-gradient(135deg, #c9a96e 0%, #e2cc9d 48%, #c9a96e 100%)",
                color: "#09090b",
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textDecoration: "none",
                boxShadow: "0 0 20px rgba(201,169,110,0.22), 0 4px 14px rgba(0,0,0,0.4)",
                whiteSpace: "nowrap",
                position: "relative",
                overflow: "hidden",
                transition: "box-shadow 0.4s",
                textTransform: "uppercase",
              }}
            >
              {/* Shimmer sweep */}
              <motion.span
                animate={{ x: ["-180%", "220%"] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2,
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "55%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>Get a Quote</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "relative", zIndex: 1, flexShrink: 0 }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
          </div>

          {/* ─── MOBILE HAMBURGER ─── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="flex md:hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "9px 10px",
              cursor: "pointer",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
            }}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.28 }}
              style={{ display: "block", width: 20, height: 1.5, background: "#fff", borderRadius: 2 }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 0.6, scaleX: 1 }}
              transition={{ duration: 0.28 }}
              style={{ display: "block", width: 20, height: 1.5, background: "#fff", borderRadius: 2 }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.28 }}
              style={{ display: "block", width: 20, height: 1.5, background: "#fff", borderRadius: 2 }}
            />
          </button>
        </div>
      </div>

      {/* ─── MOBILE MENU ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            style={{
              overflow: "hidden",
              background: "rgba(9,9,11,0.97)",
              backdropFilter: "blur(28px)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ padding: "1.25rem 2rem 2rem" }}>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.28, delay: i * 0.055 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "15px 0",
                    textDecoration: "none",
                    color: isActive(link.label)
                      ? "rgba(201,169,110,0.9)"
                      : "rgba(255,255,255,0.52)",
                    fontSize: 13.5,
                    fontWeight: 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    borderBottom:
                      i < NAV_LINKS.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    transition: "color 0.3s",
                  }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: isActive(link.label) ? "#c9a96e" : "rgba(255,255,255,0.15)",
                      flexShrink: 0,
                      transition: "background 0.3s",
                    }}
                  />
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.32, delay: 0.32 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: "1.5rem",
                  padding: "14px 24px",
                  borderRadius: 100,
                  background: "linear-gradient(135deg, #c9a96e, #d4b883)",
                  color: "#09090b",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(201,169,110,0.3)",
                }}
              >
                Get a Quote
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
