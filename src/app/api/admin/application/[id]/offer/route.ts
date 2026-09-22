import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.internshipApplication.findUnique({
      where: { id },
      include: {
        user: {
          include: { studentProfile: true }
        },
        domain: true
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "SUBMITTED") {
      return NextResponse.json({ error: "Application is not in SUBMITTED state" }, { status: 400 });
    }

    // Update the application status to PAYMENT_PENDING
    const updatedApplication = await prisma.internshipApplication.update({
      where: { id },
      data: {
        status: "PAYMENT_PENDING",
        offerLetterSentAt: new Date(),
      }
    });

    // Send the email
    const studentName = application.user.studentProfile?.fullName || application.user.name || "Student";
    const studentEmail = application.user.email;
    const domainName = application.domain.name;

    if (studentEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL || "admin@veritasco.tech",
          pass: process.env.SMTP_PASSWORD || "your-app-password",
        },
      });

      const mailOptions = {
        from: `"VeritasCo Tech" <${process.env.SMTP_EMAIL || "admin@veritasco.tech"}>`,
        to: studentEmail,
        subject: "Action Required: Your VeritasCo Internship Offer Letter",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Offer Letter — VeritasCo</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; }
        .email-wrapper { padding: 40px 20px; width: 100%; box-sizing: border-box; }
        .email-card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .top-rule { height: 4px; background-color: #07111F; }
        .header { padding: 24px 32px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; }
        .header img { height: 32px; display: block; }
        .body-content { padding: 32px; }
        h1 { font-size: 24px; font-weight: 700; color: #07111F; margin: 0 0 16px 0; letter-spacing: -0.02em; }
        p { font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 16px 0; }
        p strong { color: #07111F; font-weight: 600; }
        .btn-wrap { margin: 32px 0 24px; text-align: center; }
        .btn { display: inline-block; background-color: #07111F; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .btn:hover { background-color: #0f172a; }
        .footer { padding: 24px 32px; border-top: 1px solid #f1f5f9; background-color: #f8fafc; text-align: center; }
        .footer p { font-size: 12px; color: #64748b; margin: 0 0 4px 0; }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-card">
            <div class="top-rule"></div>
            <div class="header">
                <img src="https://recheck.veritasco.tech/veritasco.png" alt="VeritasCo">
            </div>
            <div class="body-content">
                <h1>Internship Offer Letter</h1>
                <p>Dear <strong>${studentName}</strong>,</p>
                <p>We have carefully reviewed your application and are pleased to formally offer you an internship position in the <strong>${domainName}</strong> domain at VeritasCo Tech.</p>
                <p>To view your official Offer Letter and proceed with the necessary steps to confirm your acceptance, please log in to your dashboard.</p>
                
                <div class="btn-wrap">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="btn">View Offer Letter</a>
                </div>
                
                <p>We look forward to welcoming you to our team.</p>
                <p style="margin-top: 24px;">Sincerely,<br><strong>The VeritasCo Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply directly to this email.</p>
                <p>&copy; 2026 VeritasCo Tech. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, application: updatedApplication });
  } catch (error) {
    console.error("Error sending offer letter:", error);
    return NextResponse.json({ error: "Failed to send offer letter" }, { status: 500 });
  }
}
