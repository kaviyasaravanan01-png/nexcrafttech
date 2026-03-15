"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "SpaceCrafts",
    slug: "spacecrafts",
    desc: "Interactive website with modern animations & bold visual identity.",
    tags: ["Next.js", "Framer Motion", "Tailwind"],
    url: "https://spacecraftsfurniture.in/",
    color: "#6366f1",
  },
  {
    id: 2,
    title: "Living Fire Australia",
    slug: "living-fire-australia",
    desc: "Premium eCommerce for a leading Australian fireplace brand.",
    tags: ["eCommerce", "Custom Build", "SEO"],
    url: "https://www.livingfire.com.au/",
    color: "#f97316",
  },
  {
    id: 3,
    title: "Blendora Collections",
    slug: "blendora-collections",
    desc: "Elegant fashion storefront with smooth browsing experience.",
    tags: ["Next.js", "Supabase", "Responsive"],
    url: "https://blendoracollections.com/",
    color: "#ec4899",
  },
  {
    id: 4,
    title: "Previzz",
    slug: "previzz",
    desc: "SaaS platform for pre-visualization & project planning.",
    tags: ["React", "Cloud", "Real-time"],
    url: "https://www.previzz.com/",
    color: "#06b6d4",
  },
  {
    id: 5,
    title: "Spark Metal Fabrications",
    slug: "spark-metal-fabrications",
    desc: "Industrial services website with portfolio & enquiry system.",
    tags: ["Custom Build", "SEO", "Lead Gen"],
    url: "https://sparkmetalfabrications.com.au/",
    color: "#eab308",
  },
  {
    id: 6,
    title: "Able Interiors Digital",
    slug: "able-interiors-digital",
    desc: "Interior design studio with immersive visual storytelling.",
    tags: ["Next.js", "Tailwind", "Design"],
    url: "https://ableinteriorsdigitalwebsite.vercel.app/",
    color: "#22c55e",
  },
  {
    id: 7,
    title: "Prompt Library",
    slug: "prompt-library",
    desc: "AI prompt marketplace for Midjourney, ChatGPT, Veo, Gemini & more. Trusted by 400,000+ users.",
    tags: ["Marketplace", "AI Prompts", "Video Tutorials", "Next.js", "SEO"],
    url: "https://promptslibrary-nine.vercel.app/",
    color: "#4f46e5",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.1, 0, 1],
    },
  }),
};

