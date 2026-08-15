"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "What does NexCraft actually do?",
    a: "We are an AI and automation solutions studio. We also build websites, SEO, product prototypes, production SaaS, and data engineering — from discovery to launch, with a team you can call.",
  },
  {
    q: "How do we start?",
    a: "Call, WhatsApp, or send the form. We reply with a short discovery call, then a written scope and estimate. You only commit after that.",
  },
  {
    q: "How are projects priced?",
    a: "Digital work typically starts around ₹15,000. AI and automation engagements typically start around ₹50,000. Product and data work is custom. Quotes are milestone-based — no hidden add-ons and no fake lifetime promises.",
  },
  {
    q: "Can you build AI on our data and rules?",
    a: "Yes. We ground agents in your catalog, knowledge base, and offer rules (like AI Call Assistant), with transfer to humans when needed. We also set evaluation so quality does not drift.",
  },
  {
    q: "Do you only work in Chennai?",
    a: "HQ is in Chennai. We deliver remotely for clients in India, Australia, and elsewhere. Calls and WhatsApp keep the loop short.",
  },
  {
    q: "What stack do you use?",
    a: "Next.js, React, Node, Python, Supabase, Vercel, Railway, Claude, Vapi, Playwright, and standard cloud data tools. We pick the stack that fits the problem, not a single vendor.",
  },
];

function AccordionItem({ faq, index, openIndex, setOpenIndex }) {
  const isOpen = openIndex === index;
  const contentRef = useRef(null);

  return (
    <motion.div
      className="faq-item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.1, 0, 1] }}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpenIndex(isOpen ? -1 : index)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.25rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flex: 1 }}>
          <span
            className="faq-number"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 600,
              color: isOpen ? "#c9a96e" : "rgba(255,255,255,0.2)",
              minWidth: 22,
              transition: "color 0.3s",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: isOpen ? "#e8d5b0" : "rgba(255,255,255,0.75)",
              letterSpacing: "-0.01em",
              transition: "color 0.3s",
              lineHeight: 1.5,
            }}
          >
            {faq.q}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: isOpen ? "rgba(201,169,110,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${isOpen ? "rgba(201,169,110,0.25)" : "rgba(255,255,255,0.06)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.3s, border-color 0.3s",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke={isOpen ? "#c9a96e" : "rgba(255,255,255,0.4)"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              ref={contentRef}
              style={{
                padding: "0 0 1.25rem 2.1rem",
                fontSize: 13,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "44rem",
              }}
            >
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".faq-divider", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".faq-badge",
        { scale: 0, rotation: -10 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".faq-badge", start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // JSON-LD Schema Markup for FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      style={{
        padding: "5rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background subtle glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "52rem", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="faq-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 100,
                background: "rgba(201,169,110,0.08)",
                border: "1px solid rgba(201,169,110,0.15)",
                marginBottom: "1rem",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
              </svg>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: "#c9a96e", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                FAQ
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.6rem", lineHeight: 1.2 }}
          >
            Frequently Asked{" "}
            <span className="gradient-text-static">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: "28rem", margin: "0 auto" }}
          >
            Everything you need to know about working with NexCraft.
          </motion.p>

          {/* Divider */}
          <div
            className="faq-divider"
            style={{
              width: "4rem",
              height: 1,
              background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
              margin: "1.5rem auto 0",
              transformOrigin: "center",
            }}
          />
        </div>

        {/* Accordion */}
        <div
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: "0.5rem 1.5rem",
          }}
        >
          {faqs.map((faq, i) => (
            <AccordionItem key={i} faq={faq} index={i} openIndex={openIndex} setOpenIndex={setOpenIndex} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: "center", marginTop: "2rem" }}
        >
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>
            Still have questions?
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(201,169,110,0.3)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 22px",
              borderRadius: 100,
              background: "rgba(201,169,110,0.1)",
              border: "1px solid rgba(201,169,110,0.2)",
              color: "#c9a96e",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
          >
            Get in Touch
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          #faq { padding: 3.5rem 1rem !important; }
        }
      `}</style>
    </section>
  );
}
