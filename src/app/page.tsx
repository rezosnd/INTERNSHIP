import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { TransitionSection } from "@/components/home/TransitionSection";
import { DomainExplorer } from "@/components/home/DomainExplorer";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { CertificateShowcase } from "@/components/home/CertificateShowcase";
import { PricingSection } from "@/components/home/PricingSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VeritasCo.Tech Internship Program | Build. Learn. Prove.",
  description: "Build a real-world project with VeritasCo.Tech, submit your work, and receive a professionally verifiable internship certificate.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <IntroSection />
      <TransitionSection />
      <DomainExplorer />
      <ProcessTimeline />
      <CertificateShowcase />
      <PricingSection />
    </main>
  );
}
