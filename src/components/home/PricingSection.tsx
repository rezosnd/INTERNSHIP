"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section className="bg-white py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-[#07111F] mb-6"
          >
            Start your journey.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            A single, transparent fee for the entire internship process, from project submission to verifiable certification.
          </motion.p>
        </div>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#07111F] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">VERITASCO INTERNSHIP</h3>
                  <p className="text-white/60">Complete platform access</p>
                </div>
                <div className="text-right">
                  <div className="flex items-start justify-end text-white">
                    <span className="text-2xl font-semibold mt-2 mr-1">₹</span>
                    <span className="text-6xl font-black tracking-tighter">349</span>
                  </div>
                  <p className="text-white/60 text-sm mt-1">One-time processing fee</p>
                </div>
              </div>

              <div className="h-px w-full bg-white/10 mb-8" />

              <ul className="space-y-4 mb-10">
                {[
                  "Internship application processing",
                  "Project submission & review",
                  "Permanent project details record",
                  "Certificate generation & processing",
                  "Unique certificate ID",
                  "Instant QR verification link",
                  "High-resolution digital certificate"
                ].map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 text-white/80"
                  >
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link href="/login" className="block w-full">
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group">
                  Start Internship — ₹349
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
