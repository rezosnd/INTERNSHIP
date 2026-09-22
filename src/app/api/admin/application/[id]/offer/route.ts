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
        body { font-family: 'Inter', sans-serif; background-color: #f2f2f2; margin: 0; padding: 0; }
        .email-wrapper { padding: 24px 16px; width: 100%; box-sizing: border-box; }
        .email-card { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; border: 1px solid #d9d9d9; overflow: hidden; }
        .top-rule { height: 3px; background-color: #111111; }
        .header { padding: 16px 28px; border-bottom: 1px solid #e5e5e5; }
        .header img { height: 28px; display: block; }
        .body-content { padding: 24px 28px 20px; }
        h1 { font-size: 20px; font-weight: 700; color: #111111; margin: 0 0 14px 0; }
        p { font-size: 14px; color: #444444; line-height: 1.65; margin: 0 0 11px 0; }
        p strong { color: #111111; font-weight: 600; }
        .btn-wrap { margin: 16px 0 12px; }
        .btn { display: inline-block; background-color: #111111; color: #ffffff !important; text-decoration: none; padding: 11px 22px; border-radius: 4px; font-size: 13px; font-weight: 600; }
        .footer { padding: 12px 28px; border-top: 1px solid #e5e5e5; background-color: #f7f7f7; }
        .footer p { font-size: 10.5px; color: #999999; margin: 0 0 3px 0; }
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
                <h1>Congratulations!<br>Your Internship Offer is ready.</h1>
                <p>Dear <strong>${studentName}</strong>,</p>
                <p>We have reviewed your application and are pleased to offer you an internship position in the <strong>${domainName}</strong> domain at VeritasCo Tech.</p>
                <p>Please log in to your dashboard to view your official Offer Letter and proceed with the necessary steps to confirm your acceptance.</p>
                
                <div class="btn-wrap">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="btn">View Offer Letter</a>
                </div>
                
                <p>We look forward to welcoming you to the team!</p>
                <p style="margin-top: 20px;"><strong>VeritasCo Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2026 VeritasCo. All rights reserved.</p>
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
