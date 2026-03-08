"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: "Anand Sharma",
    role: "Founder & Lead Developer",
    bio: "Full-stack engineer with 3+ years building scalable web apps. Passionate about clean code and delivering real business value.",
    initials: "AS",
    color: "#c9a96e",
    skills: ["Next.js", "React", "Node.js", "AI/ML"],
    socials: { linkedin: "#", github: "#" },
  },
  {
    name: "Priya Mehta",
    role: "UI/UX Designer",
    bio: "Creating pixel-perfect interfaces that users love. Specializes in design systems, motion design, and user research.",
    initials: "PM",
    color: "#d4b883",
    skills: ["Figma", "Motion Design", "User Research", "Design Systems"],
    socials: { linkedin: "#" },
  },
  {
    name: "Rohan Verma",
    role: "Backend & Cloud Engineer",
    bio: "Infrastructure and API specialist. Builds secure, high-performance backends on GCP and AWS with elegant architectures.",
    initials: "RV",
    color: "#e8d5b0",
    skills: ["GCP", "AWS", "Python", "PostgreSQL"],
    socials: { linkedin: "#", github: "#" },
  },
  {
    name: "Neha Kapoor",
    role: "SEO & Marketing Strategist",
    bio: "Data-driven marketer who turns traffic into revenue. Expert in technical SEO, content strategy, and growth analytics.",
    initials: "NK",
    color: "#a8a8b3",
    skills: ["SEO", "Google Ads", "Analytics", "Content Strategy"],
    socials: { linkedin: "#" },
  },
  {
    name: "Arjun Patel",
    role: "AI & Chatbot Developer",
    bio: "Builds intelligent chatbots and automation workflows. From GPT integrations to WhatsApp bots — making AI accessible.",
    initials: "AP",
    color: "#c9a96e",
    skills: ["Python", "LLMs", "WhatsApp API", "NLP"],
    socials: { linkedin: "#", github: "#" },
  },
  {
    name: "Simran Kaur",
    role: "Mobile App Developer",
    bio: "Cross-platform specialist crafting smooth mobile experiences. React Native expert with a passion for performant apps.",
    initials: "SK",
    color: "#d4b883",
    skills: ["React Native", "iOS", "Android", "Firebase"],
    socials: { linkedin: "#" },
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0, 1] },
  }),
};

export default function TeamPageClient() {
  const pageRef = useRef(null);
  const isInView = useInView(pageRef, { once: true, margin: "-60px" });
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".team-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".team-divider", start: "top 90%" },
        }
      );
      gsap.utils.toArray(".team-avatar").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0, rotation: -15 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(2.5)",
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              marginBottom: "2rem",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          <span
            style={{
              display: "inline-block",
              color: "#c9a96e",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Our Team
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#ffffff",
              margin: 0,
            }}
          >
            The People Behind{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NexCraft
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 15,
              marginTop: "0.75rem",
              fontWeight: 300,
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            A small, focused team that ships fast and cares deeply about quality.
          </p>
        </motion.div>

        {/* Gold divider */}
        <div
          className="team-divider"
          style={{
            width: 60,
            height: 2,
            background: "linear-gradient(90deg, #c9a96e, #d4b883)",
            borderRadius: 1,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "3rem",
            transformOrigin: "center",
          }}
        />

        {/* Team grid */}
        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: "relative",
                padding: "2rem 1.5rem",
                borderRadius: 16,
                background:
                  hoveredIdx === i
                    ? "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
                border:
                  hoveredIdx === i
                    ? `1px solid ${member.color}40`
                    : "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
                cursor: "default",
                textAlign: "center",
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                transform: hoveredIdx === i ? "translateY(-6px)" : "translateY(0)",
                boxShadow:
                  hoveredIdx === i
                    ? `0 20px 50px -12px ${member.color}15`
                    : "none",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: 2,
                  background:
                    hoveredIdx === i
                      ? `linear-gradient(90deg, transparent, ${member.color}60, transparent)`
                      : "transparent",
                  transition: "background 0.4s",
                  borderRadius: 1,
                }}
              />

              {/* Avatar */}
              <div
                className="team-avatar"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${member.color}12`,
                  border: `2px solid ${member.color}30`,
                  margin: "0 auto 1rem",
                  transition: "all 0.4s",
                  boxShadow:
                    hoveredIdx === i
                      ? `0 0 24px ${member.color}20`
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: member.color,
                    letterSpacing: "0.05em",
                  }}
                >
                  {member.initials}
                </span>
              </div>

              {/* Name & Role */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 4,
                  transition: "color 0.3s",
                  ...(hoveredIdx === i && { color: "#e8d5b0" }),
                }}
              >
                {member.name}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: member.color,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                  opacity: 0.7,
                }}
              >
                {member.role}
              </p>

              {/* Bio */}
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1rem",
                }}
              >
                {member.bio}
              </p>

              {/* Skills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: 10,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.5)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social links */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {member.socials.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.3)",
                      transition: "all 0.3s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#c9a96e";
                      e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
                      e.currentTarget.style.background = "rgba(201,169,110,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {member.socials.github && (
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.3)",
                      transition: "all 0.3s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#c9a96e";
                      e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
                      e.currentTarget.style.background = "rgba(201,169,110,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
          style={{
            textAlign: "center",
            marginTop: "4rem",
            padding: "2.5rem 2rem",
            borderRadius: 16,
            background: "linear-gradient(145deg, rgba(201,169,110,0.05) 0%, rgba(201,169,110,0.01) 100%)",
            border: "1px solid rgba(201,169,110,0.12)",
          }}
        >
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "0.5rem",
            }}
          >
            Want to join the team?
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              marginBottom: "1.5rem",
              maxWidth: "28rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            We&apos;re always looking for talented people. Drop us a line.
          </p>
          <a
            href="/#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 100,
              background: "linear-gradient(135deg, #c9a96e, #d4b883)",
              color: "#09090b",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.02em",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(201,169,110,0.2)",
              transition: "all 0.4s",
            }}
          >
            Get in Touch
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>

      <style jsx>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
