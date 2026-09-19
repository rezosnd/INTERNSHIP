"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.getElementById("program");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[100svh] min-h-[720px] flex items-center overflow-hidden bg-black">
      {/* Background Image with subtle zoom animation */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Student working on a modern laptop in a dark tech office"
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 z-10" />
      </motion.div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="text-primary font-semibold tracking-widest text-sm uppercase">
              VeritasCo.Tech · Internship Program
            </span>
          </motion.div>

          <div className="flex flex-col gap-2 mb-8">
            {["BUILD.", "LEARN.", "PROVE."].map((text, i) => (
              <motion.h1
                key={text}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="text-[clamp(4rem,8vw,9rem)] leading-[0.9] font-bold text-white tracking-tighter"
              >
                {text}
              </motion.h1>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 font-medium leading-relaxed"
          >
            Build a real-world project, showcase your skills, and earn a professionally verifiable VeritasCo internship certificate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/login" className="group">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md font-semibold text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                Start Your Internship
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/verify">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-md font-semibold text-lg transition-all w-full sm:w-auto">
                Verify a Certificate
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
        onClick={scrollToNext}
      >
        <span className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-4 group-hover:text-white transition-colors">
          Scroll to explore
        </span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/2 bg-primary"
            animate={{ 
              y: ["-100%", "200%"]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "linear" 
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
