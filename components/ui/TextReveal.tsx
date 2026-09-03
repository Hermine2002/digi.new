"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);


interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "words" | "chars" | "lines";
}


export function TextReveal({
  children,
  className,
  delay = 0,
  stagger = 0.03,
  as: Component = "p",
  splitBy = "words",
}: TextRevealProps) {

  const containerRef = useRef<HTMLElement | null>(null);


  const splitText = () => {

    if(splitBy === "words") {
      return children.split(" ").map((word,i)=>(
        <span 
          key={i}
          className="inline-block overflow-hidden mr-[0.25em]"
        >
          <span className="word inline-block">
            {word}
          </span>
        </span>
      ));
    }


    if(splitBy === "chars") {
      return children.split("").map((char,i)=>(
        <span
          key={i}
          className="inline-block overflow-hidden"
        >
          <span className="char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ));
    }


    return children;
  };



  useEffect(()=>{

    if(!containerRef.current) return;


    const ctx = gsap.context(()=>{

      const elements =
      containerRef.current!.querySelectorAll(".word,.char");


      gsap.fromTo(
        elements,
        {
          y:"100%",
          opacity:0,
          filter:"blur(8px)"
        },
        {
          y:"0%",
          opacity:1,
          filter:"blur(0px)",
          duration:.8,
          stagger,
          delay,
          ease:"power3.out",
          scrollTrigger:{
            trigger:containerRef.current,
            start:"top 85%",
          }
        }
      );


    },containerRef);


    return ()=>ctx.revert();


  },[delay,stagger]);



  return (
    <Component
      ref={containerRef as any}
      className={cn(className)}
    >
      {splitText()}
    </Component>
  );
}




export function BlurReveal({
  children,
  className,
  delay = 0,
}:{
  children:React.ReactNode;
  className?:string;
  delay?:number;
}) {


  const ref = useRef<HTMLDivElement>(null);



  useEffect(()=>{

    if(!ref.current) return;


    const ctx = gsap.context(()=>{

      gsap.fromTo(
        ref.current,
        {
          opacity:0,
          filter:"blur(15px)",
          y:40,
        },
        {
          opacity:1,
          filter:"blur(0px)",
          y:0,
          duration:1,
          delay,
          ease:"power3.out",
          scrollTrigger:{
            trigger:ref.current,
            start:"top 85%",
          }
        }
      );


    },ref);



    return ()=>ctx.revert();


  },[delay]);



  return (
    <div
      ref={ref}
      className={cn(className)}
    >
      {children}
    </div>
  );
}