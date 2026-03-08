"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visited = sessionStorage.getItem("nexcraft_visited");
    if (!visited) {
      setShow(true);
      document.body.style.overflow = "hidden";
      sessionStorage.setItem("nexcraft_visited", "1");
      const timer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
      }, 2800);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#09090b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(201,169,110,0.3)",
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 800, color: "#09090b" }}>N</span>
            </div>
          </motion.div>

          {/* NexCraft text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              NexCraft
            </span>
            <span style={{ fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>
              Technologies
            </span>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              width: 120,
              height: 2,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 1,
              overflow: "hidden",
              marginTop: 8,
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.7, duration: 1.8, ease: [0.25, 0.1, 0, 1] }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #c9a96e, #e8d5b0)",
                borderRadius: 1,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
