"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const services3D = [
  {
    id: "web",
    title: "Website Development",
    desc: "Fast, responsive websites built with Next.js, React, and Tailwind. From landing pages to complex platforms.",
    price: "₹6,000",
    color: "#6366f1",
    icon: "globe",
    features: ["Next.js / React", "Responsive Design", "SEO Optimized", "Fast Loading"],
  },
  {
    id: "seo",
    title: "SEO & Marketing",
    desc: "Get found on Google. Technical SEO, content strategy, and analytics-driven campaigns.",
    price: "₹4,000/mo",
    color: "#f97316",
    icon: "chart",
    features: ["Keyword Strategy", "On-Page SEO", "Analytics", "Content Plan"],
  },
  {
    id: "ai",
    title: "AI Chatbots",
    desc: "Smart chatbots for WhatsApp and website that automate support and generate leads 24/7.",
    price: "₹5,000",
    color: "#22c55e",
    icon: "bot",
    features: ["GPT-Powered", "WhatsApp Integration", "Lead Capture", "24/7 Active"],
  },
  {
    id: "cloud",
    title: "Cloud & AI",
    desc: "Cloud infrastructure, data pipelines, and AI-powered workflows on GCP and AWS.",
    price: "₹15,000",
    color: "#06b6d4",
    icon: "cloud",
    features: ["GCP / AWS", "Data Pipelines", "ML Models", "Auto Scaling"],
  },
  {
    id: "app",
    title: "App Development",
    desc: "Cross-platform mobile apps with React Native. One codebase, every device.",
    price: "₹10,000",
    color: "#ec4899",
    icon: "phone",
    features: ["React Native", "iOS + Android", "Push Notifications", "Offline Support"],
  },
  {
    id: "maintenance",
    title: "Maintenance",
    desc: "Bug fixes, updates, security patches, and uptime monitoring. We keep things running.",
    price: "₹2,000/mo",
    color: "#eab308",
    icon: "wrench",
    features: ["Bug Fixes", "Security Patches", "Monitoring", "Content Updates"],
  },
];

/* ─── 3D Shapes for each service ─── */

function GlobeShape({ color }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <MeshDistortMaterial color={color} distort={0.25} speed={2} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Wireframe ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.02, 16, 64]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.8, 0.015, 16, 64]} />
        <meshStandardMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </Float>
  );
}

function ChartShape({ color }) {
  const groupRef = useRef();
  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  const heights = [0.6, 1.0, 0.8, 1.4, 1.1];
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {heights.map((h, i) => (
          <mesh key={i} position={[(i - 2) * 0.5, h / 2 - 0.5, 0]}>
            <boxGeometry args={[0.35, h, 0.35]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.5 + (i * 0.1)}
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
        ))}
        {/* Arrow */}
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function BotShape({ color }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
  });
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={meshRef}>
        {/* Head */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1, 0.9, 0.8]} />
          <MeshWobbleMaterial color={color} factor={0.1} speed={1} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.25, 0.5, 0.41]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.25, 0.5, 0.41]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Body */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.6]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} transparent opacity={0.8} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function CloudShape({ color }) {
  const groupRef = useRef();
  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={groupRef}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <MeshDistortMaterial color={color} distort={0.15} speed={1.5} roughness={0.3} metalness={0.5} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.65, -0.1, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <MeshDistortMaterial color={color} distort={0.1} speed={1.5} roughness={0.3} metalness={0.5} transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.6, -0.1, 0]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <MeshDistortMaterial color={color} distort={0.12} speed={1.5} roughness={0.3} metalness={0.5} transparent opacity={0.65} />
        </mesh>
        {/* Connection lines */}
        {[[-0.3, -0.8], [0.3, -0.9], [0, -1]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5]} />
            <meshStandardMaterial color={color} transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function PhoneShape({ color }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Phone body */}
        <mesh>
          <boxGeometry args={[0.8, 1.5, 0.08]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.65, 1.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.1} />
        </mesh>
        {/* Notch */}
        <mesh position={[0, 0.6, 0.05]}>
          <boxGeometry args={[0.25, 0.06, 0.01]} />
          <meshStandardMaterial color="#0a0a0f" />
        </mesh>
      </group>
    </Float>
  );
}

