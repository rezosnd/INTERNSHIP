import { prisma } from "@/lib/prisma";
import { ShieldAlert, ShieldCheck, SearchX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function VerifyResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateId: id },
  });

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-[#07111F] mb-4">Certificate not found</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            We couldn't verify the certificate ID <strong>{id}</strong>. Please check the ID and try again.
          </p>
          <Link href="/verify">
            <Button size="lg" className="w-full h-12 text-lg">Try Again</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (certificate.status === "REVOKED") {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-destructive/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-destructive" />
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-[#07111F] mb-4">Certificate Revoked</h1>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            This certificate (<strong>{id}</strong>) is no longer considered valid in the VeritasCo verification system.
          </p>
          <Link href="/verify">
            <Button variant="outline" size="lg" className="w-full h-12 text-lg">Verify another</Button>
          </Link>
        </div>
      </div>
    );
  }

  // VALID STATE
  return (
    <div className="min-h-screen bg-[#F7F8FA] py-20 px-4 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-8">
            <Image src="/images/veritasco.png" alt="VeritasCo Logo" width={180} height={45} className="h-10 w-auto object-contain" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-primary/20 overflow-hidden">
          <div className="bg-primary/10 p-8 flex flex-col items-center border-b border-primary/10">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 mb-6 relative">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#07111F] mb-2 tracking-tight">CERTIFICATE VERIFIED</h1>
            <p className="text-primary font-medium">This certificate has been issued by VeritasCo.Tech.</p>
          </div>
          
          <div className="p-8 md:p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Student</p>
                <p className="text-xl font-bold text-[#07111F]">{certificate.studentNameSnapshot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Certificate ID</p>
                <p className="text-xl font-bold text-[#07111F] font-mono tracking-tight">{certificate.certificateId}</p>
              </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Institute</p>
                <p className="text-lg font-medium text-[#07111F]">{certificate.instituteSnapshot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Domain</p>
                <p className="text-lg font-medium text-[#07111F]">{certificate.domainSnapshot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Project Built</p>
                <p className="text-lg font-medium text-[#07111F]">{certificate.projectTitleSnapshot}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                  <p className="text-lg font-medium text-[#07111F]">
                    {new Intl.DateTimeFormat('en-IN', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    }).format(certificate.issueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="text-lg font-bold text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    VERIFIED
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              {certificate.pdfUrl && (
                <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-14 text-lg">View Certificate</Button>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/verify">
            <Button variant="ghost" className="text-muted-foreground hover:text-[#07111F]">Verify another certificate</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
