"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface OfferLetterProps {
  application: any;
  profile: any;
}

export function OfferLetterView({ application, profile }: OfferLetterProps) {
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  const issueDate = application.offerLetterSentAt 
    ? new Date(application.offerLetterSentAt) 
    : new Date();

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(issueDate);

  const downloadPDF = async () => {
    if (!letterRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(letterRef.current, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`VeritasCo_Offer_Letter_${profile.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!showFullLetter) {
    return (
      <Card className="bg-[#07111F] text-white border-0 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Application Approved</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Your Offer Letter is Ready!</h2>
            <p className="text-white/70 max-w-md text-lg mb-0">
              Congratulations! We have reviewed your application and would like to offer you an internship position.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <Button 
              size="lg" 
              onClick={() => setShowFullLetter(true)}
              className="w-full h-14 px-8 text-lg bg-white text-[#07111F] hover:bg-white/90"
            >
              <FileText className="w-5 h-5 mr-2" />
              View Offer Letter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#07111F]">Internship Offer</h2>
          <p className="text-muted-foreground">Please review your offer details below.</p>
        </div>
        <Button variant="ghost" onClick={() => setShowFullLetter(false)}>Close</Button>
      </div>

      <div 
        ref={letterRef}
        className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div>
            <img src="/images/veritasco.png" alt="VeritasCo Logo" className="h-10 w-auto object-contain mb-6" />
            <h1 className="text-2xl md:text-4xl font-bold text-[#07111F] tracking-tight">OFFER OF INTERNSHIP</h1>
          </div>
          <div className="text-right text-muted-foreground text-sm">
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Ref:</strong> VC-OFF-{application.applicationNumber.split('-')[1]}</p>
          </div>
        </div>

        <div className="space-y-6 text-[#07111F] leading-relaxed relative z-10">
          <p>Dear <strong>{profile.fullName}</strong>,</p>
          
          <p>
            We are thrilled to extend this formal offer of internship at VeritasCo Tech. After reviewing your application and profile, we were highly impressed by your enthusiasm and potential.
          </p>
          
          <div className="bg-muted/30 p-6 rounded-xl border border-border/50 my-8">
            <h3 className="font-semibold text-lg mb-4">Internship Details:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-sm text-muted-foreground">Domain</p>
                <p className="font-medium text-lg">{application.domain.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium text-lg">{application.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project Focus</p>
                <p className="font-medium text-lg">{application.projectTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium text-lg">Remote</p>
              </div>
            </div>
          </div>

          <p>
            During this internship, you will have the opportunity to work on industry-relevant projects, gain hands-on experience, and build a strong portfolio. Our team is committed to providing you with the necessary guidance and resources to ensure your success.
          </p>

          <p>
            To formally accept this offer and secure your spot, please proceed to the resource fee payment. This nominal fee covers the platform resources, premium support, and the verifiable certification you will receive upon successful completion.
          </p>

          <p>
            We look forward to welcoming you to the VeritasCo team!
          </p>

          <div className="pt-8 mt-8 border-t border-border">
            <p className="font-semibold">Sincerely,</p>
            <p className="text-muted-foreground mt-1">The VeritasCo Team</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={downloadPDF}
          disabled={isDownloading}
          className="h-14 px-8 text-lg"
        >
          {isDownloading ? "Generating PDF..." : "Download as PDF"}
        </Button>
        
        {!isAccepted ? (
          <Button 
            size="lg" 
            onClick={() => setIsAccepted(true)}
            className="h-14 px-8 text-lg bg-[#07111F] hover:bg-[#0a1a2f] text-white shadow-lg w-full sm:w-auto"
          >
            Accept Offer
            <CheckCircle2 className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-4 h-14 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Offer Accepted
            </div>
            <Link href={`/payment?applicationId=${application.id}`}>
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 w-full sm:w-auto">
                Proceed to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
