"use client";

import { motion } from "framer-motion";
import { FileText, BookOpen, Download, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ResourceShowcase({ feeAmount }: { feeAmount?: number }) {
  const resources = [
    {
      title: "Offer Letter Template",
      description: "Official internship offer letter and confidentiality agreement for your records.",
      type: "PDF Document",
      icon: FileText
    },
    {
      title: "Internship Guide & Curriculum",
      description: "Comprehensive step-by-step guide outlining your internship journey and project requirements.",
      type: "Learning Material",
      icon: BookOpen
    },
    {
      title: "Project Submission Guidelines",
      description: "Detailed instructions on how to submit your final project for review and certification.",
      type: "Reference Manual",
      icon: Download
    }
  ];

  return (
    <section className="bg-[#F7F8FA] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6"
          >
            <Lock className="w-4 h-4" />
            Premium Resources Included
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tighter text-[#07111F] mb-6"
          >
            Resources to Ace Your Placement
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Unlock all of these premium materials instantly when you pay the one-time registration fee of <strong className="text-[#07111F]">₹{feeAmount}</strong>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <a href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2">
              Unlock All Resources Now
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {resources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Card className="border-border shadow-md hover:shadow-xl transition-all group overflow-hidden h-full bg-white relative">
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-[#07111F] rounded-full flex items-center justify-center mb-3 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-[#07111F]">Unlocks after ₹{feeAmount} payment</p>
                  </div>

                  <div className="h-1 w-full bg-primary/20" />
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary mt-1">
                      {resource.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{resource.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
