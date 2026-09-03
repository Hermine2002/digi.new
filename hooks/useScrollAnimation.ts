"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export function useScrollAnimation(
  animationCallback: (tl: gsap.core.Timeline, trigger: Element) => void,
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: options.trigger || ref.current,
          start: options.start || "top 80%",
          end: options.end || "bottom 20%",
          scrub: options.scrub || false,
          markers: options.markers || false,
          toggleActions: options.toggleActions || "play none none reverse",
          onEnter: options.onEnter,
          onLeave: options.onLeave,
          onEnterBack: options.onEnterBack,
          onLeaveBack: options.onLeaveBack,
        },
      });

      timelineRef.current = tl;
      animationCallback(tl, ref.current!);
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useFadeInUp(delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay]);

  return ref;
}

export function useStaggerChildren(stagger: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const children = ref.current.children;
    if (!children.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger]);

  return ref;
}
