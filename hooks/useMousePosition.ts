"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { throttle } from "@/lib/utils";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition(throttleMs: number = 16) {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const handleMouseMove = useCallback(
    throttle((e: any) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    }, throttleMs),
    [throttleMs]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return position;
}

export function useMagneticButton(strength: number = 0.3) {
  const ref = useRef<HTMLButtonElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      positionRef.current = {
        x: distanceX * strength,
        y: distanceY * strength,
      };

      button.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    };

    const handleMouseLeave = () => {
      positionRef.current = { x: 0, y: 0 };
      button.style.transform = "translate(0, 0)";
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
