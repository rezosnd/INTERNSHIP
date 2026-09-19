"use client";

import { motion } from "framer-motion";
import { UserPlus, Laptop, Upload, ShieldCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "REGISTER",
    description: "Sign in securely with Google and complete your student profile to join the VeritasCo ecosystem.",
    icon: UserPlus
  },
  {
    num: "02",
    title: "BUILD",
    description: "Choose your domain and start developing. We don't provide tutorials—we provide the framework for you to build real projects.",
    icon: Laptop
  },
  {
    num: "03",
    title: "SUBMIT",
    description: "Document your architecture, push your code to GitHub, deploy a live demo, and submit your project for review.",
    icon: Upload
  },
  {
    num: "04",
    title: "GET VERIFIED",
    description: "After our automated and manual review processes, receive your verifiable VeritasCo certificate with a unique QR ID.",
    icon: ShieldCheck
  }
];

export function ProcessTimeline() {
  return (
    <section id="how-it-works" className="bg-[#07111F] py-32 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              YOUR JOURNEY.<br />
              <span className="text-primary">FOUR STEPS.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-[1px] bg-white/10 z-0" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-32 h-32 rounded-full bg-[#0D1B2A] border border-white/10 flex items-center justify-center mb-8 relative group shadow-2xl">
                  {/* Outer animated ring */}
                  <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-700" />
                  
                  <span className="absolute -top-3 -right-3 text-sm font-bold text-[#07111F] bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    {step.num}
                  </span>
                  <Icon className="w-12 h-12 text-white/80 group-hover:text-white transition-colors duration-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white tracking-widest mb-4">
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed font-medium">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
