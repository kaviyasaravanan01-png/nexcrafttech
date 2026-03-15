"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
      { label: "Blog", href: "/blog" },
      { label: "Team", href: "/team" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Website Development", href: "#services" },
      { label: "SEO & Marketing", href: "#services" },
      { label: "AI Chatbots", href: "#services" },
      { label: "App Development", href: "#services" },
      { label: "Maintenance", href: "#services" },
    ],
  },
  {
    title: "Legal & More",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Sitemap", href: "/sitemap-page" },
      { label: "nexcrafttech@gmail.com", href: "mailto:nexcrafttech@gmail.com" },
      { label: "India (Remote-first)", href: null },
    ],
  },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/nexcrafttech",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nexcrafttech",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/nexcrafttech",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/nexcrafttech",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@nexcrafttech",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/nexcrafttech",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

const linkVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-top-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".footer-top-line", start: "top 95%" },
        }
      );
      gsap.fromTo(
        ".footer-logo",
        { scale: 0, rotation: -20 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".footer-logo", start: "top 92%" },
        }
      );
      gsap.utils.toArray(".footer-social").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(2.5)",
            delay: 0.2 + i * 0.08,
            scrollTrigger: { trigger: el, start: "top 95%" },
          }
        );
      });
      gsap.fromTo(
        ".footer-bottom-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".footer-bottom-bar", start: "top 98%" },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        background: "#060608",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Gold top line */}
      <div
        className="footer-top-line"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)",
          transformOrigin: "center",
        }}
      />

      <div
        style={{
          maxWidth: "60rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "3rem",
          paddingBottom: "1.5rem",
        }}
      >
        {/* Main grid */}
        <div className="footer-grid">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                className="footer-logo"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(201,169,110,0.25)",
                  background: "rgba(201,169,110,0.05)",
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 21 21" fill="none" aria-hidden="true">
                  <path d="M2 10.5L7.5 2L13 10.5L7.5 19L2 10.5Z" fill="url(#fg1)" />
                  <path d="M9 10.5L14.5 2L20 10.5L14.5 19L9 10.5Z" fill="url(#fg2)" />
                  <defs>
                    <linearGradient id="fg1" x1="2" y1="2" x2="13" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#e8d5b0" /><stop offset="1" stopColor="#c9a96e" /></linearGradient>
                    <linearGradient id="fg2" x1="9" y1="2" x2="20" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#c9a96e" stopOpacity="0.6" /><stop offset="1" stopColor="#c9a96e" stopOpacity="0.18" /></linearGradient>
                  </defs>
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em" }}>
                NexCraft Technologies
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.22)",
                maxWidth: 260,
                margin: "0 0 14px 0",
                fontWeight: 300,
              }}
            >
              We build websites, chatbots & digital products for businesses that want to grow. Transparent pricing. No fluff.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    transition: "all 0.3s",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {footerLinks.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + gi * 0.08, ease: [0.25, 0.1, 0, 1] }}
            >
              <h4
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 12,
                }}
              >
                {group.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {group.links.map((link, li) => (
                  <motion.li
                    key={link.label}
                    custom={gi * 5 + li}
                    variants={linkVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{ marginBottom: 6 }}
                  >
                    {link.href ? (
                      <a
                        href={link.href}
                        className="footer-link"
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.22)",
                          textDecoration: "none",
                          transition: "color 0.3s",
                        }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
                        {link.label}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom-bar"
          style={{
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            transformOrigin: "center",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "rgba(255,255,255,0.12)",
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} NexCraft Technologies. All rights reserved.
          </motion.p>
        </div>
      </div>

      <style jsx>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
        .footer-social:hover {
          background: rgba(201, 169, 110, 0.1) !important;
          border-color: rgba(201, 169, 110, 0.25) !important;
          color: #c9a96e !important;
          transform: translateY(-2px);
        }
        .footer-link:hover {
          color: rgba(201, 169, 110, 0.7) !important;
        }
      `}</style>
    </footer>
  );
}
