import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const application = await prisma.internshipApplication.findUnique({
      where: { id: applicationId },
      include: { user: true, domain: true },
    });

    if (!application || application.user?.id !== session.user.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "PAYMENT_PENDING") {
      return Response.json({ error: "Application is not pending payment" }, { status: 400 });
    }

    const amount = 1 * 100; // 1 INR in paise (testing)
    const currency = "INR";
    const receipt = `rcpt_${application.id.substring(0, 10)}`;

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    return Response.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });

  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
