"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import { clients } from "@/data/clients";
import { useLanguage } from "@/context/LanguageContext";

const AUTOPLAY_INTERVAL = 2800; // ms between auto-advances
const ACTIVE_WIDTH = 220;
const IDLE_WIDTH = 60;
const CARD_HEIGHT = 150;

// ================= 3D BACKGROUND MOVING BOXES (ՔԱՌԱԿՈՒՍԻՆԵՐ) =================
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

// ================= MOUSE PARALLAX & CAMERA CONTROLLER =================
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

// ================= MAIN COMPONENT =================
export function ClientsExperience() {
  const { language, t } = useLanguage();
  const pp = t.partners;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const toPrev = useCallback(() => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev === 0 ? clients.length - 1 : prev - 1));
  }, [isAnimating]);

  const toNext = useCallback(() => {
    if (isAnimating) return;
    setActiveIndex((prev) => (prev === clients.length - 1 ? 0 : prev + 1));
  }, [isAnimating]);

  const toSlide = (index: number) => {
    if (isAnimating) return;
    setActiveIndex(index);
  };

  // Autoplay: advances automatically, loops, pauses on hover
  useEffect(() => {
    if (isPaused) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev === clients.length - 1 ? 0 : prev + 1));
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F0F0F0] overflow-hidden">

      {/* 3D Canvas — background boxes stay fully visible */}
      <Canvas
        camera={{ position: [0, 3.2, 13.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 12, 8]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, 6, 3]} intensity={0.5} color="#00c050" />

        {/* Ֆոնի շարժվող քառակուսիներ */}
        <BackgroundBoxes />

        {/* Մկնիկի շարժման (Parallax) և տեսախցիկի կառավարում */}
        <SceneController />
      </Canvas>

      {/* Section Header */}
      <div className="absolute top-12 left-0 right-0 z-20 text-center px-6 pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          {pp?.clientsTitle?.[language] || "Our Trusted"}{" "}
          <span className="text-[#00c050]">
            {pp?.clientsSubtitle?.[language] || "Clients"}
          </span>
        </h2>
      </div>

      {/* Tilt Stack Carousel — sits above the 3D scene, transparent cards so boxes show through */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-10 px-6 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative"
          style={{ width: ACTIVE_WIDTH, height: CARD_HEIGHT }}
        >
          <motion.div
            className="flex w-fit"
            initial={false}
            animate={{ x: -(IDLE_WIDTH * activeIndex) }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
          >
            {clients.map((client, i) => {
              const isActive = activeIndex === i;
              const dir = i < activeIndex ? 1 : i > activeIndex ? -1 : 0;
              const rotateY = dir * 55;
              const rotateZ = dir * 8;

              return (
                <div
                  key={client.name}
                  style={{
                    perspective: 1000,
                    zIndex: clients.length - Math.abs(activeIndex - i),
                  }}
                >
                  <motion.div
                    onClick={() => toSlide(i)}
                    className="
                      group
                      shrink-0
                      flex items-center justify-center
                      relative
                      will-change-transform
                      rounded-2xl
                      bg-black/40
                      backdrop-blur-xl
                      border border-white/10
                      shadow-2xl shadow-black/60
                      overflow-hidden
                      cursor-pointer
                      hover:bg-black/55
                      hover:border-[#00c050]/50
                      transition-colors
                    "
                    style={{ height: CARD_HEIGHT }}
                    animate={{
                      rotateY,
                      rotateZ,
                      width: isActive ? ACTIVE_WIDTH : IDLE_WIDTH,
                    }}
                    transition={{
                      type: "tween",
                      duration: 0.8,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                    initial={false}
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      className={`max-h-[65%] max-w-[75%] object-contain transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-60"
                      }`}
                    />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Active-card accent frame */}
          <motion.div
            key={activeIndex}
            className="pointer-events-none absolute inset-0 m-auto rounded-2xl border-2 border-[#00c050]/60"
            style={{
              width: ACTIVE_WIDTH,
              height: CARD_HEIGHT,
              boxSizing: "content-box",
            }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 px-3 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
          <button
            onClick={toPrev}
            className="p-2 rounded-full text-white/70 hover:text-[#00c050] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {clients.map((_, i) => (
              <button
                key={i}
                onClick={() => toSlide(i)}
                className={`rounded-full h-1.5 transition-all duration-300 ${
                  activeIndex === i ? "w-6 bg-[#00c050]" : "w-1.5 bg-white/30"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={toNext}
            className="p-2 rounded-full text-white/70 hover:text-[#00c050] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}