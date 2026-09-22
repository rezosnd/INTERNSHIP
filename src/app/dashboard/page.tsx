import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, Download, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OfferLetterView } from "@/components/dashboard/OfferLetterView";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const application = await prisma.internshipApplication.findFirst({
    where: { userId: session.user.id },
    include: { domain: true, certificate: true },
  });

  if (!application) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#07111F]">Welcome, {profile.fullName.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your VeritasCo internship journey starts here.</p>
        </div>

        <Card className="bg-[#07111F] text-white border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Start your project.</h2>
              <p className="text-white/70 max-w-md text-lg mb-0">Choose your domain, submit your project details, and earn a verifiable certificate of completion.</p>
            </div>
            <Link href="/internship/apply" className="w-full md:w-auto shrink-0">
              <Button size="lg" className="w-full h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white">
                Start Internship Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Removed redirect for PAYMENT_PENDING to show Offer Letter instead

  // Determine active step for timeline
  const getTimelineStep = () => {
    switch(application.status) {
      case "SUBMITTED":
      case "PAYMENT_PENDING": return 1;
      case "PAID":
      case "UNDER_REVIEW": return 2;
      case "APPROVED":
      case "CERTIFICATE_PROCESSING": return 3;
      case "CERTIFICATE_ISSUED": return 4;
      default: return 2; // IN_PROGRESS / PAID
    }
  };

  const currentStep = getTimelineStep();

  const timelineSteps = [
    { num: 1, title: "Application", desc: "Submitted successfully" },
    { num: 2, title: "Payment", desc: "Fee processed" },
    { num: 3, title: "Review", desc: application.status === "UNDER_REVIEW" ? "Project under review" : "Project approved" },
    { num: 4, title: "Certificate", desc: application.certificate?.status === "ISSUED" ? "Issued & Verifiable" : "Processing..." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#07111F]">Welcome back, {profile.fullName.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-2 text-lg">Track your VeritasCo internship journey.</p>
      </div>

      {application.status === "PAYMENT_PENDING" && (
        <OfferLetterView application={application} profile={profile} />
      )}

      {application.status === "SUBMITTED" && (
        <Card className="bg-muted/30 border-dashed border-2 shadow-none overflow-hidden relative">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#07111F] mb-3">Application Under Review</h2>
            <p className="text-muted-foreground max-w-md text-lg">
              Our team is currently reviewing your application details. Please check back later for your Offer Letter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progress Timeline */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-muted z-0" />
            <div 
              className="hidden md:block absolute top-6 left-[10%] h-[2px] bg-primary z-0 transition-all duration-1000" 
              style={{ width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 80}%` }}
            />

            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 mb-6 md:mb-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  currentStep >= step.num ? "bg-primary text-white ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > step.num ? <CheckCircle2 className="w-6 h-6" /> : step.num}
                </div>
                <div className="text-left md:text-center">
                  <p className={`font-bold ${currentStep >= step.num ? "text-[#07111F]" : "text-muted-foreground"}`}>{step.title}</p>
                  <p className="text-xs text-muted-foreground hidden md:block mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card id="application" className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>The information submitted for review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Domain</p>
              <p className="font-medium text-[#07111F]">{application.domain.name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Project</p>
              <p className="font-medium text-[#07111F]">{application.projectTitle}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <Circle className="w-2 h-2 fill-emerald-600" />
                Active
              </span>
            </div>
          </CardContent>
        </Card>

        {application.certificate?.status === "ISSUED" ? (
          <Card id="certificate" className="bg-[#07111F] text-white border-0 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('/images/hero/hero-bg.jpg')] bg-cover mix-blend-overlay" />
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Certificate Issued</CardTitle>
              <CardDescription className="text-white/70">Your verifiable internship certificate is ready.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <p className="text-sm font-mono text-white/50 mb-6">ID: {application.certificate.certificateId}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                {application.certificate.pdfUrl && (
                  <a href={application.certificate.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </a>
                )}
                <Link href={`/verify/${application.certificate.certificateId}`} className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify Online
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : application.status === "PAYMENT_PENDING" ? (
          <Card id="certificate" className="border-border shadow-sm bg-muted/10">
            <CardHeader>
              <CardTitle>Action Required</CardTitle>
              <CardDescription>Proceed to payment for the next process.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-[#07111F] mb-2">Next Step: Payment</p>
                <p className="text-sm text-muted-foreground mb-5">
                  Your offer is ready. Please complete the payment to start your internship and eventually earn your certificate.
                </p>
                <Link href={`/payment?applicationId=${application.id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card id="certificate" className="border-border shadow-sm bg-muted/30">
            <CardHeader>
              <CardTitle>Certificate Status</CardTitle>
              <CardDescription>Your certificate is being processed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border rounded-xl">
                <Award className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="font-medium text-muted-foreground">Check back later.</p>
                <p className="text-sm text-muted-foreground/70 mt-2">Certificates are issued after the project review is complete.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
