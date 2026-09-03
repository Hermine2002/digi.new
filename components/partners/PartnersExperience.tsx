"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { partners } from "@/data/partners";
import GalaxyBackground from "@/components/ui/GalaxyBackground";
import { useTranslation } from "@/lib/i18n";
gsap.registerPlugin(ScrollTrigger);
// ─── Galaxy Orbit Configuration ───
const ORBIT_RADIUS_X = 360;
const ORBIT_RADIUS_Z = 240;
const ORBIT_RADIUS_Y = 80;
const LOOPS = 2.5;
const TILT_ANGLE = 0.25;
const EASING = 0.05;

export function PartnersExperience({ lang = "en" }: { lang?: "hy" | "en" | "ru" }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgress = useRef(0);
  const currentRotation = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastActive = useRef(0);
  const total = partners.length;

  const { t } = useTranslation(lang);

  // Scroll Trigger Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Galaxy Animation Loop
  useEffect(() => {
    const tick = () => {
      const targetRotation = scrollProgress.current * Math.PI * 2 * LOOPS;
      currentRotation.current += (targetRotation - currentRotation.current) * EASING;

      let frontIndex = 0;
      let maxDepth = -Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        const phaseOffset = (i / total) * Math.PI * 2;
        const angle = currentRotation.current + phaseOffset;

        const rawX = Math.sin(angle) * ORBIT_RADIUS_X;
        const rawZ = Math.cos(angle) * ORBIT_RADIUS_Z;
        const rawY = Math.sin(i * 1.618) * ORBIT_RADIUS_Y;

        const tiltedY = rawY * Math.cos(TILT_ANGLE) - rawZ * Math.sin(TILT_ANGLE);
        const tiltedZ = rawY * Math.sin(TILT_ANGLE) + rawZ * Math.cos(TILT_ANGLE);

        const depth = tiltedZ;
        const normalizedDepth = (depth + ORBIT_RADIUS_Z) / (ORBIT_RADIUS_Z * 2);

        const scaleCard = 0.5 + normalizedDepth * 0.6;
        const opacity = 0.25 + normalizedDepth * 0.75;
        const blur = (1 - normalizedDepth) * 4;
        const rotateY = Math.sin(angle) * -20;
        const rotateX = Math.cos(angle) * 10;

        if (depth > maxDepth) {
          maxDepth = depth;
          frontIndex = i;
        }

        el.style.transform = `
          translate3d(${rawX}px, ${tiltedY}px, ${tiltedZ}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          scale(${scaleCard})
        `;
        el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        el.style.filter = `blur(${blur}px)`;
        el.style.zIndex = String(Math.round(normalizedDepth * 100));
      });

      if (lastActive.current !== frontIndex) {
        lastActive.current = frontIndex;
        setActiveIndex(frontIndex);
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [total]);

  const active = partners[activeIndex];

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${Math.max(total * 70, 400)}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        {/* Galaxy Background */}
        <GalaxyBackground scrollProgress={scrollProgress} />

        {/* Star Field */}
        <div className="absolute inset-0 pointer-events-none z-[5]">
          <StarField />
        </div>

        {/* Galaxy Card Orbit */}
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ perspective: "1400px" }}>
          <div className="relative" style={{ transformStyle: "preserve-3d", width: 0, height: 0, transform: `rotateX(${TILT_ANGLE * (180 / Math.PI)}deg)` }}>
            {partners.map((partner, i) => (
              <div
                key={partner.name}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`
                  absolute -translate-x-1/2 -translate-y-1/2 w-[180px] h-[130px] rounded-2xl
                  bg-white/95 backdrop-blur-xl border border-zinc-200
                  shadow-[0_8px_32px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.6)]
                  flex items-center justify-center p-5 transition-shadow duration-500
                  ${i === activeIndex ? 'shadow-[0_12px_48px_rgba(16,185,129,0.25),0_0_0_1px_rgba(16,185,129,0.3)]' : ''}
                `}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
                {i === activeIndex && (
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
          <div className="container-x pt-20 md:pt-24 flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-[0.35em] text-emerald-600 font-medium">
              {t("partnersExperience.strategicPartners")}
            </span>

            <h2 className="mt-4 max-w-2xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#000000]">
              {t("partnersExperience.technologyAlliances")}{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-[#00c050]">
                alliances
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-zinc-500">
              {t("partnersExperience.description")}
            </p>
          </div>
        </div>

        {/* Active Label */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              {t("partnersExperience.currentlyViewing")}
            </span>
            <span className="text-2xl md:text-3xl font-bold text-zinc-800 transition-all duration-500">
              {active?.name}
            </span>
          </div>

          {/* Progress Dots */}
          <div className="mt-3 flex gap-2 items-center">
            {partners.map((_, i) => {
              const dist = Math.abs(i - activeIndex);
              const isNear = dist <= 2;
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "w-10 h-2.5 bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : isNear
                        ? "w-2.5 h-2.5 bg-emerald-400/60"
                        : "w-1.5 h-1.5 bg-zinc-300/40"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Vignette Overlays */}
        <div className="absolute inset-0 pointer-events-none z-[15]">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/90 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// StarField Component
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${star.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}