"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "James Mitchell",
    role: "CEO, Living Fire Australia",
    text: "NexCraft rebuilt our entire eCommerce website. Clean, fast, and exactly what we needed. Sales improved within the first month.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Founder, Blendora Collections",
    text: "The transparency impressed me most. They quoted a price, stuck to it, and delivered on time. Rare in this industry.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Director, Spark Metal Fabrications",
    text: "We needed a website that generates leads. NexCraft delivered that plus Google Business and SEO. Enquiries doubled.",
    rating: 5,
  },
];

const videoTestimonials = [
  {
    name: "James Mitchell",
    role: "CEO, Living Fire Australia",
    embedId: "dQw4w9WgXcQ",
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
    quote: "The results speak for themselves — sales up 40% in month one.",
  },
  {
    name: "Priya Sharma",
    role: "Founder, Blendora Collections",
    embedId: "dQw4w9WgXcQ",
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
    quote: "Transparency and quality — exactly what we needed.",
  },
];

/* ── Carousel Hook ────────────────────────── */
function useCarousel(length, autoplayMs = 5000) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const timer = useRef(null);

  const go = useCallback((idx) => {
    setDir(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => {
    setDir(1);
    setActive((p) => (p + 1) % length);
  }, [length]);

  const prev = useCallback(() => {
    setDir(-1);
    setActive((p) => (p - 1 + length) % length);
  }, [length]);

  // autoplay
  useEffect(() => {
    if (autoplayMs <= 0) return;
    timer.current = setInterval(next, autoplayMs);
    return () => clearInterval(timer.current);
  }, [next, autoplayMs]);

  // pause on interact - restart after 8s
  const pause = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setTimeout(() => {
      timer.current = setInterval(next, autoplayMs);
    }, 8000);
  }, [next, autoplayMs]);

  return { active, dir, go, next, prev, pause };
}

/* ── Slide Variants ───────────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
};

/* ── Nav Button ───────────────────────────── */
function NavBtn({ onClick, children, style: s }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)",
        color: "#c9a96e", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.3s", ...s,
      }}
    >
      {children}
    </motion.button>
  );
}

