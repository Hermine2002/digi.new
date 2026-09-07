"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";

// ================= 3D BACKGROUND MOVING BOXES =================
function BackgroundBoxes() {
  const groupRef = useRef<THREE.Group>(null);

  const boxes = useRef(
    Array.from({ length: 40 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ),
      scale: 0.6 + Math.random() * 1.2,
    }))
  ).current;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    groupRef.current.rotation.y = t * 0.03;

    groupRef.current.children.forEach((child, i) => {
      const boxData = boxes[i];
      child.rotation.x += boxData.rotationSpeed.x;
      child.rotation.y += boxData.rotationSpeed.y;
    });
  });

  return (
    <group ref={groupRef}>
      {boxes.map((box, i) => (
        <mesh key={i} position={box.position} scale={box.scale}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial
            color="#00c050"
            transparent
            opacity={0.12}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
}

// ================= MOUSE PARALLAX =================
function SceneController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const targetX = mouse.current.x * 1.2;
    const targetY = 3.2 + mouse.current.y * 0.8;

    camera.position.x += (targetX - camera.position.x) * delta * 3;
    camera.position.y += (targetY - camera.position.y) * delta * 3;
    camera.lookAt(0, 0.6, 0);
  });

  return null;
}

// ================= PARTNERS HERO =================
export function PartnersHero() {
  const { language, t } = useLanguage();
  const pp = t.partners;

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white h-full-screen md:h-[50vh] lg:h-[80vh]">
      
      {/* 3D Background — նույն ClientsExperience-ի ֆոնը */}
      <Canvas
        camera={{ position: [0, 3.2, 13.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 12, 8]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, 6, 3]} intensity={0.5} color="#00c050" />

        <BackgroundBoxes />
        <SceneController />
      </Canvas>

      {/* Content */}
      <div className="relative z-10 container-x py-24 md:py-32 p-4">
        <div className="max-w-4xl pl-6 md:pl-16 text-left">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-700 font-medium">
              {pp.eyebrow[language]}
            </span>
          </div>

          <h1 className="mt-8 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-zinc-900">
            {pp.title[language]}{" "}
            <span className="text-[#00c050]">
              {pp.trust[language]}
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg leading-relaxed text-zinc-900 font-semibold">
            {pp.description1[language]}
          </p>

          <div className="mt-8 h-px w-24 bg-gradient-to-r from-emerald-400/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}