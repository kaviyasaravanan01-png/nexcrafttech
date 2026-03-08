"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
      springProgress.set(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [springProgress]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          background: "linear-gradient(90deg, #c9a96e, #e8d5b0, #c9a96e)",
          transformOrigin: "left",
          scaleX: springProgress,
          boxShadow: "0 0 10px rgba(201,169,110,0.5)",
        }}
      />
    </motion.div>
  );
}
