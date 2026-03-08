"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Gold-tinted floating particles ─── */
function FloatingParticles({ count = 600 }) {
  const mesh = useRef();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      sz[i] = Math.random() * 0.04 + 0.01;
    }
    return [pos, sz];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const arr = mesh.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += Math.sin(time * 0.15 + i * 0.1) * 0.002;
      arr[i3] += Math.cos(time * 0.1 + i * 0.05) * 0.001;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = state.pointer.x * 0.06;
    mesh.current.rotation.x = state.pointer.y * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#d4b883"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Orbiting rings — gold, silver, white ─── */
function OrbitRing({ radius, speed, color, opacity = 0.2, lineWidth }) {
  const ref = useRef();

  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.65, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(150);
    return new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
  }, [radius]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.PI * 0.35 + Math.sin(t * speed * 0.3) * 0.08;
    ref.current.rotation.y = t * speed;
    ref.current.rotation.z = Math.sin(t * speed * 0.5) * 0.04;
    ref.current.position.y = Math.sin(t * 0.15) * 0.3;
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

/* ─── Glowing central orb — icosahedron wireframe ─── */
function CentralOrb() {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 0.4) * 0.06);
    ref.current.rotation.y = t * 0.1;
    ref.current.rotation.x = t * 0.05;
    ref.current.position.x = state.pointer.x * 0.3;
    ref.current.position.y = Math.sin(t * 0.25) * 0.2 + state.pointer.y * 0.2;
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshBasicMaterial color="#c9a96e" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[2.1, 1]} />
        <meshBasicMaterial color="#a8a8b3" wireframe transparent opacity={0.08} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.8, 3]} />
        <meshBasicMaterial color="#e8d5b0" wireframe transparent opacity={0.2} />
      </mesh>
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#c9a96e" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* ─── Ambient light beams ─── */
function LightBeam({ position, rotation, color }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = rotation + Math.sin(t * 0.2) * 0.1;
    ref.current.material.opacity = 0.03 + Math.sin(t * 0.3 + rotation) * 0.015;
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.1, 20]} />
      <meshBasicMaterial color={color} transparent opacity={0.03} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "auto" }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#09090b"]} />
      <FloatingParticles count={600} />
      <CentralOrb />
      <OrbitRing radius={3.5} speed={0.15} color="#c9a96e" opacity={0.2} />
      <OrbitRing radius={5} speed={-0.09} color="#a8a8b3" opacity={0.15} />
      <OrbitRing radius={6.5} speed={0.05} color="#e8d5b0" opacity={0.1} />
      <LightBeam position={[-3, 0, -5]} rotation={0.3} color="#c9a96e" />
      <LightBeam position={[4, 0, -5]} rotation={-0.4} color="#a8a8b3" />
    </Canvas>
  );
}
