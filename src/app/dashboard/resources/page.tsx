import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Download, BookOpen, ShieldCheck } from "lucide-react";

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const application = await prisma.internshipApplication.findFirst({
    where: { userId: session.user.id },
  });

  if (!application) {
    redirect("/dashboard");
  }

  // Check if they have paid
  const hasPaid = application.status !== "PAYMENT_PENDING" && application.status !== "SUBMITTED";

  if (!hasPaid) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#07111F]">Internship Resources</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your learning materials and guides.</p>
        </div>
        
        <Card className="border-border shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Resources Locked
            </CardTitle>
            <CardDescription>You must complete your internship registration fee to access these resources.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-white">
                <BookOpen className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-[#07111F]">Premium Resources Locked</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">Complete your payment on the dashboard to unlock all internship training materials, mentorship guides, and learning modules.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resources = [
    {
      title: "VeritasCo Offer Letter Template",
      description: "Official internship offer letter and confidentiality agreement for your records.",
      link: "https://drive.google.com/file/d/1p_K5YMhmxD5WnL25g8PN_I6Pd1GWlQUd/view?usp=drivesdk",
      type: "PDF Document",
      icon: FileText
    },
    {
      title: "Internship Guide & Curriculum",
      description: "Comprehensive step-by-step guide outlining your internship journey and project requirements.",
      link: "https://drive.google.com/file/d/1KVjo4xzGahx3qYHdx9-zeLO_lhzEs1Xp/view?usp=drivesdk",
      type: "Learning Material",
      icon: BookOpen
    },
    {
      title: "Project Submission Guidelines",
      description: "Detailed instructions on how to submit your final project for review and certification.",
      link: "https://drive.google.com/file/d/13BL6A4D4VReitgPdRiYkQKfF5ux4IS8a/view?usp=drivesdk",
      type: "Reference Manual",
      icon: Download
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#07111F]">Internship Resources</h1>
        <p className="text-muted-foreground mt-2 text-lg">Access your official training materials, guides, and documentation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, idx) => {
          const Icon = resource.icon;
          return (
            <Card key={idx} className="border-border shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
              <div className="h-2 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl line-clamp-1">{resource.title}</CardTitle>
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary mt-1">{resource.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">{resource.description}</p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border mt-auto bg-muted/20">
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" className="w-full justify-between hover:bg-primary hover:text-white transition-colors group/btn">
                    Access Resource
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/btn:text-white transition-colors" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Bonus Box */}
      <Card className="bg-[#07111F] text-white border-0 shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Constantly Updated
            </div>
            <h2 className="text-2xl font-bold mb-2">Need more help?</h2>
            <p className="text-white/70 max-w-md text-md mb-0">Our mentors are always available to provide guidance. If you need specific resources for your project domain, reach out to support.</p>
          </div>
          <a href="mailto:admin@veritasco.tech" className="w-full md:w-auto shrink-0">
            <Button size="lg" className="w-full h-14 px-8 text-lg bg-white text-[#07111F] hover:bg-white/90 shadow-lg">
              Contact Mentor
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
