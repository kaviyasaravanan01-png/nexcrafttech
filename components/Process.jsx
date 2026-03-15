"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "We learn your goals and give you a clear quote.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Design",
    desc: "Wireframes & mockups — you approve before we code.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Develop",
    desc: "We build with modern tech. Weekly updates included.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Launch",
    desc: "We deploy live and provide ongoing support.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.12,
      ease: [0.25, 0.1, 0, 1],
    },
  }),
};

export default function Process() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate connector lines
      gsap.utils.toArray(".process-connector").forEach((el, i) => {
        gsap.fromTo(el,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.6, delay: 0.3 + i * 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" },
          }
        );
      });
      // Animate the number counters with a pop effect
      gsap.utils.toArray(".process-num").forEach((el, i) => {
        gsap.fromTo(el,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.5, delay: 0.1 + i * 0.12,
            ease: "back.out(2)",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
          }
        );
      });
      // Progress bar driven by scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 30%",
        onUpdate: (self) => setProgress(self.progress),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative overflow-hidden" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      <div className="px-6" style={{ maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
        >
          <span style={{ display: "inline-block", color: "#c9a96e", fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            How We Work
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-[1.15] text-white">
            Simple <span className="gradient-text">4-Step</span> Process
          </h2>
          <p className="font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.05rem", maxWidth: "36rem", marginLeft: "auto", marginRight: "auto", marginTop: "1rem" }}>
            From discovery to launch, we build your website with a clear, structured workflow that keeps your business goals at the centre of every decision.
          </p>
        </motion.div>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)", marginLeft: "auto", marginRight: "auto", marginTop: "2rem", marginBottom: "2rem" }} />

        {/* Progress Track */}
        <div className="process-progress-track" style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", marginBottom: "1.5rem", overflow: "hidden" }}>
          <motion.div
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              borderRadius: 3,
              background: "linear-gradient(90deg, #c9a96e, #d4b883, #e8d5b0)",
              width: `${Math.min(progress * 100, 100)}%`,
              boxShadow: "0 0 12px rgba(201,169,110,0.3)",
              transition: "width 0.1s linear",
            }}
          />
          {/* Step dots on the track */}
          {steps.map((_, i) => {
            const pos = (i / (steps.length - 1)) * 100;
            const reached = progress * 100 >= pos;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${pos}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: reached ? 12 : 8,
                  height: reached ? 12 : 8,
                  borderRadius: "50%",
                  background: reached ? "#c9a96e" : "rgba(255,255,255,0.08)",
                  border: reached ? "2px solid #e8d5b0" : "2px solid rgba(255,255,255,0.06)",
                  transition: "all 0.3s ease",
                  boxShadow: reached ? "0 0 8px rgba(201,169,110,0.4)" : "none",
                  zIndex: 2,
                }}
              />
            );
          })}
        </div>

        {/* Steps - horizontal timeline */}
        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", position: "relative" }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{ position: "relative" }}>
              {/* Card */}
              <motion.div
                custom={i}
                variants={stepVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group"
                style={{
                  padding: "1.5rem 1rem",
                  borderRadius: "0.75rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.4s, background 0.4s",
                }}
              >
                {/* Hover border */}
                <div style={{
                  position: "absolute", bottom: 0, left: "25%", right: "25%", height: 1,
                  background: "rgba(201,169,110,0)", transition: "all 0.4s",
                }} className="group-hover:!bg-[rgba(201,169,110,0.2)]" />

                {/* Number badge */}
                <div
                  className="process-num group-hover:!bg-[rgba(201,169,110,0.15)] group-hover:!border-[rgba(201,169,110,0.3)]"
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)",
                    color: "#c9a96e", fontSize: 12, fontWeight: 700,
                    marginLeft: "auto", marginRight: "auto", marginBottom: "0.75rem",
                    transition: "all 0.4s",
                  }}
                >
                  {step.num}
                </div>

                {/* Icon */}
                <div style={{
                  color: "rgba(201,169,110,0.4)", marginBottom: "0.5rem",
                  display: "flex", justifyContent: "center",
                  transition: "color 0.4s",
                }} className="group-hover:!text-[#c9a96e]">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-white group-hover:text-[#e8d5b0] transition-colors duration-300" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                  {step.title}
                </h3>

                {/* Desc */}
                <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 11.5, lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </motion.div>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="process-connector" style={{
                  position: "absolute", top: "2.5rem", right: "-0.4rem", zIndex: 10,
                  width: "0.8rem", height: 1,
                  background: "rgba(201,169,110,0.2)",
                  transformOrigin: "left center",
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .process-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .process-connector {
            display: none !important;
          }
          .process-progress-track {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
