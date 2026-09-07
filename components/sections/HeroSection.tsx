"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { TextReveal, BlurReveal } from "@/components/ui/TextReveal";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { LODField } from "../3d/Lodfield ";

gsap.registerPlugin(ScrollTrigger);

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

// ================= HERO SECTION =================
export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const hero = t.hero;

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -120,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      <LODField/>
      {/* 3D Background — ամբողջ section-ով */}
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

      {/* Soft overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/70 via-white/60 to-white/80 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00c050]/10 rounded-full blur-3xl z-[2] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00c050]/10 rounded-full blur-3xl z-[2] pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 section-padding pt-32 pb-20">
        <div className="container-wide text-start max-w-5xl mx-auto">
          <BlurReveal delay={0.2}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00c050]/10 border border-[#00c050]/20 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00c050] animate-pulse" />
              <span className="text-sm font-medium text-[#00c050]">
                {hero.badge[language]}
              </span>
            </div>
          </BlurReveal>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-5 text-balance leading-[1.12] tracking-tight">
            <TextReveal key={language} splitBy="words" delay={0.3}>
              {hero.title[language]}
            </TextReveal>
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00c050] mt-1">
              {hero.badgeSubTilile[language]}
            </span>
          </h1>

          <BlurReveal delay={0.6}>
            <p className="text-lg lg:text-xl text-zinc-600 max-w-2xl mb-10 leading-relaxed">
              {hero.description[language]}
            </p>
          </BlurReveal>

          <Link href="/contact">
            <BlurReveal delay={0.8}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button
                  size="lg"
                  className="group bg-[#00c050] hover:bg-[#00a042] text-white"
                >
                  {hero.ctaPrimary[language]}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </BlurReveal>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-400">
        <span className="text-xs font-medium tracking-widest uppercase">
          {hero.scroll[language]}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}