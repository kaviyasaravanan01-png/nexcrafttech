"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const LottieIcon = dynamic(() => import("./LottieIcon"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
      </svg>
    ),
    title: "Website Development",
    desc: "Fast, responsive websites — from landing pages to full eCommerce.",
    price: "₹6,999",
    lottieType: "globe",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    title: "SEO & Marketing",
    desc: "Get found on Google. Ads, SEO, and content that drives traffic.",
    price: "₹4,000/mo",
    lottieType: "chart",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" />
        <path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
      </svg>
    ),
    title: "AI Chatbots",
    desc: "WhatsApp & website bots that automate support and generate leads.",
    price: "₹5,000",
    lottieType: "chip",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
    title: "Cloud & AI",
    desc: "Cloud infra, data pipelines, and AI-powered workflows on GCP.",
    price: "₹15,000",
    lottieType: "cloud",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
      </svg>
    ),
    title: "App Development",
    desc: "Cross-platform mobile & desktop apps. One codebase, every device.",
    price: "₹10,000",
    lottieType: "phone",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Maintenance",
    desc: "Bug fixes, updates, security patches. We keep your site running.",
    price: "₹2,000/mo",
    lottieType: "wrench",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0, 1],
    },
  }),
};

export default function Services() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the gold line growing
      gsap.fromTo(".services-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="px-6" style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
        >
          <span style={{ display: "inline-block", color: "#c9a96e", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            What We <span className="gradient-text">Offer</span>
          </h2>
          <p className="font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.05rem", maxWidth: "32rem", marginLeft: "auto", marginRight: "auto", marginTop: "1rem" }}>
            Everything to build, grow, and maintain your online presence.
          </p>
        </motion.div>

        {/* Gold line */}
        <div className="services-line" style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)", marginLeft: "auto", marginRight: "auto", marginTop: "2.5rem", marginBottom: "2.5rem", transformOrigin: "center" }} />

        {/* Grid */}
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{
                y: -6,
                scale: 1.03,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              }}
              className="group"
              style={{
                position: "relative",
                padding: "1.75rem 1.25rem",
                borderRadius: "0.875rem",
                background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
                cursor: "default",
                textAlign: "center",
              }}
            >
              {/* Top accent line on hover */}
              <div style={{
                position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                background: "rgba(201,169,110,0)",
                transition: "all 0.5s",
              }} className="group-hover:!bg-[rgba(201,169,110,0.25)]" />

              {/* Corner glow */}
              <div style={{
                position: "absolute", top: -30, right: -30, width: 80, height: 80, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
                opacity: 0, transition: "opacity 0.5s",
              }} className="group-hover:!opacity-100" />

              {/* Icon with Lottie background */}
              <div style={{ position: "relative", width: 38, height: 38, marginLeft: "auto", marginRight: "auto", marginBottom: "0.875rem" }}>
                {/* Lottie animation behind icon */}
                <div style={{ position: "absolute", inset: -8, opacity: 0.4, pointerEvents: "none" }}>
                  <LottieIcon type={service.lottieType} color="rgba(201,169,110,0.6)" size={54} />
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.1)", color: "rgba(201,169,110,0.5)",
                  position: "relative", zIndex: 1,
                  transition: "all 0.4s",
                }} className="group-hover:!text-[#c9a96e] group-hover:!border-[rgba(201,169,110,0.3)] group-hover:!bg-[rgba(201,169,110,0.1)]">
                  {service.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-white group-hover:text-[#e8d5b0] transition-colors duration-400" style={{ fontSize: "0.95rem", marginBottom: "0.375rem" }}>
                {service.title}
              </h3>

              {/* Description */}
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12.5, lineHeight: 1.55, marginBottom: "0.875rem" }}>
                {service.desc}
              </p>

              {/* Price */}
              <div style={{
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}>
                <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>From</span>
                <span className="gradient-text-static font-semibold" style={{ fontSize: "0.9rem" }}>{service.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
