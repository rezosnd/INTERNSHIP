"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function IntroSection() {
  return (
    <section id="program" className="bg-white py-32 md:py-48 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-6 block">
              The Program
            </span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#07111F] leading-[1.05]">
              Don't just learn.<br />
              <span className="text-muted-foreground">Build something real.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 font-medium">
              VeritasCo gives students a structured way to turn technical knowledge into a project they can demonstrate, document, and share. Stand out to employers with verifiable proof of your abilities.
            </p>
            
            <div>
              <Link href="/#domains" className="group inline-flex items-center gap-3 text-lg font-semibold text-[#07111F] hover:text-primary transition-colors">
                Explore domains
                <span className="bg-[#07111F] group-hover:bg-primary text-white p-2 rounded-full transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
