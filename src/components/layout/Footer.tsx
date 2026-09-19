"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#07111F] text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src="/images/veritasco.png" alt="VeritasCo Logo" width={160} height={40} className="h-8 w-auto object-contain brightness-0 invert" />
            </Link>
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-semibold uppercase tracking-widest">
              <span className="text-emerald-400">✓</span> MSME Registered Company
            </div>
            <p className="text-white/60 text-lg mb-8 max-w-sm">
              Build a real-world project, showcase your skills, and earn a professionally verifiable internship certificate.
            </p>
            <div className="text-white/80 font-medium">
              BUILD. LEARN. PROVE.
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wide">Platform</h3>
            <ul className="space-y-4 text-white/60">
              <li><Link href="/#programs" className="hover:text-primary transition-colors">Programs</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#domains" className="hover:text-primary transition-colors">Domains</Link></li>
              <li><Link href="/verify" className="hover:text-primary transition-colors">Verify Certificate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wide">Company</h3>
            <ul className="space-y-4 text-white/60">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wide">Support</h3>
            <ul className="space-y-4 text-white/60">
              <li><a href="mailto:admin@veritasco.tech" className="hover:text-primary transition-colors">admin@veritasco.tech</a></li>
              <li className="pt-4 mt-4 border-t border-white/10">
                <Link href="/login">
                  <span className="text-primary hover:text-white transition-colors cursor-pointer">Student Login &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-white/40 text-sm">
          <p>&copy; {currentYear} VeritasCo.Tech. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
