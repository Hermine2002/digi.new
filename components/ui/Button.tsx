"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useMagneticButton } from "@/hooks/useMousePosition";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", magnetic = false, children, ...props }, forwardedRef) => {
    const magneticRef = useMagneticButton(0.3);

    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-expo-out rounded-full focus:outline-none focus:ring-2 focus:ring-digibase-green/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-digibase-green text-white hover:bg-digibase-green-dark hover:shadow-lg hover:shadow-digibase-green/25 active:scale-95",
      secondary: "bg-digibase-black text-white hover:bg-digibase-gray-800 active:scale-95",
      outline: "border-2 border-digibase-black text-digibase-black hover:bg-digibase-black hover:text-white active:scale-95",
      ghost: "text-digibase-black hover:bg-digibase-gray-100 active:scale-95",
    };

    const sizes = {
      sm: "px-5 py-2.5 text-sm",
      md: "px-8 py-3.5 text-base",
      lg: "px-10 py-4 text-lg",
    };

    const ref = magnetic ? magneticRef : forwardedRef;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
