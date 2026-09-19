import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, imageData, studentName, verificationUrl } = await req.json();

    if (!email || !imageData) {
      return NextResponse.json({ error: "Email and imageData are required" }, { status: 400 });
    }

    // Convert base64 image data to buffer
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL || "admin@veritasco.tech", // fallback
        pass: process.env.SMTP_PASSWORD || "your-app-password",
      },
    });

    const mailOptions = {
      from: `"VeritasCo Tech" <${process.env.SMTP_EMAIL || "admin@veritasco.tech"}>`,
      to: email,
      subject: "Your Internship Certificate from VeritasCo Tech",
      html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Certificate of Completion — VeritasCo</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            outline: none;
            text-decoration: none;
            display: block;
        }

        table {
            border-collapse: collapse !important;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            -webkit-font-smoothing: antialiased;
        }

        .email-wrapper {
            background-color: #f2f2f2;
            padding: 24px 16px;
            width: 100%;
        }

        .email-card {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 4px;
            border: 1px solid #d9d9d9;
            overflow: hidden;
        }

        /* ── Top accent ── */
        .top-rule {
            height: 3px;
            background-color: #111111;
        }

        /* ── Header ── */
        .header {
            padding: 16px 28px;
            border-bottom: 1px solid #e5e5e5;
            background-color: #ffffff;
        }

        .header img {
            height: 28px;
            width: auto;
            display: block;
        }

        /* ── Body ── */
        .body-content {
            padding: 24px 28px 20px;
            background-color: #ffffff;
        }

        h1 {
            font-size: 20px;
            font-weight: 700;
            color: #111111;
            margin: 0 0 14px 0;
            line-height: 1.3;
            letter-spacing: -0.02em;
        }

        p {
            font-size: 14px;
            color: #444444;
            line-height: 1.65;
            margin: 0 0 11px 0;
        }

        p strong {
            color: #111111;
            font-weight: 600;
        }

        .btn-wrap {
            margin: 16px 0 12px;
        }

        .btn {
            display: inline-block;
            background-color: #111111;
            color: #ffffff !important;
            text-decoration: none;
            padding: 11px 22px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.01em;
        }

        .section-rule {
            border: none;
            border-top: 1px solid #e5e5e5;
            margin: 16px 0 12px;
        }

        .sig-name {
            font-size: 13px;
            font-weight: 600;
            color: #111111;
            margin: 0 0 2px 0;
        }

        .sig-title {
            font-size: 11.5px;
            color: #888888;
            margin: 0;
        }

        /* ── Footer ── */
        .footer {
            padding: 12px 28px;
            border-top: 1px solid #e5e5e5;
            background-color: #f7f7f7;
        }

        .footer p {
            font-size: 10.5px;
            color: #999999;
            margin: 0 0 3px 0;
            line-height: 1.55;
        }

        .footer a {
            color: #666666;
            text-decoration: none;
        }

        /* ══════════════════════════════════════
           DARK MODE — pure black & white
        ══════════════════════════════════════ */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #111111 !important;
            }

            .email-wrapper {
                background-color: #111111 !important;
            }

            .email-card {
                background-color: #1a1a1a !important;
                border-color: #2e2e2e !important;
            }

            .top-rule {
                background-color: #ffffff !important;
            }

            .header {
                background-color: #1a1a1a !important;
                border-color: #2e2e2e !important;
            }

            .body-content {
                background-color: #1a1a1a !important;
            }

            h1 {
                color: #f5f5f5 !important;
            }

            p {
                color: #aaaaaa !important;
            }

            p strong {
                color: #f5f5f5 !important;
            }

            p a {
                color: #dddddd !important;
            }

            .btn {
                background-color: #ffffff !important;
                color: #111111 !important;
            }

            .section-rule {
                border-color: #2e2e2e !important;
            }

            .sig-name {
                color: #f0f0f0 !important;
            }

            .sig-title {
                color: #666666 !important;
            }

            .footer {
                background-color: #141414 !important;
                border-color: #2e2e2e !important;
            }

            .footer p {
                color: #444444 !important;
            }

            .footer a {
                color: #555555 !important;
            }
        }

        /* ── Mobile: FULL SCREEN, no gaps ── */
        @media only screen and (max-width: 600px) {
            html,
            body {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            .email-wrapper {
                padding: 0 !important;
                width: 100% !important;
            }

            .email-card {
                border-radius: 0 !important;
                border-left: 0 !important;
                border-right: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            .header {
                padding: 14px 20px !important;
            }

            .header img {
                height: 24px !important;
            }

            .body-content {
                padding: 18px 20px 16px !important;
            }

            .footer {
                padding: 10px 20px !important;
            }

            h1 {
                font-size: 18px !important;
                margin-bottom: 12px !important;
            }

            p {
                font-size: 13.5px !important;
                margin-bottom: 10px !important;
            }

            .btn {
                display: block !important;
                text-align: center !important;
                width: 100% !important;
                padding: 13px 16px !important;
            }

            .btn-wrap {
                margin: 14px 0 10px !important;
            }

            .section-rule {
                margin: 14px 0 10px !important;
            }
        }
    </style>
</head>

<body style="background-color: #f2f2f2; margin: 0; padding: 0;">
    <div class="email-wrapper">
        <div class="email-card">
            <!-- Accent bar -->
            <div class="top-rule"></div>

            <!-- Header -->
            <div class="header">
                <img src="https://recheck.veritasco.tech/veritasco.png" alt="VeritasCo" height="28">
            </div>

            <!-- Body -->
            <div class="body-content">
                <h1>Your Certificate of Completion<br>has been issued.</h1>

                <p>Dear <strong>${studentName || "Student"}</strong>,</p>

                <p>
                    We are pleased to inform you that your <strong>Certificate of Completion</strong> has been
                    officially issued by VeritasCo upon the successful conclusion of your internship program.
                    This credential reflects your dedication, professional conduct, and the quality of work
                    delivered throughout the engagement.
                </p>

                <p>
                    Your certificate is attached to this email as an image. You can also view and verify your certificate
                    online using the verification portal. We encourage you to add this
                    credential to your LinkedIn profile, professional portfolio, or résumé — it stands as a
                    formal recognition of your contribution.
                </p>

                <p>
                    If you require any clarification regarding your certificate, please contact us at
                    <a href="mailto:admin@veritasco.tech"
                        style="color: #111111; font-weight: 500; text-decoration: underline;">admin@veritasco.tech</a>.
                </p>

                <!-- CTA -->
                <div class="btn-wrap">
                    <a href="${verificationUrl}"
                        class="btn" target="_blank">
                        View &amp; Verify Certificate
                    </a>
                </div>

                <hr class="section-rule">

                <p class="sig-name">VeritasCo Team</p>
                <p class="sig-title">VeritasCo</p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>This email is intended solely for the recipient named above.</p>
                <p>
                    <a href="https://veritasco.tech">veritasco.tech</a>
                    &nbsp;&middot;&nbsp;
                    <a href="mailto:admin@veritasco.tech">admin@veritasco.tech</a>
                </p>
                <p>&copy; 2026 VeritasCo. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
      `,
      attachments: [
        {
          filename: "VeritasCo_Certificate.jpg",
          content: imageBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
