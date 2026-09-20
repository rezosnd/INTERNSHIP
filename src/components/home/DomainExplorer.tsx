"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Code2, Smartphone, Layers, TerminalSquare, Database, Cpu, BrainCircuit, ShieldAlert, Cloud, Workflow, PenTool, Link2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const domains = [
  { 
    id: 1, 
    name: "Web Development", 
    icon: Code2, 
    color: "from-blue-500/20 to-blue-600/20",
    projects: [
      { title: "E-Commerce Platform", desc: "Next.js 14, Stripe integration, Redux, responsive UI." },
      { title: "Real-time Chat App", desc: "Socket.io, Node.js, React, end-to-end encryption." },
      { title: "Task Management SaaS", desc: "Kanban board, drag-and-drop, authentication with NextAuth." }
    ]
  },
  { 
    id: 2, 
    name: "App Development", 
    icon: Smartphone, 
    color: "from-purple-500/20 to-purple-600/20",
    projects: [
      { title: "Fitness Tracker App", desc: "React Native, HealthKit/Google Fit API integration." },
      { title: "Food Delivery App", desc: "Flutter, geolocation tracking, payment gateway." },
      { title: "Social Media Clone", desc: "Swift, Firebase backend, infinite scrolling feed." }
    ]
  },
  { 
    id: 3, 
    name: "Full Stack", 
    icon: Layers, 
    color: "from-emerald-500/20 to-emerald-600/20",
    projects: [
      { title: "Blogging Engine", desc: "MERN stack, rich text editor, SEO optimization." },
      { title: "Online Learning Portal", desc: "Django, React, video streaming, quiz system." },
      { title: "Job Board Platform", desc: "Spring Boot, Angular, Elasticsearch integration." }
    ]
  },
  { 
    id: 4, 
    name: "Python", 
    icon: TerminalSquare, 
    color: "from-yellow-500/20 to-yellow-600/20",
    projects: [
      { title: "Web Scraper Toolkit", desc: "BeautifulSoup, Selenium, automated data extraction." },
      { title: "Discord Bot", desc: "discord.py, moderation tools, API integrations." },
      { title: "Portfolio Tracker", desc: "FastAPI backend, financial data APIs, automated reporting." }
    ]
  },
  { 
    id: 5, 
    name: "Java", 
    icon: Database, 
    color: "from-red-500/20 to-red-600/20",
    projects: [
      { title: "Library Management", desc: "JavaFX UI, MySQL, JDBC, authentication system." },
      { title: "Microservices API", desc: "Spring Boot, Eureka, API Gateway, Dockerized." },
      { title: "Multiplayer Chess", desc: "Java Sockets, multithreading, Swing interface." }
    ]
  },
  { 
    id: 6, 
    name: "Data Science", 
    icon: Cpu, 
    color: "from-cyan-500/20 to-cyan-600/20",
    projects: [
      { title: "Predictive Sales Model", desc: "Pandas, Scikit-learn, time-series forecasting." },
      { title: "Customer Segmentation", desc: "K-means clustering, RFM analysis, Tableau dashboard." },
      { title: "Sentiment Analysis", desc: "NLTK, Twitter API, processing 10k+ daily tweets." }
    ]
  },
  { 
    id: 7, 
    name: "AI & ML", 
    icon: BrainCircuit, 
    color: "from-indigo-500/20 to-indigo-600/20",
    projects: [
      { title: "Image Classification", desc: "TensorFlow/Keras, CNNs, 95%+ accuracy on CIFAR-10." },
      { title: "Chatbot Assistant", desc: "PyTorch, transformer models, fine-tuned on custom dataset." },
      { title: "Recommendation System", desc: "Collaborative filtering, matrix factorization, implicit feedback." }
    ]
  },
  { 
    id: 8, 
    name: "Cybersecurity", 
    icon: ShieldAlert, 
    color: "from-rose-500/20 to-rose-600/20",
    projects: [
      { title: "Network Vulnerability Scanner", desc: "Python, Nmap integration, automated reporting." },
      { title: "Keylogger & Defender", desc: "Malware analysis, building detection signatures." },
      { title: "Secure File Transfer", desc: "Custom encryption protocol, AES-256, secure key exchange." }
    ]
  },
  { 
    id: 9, 
    name: "Cloud Computing", 
    icon: Cloud, 
    color: "from-sky-500/20 to-sky-600/20",
    projects: [
      { title: "Serverless Image Processing", desc: "AWS Lambda, S3 triggers, automated resizing." },
      { title: "Fault-Tolerant Architecture", desc: "EC2 Auto-scaling, ELB, Route53 failover routing." },
      { title: "Multi-Cloud Deploy", desc: "Terraform, cross-provider resource provisioning." }
    ]
  },
  { 
    id: 10, 
    name: "DevOps", 
    icon: Workflow, 
    color: "from-orange-500/20 to-orange-600/20",
    projects: [
      { title: "CD to Cloud", desc: "Auto-deploy on merge to main with environment secrets." },
      { title: "Infrastructure as Code", desc: "Terraform script provisioning a VM + security group." },
      { title: "Monitoring Stack", desc: "Prometheus + Grafana on a sample app, 3 custom dashboards." }
    ]
  },
  { 
    id: 11, 
    name: "UI/UX Design", 
    icon: PenTool, 
    color: "from-pink-500/20 to-pink-600/20",
    projects: [
      { title: "Mobile App Redesign", desc: "Audit an existing app, redesign 5 screens with rationale." },
      { title: "Design System Starter", desc: "Colors, type scale, buttons, inputs, cards in Figma." },
      { title: "E-commerce Checkout Flow", desc: "Wireframes → hi-fi → clickable prototype." },
      { title: "Usability Test Report", desc: "5 users on a live site, findings + prioritized fixes." },
      { title: "Dashboard UI Concept", desc: "Data-heavy admin screen, responsive states, dark mode." }
    ]
  },
  { 
    id: 12, 
    name: "Blockchain", 
    icon: Link2, 
    color: "from-slate-500/20 to-slate-600/20",
    projects: [
      { title: "Hello-World Smart Contract", desc: "Solidity storage contract, deploy on testnet via Remix." },
      { title: "ERC-20 Token", desc: "Mint, transfer, balance; verify on block explorer." },
      { title: "Simple Voting DApp", desc: "Contract + web3.js frontend, wallet connect, live results." },
      { title: "NFT Minter", desc: "ERC-721 with IPFS metadata, mint page." },
      { title: "Blockchain from Scratch (Python)", desc: "Blocks, hashing, proof-of-work, chain validation." }
    ]
  },
];

