"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

export function CertificateShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="certificate" ref={containerRef} className="bg-[#07111F] py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative">
            <motion.div style={{ y }} className="relative z-10">
              <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-primary/20 ring-1 ring-white/10">
                <Image
                  src="/images/certificate/certificate-mockup.jpg"
                  alt="VeritasCo Premium Internship Certificate"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
            
            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[80px] rounded-full z-0" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
              Proof that<br />you've built.
            </h2>
            <p className="text-xl text-white/60 leading-relaxed mb-10 font-medium">
              Every completed project earns a professionally designed VeritasCo.Tech certificate. It’s not just a piece of paper—it’s verifiable proof of your technical capabilities.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Unique Certificate ID",
                "Instant QR Code Verification",
                "Cryptographically secure records",
                "Shareable on LinkedIn"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/80 font-medium"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <div>
              <Link href="/verify">
                <button className="bg-white hover:bg-white/90 text-[#07111F] px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2">
                  Verify a Certificate
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
