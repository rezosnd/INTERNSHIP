import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MultiStepApplyForm from "./MultiStepApplyForm";

export default async function ApplyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  // Check if they already have an application
  const existingApplication = await prisma.internshipApplication.findFirst({
    where: { userId: session.user.id },
  });

  if (existingApplication) {
    if (existingApplication.status === "PAYMENT_PENDING") {
      redirect(`/payment?applicationId=${existingApplication.id}`);
    }
    redirect("/dashboard");
  }

  const domains = await prisma.domain.findMany({
    orderBy: { name: "asc" },
  });

  const settings = await prisma.platformSettings.findUnique({
    where: { id: "global" },
  });
  const feeAmount = settings?.feeAmount ?? 349;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <MultiStepApplyForm domains={domains} profile={profile} feeAmount={feeAmount} />
      </div>
    </div>
  );
}
