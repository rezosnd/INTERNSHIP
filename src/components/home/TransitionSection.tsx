"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function TransitionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[80svh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black"
    >
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[140%] -top-[20%] z-0"
      >
        <Image
          src="/images/hero/transition-bg.jpg"
          alt="Code and wireframes"
          fill
          className="object-cover opacity-50 mix-blend-overlay"
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-[#07111F]/70 z-10 mix-blend-multiply" />

      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto"
      >
        <p className="text-white/60 uppercase tracking-[0.3em] font-semibold text-sm sm:text-base mb-6">
          From Idea
        </p>
        <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-8">
          TO REALITY.
        </h2>
        <p className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto">
          Choose your domain. Build your project. Document your work.
        </p>
      </motion.div>
    </section>
  );
}
