import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      applicationId 
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !applicationId) {
      return Response.json({ error: "Missing required payment details" }, { status: 400 });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return Response.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const application = await prisma.internshipApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application || application.user.id !== session.user.id) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    // Process payment in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Create Payment Record
      await tx.payment.create({
        data: {
          applicationId: application.id,
          userId: application.userId,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amount: 100, // 1 INR in paise (testing)
          currency: "INR",
          status: "SUCCESS",
          paidAt: new Date(),
        }
      });

      // Update Application Status
      await tx.internshipApplication.update({
        where: { id: application.id },
        data: { status: "PAID" }
      });
    });

    return Response.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
