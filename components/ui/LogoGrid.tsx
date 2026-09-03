"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Logo {
  name: string;
  src: string;
  href?: string;
  scale?: number;
}

interface LogoGridProps {
  logos: Logo[];
  className?: string;
  columns?: number;
  hoverEffect?: boolean;
}

export function LogoGrid({
  logos,
  className,
  columns = 4,
  hoverEffect = true,
}: LogoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const items = gridRef.current!.querySelectorAll(".logo-item");

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
          rotateX: 20,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  const gridCols = {
    2: "grid-cols-2 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid gap-6 lg:gap-8 perspective-[1200px]",
        gridCols[columns as keyof typeof gridCols] || gridCols[4],
        className
      )}
    >
      {logos.map((logo, index) => (
        <div
          key={index}
          className={cn(
            "logo-item",
            "group relative",
            "h-44",
            "rounded-3xl",
            "bg-[#000000]/90",
             "bg-transparent/30",
            "border border-emerald-500/40",
            "backdrop-blur-xl",
            "shadow-xl shadow-black/30",
            "flex items-center justify-center overflow-hidden",
            "transition-all duration-700",
            hoverEffect && [
              "hover:-translate-y-4",
              "hover:bg-[#00c050]",
              "hover:bg-translate/50",
              "hover:border-emerald-200/20",
              "hover:shadow-[0_20px_60px_rgba(16,185,129,0.25)]",
            ]
          )}
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-green-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-emerald-400/30 transition-all duration-500" />

          {/* Logo */}
          <div className="relative flex items-center justify-center w-full h-full px-8 z-10">
            <div
              style={{
                transform: `scale(${logo.scale ?? 1})`,
                transition: "transform 0.5s ease",
              }}
              className="group-hover:scale-105"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={80}
                className="w-auto h-auto max-w-[160px] max-h-[80px] object-contain"
              />
            </div>
          </div>

          {/* Name */}
          {hoverEffect && (
            <div className="absolute bottom-4 left-0 right-0 z-20 text-center opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                {logo.name}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}