export default function Portfolio() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const [dragConstraint, setDragConstraint] = useState(0);

  // Calculate drag boundaries
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const track = trackRef.current;
      const overflow = track.scrollWidth - track.parentElement.offsetWidth;
      setDragConstraint(overflow > 0 ? -overflow : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".portfolio-divider",
            start: "top 85%",
          },
        }
      );
      gsap.utils.toArray(".portfolio-number").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0, rotation: -15 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(2)",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          }
        );
      });
      gsap.utils.toArray(".portfolio-card-glow").forEach((el) => {
        gsap.to(el, {
          opacity: 0.6,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = useCallback((idx) => {
    setActiveIdx(idx);
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "5rem",
        paddingBottom: "5rem",
      }}
    >
      {/* Top accent line */}
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
          maxWidth: "64rem",
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
            Work We&apos;re{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Proud Of
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
            Real projects. Real results. Click to visit live.
          </p>
        </motion.div>

        {/* Gold divider */}
        <div
          className="portfolio-divider"
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

        {/* Project Carousel */}
        <div style={{ position: "relative" }}>
          {/* Nav arrows */}
          <div className="portfolio-arrows" style={{ position: "absolute", top: "50%", left: -48, transform: "translateY(-50%)", zIndex: 3 }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: activeIdx === 0 ? "rgba(255,255,255,0.03)" : "rgba(201,169,110,0.08)",
                border: `1px solid ${activeIdx === 0 ? "rgba(255,255,255,0.04)" : "rgba(201,169,110,0.15)"}`,
                color: activeIdx === 0 ? "rgba(255,255,255,0.15)" : "#c9a96e",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: activeIdx === 0 ? "default" : "pointer", transition: "all 0.3s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </motion.button>
          </div>
          <div className="portfolio-arrows" style={{ position: "absolute", top: "50%", right: -48, transform: "translateY(-50%)", zIndex: 3 }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollTo(Math.min(projects.length - 1, activeIdx + 1))}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: activeIdx >= projects.length - 1 ? "rgba(255,255,255,0.03)" : "rgba(201,169,110,0.08)",
                border: `1px solid ${activeIdx >= projects.length - 1 ? "rgba(255,255,255,0.04)" : "rgba(201,169,110,0.15)"}`,
                color: activeIdx >= projects.length - 1 ? "rgba(255,255,255,0.15)" : "#c9a96e",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: activeIdx >= projects.length - 1 ? "default" : "pointer", transition: "all 0.3s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </motion.button>
          </div>

          {/* Carousel track */}
          <div style={{ overflow: "hidden", borderRadius: 16 }}>
            <motion.div
              ref={trackRef}
              drag="x"
              dragConstraints={{ left: dragConstraint, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, info) => {
                const cardW = trackRef.current?.firstChild?.offsetWidth || 340;
                const swipeThreshold = cardW / 3;
                if (info.offset.x < -swipeThreshold) {
                  scrollTo(Math.min(projects.length - 1, activeIdx + 1));
                } else if (info.offset.x > swipeThreshold) {
                  scrollTo(Math.max(0, activeIdx - 1));
                }
              }}
              animate={{ x: -(activeIdx * (340 + 20)) }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                display: "flex", gap: 20,
                cursor: "grab", userSelect: "none",
              }}
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  style={{ flex: "0 0 340px", minWidth: 0 }}
                >
              <div
                className="portfolio-card-link"
                style={{
                  display: "block",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(17,17,20,0.7)",
                  transition: "border-color 0.4s, box-shadow 0.4s",
                }}
              >
                {/* Color accent top bar */}
                <div
                  style={{
                    height: 3,
                    background: `linear-gradient(90deg, ${project.color}, ${project.color}80)`,
                    opacity: 0,
                    transition: "opacity 0.4s",
                  }}
                  className="card-accent-bar"
                />

                {/* Card glow on hover */}
                <div
                  className="portfolio-card-glow"
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${project.color}12, transparent 70%)`,
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />

                {/* Content */}
                <div style={{ padding: "1.25rem 1.5rem" }}>
                  {/* Top row: number + tags */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      className="portfolio-number"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#c9a96e",
                        background: "rgba(201,169,110,0.08)",
                        border: "1px solid rgba(201,169,110,0.15)",
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: "2px 8px",
                            borderRadius: 20,
                            fontSize: 10,
                            fontWeight: 500,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="card-title"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#ffffff",
                      margin: "0 0 0.4rem 0",
                      transition: "color 0.4s",
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 13,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {project.desc}
                  </p>

                  {/* Footer: URL + arrow */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "0.75rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: "rgba(255,255,255,0.25)",
                        textDecoration: "none",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#28c840",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                        {project.url.replace("https://", "").replace(/\/$/, "")}
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>

                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="case-study-link"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "rgba(201,169,110,0.5)",
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        transition: "color 0.3s",
                      }}
                    >
                      Case Study
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
            </motion.div>
          </div>

          {/* Dots navigation */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "1.5rem" }}>
            {projects.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => scrollTo(i)}
                animate={{
                  width: i === activeIdx ? 24 : 8,
                  background: i === activeIdx ? "#c9a96e" : "rgba(201,169,110,0.15)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  height: 8, borderRadius: 4, border: "none",
                  cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .portfolio-arrows {
            display: none !important;
          }
        }
        .portfolio-card-link:hover {
          border-color: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(201, 169, 110, 0.04) !important;
        }
        .portfolio-card-link:hover .card-accent-bar {
          opacity: 1 !important;
        }
        .portfolio-card-link:hover .card-title {
          color: #e8d5b0 !important;
        }
        .portfolio-card-link:hover .card-arrow {
          background: rgba(201, 169, 110, 0.1) !important;
          border-color: rgba(201, 169, 110, 0.3) !important;
        }
        .portfolio-card-link:hover .card-arrow svg {
          stroke: #c9a96e !important;
        }
        .portfolio-card-link:hover ~ .case-study-link,
        .case-study-link:hover {
          color: #c9a96e !important;
        }
      `}</style>
    </section>
  );
}