export function DomainExplorer() {
  const [activeDomain, setActiveDomain] = useState(domains[0]);

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

        {/* Mobile Domain Selector (Horizontal Scroll) */}
        <div className="lg:hidden mb-8 overflow-x-auto pb-4 flex gap-3 snap-x scrollbar-hide">
          {domains.map(domain => (
            <button
              key={domain.id}
              onClick={() => setActiveDomain(domain)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-semibold transition-all snap-start ${
                activeDomain.id === domain.id 
                  ? "bg-[#07111F] text-white shadow-lg" 
                  : "bg-white text-muted-foreground border border-border hover:border-primary/30"
              }`}
            >
              {domain.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column - Desktop Domains List */}
          <div className="hidden lg:flex w-full lg:w-[35%] flex-col gap-2 sticky top-32 max-h-[75vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {domains.map((domain) => {
              const Icon = domain.icon;
              const isActive = activeDomain.id === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain)}
                  className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-300 text-left border ${
                    isActive 
                      ? "bg-white shadow-md border-primary/20" 
                      : "hover:bg-white/50 border-transparent hover:border-border/50 text-muted-foreground hover:text-[#07111F]"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                    isActive ? `bg-gradient-to-br ${domain.color}` : "bg-muted"
                  }`}>
                    <Icon className={`w-6 h-6 transition-colors duration-500 ${isActive ? "text-[#07111F]" : ""}`} />
                  </div>
                  <span className={`font-semibold text-lg transition-colors duration-500 ${isActive ? "text-[#07111F]" : ""}`}>{domain.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column - Active Domain Projects */}
          <div className="w-full lg:w-[65%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white rounded-3xl p-6 md:p-10 border border-border shadow-xl relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${activeDomain.color} opacity-20 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none transition-all duration-1000`} />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#07111F] mb-3 tracking-tight">{activeDomain.name} Projects</h3>
                      <p className="text-muted-foreground text-lg">Select a project to build and master during your internship.</p>
                    </div>
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${activeDomain.color} flex items-center justify-center shrink-0 shadow-lg`}>
                      <activeDomain.icon className="w-10 h-10 text-[#07111F]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                    {activeDomain.projects.map((project, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        key={idx} 
                        className="group p-6 rounded-2xl border border-border bg-[#F7F8FA] hover:bg-white hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      >
                        <h4 className="text-xl font-bold text-[#07111F] mb-3 group-hover:text-primary transition-colors">{project.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{project.desc}</p>
                        <div className="flex items-center text-sm font-semibold text-[#07111F] opacity-70 group-hover:opacity-100 transition-opacity">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                          Industry Standard
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-border/60 flex justify-end">
                    <Link href="/internship/apply" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto bg-[#07111F] text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-primary transition-colors group">
                        Apply for {activeDomain.name}
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

