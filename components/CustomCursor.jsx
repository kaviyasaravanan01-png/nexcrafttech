"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 25;
const PARTICLE_COUNT = 40;

export default function CustomCursor() {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trail = useRef([]);
  const particles = useRef([]);
  const rafRef = useRef(null);
  const visible = useRef(false);
  const hovering = useRef(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize trail points
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trail.current.push({ x: -100, y: -100 });
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      visible.current = true;

      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (ringRef.current) ringRef.current.style.opacity = "1";

      // Spawn liquid particles on movement
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 1,
          size: Math.random() * 4 + 2,
        });
      }
      if (particles.current.length > PARTICLE_COUNT) {
        particles.current.splice(0, particles.current.length - PARTICLE_COUNT);
      }
    };

    const onMouseLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onMouseOver = (e) => {
      if (e.target.closest("a, button, [role='button'], input, textarea, select")) {
        hovering.current = true;
        if (dotRef.current) {
          dotRef.current.style.width = "6px";
          dotRef.current.style.height = "6px";
          dotRef.current.style.marginLeft = "-3px";
          dotRef.current.style.marginTop = "-3px";
          dotRef.current.style.background = "#c9a96e";
        }
        if (ringRef.current) {
          ringRef.current.style.width = "56px";
          ringRef.current.style.height = "56px";
          ringRef.current.style.marginLeft = "-28px";
          ringRef.current.style.marginTop = "-28px";
          ringRef.current.style.borderColor = "rgba(201, 169, 110, 0.5)";
        }
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest("a, button, [role='button'], input, textarea, select")) {
        hovering.current = false;
        if (dotRef.current) {
          dotRef.current.style.width = "8px";
          dotRef.current.style.height = "8px";
          dotRef.current.style.marginLeft = "-4px";
          dotRef.current.style.marginTop = "-4px";
          dotRef.current.style.background = "#ffffff";
        }
        if (ringRef.current) {
          ringRef.current.style.width = "40px";
          ringRef.current.style.height = "40px";
          ringRef.current.style.marginLeft = "-20px";
          ringRef.current.style.marginTop = "-20px";
          ringRef.current.style.borderColor = "rgba(201, 169, 110, 0.25)";
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update ring position
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }

      if (visible.current) {
        // Update trail with spring-like follow
        trail.current[0].x += (mouse.current.x - trail.current[0].x) * 0.35;
        trail.current[0].y += (mouse.current.y - trail.current[0].y) * 0.35;
        for (let i = 1; i < TRAIL_LENGTH; i++) {
          const ease = 0.25 - i * 0.006;
          trail.current[i].x += (trail.current[i - 1].x - trail.current[i].x) * Math.max(ease, 0.04);
          trail.current[i].y += (trail.current[i - 1].y - trail.current[i].y) * Math.max(ease, 0.04);
        }

        // Draw liquid trail — thick, smooth, with gradient
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < TRAIL_LENGTH; i++) {
          const t = i / TRAIL_LENGTH;
          const alpha = (1 - t) * 0.35;
          const width = (1 - t) * 14 + 2;
          
          ctx.beginPath();
          ctx.moveTo(trail.current[i - 1].x, trail.current[i - 1].y);

          // Use quadratic curve for smoothness
          if (i < TRAIL_LENGTH - 1) {
            const mx = (trail.current[i].x + trail.current[i + 1].x) / 2;
            const my = (trail.current[i].y + trail.current[i + 1].y) / 2;
            ctx.quadraticCurveTo(trail.current[i].x, trail.current[i].y, mx, my);
          } else {
            ctx.lineTo(trail.current[i].x, trail.current[i].y);
          }

          const goldR = 201, goldG = 169, goldB = 110;
          ctx.strokeStyle = `rgba(${goldR}, ${goldG}, ${goldB}, ${alpha})`;
          ctx.lineWidth = width;
          ctx.stroke();
        }

        // Draw floating particles (liquid splashes)
        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.life -= 0.025;

          if (p.life <= 0) {
            particles.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 169, 110, ${p.life * 0.3})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Canvas for liquid trail */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9997,
          pointerEvents: "none",
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: "50%",
          background: "#ffffff",
          opacity: 0,
          zIndex: 9999,
          pointerEvents: "none",
          transition: "opacity 0.3s, background 0.3s, width 0.3s, height 0.3s, margin 0.3s",
          mixBlendMode: "difference",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          marginLeft: -20,
          marginTop: -20,
          borderRadius: "50%",
          border: "1.5px solid rgba(201, 169, 110, 0.25)",
          opacity: 0,
          zIndex: 9998,
          pointerEvents: "none",
          transition: "opacity 0.3s, border-color 0.4s, width 0.4s, height 0.4s, margin 0.4s",
        }}
      />
    </>
  );
}
