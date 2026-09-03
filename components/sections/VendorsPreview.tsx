"use client";

import { useEffect, useState, useCallback, ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe2,
  Cpu,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { BlurReveal } from "@/components/ui/TextReveal";
import { vendors } from "@/data/vendors";
import { useLanguage } from "@/context/LanguageContext";

// Three.js Particles Component
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const { pointer } = useThree();

  const [particleTexture, setParticleTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(32, 32, 28, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    setParticleTexture(texture);
  }, []);

  const count = 3000;
  const [geometry] = useState(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      vertices[i] = 2000 * Math.random() - 1000;
      vertices[i + 1] = 2000 * Math.random() - 1000;
      vertices[i + 2] = 2000 * Math.random() - 1000;
    }
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return geom;
  });

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;

    const targetRotationX = pointer.y * 0.5;
    const targetRotationY = pointer.x * 0.5;

    pointsRef.current.rotation.x += (targetRotationX - pointsRef.current.rotation.x) * 0.05;
    pointsRef.current.rotation.y += (targetRotationY - pointsRef.current.rotation.y) * 0.05;

    const time = state.clock.getElapsedTime() * 0.05;
    const h = 0.33; 
    const s = 0.2 + Math.sin(time * 2) * 0.15; 
    const l = 0.4 + Math.cos(time * 3) * 0.2; 
    materialRef.current.color.setHSL(h, s, l);
  });

  if (!particleTexture) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={25}
        sizeAttenuation={true}
        map={particleTexture}
        alphaTest={0.5}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
}

export function NeuralScene() {
  return <ParticleField />;
}

const NeuralCanvas = dynamic(
  () =>
    Promise.resolve(() => (
      <div className="absolute inset-0 pointer-events-none -z-10 h-full w-full">
        <Canvas camera={{ position: [0, 0, 1000], fov: 55, near: 2, far: 2000 }}>
          <NeuralScene />
        </Canvas>
      </div>
    )),
  { ssr: false }
);

const CARD_WIDTH = 300;
const IDLE_WIDTH = 90;
const OFFSET_X = 90;

