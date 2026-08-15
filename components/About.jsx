"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 5, suffix: "", label: "Shipped products" },
  { value: 2, suffix: "", label: "Client markets" },
  { value: 6, suffix: "", label: "Solution practices" },
];

// Animated counter that counts from 0 → target on scroll
function AnimatedCounter({ target, suffix = "", decimals = 0, trigger }) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target]);

  return (
    <>
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </>
  );
}

const values = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI-first delivery",
    desc: "Voice agents, RAG, automation, and copilots designed around your data, rules, and operations — not generic chat widgets.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      </svg>
    ),
    title: "Build what we run",
    desc: "We ship our own products — VantaHire, AI Call Assistant, CamToCode, PDF AI, WhatsApp CRM — so client work is production-grade.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Reachable team",
    desc: "Chennai-based, working with India and international clients. Call, WhatsApp, or email — a person replies, with a scoped plan.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".about-stat").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1, duration: 0.6, delay: i * 0.08,
            ease: "back.out(1.7)",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          }
        );
      });
      // Parallax — background glow moves slower
      gsap.to(".about-glow", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
      // Parallax — values cards
      gsap.to(".about-values-grid", {
        y: -15,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-values-grid",
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      {/* Subtle glow */}
      <div className="about-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(201,169,110,0.03) 0%, transparent 70%)" }} />

      <div className="px-6" style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
        >
          <span style={{ display: "inline-block", color: "#c9a96e", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>
            About Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            An AI solutions studio,{" "}
            <span className="gradient-text">not a template shop</span>
          </h2>
          <p className="font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.05rem", maxWidth: "38rem", marginLeft: "auto", marginRight: "auto", marginTop: "1rem" }}>
            NexCraft Technologies is a Chennai-based team that designs, builds, and operates AI, automation, websites, SEO, products, prototypes, and data systems for businesses that need a partner they can call.
          </p>
        </motion.div>

        {/* Animated Stats Counter Row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "3rem", marginBottom: "3rem" }}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="about-stat" style={{ textAlign: "center", minWidth: 90 }}>
              <div className="gradient-text-static font-bold" style={{ fontSize: "2rem", lineHeight: 1.1 }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} trigger={isInView} />
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4, letterSpacing: "0.05em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)", marginLeft: "auto", marginRight: "auto", marginBottom: "2.5rem" }} />

        {/* Values */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="about-values-grid">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.3 } }}
              className="group"
              style={{
                position: "relative",
                padding: "2rem 1.5rem",
                borderRadius: "1rem",
                background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
                cursor: "default",
                transition: "border-color 0.5s, box-shadow 0.5s",
              }}
            >
              {/* Hover glow */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(201,169,110,0), transparent)",
                transition: "all 0.5s",
              }} className="group-hover:!bg-[linear-gradient(90deg,transparent,rgba(201,169,110,0.3),transparent)]" />

              <div style={{
                width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.12)", color: "rgba(201,169,110,0.5)",
                marginLeft: "auto", marginRight: "auto", marginBottom: "1rem",
                transition: "all 0.4s",
              }} className="group-hover:!text-[#c9a96e] group-hover:!border-[rgba(201,169,110,0.3)] group-hover:!bg-[rgba(201,169,110,0.1)]">
                {item.icon}
              </div>

              <h3 className="font-semibold text-white group-hover:text-[#e8d5b0] transition-colors duration-400" style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .about-values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
