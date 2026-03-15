"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
// Animation variants for pricing cards
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.1, 0, 1],
    },
  }),
};

const plans = [
  {
    name: "Starter",
    desc: "Professional online presence for small businesses.",
    priceINR: "₹6,999",
    priceUSD: "$85",
    period: "one-time",
    features: [
      "Up to 4 pages",
      "Mobile responsive",
      "Custom design & animations",
      "SEO setup",
      "SEO maintenance (12 months)",
      "Contact form",
      "WhatsApp chat integration",
      "Lifetime support",
      "Vercel / Netlify hosting",
      "Speed optimization"
    ],
    highlight: false,
  },
  {
    name: "Growth",
    desc: "Scale with custom features & ongoing support. Best for startups and growing businesses.",
    priceINR: "₹14,999",
    priceUSD: "$179",
    period: "one-time",
    features: [
      "Up to 10 pages",
      "Custom design & animations",
      "SEO setup + analytics",
      "SEO maintenance (12 months)",
      "WhatsApp integration",
      "Admin content update option",
      "Performance optimized",
      "Lifetime support",
    ],
    highlight: true,
  },
  {
    name: "Business / Advanced",
    desc: "For serious businesses.",
    priceINR: "₹29,999+",
    priceUSD: "$349+",
    period: "project based",
    features: [
      "Up to 20 pages",
      "Custom UI/UX",
      "AI chatbot integration",
      "Custom cloud backend",
      "CMS / Admin panel",
      "SEO setup + analytics",
      "SEO maintenance (24 months)",
      "Performance optimization",
      "Lifetime support",
      "CI/CD & staging setup"
    ],
    highlight: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [currency, setCurrency] = useState("INR"); // default INR

  // Detect user location via API
  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.country && data.country !== "IN") {
          setCurrency("USD");
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pricing-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".pricing-divider", start: "top 85%" },
        }
      );
      gsap.utils.toArray(".pricing-check").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(2)",
            delay: 0.4 + i * 0.04,
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        );
      });
      gsap.utils.toArray(".pricing-badge").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: -10, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(2.5)",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "5rem",
        paddingBottom: "5rem",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)",
        }}
      />

      <div
        style={{
          maxWidth: "60rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
            }}
          >
            Transparent{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pricing
            </span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
              marginTop: "0.5rem",
              fontWeight: 300,
            }}
          >
            No hidden fees. Pick a plan or get a custom quote.
          </p>

          {/* Special Launch Offer heading */}
          <div style={{ margin: "1.2rem 0 0.7rem 0", textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              fontWeight: 700,
              fontSize: 16,
              color: "#c9a96e",
              background: "rgba(201,169,110,0.08)",
              padding: "6px 18px",
              borderRadius: 8,
              letterSpacing: "0.04em",
              marginBottom: 6,
            }}>
              Special Launch Offer – Limited Time Pricing
            </span>
          </div>

          {/* Currency Toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <div style={{
              display: "inline-flex",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              padding: 3,
              gap: 2,
            }}>
              <button
                onClick={() => setCurrency("INR")}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  background: currency === "INR"
                    ? "linear-gradient(135deg, #c9a96e, #d4b883)"
                    : "transparent",
                  color: currency === "INR" ? "#09090b" : "rgba(255,255,255,0.4)",
                }}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  background: currency === "USD"
                    ? "linear-gradient(135deg, #c9a96e, #d4b883)"
                    : "transparent",
                  color: currency === "USD" ? "#09090b" : "rgba(255,255,255,0.4)",
                }}
              >
                $ USD
              </button>
            </div>
          </div>

          {/* Trust line */}
          {/* <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            marginBottom: "1.2rem",
            fontSize: 14,
            fontWeight: 600,
            color: "#22c55e",
            flexWrap: "wrap",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Free consultation
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              No hidden charges
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Fast delivery (5–10 days)
            </span>
          </div> */}
        </motion.div>

        {/* Gold divider */}
        <div
          className="pricing-divider"
          style={{
            width: 48,
            height: 2,
            background: "linear-gradient(90deg, #c9a96e, #d4b883)",
            borderRadius: 1,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "2.5rem",
            transformOrigin: "center",
          }}
        />

        {/* Cards */}
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="pricing-card"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 14,
                border: plan.highlight
                  ? "1.5px solid rgba(201,169,110,0.25)"
                  : "1px solid rgba(255,255,255,0.06)",
                background: plan.highlight
                  ? "linear-gradient(160deg, rgba(201,169,110,0.06) 0%, rgba(17,17,20,0.8) 40%)"
                  : "rgba(17,17,20,0.7)",
                transition: "border-color 0.4s, box-shadow 0.4s, transform 0.3s",
              }}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div
                  className="pricing-badge"
                  style={{
                    textAlign: "center",
                    padding: "5px 0",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    background: "rgba(201,169,110,0.12)",
                    color: "#c9a96e",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ padding: "1.5rem" }}>
                {/* Plan name */}
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    margin: "0 0 1rem 0",
                  }}
                >
                  {plan.desc}
                </p>

                {/* Price */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
                    <span
                      style={{
                        fontSize: "clamp(2rem, 4vw, 2.75rem)",
                        fontWeight: 900,
                        letterSpacing: "-0.02em",
                        background: "linear-gradient(135deg, #e8d5b0, #c9a96e 50%, #d4b883)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1.1,
                      }}
                    >
                      {currency === "INR" ? plan.priceINR : plan.priceUSD}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.25)",
                        marginLeft: 4,
                        fontWeight: 500,
                      }}
                    >
                      / {plan.period}
                    </span>
                  </div>
                  {/* Alternate currency */}
                  <div style={{
                    marginTop: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: "rgba(201,169,110,0.06)",
                    border: "1px solid rgba(201,169,110,0.08)",
                  }}>
                    <span style={{
                      fontSize: 11,
                      color: "rgba(201,169,110,0.5)",
                      fontWeight: 600,
                    }}>
                      ≈ {currency === "INR" ? plan.priceUSD : plan.priceINR}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem 0" }}>
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                        marginBottom: 8,
                      }}
                    >
                      <span className="pricing-check" style={{ flexShrink: 0, marginTop: 2, display: "inline-flex" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className="pricing-cta"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.7rem 0",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textDecoration: "none",
                    transition: "all 0.4s",
                    ...(plan.highlight
                      ? {
                          background: "linear-gradient(135deg, #c9a96e, #d4b883)",
                          color: "#09090b",
                          boxShadow: "0 4px 16px rgba(201,169,110,0.2)",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.5)",
                        }),
                  }}
                >
                  Get Started
                </a>
              </div>

              {/* Bottom accent line */}
              <div
                className="card-bottom-accent"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: plan.highlight
                    ? "linear-gradient(90deg, #c9a96e, #d4b883)"
                    : "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                  opacity: plan.highlight ? 1 : 0,
                  transition: "opacity 0.4s",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: 13,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Need something custom?{" "}
          <a
            href="#contact"
            style={{
              color: "rgba(201,169,110,0.6)",
              textDecoration: "underline",
            }}
          >
            Contact us
          </a>{" "}
          for a free tailored quote.
        </motion.p>
      </div>

      <style jsx>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 360px;
            margin-left: auto;
            margin-right: auto;
          }
        }
        .pricing-card:hover {
          border-color: rgba(201, 169, 110, 0.15) !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 25px rgba(201, 169, 110, 0.04) !important;
        }
        .pricing-card:hover .card-bottom-accent {
          opacity: 1 !important;
        }
        .pricing-card:hover .pricing-cta {
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
}
