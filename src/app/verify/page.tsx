"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const [certId, setCertId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim().length < 5) return;
    
    setIsLoading(true);
    router.push(`/verify/${certId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-32 pb-20 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#07111F] tracking-tight mb-4">
            Verify a VeritasCo Certificate
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter the unique Certificate ID to verify its authenticity and view the project details.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-xl shadow-black/5 border border-border"
        >
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Enter Certificate ID (e.g., VC-2026-A8F4K2)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="pl-11 h-14 text-lg font-medium tracking-wide uppercase"
                maxLength={20}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="h-14 px-8 text-lg shrink-0"
              disabled={isLoading || certId.trim().length < 5}
            >
              {isLoading ? "Verifying..." : "Verify Certificate"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
            <p>You can also verify a certificate by scanning the QR code printed on it.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