// Individual 3D Floating Vendor Card Component using Motion Values & rAF
function FloatingVendorCard({
  vendor,
  isActive,
  distance,
  xOffset,
  rotateY,
  scale,
  opacity,
  onClick,
  onAnimationStart,
  onAnimationComplete,
}: {
  vendor: typeof vendors[0];
  isActive: boolean;
  distance: number;
  xOffset: number;
  rotateY: number;
  scale: number;
  opacity: number;
  onClick: () => void;
  onAnimationStart: () => void;
  onAnimationComplete: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth physics-based mouse interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt & rotation reactions
  const springConfig = { damping: 25, stiffness: 150 };
  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  // Dynamic Layer Transforms using translateZ
  const glowZ = useSpring(isActive ? 30 : 10, springConfig);
  const glassZ = useSpring(isActive ? 50 : 20, springConfig);
  const logoZ = useSpring(isActive ? 80 : 35, springConfig);
  const reflectionZ = useSpring(isActive ? 65 : 25, springConfig);

  // Dynamic Shadow & Glow intensities based on hover/active state
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    
    // Normalize mouse position between -0.5 and 0.5 relative to card center
    const normalizedX = (e.clientX - centerX) / width;
    const normalizedY = (e.clientY - centerY) / height;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute cursor-pointer"
      style={{
        zIndex: vendors.length - Math.abs(distance),
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      initial={false}
      animate={{
        x: xOffset,
        rotateY: rotateY,
        scale: scale,
        opacity: opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
      }}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="h-[340px] rounded-3xl relative will-change-transform flex flex-col items-center justify-center"
        style={{
          width: isActive ? CARD_WIDTH : IDLE_WIDTH,
          transformStyle: "preserve-3d",
          rotateX: cardRotateX,
          rotateY: cardRotateY,
        }}
        // Continuous subtle breathing / floating idle animation
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5 + Math.abs(distance * 0.5),
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* LAYER 1: Subtle Shadow Underneath */}
        <motion.div 
          className="absolute inset-x-4 -bottom-4 h-8 rounded-full bg-black/30 blur-xl pointer-events-none -z-20"
          animate={{
            opacity: isHovered ? 0.45 : 0.2,
            scale: isHovered ? 1.05 : 0.95,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* LAYER 2: Dynamic Glow Layer */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-teal-400/30 blur-xl pointer-events-none -z-10"
          style={{ zIndex: glowZ }}
          animate={{
            opacity: isHovered ? 0.8 : isActive ? 0.4 : 0.1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* LAYER 3: Premium Glass Card Base */}
        <motion.div
          className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden flex flex-col"
          style={{
            zIndex: glassZ,
            boxShadow: isHovered 
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.25)" 
              : "0 10px 30px -10px rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* LAYER 4: Glass Reflections (Specular sheen overlay) */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
            style={{
              zIndex: reflectionZ,
              transform: useTransform(mouseX, [-0.5, 0.5], ["-30%", "30%"]),
            }}
          />

          {/* LAYER 5: Logo Area with Parallax Effect */}
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50/40 via-white/60 to-zinc-50/50 overflow-hidden rounded-t-3xl relative">
            <motion.img
              src={vendor.logo}
              alt={vendor.name}
              className="max-h-20 max-w-full object-contain pointer-events-none drop-shadow-md"
              style={{
                z: logoZ,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function VendorsPreview() {
  const { language, t } = useLanguage();
  const vp = (t as any).vendorsPreview || {};

  const [currentIndex, setCurrentIndex] = useState(2);
  const [paused, setPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = vendors.length;

  const next = useCallback(() => {
    if (isAnimating) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total, isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total, isAnimating]);

  const toSlide = (index: number) => {
    if (isAnimating) return;
    setCurrentIndex(index);
  };

  // Auto-play interval
  useEffect(() => {
    if (paused || total === 0) return;
    const timer = setInterval(() => {
      next();
    }, 2500);
    return () => clearInterval(timer);
  }, [paused, total, next]);

  return (
    <section className="relative overflow-hidden py-28 md:py-36 select-none w-full">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-zinc-50 to-white" />
      <div className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-200/20 blur-[120px]" />

      {/* 3D NEURAL CANVAS */}
      <NeuralCanvas />

      <div className="w-full px-4 sm:px-6 lg:px-12 relative z-10">
        {/* HEADER */}
        <BlurReveal>
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">{vp.eyebrow[language]}</span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-black md:text-6xl ">
              {vp.mainTitle[language]}
            </h2>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#00c050] md:text-6xl ">
               {vp.minititleTwo[language]}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
              {vp.mainDescription[language]}
            </p>
          </div>
        </BlurReveal>

        {/* FEATURE CARDS */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
          <FeatureCard
            icon={<Globe2 />}
            title={vp.features.directAccess.title[language]}
            text={vp.features.directAccess.text[language]}
            badge={vp.features.badgeText[language]}
          />
          <FeatureCard
            icon={<Award />}
            title={vp.features.certifiedExperts.title[language]}
            text={vp.features.certifiedExperts.text[language]}
            badge={vp.features.badgeText[language]}
          />
          <FeatureCard
            icon={<Cpu />}
            title={vp.features.completePortfolio.title[language]}
            text={vp.features.completePortfolio.text[language]}
            badge={vp.features.badgeText[language]}
          />
        </div>

        {/* PARTNER TITLE */}
        <BlurReveal delay={0.2}>
          <div className="mt-28 text-center">
            <span className="eyebrow text-bleck font-bold">{vp.partnersTitle[language]}</span>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-bleck font-bold">
              {vp.partnersDescription[language]}
            </p>
          </div>
        </BlurReveal>

        {/* FULL WIDTH CAROUSEL CONTAINER */}
        <BlurReveal delay={0.3}>
          <div
            className="relative mt-16 flex flex-col items-center justify-center py-10 w-full overflow-hidden bg-white"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {/* Carousel Wrapper */}
            <div 
              className="relative w-full max-w-4xl flex justify-center items-center py-12 overflow-visible"
              style={{ perspective: "1200px" }}
            >
              {/* Slides Container */}
              <div className="relative flex items-center justify-center w-full h-[360px]">
                {vendors.map((vendor, i) => {
                  const distance = i - currentIndex;
                  const isActive = distance === 0;

                  let xOffset = distance * OFFSET_X;
                  if (distance > 0) xOffset = (CARD_WIDTH / 2) + (distance - 1) * OFFSET_X;
                  if (distance < 0) xOffset = -(CARD_WIDTH / 2) + (distance + 1) * OFFSET_X;

                  const rotateY = distance < 0 ? 50 : distance > 0 ? -50 : 0;
                  const scale = isActive ? 1 : 0.85;
                  const opacity = Math.abs(distance) > 4 ? 0 : 1 - Math.abs(distance) * 0.18;

                  return (
                    <FloatingVendorCard
                      key={vendor.name}
                      vendor={vendor}
                      isActive={isActive}
                      distance={distance}
                      xOffset={xOffset}
                      rotateY={rotateY}
                      scale={scale}
                      opacity={opacity}
                      onClick={() => toSlide(i)}
                      onAnimationStart={() => setIsAnimating(true)}
                      onAnimationComplete={() => setIsAnimating(false)}
                    />
                  );
                })}
              </div>

              {/* Active Slide Frame Highlight */}
              <motion.div
                key={currentIndex}
                className="absolute inset-0 m-auto h-[356px] border-2 border-emerald-500/60 rounded-[28px] pointer-events-none z-50"
                style={{ width: CARD_WIDTH + 16, boxSizing: "content-box" }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>

            {/* CONTROLS */}
            <div className="mt-10 flex items-center gap-4 justify-center text-neutral-700 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 border border-zinc-200 shadow-lg z-50">
              <button onClick={prev} className="p-2 cursor-pointer transition hover:text-emerald-600">
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="w-[180px] flex justify-center items-center gap-2">
                {vendors.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => toSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`rounded-full cursor-pointer h-2 transition-all duration-300 ${
                      currentIndex === i ? "w-8 bg-emerald-500" : "w-2 bg-zinc-300"
                    }`}
                  />
                ))}
              </div>

              <button onClick={next} className="p-2 cursor-pointer transition hover:text-emerald-600">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  badge,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  badge: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#00c050]">
        {icon}
      </div>
      <h4 className="mt-6 text-xl font-bold text-black">{title}</h4>
      <p className="mt-4 leading-7 text-zinc-600">{text}</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-semibold  text-[#00c050]">
        <CheckCircle2 className="h-4 w-4 text-[#00c050]" />
        {badge}
      </div>
    </motion.div>
  );
}