function WrenchShape({ color }) {
  const groupRef = useRef();
  useFrame((state) => {
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Gear */}
        <mesh>
          <torusGeometry args={[0.8, 0.15, 8, 6]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.5, 0.08, 8, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} transparent opacity={0.6} />
        </mesh>
        {/* Center */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
        {/* Bolts */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <mesh key={i} position={[Math.cos(rad) * 0.8, Math.sin(rad) * 0.8, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

const shapeMap = {
  globe: GlobeShape,
  chart: ChartShape,
  bot: BotShape,
  cloud: CloudShape,
  phone: PhoneShape,
  wrench: WrenchShape,
};

function Scene3D({ icon, color }) {
  const ShapeComponent = shapeMap[icon];
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, -3, 2]} intensity={0.4} color={color} />
      <pointLight position={[3, 3, 2]} intensity={0.3} color={color} />
      <Suspense fallback={null}>
        <ShapeComponent color={color} />
      </Suspense>
    </Canvas>
  );
}

export default function ServiceShowcase() {
  const sectionRef = useRef(null);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".showcase-divider",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger: ".showcase-divider", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".showcase-badge",
        { scale: 0, rotation: -10 },
        {
          scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2)",
          scrollTrigger: { trigger: ".showcase-badge", start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const active = services3D[activeService];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      style={{ padding: "5rem 1.5rem", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${active.color}08 0%, transparent 70%)`,
        pointerEvents: "none", transition: "background 0.5s",
      }} />

      <div style={{ maxWidth: "64rem", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="showcase-badge" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 100,
              background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)",
              marginBottom: "1rem",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: "#c9a96e", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Interactive Showcase
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
            Explore Our{" "}
            <span className="gradient-text-static">Services in 3D</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: "28rem", margin: "0 auto" }}
          >
            Click each service to see interactive 3D visuals and details.
          </motion.p>

          <div className="showcase-divider" style={{
            width: "4rem", height: 1,
            background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            margin: "1.5rem auto 0", transformOrigin: "center",
          }} />
        </div>

        {/* Main showcase area */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Service selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {services3D.map((service, i) => (
              <motion.button
                key={service.id}
                onClick={() => setActiveService(i)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 10,
                  background: activeService === i ? `${service.color}12` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${activeService === i ? `${service.color}30` : "rgba(255,255,255,0.04)"}`,
                  cursor: "pointer", textAlign: "left", outline: "none",
                  transition: "all 0.3s",
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: activeService === i ? service.color : "rgba(255,255,255,0.15)",
                  boxShadow: activeService === i ? `0 0 8px ${service.color}60` : "none",
                  transition: "all 0.3s", flexShrink: 0,
                }} />
                <div>
                  <div style={{
                    fontSize: 12.5, fontWeight: 600,
                    color: activeService === i ? "#fff" : "rgba(255,255,255,0.5)",
                    transition: "color 0.3s",
                  }}>
                    {service.title}
                  </div>
                  <div style={{
                    fontSize: 10.5,
                    color: activeService === i ? service.color : "rgba(255,255,255,0.2)",
                    fontWeight: 600, transition: "color 0.3s",
                  }}>
                    from {service.price}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 3D Canvas + Details */}
          <div style={{
            borderRadius: 16,
            background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}>
            {/* 3D Scene */}
            <div style={{
              height: 280, position: "relative",
              background: `radial-gradient(ellipse at center, ${active.color}08 0%, transparent 70%)`,
              transition: "background 0.5s",
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Scene3D icon={active.icon} color={active.color} />
                </motion.div>
              </AnimatePresence>

              {/* Subtle grid overlay */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                opacity: 0.5,
              }} />
            </div>

            {/* Service Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                style={{ padding: "1.25rem 1.5rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
                    {active.title}
                  </h3>
                  <span style={{
                    padding: "4px 12px", borderRadius: 100,
                    fontSize: 12, fontWeight: 700, color: active.color,
                    background: `${active.color}12`, border: `1px solid ${active.color}25`,
                  }}>
                    {active.price}
                  </span>
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", marginBottom: "1rem" }}>
                  {active.desc}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {active.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4,
                        background: `${active.color}15`, border: `1px solid ${active.color}25`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={active.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03, boxShadow: `0 0 24px ${active.color}30` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "9px 20px", borderRadius: 100, marginTop: "1rem",
                    background: `linear-gradient(135deg, ${active.color}, ${active.color}cc)`,
                    color: "#fff", fontSize: 11.5, fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    textDecoration: "none",
                    boxShadow: `0 4px 16px ${active.color}25`,
                  }}
                >
                  Get Started
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          #showcase > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
