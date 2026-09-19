"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Programs", href: "/#programs" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Domains", href: "/#domains" },
    { name: "Certificate", href: "/#certificate" },
    { name: "Verify", href: "/verify" },
  ];

  const isHomePage = pathname === "/";
  const transparentBg = isHomePage && !isScrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        transparentBg 
          ? "bg-transparent py-6" 
          : "bg-background/90 backdrop-blur-md border-b border-border py-4 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <Image src="/images/veritasco.png" alt="VeritasCo Logo" width={160} height={40} className="h-8 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  transparentBg ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth/CTA */}
          <div className="hidden md:flex items-center gap-4">
            {status === "authenticated" ? (
              <Link href="/dashboard">
                <Button variant={transparentBg ? "secondary" : "default"}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={transparentBg ? "text-white hover:bg-white/10 hover:text-white" : ""}>
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant={transparentBg ? "secondary" : "default"}>
                    Start Internship
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 rounded-md ${transparentBg ? "text-white" : "text-foreground"}`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <Link href="/" className="flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/images/veritasco.png" alt="VeritasCo Logo" width={160} height={40} className="h-8 w-auto object-contain" />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-foreground hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-foreground tracking-tight"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="p-6 border-t border-border flex flex-col gap-4">
              {status === "authenticated" ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full" size="lg">Login</Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" size="lg">Start Internship</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
