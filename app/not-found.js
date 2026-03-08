"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const floatingChars = ["4", "0", "4", "N", "E", "X"];

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        position: "relative",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      {/* Floating background characters */}
      {floatingChars.map((char, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.03,
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 30 - 15, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: i * 0.15 },
            x: { duration: 6 + i, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 5 + i, repeat: Infinity, repeatType: "reverse" },
          }}
          style={{
            position: "absolute",
            fontSize: `${100 + i * 30}px`,
            fontWeight: 900,
            color: "#c9a96e",
            top: `${15 + i * 12}%`,
            left: `${10 + i * 14}%`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {char}
        </motion.div>
      ))}

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: "transform 0.3s ease-out",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        {/* 404 number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            style={{
              fontSize: "clamp(6rem, 18vw, 12rem)",
              fontWeight: 900,
              lineHeight: 1,
              margin: 0,
              background: "linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.05) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.04em",
              transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          style={{
            width: 60,
            height: 2,
            background: "linear-gradient(90deg, #c9a96e, #e8d5b0)",
            borderRadius: 1,
            margin: "1rem auto",
            transformOrigin: "center",
          }}
        />

        {/* Text */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
            fontWeight: 600,
            color: "#ffffff",
            marginBottom: "0.5rem",
          }}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 14,
            maxWidth: 400,
            margin: "0 auto 2rem",
            lineHeight: 1.7,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #c9a96e, #d4b883)",
              color: "#09090b",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(201,169,110,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(17,17,20,0.5)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
              e.currentTarget.style.color = "#c9a96e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            Read Our Blog
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom grid pattern */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(to top, rgba(201,169,110,0.02) 0%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
