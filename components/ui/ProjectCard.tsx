"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags?: string[];
  index?: number;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  image,
  tags = [],
  index = 0,
  className,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Image parallax
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative rounded-3xl overflow-hidden bg-white border border-digibase-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-digibase-green/5 hover:border-digibase-green/20",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div ref={imageRef} className="absolute inset-0 scale-110">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-digibase-black"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl lg:text-2xl font-semibold text-digibase-black mb-2 group-hover:text-digibase-green transition-colors duration-300">
              {title}
            </h3>
            <p className="text-digibase-gray-600 text-sm lg:text-base leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-digibase-gray-100 flex items-center justify-center group-hover:bg-digibase-green group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
