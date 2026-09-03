"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { BlurReveal } from "@/components/ui/TextReveal";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

const GLOBE_RADIUS = 2.2;

function VortexCore() {
  const vortexRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const particleCount = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const t = Math.random() * Math.PI * 6;
      const radius = GLOBE_RADIUS * (0.3 + Math.random() * 0.8);
      const height = (Math.random() - 0.5) * GLOBE_RADIUS * 2.8;

      pos[i3] = radius * Math.cos(t);
      pos[i3 + 1] = height + Math.sin(t * 3) * 0.4;
      pos[i3 + 2] = radius * Math.sin(t);

      // #00c050 color (RGB: ~0.0, 0.75, 0.31)
      const intensity = Math.random();
      colors[i3] = 0.0;
      colors[i3 + 1] = 0.75 + intensity * 0.2;
      colors[i3 + 2] = 0.31 + intensity * 0.2;
    }
    return { pos, colors };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (vortexRef.current) {
      vortexRef.current.rotation.y = t * 0.25;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.6;
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.y = t * (0.3 + i * 0.1);
        const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.15 + Math.sin(t * 2 + i) * 0.08;
      });
    }
  });

  return (
    <group ref={vortexRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={positions.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <group ref={ringsRef}>
        {[1.4, 1.8, 2.3].map((r, i) => (
          <mesh key={i} rotation={[Math.PI * 0.1 * i, 0, 0]}>
            <torusGeometry args={[r, 0.035, 18, 120]} />
            <meshBasicMaterial color="#00c050" transparent opacity={0.22} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>

      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color="#ffffff" blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function PartnershipIntro() {
  const { language, t } = useLanguage();
  const vp = t.vendors;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#06120E]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/vendors/nano-banana-4a3f646c6da834e1d2b975407464c139-1.png"
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#06120E]/80" />
      </div>

      <div className="container-x relative z-10 py-20">
        <div className="grid items-center gap-16 lg:gap-20 lg:grid-cols-2">
          {/* Left - Content */}
          <BlurReveal>
            <div className="rounded-[32px] border border-[#00c050]/20 bg-white/5 p-10 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,.45)]">
              <span className="inline-flex rounded-full border border-[#00c050]/30 bg-[#00c050]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00c050]">
                {vp.eyebrow[language]}
              </span>
              <h2 className="mt-7 text-4xl font-bold leading-tight text-white md:text-5xl">
                {vp.title1[language]}{" "}
                <span className="text-[#00c050]">
                  {vp.title2[language]}
                </span>
              </h2>
              <p className="mt-6 text-base leading-7 text-white/80">
                {vp.description[language]}
              </p>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-[#00c050]/50 via-[#00c050]/20 to-transparent" />

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#00c050]">
                {vp.deliversLabel[language]}
              </p>

              <ul className="mt-6 space-y-6">
                {vp.deliverables.map((item: any, index: number) => (
                  <li key={index} className="flex gap-4">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#00c050]/40 bg-[#00c050]/10">
                      <div className="h-2 w-2 rounded-full bg-[#00c050] shadow-[0_0_10px_#00c050]" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {item.title[language]}:
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-white/70">
                        {item.text[language]}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </BlurReveal>

          {/* Right - 3D Vortex */}
          <BlurReveal delay={0.15}>
            <div className="relative h-[520px] w-full rounded-[36px] border border-[#00c050]/20 bg-white/5 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,.45)] overflow-hidden">
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }} className="absolute inset-0">
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <VortexCore />
                <Environment preset="night" />
                <OrbitControls 
                  enablePan={false} 
                  enableZoom={true} 
                  minDistance={3} 
                  maxDistance={8} 
                  autoRotate 
                  autoRotateSpeed={0.35}
                />
              </Canvas>

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
            </div>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}