/* ── Dot Indicators ───────────────────────── */
function Dots({ count, active, onDot }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "1.25rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onDot(i)}
          animate={{
            width: i === active ? 24 : 8,
            background: i === active ? "#c9a96e" : "rgba(201,169,110,0.15)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            height: 8, borderRadius: 4, border: "none", cursor: "pointer",
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── Video Card ───────────────────────────── */
function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: false, amount: 0.6 });

  useEffect(() => {
    if (!isCardInView && playing) setPlaying(false);
  }, [isCardInView, playing]);

  return (
    <div ref={cardRef} style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(17,17,20,0.7)" }}>
      <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.embedId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${video.name} testimonial`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <div
            onClick={() => setPlaying(true)}
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              cursor: "pointer",
              background: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${video.thumbnail}) center/cover`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(201,169,110,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 30px rgba(201,169,110,0.3)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#09090b">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </motion.div>
          </div>
        )}
      </div>
      <div style={{ padding: "1rem 1.25rem" }}>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, fontStyle: "italic", margin: "0 0 0.6rem 0", lineHeight: 1.6 }}>
          &ldquo;{video.quote}&rdquo;
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "rgba(201,169,110,0.8)",
          }}>
            {video.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{video.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{video.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────── */
export default function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  // Text testimonials carousel
  const textCarousel = useCarousel(testimonials.length, 6000);
  // Video carousel
  const videoCarousel = useCarousel(videoTestimonials.length, 0); // no autoplay for videos

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-divider",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger: ".testimonial-divider", start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const t = testimonials[textCarousel.active];

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative", overflow: "hidden",
        paddingTop: "5rem", paddingBottom: "5rem",
        background: "#0c0c0f",
      }}
    >
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 160, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)",
      }} />

      <div style={{ maxWidth: "60rem", marginLeft: "auto", marginRight: "auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#ffffff", margin: 0 }}>
            What Clients{" "}
            <span style={{ background: "linear-gradient(135deg, #c9a96e, #e8d5b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Say
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: "0.5rem", fontWeight: 300 }}>
            Real feedback from real clients.
          </p>
        </motion.div>

        {/* Gold divider */}
        <div className="testimonial-divider" style={{
          width: 48, height: 2,
          background: "linear-gradient(90deg, #c9a96e, #d4b883)",
          borderRadius: 1, marginLeft: "auto", marginRight: "auto",
          marginBottom: "2.5rem", transformOrigin: "center",
        }} />

        {/* ═══ TEXT TESTIMONIALS CAROUSEL ═══ */}
        <div style={{ position: "relative", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
          {/* Nav arrows */}
          <div className="carousel-arrows" style={{ position: "absolute", top: "50%", left: -52, transform: "translateY(-50%)", zIndex: 3 }}>
            <NavBtn onClick={() => { textCarousel.prev(); textCarousel.pause(); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </NavBtn>
          </div>
          <div className="carousel-arrows" style={{ position: "absolute", top: "50%", right: -52, transform: "translateY(-50%)", zIndex: 3 }}>
            <NavBtn onClick={() => { textCarousel.next(); textCarousel.pause(); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </NavBtn>
          </div>

          {/* Slide container */}
          <div style={{ overflow: "hidden", borderRadius: 16, minHeight: 220 }}>
            <AnimatePresence initial={false} custom={textCarousel.dir} mode="wait">
              <motion.div
                key={textCarousel.active}
                custom={textCarousel.dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
                style={{
                  position: "relative", overflow: "hidden", borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(17,17,20,0.7)", padding: "2rem 2.5rem",
                  textAlign: "center",
                }}
              >
                {/* Quote watermark */}
                <div style={{
                  position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                  fontSize: 100, fontFamily: "Georgia, serif", lineHeight: 1,
                  color: "rgba(201,169,110,0.05)", pointerEvents: "none", userSelect: "none",
                }}>
                  &ldquo;
                </div>

                {/* Stars */}
                <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: "1rem" }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <motion.span
                      key={j}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: j * 0.06, duration: 0.3, ease: "backOut" }}
                      style={{ display: "inline-flex" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </motion.span>
                  ))}
                </div>

                {/* Quote text */}
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.8, margin: "0 0 1.5rem 0", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.04)", marginBottom: "1rem", maxWidth: 200, marginLeft: "auto", marginRight: "auto" }} />

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                    background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)",
                    color: "rgba(201,169,110,0.8)", flexShrink: 0,
                  }}>
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{t.name}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <Dots count={testimonials.length} active={textCarousel.active} onDot={(i) => { textCarousel.go(i); textCarousel.pause(); }} />
        </div>

        {/* ═══ VIDEO REVIEWS CAROUSEL ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
          style={{ marginTop: "3.5rem" }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 11, fontWeight: 600, color: "rgba(201,169,110,0.6)",
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Video Reviews
            </div>
          </div>

          <div style={{ position: "relative", maxWidth: "36rem", marginLeft: "auto", marginRight: "auto" }}>
            {/* Nav arrows */}
            <div className="carousel-arrows" style={{ position: "absolute", top: "40%", left: -52, transform: "translateY(-50%)", zIndex: 3 }}>
              <NavBtn onClick={() => { videoCarousel.prev(); videoCarousel.pause(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </NavBtn>
            </div>
            <div className="carousel-arrows" style={{ position: "absolute", top: "40%", right: -52, transform: "translateY(-50%)", zIndex: 3 }}>
              <NavBtn onClick={() => { videoCarousel.next(); videoCarousel.pause(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </NavBtn>
            </div>

            {/* Video slide */}
            <div style={{ overflow: "hidden", borderRadius: 14 }}>
              <AnimatePresence initial={false} custom={videoCarousel.dir} mode="wait">
                <motion.div
                  key={videoCarousel.active}
                  custom={videoCarousel.dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
                >
                  <VideoCard video={videoTestimonials[videoCarousel.active]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <Dots count={videoTestimonials.length} active={videoCarousel.active} onDot={(i) => { videoCarousel.go(i); videoCarousel.pause(); }} />
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .carousel-arrows {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
