"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { TextReveal, BlurReveal } from "@/components/ui/TextReveal";
import { ArrowRight, ChevronDown } from "lucide-react";
// import Hero3D from "@/components/3d/Hero3D";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

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
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundImage: 'url("/images/zZzYV1gkzUdnoAq3JlWsgqi77ENivpYDZJ1E7Dw_nDbmeD6xZiRcndKTKX93TzEP6uCAf4nGO2Z1y0GQSkPjqsLRXB5Pp9vHDCGLusgPK8qqSGQeoSiTNYV4QqmfYNUjZZNh0S85936kcspw2qHlZ18AcV_qoVG_NeSVvZfrsroMFI7VRLlOWv3TGzaKoJlW.jpeg")', 
        backgroundSize: "cover", 
        backgroundPosition: "80% 50%", 
        backgroundRepeat: "no-repeat" 
      }}
    >
      {/* <Hero3D /> */}

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/80 via-white/50 to-white" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00c050]/10 rounded-full blur-3xl z-[2]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00c050]/10 rounded-full blur-3xl z-[2]" />

      <div ref={contentRef} className="relative z-10 section-padding pt-32 pb-20">
        <div className="container-wide text-start max-w-5xl mx-auto">
          <BlurReveal delay={0.2}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00c050]/10 border border-[#00c050]/20 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00c050] animate-pulse" />
              <span className="text-sm font-medium text-[#00c050]">{hero.badge[language]}</span>
            </div>
          </BlurReveal>

          <h1 className="text-display-xl font-bold text-black mb-5 text-balance">
            <TextReveal key={language} splitBy="words" delay={0.3}>
              {hero.title[language]}
            </TextReveal>
            
            <span className="text-display-xl font-bold text-[#00c050] mb-6 text-balance">{hero.badgeSubTilile[language]}</span>
          </h1>

          <BlurReveal delay={0.6}>
            <p className="text-lg lg:text-xl text-zinc-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              {hero.description[language]}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group bg-[#00c050] hover:bg-[#00a042] text-white">
                {hero.ctaPrimary[language]}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            
            </div>
          </BlurReveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-400">
        <span className="text-xs font-medium tracking-widest uppercase">{hero.scroll[language]}</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}