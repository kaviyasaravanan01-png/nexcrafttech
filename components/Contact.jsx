"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const contactItems = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Email",
    value: "nexcrafttech@gmail.com",
    href: "mailto:nexcrafttech@gmail.com",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
      </svg>
    ),
    label: "Website",
    value: "nexcrafttech.com",
    href: "https://nexcrafttech.com",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Location",
    value: "India (Remote-first)",
    href: null,
  },
];

const inputStyle = {
  width: "100%",
  padding: "0.65rem 1rem",
  borderRadius: 10,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#ffffff",
  fontSize: 13,
  outline: "none",
  transition: "border-color 0.3s, background 0.3s",
};

const infoVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const steps = [
    { label: "Details", icon: "user" },
    { label: "Project", icon: "briefcase" },
    { label: "Budget", icon: "wallet" },
    { label: "Message", icon: "send" },
  ];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim() && form.email.trim();
    if (step === 1) return form.service;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const { supabase } = await import("@/lib/supabaseClient");
      if (supabase) {
        const { error } = await supabase.from("inquiries").insert([
          { name: form.name, email: form.email, company: form.company, service: form.service, budget: form.budget, message: form.message },
        ]);
        if (error) throw error;
      }
      // Send email notification
      await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          service: form.service,
          budget: form.budget,
          message: form.message,
        }),
      });
      setStatus("success");
      setForm({ name: "", email: "", company: "", service: "", budget: "", message: "" });

      // Confetti celebration
      import("canvas-confetti").then((mod) => {
        const confetti = mod.default;
        const gold = ["#c9a96e", "#d4b883", "#e8d5b0", "#ffffff"];
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: gold,
          disableForReducedMotion: true,
        });
        setTimeout(() => {
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: gold,
            disableForReducedMotion: true,
          });
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: gold,
            disableForReducedMotion: true,
          });
        }, 200);
      });
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".contact-divider", start: "top 85%" },
        }
      );
      gsap.utils.toArray(".contact-icon-box").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0, rotation: -15 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(2.5)",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
      gsap.fromTo(
        ".contact-form-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-form-card", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".contact-trust",
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.3,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".contact-trust", start: "top 92%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
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
            Let&apos;s Build{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Together
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
            Tell us about your project. Free quote within 24 hours.
          </p>
        </motion.div>

        {/* Gold divider */}
        <div
          className="contact-divider"
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

        {/* Two-column layout */}
        <div className="contact-layout">
          {/* Left — Info */}
          <div>
            {/* Contact items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {contactItems.map((item, i) => {
                const Wrapper = item.href ? "a" : "div";
                return (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={infoVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Wrapper
                      {...(item.href ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="contact-info-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textDecoration: "none",
                        padding: "0.75rem 1rem",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.05)",
                        background: "rgba(17,17,20,0.6)",
                        transition: "border-color 0.3s, background 0.3s",
                      }}
                    >
                      <div
                        className="contact-icon-box"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(201,169,110,0.06)",
                          border: "1px solid rgba(201,169,110,0.12)",
                          color: "rgba(201,169,110,0.5)",
                          flexShrink: 0,
                          transition: "all 0.3s",
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            color: "rgba(255,255,255,0.2)",
                            marginBottom: 1,
                          }}
                        >
                          {item.label}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>
                          {item.value}
                        </div>
                      </div>
                    </Wrapper>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust signal */}
            <motion.div
              className="contact-trust"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: 12,
                background: "rgba(201,169,110,0.04)",
                border: "1px solid rgba(201,169,110,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(201,169,110,0.7)" }}>
                  Avg. response: 4 hours
                </span>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>
                Every enquiry gets a real human reply. No chatbots.
              </p>
            </motion.div>
          </div>

          {/* Right — Multi-step Form Wizard */}
          <div>
            <motion.form
              onSubmit={handleSubmit}
              className="contact-form-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(17,17,20,0.7)",
                padding: "1.5rem",
              }}
            >
              {/* Step progress bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: "1.5rem" }}>
                {steps.map((s, i) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
                    <div
                      onClick={() => { if (i < step) { setDirection(i < step ? -1 : 1); setStep(i); } }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        cursor: i <= step ? "pointer" : "default",
                        opacity: i <= step ? 1 : 0.35,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          background: i <= step ? "linear-gradient(135deg, #c9a96e, #d4b883)" : "rgba(255,255,255,0.04)",
                          color: i <= step ? "#09090b" : "rgba(255,255,255,0.3)",
                          border: i <= step ? "none" : "1px solid rgba(255,255,255,0.08)",
                          transition: "all 0.3s",
                          boxShadow: i === step ? "0 0 12px rgba(201,169,110,0.3)" : "none",
                        }}
                      >
                        {i < step ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span style={{ fontSize: 9, color: i <= step ? "rgba(201,169,110,0.8)" : "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: "0.05em" }}>
                        {s.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{
                        width: 32,
                        height: 1,
                        marginLeft: 6,
                        marginRight: 6,
                        marginBottom: 16,
                        background: i < step ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.06)",
                        transition: "background 0.3s",
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step content with AnimatePresence */}
              <div style={{ minHeight: 140, position: "relative", overflow: "hidden" }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {step === 0 && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem" }}>
                          Your Details
                        </div>
                        <div className="form-row-2">
                          <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required className="contact-input input-glow" style={inputStyle} />
                          <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="contact-input input-glow" style={inputStyle} />
                        </div>
                        <input type="text" name="company" placeholder="Company (optional)" value={form.company} onChange={handleChange} className="contact-input input-glow" style={{ ...inputStyle, marginTop: "0.75rem" }} />
                      </div>
                    )}

                    {step === 1 && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem" }}>
                          What do you need?
                        </div>
                        <select name="service" value={form.service} onChange={handleChange} required className="contact-input input-glow" style={{ ...inputStyle, appearance: "none" }}>
                          <option value="" disabled>Select a service</option>
                          <option value="web">Web Development</option>
                          <option value="cloud">Cloud & AI Solutions</option>
                          <option value="chatbot">Custom Chatbots</option>
                          <option value="app">App Development</option>
                          <option value="marketing">Digital Marketing & SEO</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem" }}>
                          Your Budget Range
                        </div>
                        <select name="budget" value={form.budget} onChange={handleChange} className="contact-input input-glow" style={{ ...inputStyle, appearance: "none" }}>
                          <option value="" disabled>Budget (optional)</option>
                          <option value="<50k">Under ₹50,000</option>
                          <option value="50k-150k">₹50K – ₹1.5L</option>
                          <option value="150k-500k">₹1.5L – ₹5L</option>
                          <option value="500k+">₹5,00,000+</option>
                        </select>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem" }}>
                          Tell us about your project
                        </div>
                        <textarea name="message" placeholder="Describe your project, goals, and timeline..." value={form.message} onChange={handleChange} required rows={4} className="contact-input input-glow" style={{ ...inputStyle, resize: "none" }} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", gap: "0.75rem" }}>
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    style={{
                      padding: "0.6rem 1.25rem",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  >
                    ← Back
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    style={{
                      padding: "0.6rem 1.5rem",
                      borderRadius: 10,
                      border: "none",
                      background: canProceed() ? "linear-gradient(135deg, #c9a96e, #d4b883)" : "rgba(255,255,255,0.06)",
                      color: canProceed() ? "#09090b" : "rgba(255,255,255,0.2)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: canProceed() ? "pointer" : "not-allowed",
                      transition: "all 0.3s",
                      boxShadow: canProceed() ? "0 4px 12px rgba(201,169,110,0.2)" : "none",
                    }}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-ripple"
                    style={{
                      padding: "0.7rem 2rem",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #c9a96e, #d4b883)",
                      color: "#09090b",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                      cursor: status === "sending" ? "not-allowed" : "pointer",
                      opacity: status === "sending" ? 0.5 : 1,
                      transition: "all 0.4s",
                      boxShadow: "0 4px 16px rgba(201,169,110,0.2)",
                    }}
                  >
                    {status === "sending"
                      ? "Sending..."
                      : status === "success"
                      ? "Sent Successfully!"
                      : status === "error"
                      ? "Failed — try again"
                      : "Send Enquiry"}
                  </button>
                )}
              </div>

              {status === "success" && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                    marginTop: "0.5rem",
                    marginBottom: 0,
                  }}
                >
                  Thank you! We&apos;ll get back shortly.
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 2rem;
          align-items: start;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
        .contact-input:focus {
          border-color: rgba(201, 169, 110, 0.3) !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .contact-input::placeholder {
          color: rgba(255, 255, 255, 0.18);
        }
        .contact-input option {
          background: #111114;
          color: #ffffff;
        }
        .contact-info-item:hover {
          border-color: rgba(201, 169, 110, 0.12) !important;
          background: rgba(201, 169, 110, 0.03) !important;
        }
        .contact-info-item:hover .contact-icon-box {
          background: rgba(201, 169, 110, 0.1) !important;
          color: rgba(201, 169, 110, 0.8) !important;
        }
      `}</style>
    </section>
  );
}
