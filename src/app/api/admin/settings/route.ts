import { NextResponse } from "next-auth/next"; // using standard NextResponse
import { NextResponse as Response } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.platformSettings.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: { id: "global", feeAmount: 1 }, // Default to 1 INR for ongoing testing
      });
    }

    return Response.json(settings);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { feeAmount } = await req.json();

    if (typeof feeAmount !== "number" || feeAmount < 0) {
      return Response.json({ error: "Invalid fee amount" }, { status: 400 });
    }

    const settings = await prisma.platformSettings.upsert({
      where: { id: "global" },
      update: { feeAmount },
      create: { id: "global", feeAmount },
    });

    return Response.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
