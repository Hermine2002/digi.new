"use client";

import { useRef, useEffect, ReactNode, createContext, useContext } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SectionRefsContext = createContext<{
  textRef: React.RefObject<HTMLDivElement>;
  mediaRef: React.RefObject<HTMLDivElement>;
} | null>(null);

export function useSectionRefs() {
  const ctx = useContext(SectionRefsContext);
  if (!ctx) throw new Error("useSectionRefs must be used inside ProjectSectionReveal");
  return ctx;
}

export function ProjectSectionReveal({
  children,
  textFirst,
  index,
}: {
  children: ReactNode;
  textFirst: boolean;
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 60, z: -120, rotateY: textFirst ? -8 : 8, filter: "blur(12px)" },
        {
          opacity: 1, y: 0, z: 0, rotateY: 0, filter: "blur(0px)",
          duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", end: "top 35%", scrub: 1 },
        }
      );

      gsap.fromTo(
        mediaRef.current,
        { opacity: 0, y: 90, scale: 0.92, filter: "blur(16px)" },
        {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "top 25%", scrub: 1 },
        }
      );

      gsap.to(mediaRef.current, {
        y: -40, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });

      gsap.to(sectionRef.current, {
        opacity: 0.4, filter: "blur(4px)", ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 40%", end: "bottom top", scrub: 1 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [textFirst]);

  return (
    <div ref={sectionRef} data-project-section={index} style={{ perspective: "1400px" }}>
      <div style={{ transformStyle: "preserve-3d" }}>
        <SectionRefsContext.Provider value={{ textRef, mediaRef }}>
          {children}
        </SectionRefsContext.Provider>
      </div>
    </div>
  );
}