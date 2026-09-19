import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      applicationId, 
      certificateId, 
      studentName, 
      collegeName, 
      domain, 
      startDate, 
      endDate, 
      issueDate 
    } = body;

    if (!applicationId || !certificateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert the certificate record
    const certificate = await prisma.certificate.upsert({
      where: { applicationId },
      update: {
        certificateId,
        studentNameSnapshot: studentName,
        instituteSnapshot: collegeName,
        domainSnapshot: domain,
        projectTitleSnapshot: "Internship Project", // Or pass from UI
        startDateSnapshot: new Date(startDate),
        endDateSnapshot: new Date(endDate),
        issueDate: new Date(issueDate),
        status: "ISSUED",
        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateId}`,
      },
      create: {
        applicationId,
        certificateId,
        studentNameSnapshot: studentName,
        instituteSnapshot: collegeName,
        domainSnapshot: domain,
        projectTitleSnapshot: "Internship Project",
        startDateSnapshot: new Date(startDate),
        endDateSnapshot: new Date(endDate),
        issueDate: new Date(issueDate),
        status: "ISSUED",
        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateId}`,
      }
    });

    // Update application status
    await prisma.internshipApplication.update({
      where: { id: applicationId },
      data: { status: "CERTIFICATE_ISSUED" }
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error("Save Certificate Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
