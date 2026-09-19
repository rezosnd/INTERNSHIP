import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
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

  if (profile) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Complete Your Profile
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Please provide your academic and personal information to continue with your internship application.
          </p>
        </div>
        <OnboardingForm defaultEmail={session.user.email || ""} defaultName={session.user.name || ""} />
      </div>
    </div>
  );
}
