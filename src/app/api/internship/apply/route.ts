import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return Response.json({ error: "Student profile not found" }, { status: 400 });
    }

    const existingApplication = await prisma.internshipApplication.findFirst({
      where: { userId: session.user.id },
    });

    if (existingApplication) {
      return Response.json({ error: "You already have an active application" }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = applicationSchema.parse(body);

    const application = await prisma.internshipApplication.create({
      data: {
        userId: session.user.id,
        applicationNumber: `VC-${Date.now().toString().slice(-6)}`,
        domainId: validatedData.domainId,
        duration: `${validatedData.durationWeeks} weeks`,
        projectTitle: validatedData.projectTitle,
        projectDescription: validatedData.projectDescription,
        githubUrl: validatedData.githubLink,
        liveUrl: validatedData.liveLink || undefined,
        technologies: validatedData.techStack.split(",").map((t: string) => t.trim()),
        startDate: new Date(),
        completionDate: new Date(Date.now() + validatedData.durationWeeks * 7 * 24 * 60 * 60 * 1000),
        features: "",
        contribution: "",
        challenges: "",
        learningOutcome: "",
        status: "PAYMENT_PENDING",
      },
    });

    return Response.json(application, { status: 201 });
  } catch (error: any) {
    console.error("Application Error:", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Invalid input data", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
