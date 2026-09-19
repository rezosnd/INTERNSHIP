import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = onboardingSchema.parse(body);

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return Response.json({ error: "Profile already exists" }, { status: 400 });
    }

    const profile = await prisma.studentProfile.create({
      data: {
        userId: session.user.id,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        instituteName: validatedData.instituteName,
        course: validatedData.course,
        branch: validatedData.branch,
        graduationYear: validatedData.graduationYear,
        studentId: validatedData.studentId,
      },
    });

    return Response.json(profile, { status: 201 });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Invalid input data", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
