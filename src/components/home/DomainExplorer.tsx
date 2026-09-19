"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Smartphone, Layers, TerminalSquare, Database, Cpu, BrainCircuit, ShieldAlert, Cloud, Workflow, PenTool, Link2, Wifi } from "lucide-react";
import Link from "next/link";

const domains = [
  { id: 1, name: "Web Development", icon: Code2, color: "from-blue-500/20 to-blue-600/20" },
  { id: 2, name: "App Development", icon: Smartphone, color: "from-purple-500/20 to-purple-600/20" },
  { id: 3, name: "Full Stack", icon: Layers, color: "from-emerald-500/20 to-emerald-600/20" },
  { id: 4, name: "Python", icon: TerminalSquare, color: "from-yellow-500/20 to-yellow-600/20" },
  { id: 5, name: "Java", icon: Database, color: "from-red-500/20 to-red-600/20" },
  { id: 6, name: "Data Science", icon: Cpu, color: "from-cyan-500/20 to-cyan-600/20" },
  { id: 7, name: "AI & ML", icon: BrainCircuit, color: "from-indigo-500/20 to-indigo-600/20" },
  { id: 8, name: "Cybersecurity", icon: ShieldAlert, color: "from-rose-500/20 to-rose-600/20" },
  { id: 9, name: "Cloud Computing", icon: Cloud, color: "from-sky-500/20 to-sky-600/20" },
  { id: 10, name: "DevOps", icon: Workflow, color: "from-orange-500/20 to-orange-600/20" },
  { id: 11, name: "UI/UX Design", icon: PenTool, color: "from-pink-500/20 to-pink-600/20" },
  { id: 12, name: "Blockchain", icon: Link2, color: "from-slate-500/20 to-slate-600/20" },
];

export function DomainExplorer() {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="domains" className="bg-[#F7F8FA] py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#07111F] mb-6">
              Choose your direction.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl font-medium">
              We offer structured projects across multiple cutting-edge technology stacks. Pick the domain that aligns with your career goals.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <motion.div key={domain.id} variants={item}>
                <Link href="/internship/apply" className="block h-full">
                  <div className="group relative bg-white rounded-2xl p-8 h-full border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col justify-between min-h-[240px]">
                    
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="bg-[#F7F8FA] w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/50">
                        <Icon className="w-7 h-7 text-[#07111F]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#07111F] mb-2 tracking-tight">
                        {domain.name}
                      </h3>
                    </div>

                    <div className="relative z-10 flex justify-end mt-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                        <ArrowUpRight className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-500" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
