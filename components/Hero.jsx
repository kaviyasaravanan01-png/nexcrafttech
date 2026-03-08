"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at center, rgba(201,169,110,0.04) 0%, #09090b 70%)",
    }} />
  ),
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main content parallax — moves up and fades
      gsap.to(contentRef.current, {
        y: -150,
        opacity: 0,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
      // Background layer — moves slower for depth
      gsap.to(".hero-bg-layer", {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      // Gradient overlay — slides down slower
      gsap.to(".hero-gradient-overlay", {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
      // Glow orb — floats at a different rate
      gsap.to(".hero-glow-orb", {
        y: 80,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: i * 0.1,
        ease: [0.25, 0.1, 0, 1],
      },
    }),
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Background */}
      <div className="hero-bg-layer absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Gradient overlays */}
      <div className="hero-gradient-overlay absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#09090b]" />
      <div
        className="hero-glow-orb absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-[1] opacity-40"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 60%)" }}
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 px-6" style={{ textAlign: "center", maxWidth: "64rem", marginLeft: "auto", marginRight: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
            <span className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase">
              Web &middot; AI &middot; SEO &middot; Chatbots
            </span>
          </div>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
          {["We", "Build"].map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="inline-block text-white"
              style={{ marginRight: "0.35em" }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          {["Websites", "That"].map((word, i) => (
            <motion.span
              key={word}
              custom={i + 2}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="inline-block gradient-text"
              style={{ marginRight: "0.35em" }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          {["Grow", "Your", "Business"].map((word, i) => (
            <motion.span
              key={word}
              custom={i + 4}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="inline-block text-white"
              style={{ marginRight: "0.35em" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="leading-relaxed font-light"
          style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.18rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto", textAlign: "center", marginTop: "1rem" }}
        >
          From custom websites and SEO to AI-powered chatbots — we deliver
          real results at startup-friendly prices. No fluff. No hidden costs.
        </motion.p>

        {/* Services pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease: [0.25, 0.1, 0, 1] }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.75rem", maxWidth: "36rem", marginLeft: "auto", marginRight: "auto", marginTop: "2.5rem" }}
        >
          {[
            "Website Development",
            "SEO Optimization",
            "AI Chatbots",
            "Digital Marketing",
            "App Development",
          ].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide"
              style={{
                borderColor: "rgba(201,169,110,0.22)",
                background: "rgba(201,169,110,0.06)",
                color: "rgba(201,169,110,0.85)",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(201,169,110,0.7)", display: "inline-block", flexShrink: 0 }} />
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: [0.25, 0.1, 0, 1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", width: "100%", marginTop: "1rem" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1.25rem", padding: "4px" }}>
          <a
            href="#contact"
            className="px-8 py-4 rounded-full bg-[#c9a96e] text-[#09090b] font-semibold text-sm tracking-wide hover:bg-[#d4b883] transition-all duration-500"
            style={{ boxShadow: "0 0 24px rgba(201,169,110,0.25)" }}
          >
            Start Your Project &rarr;
          </a>
          <a
            href="#portfolio"
            className="group px-8 py-4 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-medium text-sm tracking-wide transition-all duration-500"
          >
            See Our Work
          </a>
          </div>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1.5rem", color: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: "0.05em", marginTop: "1rem" }}
        >
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Transparent Pricing
          </span>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Fast Delivery
          </span>
          <span className="hidden sm:block" style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />
          <span className="hidden sm:flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            24/7 Support
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-5 h-9 rounded-full border border-white/15 flex items-start justify-center pt-2">
            <div className="w-0.5 h-2 rounded-full bg-gradient-to-b from-[#c9a96e]/60 to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
