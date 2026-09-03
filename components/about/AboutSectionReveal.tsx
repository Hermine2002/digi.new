"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSectionReveal({
  children,
  index,
  activeIndexRef,
}: {
  children: ReactNode;
  index: number;
  activeIndexRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fromRight = index % 2 === 0; // even index → enters from right, odd → from left

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          x: fromRight ? 160 : -160,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.65,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              activeIndexRef.current = index;
            },
            onEnterBack: () => {
              activeIndexRef.current = index;
            },
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [index, fromRight, activeIndexRef]);

  return <div ref={ref}>{children}</div>;
}