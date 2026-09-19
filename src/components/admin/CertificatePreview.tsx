import { useCertificateStore } from "@/store/useCertificateStore"
import { forwardRef, useEffect, useState } from "react"
import { format } from "date-fns"
import { QRCodeCanvas } from "qrcode.react"

function fmtDate(ds: string) {
  if (!ds) return ""
  try {
    const d = new Date(ds)
    return format(d, "dd/MM/yyyy")
  } catch { return ds }
}

export const CertificatePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const data = useCertificateStore((s) => s.data)

  const rawFirstName = data.studentName?.trim().split(" ")[0] || "the intern"
  const firstName = rawFirstName !== "the intern"
    ? rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1).toLowerCase()
    : "the intern"
  const fullNameUpper = data.studentName?.trim().toUpperCase() || "CANDIDATE NAME"
  const domain = data.domain || "Software Development"

  const startsWithVowel = /^[aeiou]/i.test(domain)
  const article = startsWithVowel ? "an" : "a"
  const skills = data.skills
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  const bodyFont = 'var(--font-geist-sans), "Arial", sans-serif'
  const titleFont = 'var(--font-cinzel), serif'

  // Refined Color Palette
  const textColor = "#111111" // Charcoal Black
  const navyBlue = "#0B2468"

  const [verificationUrl, setVerificationUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined" && data.certificateId) {
      setVerificationUrl(`${window.location.origin}/verify/${data.certificateId}`)
    }
  }, [data.certificateId])

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* ══════════════════════════════════════════════════════════
          ROOT — A4 PORTRAIT  794 × 1123 px
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={ref}
        id="certificate-preview"
        style={{
          position: "relative",
          width: "794px",
          height: "1123px",
          backgroundColor: "#FFFFFF",
          color: textColor,
          fontFamily: bodyFont,
          boxSizing: "border-box",
          overflow: "hidden",
          flexShrink: 0,
          padding: "70px 80px", // Generous whitespace margins
          display: "block"
        }}
      >

        {/* ── TOP-LEFT CORNER ── */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "90px", height: "90px", zIndex: 4, pointerEvents: "none", opacity: 0.85 }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "90px", height: "90px", background: "#8895A5", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: "75px", height: "75px", background: navyBlue, clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
        </div>

        {/* ── BOTTOM-RIGHT CORNER ── */}
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "90px", height: "90px", zIndex: 4, pointerEvents: "none", opacity: 0.85 }}>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "90px", height: "90px", background: "#8895A5", clipPath: "polygon(100% 100%, 0 100%, 100% 0)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "75px", height: "75px", background: navyBlue, clipPath: "polygon(100% 100%, 0 100%, 100% 0)" }} />
        </div>

        {/* Sharper Double Border */}
        <div style={{
          position: "absolute",
          inset: "25px",
          border: `1.5px solid ${textColor}`,
          zIndex: 2,
          pointerEvents: "none"
        }}>
          <div style={{
            position: "absolute",
            inset: "4px",
            border: `0.75px solid ${navyBlue}`, // Subtle blue inner line accent
          }} />
        </div>

        {/* Center Watermark V-Logo - Opacity reduced to 3.5%, improved symmetry */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            opacity: 0.035,
            pointerEvents: "none",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/veritasco.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            zIndex: 10,
            marginBottom: "15px",
          }}
        >
          {/* Left: Company Address */}
          <div style={{ fontSize: "11px", color: textColor, lineHeight: 1.5 }}>
            <div style={{ height: "24px", position: "relative", marginBottom: "12px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/veritasco-written.png" alt="VeritasCo." style={{ position: "absolute", top: "50%", left: "-15px", transform: "translateY(-50%)", width: "135px", height: "auto", objectFit: "contain", objectPosition: "left center" }} />
            </div>
            <p style={{ margin: 0 }}>Maurya Lok Complex, New Dak Bunglow Road</p>
            <p style={{ margin: 0 }}>Lodipur, Patna, Bihar 800001</p>
            <p style={{ margin: 0 }}>Ph. No: +91 8709442363</p>
            <p style={{ margin: 0, fontWeight: 500 }}>www.veritasco.tech</p>
          </div>

          {/* Right: Logo */}
          <div style={{ position: "relative", width: "150px", height: "45px", marginTop: "5px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/veritasco.png"
              alt="VeritasCo."
              style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "right top", filter: "contrast(1.05)" }}
            />
          </div>
        </div>

        {/* Divider Line */}
        <div style={{ borderBottom: `1px solid ${textColor}`, marginBottom: "20px", position: "relative", zIndex: 10 }} />

        {/* ══════════════════════════════════════════════════════
            REFERENCE & DATE
        ══════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 500, position: "relative", zIndex: 10, marginBottom: "30px" }}>
          <div>
            {data.certificateId ? <p style={{ margin: "0 0 6px 0" }}>Ref. No. : <span style={{ fontWeight: 700 }}>{data.certificateId}</span></p> : null}
            {data.registrationId ? <p style={{ margin: 0 }}>Reg. ID : <span style={{ fontWeight: 700 }}>{data.registrationId}</span></p> : null}
          </div>
          <div style={{ color: "blue" }}>
            <p style={{ margin: 0 }}>Date : <span style={{ fontWeight: 700 }}>{data.issueDate ? format(new Date(data.issueDate), "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy")}</span></p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            TITLES
        ══════════════════════════════════════════════════════ */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 10, marginBottom: "35px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontFamily: titleFont,
              fontWeight: 800,
              margin: "0 0 15px 0",
              letterSpacing: "0.05em",
            }}
          >
            INTERNSHIP COMPLETION CERTIFICATE
          </h1>

          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#333333"
            }}
          >
            To whom it may concern
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════════
            BODY TEXT (Clean & Professional Spacing)
        ══════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            fontSize: "14px",
            lineHeight: 1.7,
            textAlign: "justify",
            color: "#222222",
          }}
        >
          <p style={{ marginBottom: "16px", marginTop: 0 }}>
            This is to certify that <span style={{ fontFamily: titleFont, fontSize: "16px", fontWeight: 700, color: textColor }}>{data.salutation || "Mr."} {fullNameUpper}</span>
            <span>, from <span style={{ fontWeight: 600 }}>{data.collegeName || data.university || "KIIT UNIVERSITY BHUWANESWAR"}</span>,</span> has successfully completed their internship as {article} <span style={{ fontWeight: 600 }}>{domain}</span> Intern at <span style={{ fontWeight: 600 }}>VeritasCo., Patna</span> from <span style={{ fontWeight: 600 }}>{fmtDate(data.startDate) || "01/01/2026"}</span> to <span style={{ fontWeight: 600 }}>{fmtDate(data.endDate) || "30/06/2026"}</span>.
          </p>

          {data.remarks ? (
            <p style={{ marginBottom: "16px", marginTop: 0, whiteSpace: "pre-line" }}>
              {data.remarks}
            </p>
          ) : (
            <p style={{ marginBottom: "16px", marginTop: 0 }}>
              They have worked on a live project and assisted the technical team in developing the core modules. This project was aimed at building robust software solutions and applications for the company, providing them with hands-on experience in a professional environment.
            </p>
          )}

          <p style={{ marginBottom: "16px", marginTop: 0 }}>
            During their tenure, they have done extensive work focusing primarily on <span style={{ fontWeight: 600 }}>{skills.length > 0 ? skills.join(", ") : "modern web technologies"}</span> and have demonstrated a strong willingness to learn skills beyond their area of interest to achieve outstanding results for the company.
          </p>

          <p style={{ marginBottom: "16px", marginTop: 0 }}>
            Throughout the internship, {data.studentName ? firstName : "the candidate"} has demonstrated exemplary dedication, hard work, and professionalism, receiving an overall evaluation of <span style={{ fontWeight: 600 }}>{data.grade || "A"}</span>. {data.studentName ? firstName : "They"} also contributed to the initial client traction and activities. They have completed all the tasks entrusted to them efficiently and with a high degree of professionalism.
          </p>

          <p style={{ marginBottom: "0", marginTop: "20px", fontWeight: 500, textAlign: "center", fontSize: "15px", fontStyle: "italic", color: "#444444" }}>
            We wish them the very best in all their future endeavors.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            FOOTER - Absolute positioned to avoid overflow
        ══════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            right: "80px",
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Left Column: Signatures & Address */}
          <div style={{ fontSize: "12px", lineHeight: 1.6 }}>
            <p style={{ fontWeight: 700, margin: "0 0 10px 0", color: "#333333" }}>For VeritasCo.</p>

            {/* Signature Image */}
            <div style={{ position: "relative", width: "140px", height: "60px", marginBottom: "5px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/CTO_SIG.png"
                alt="Signature"
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "left bottom", filter: "contrast(1.1) brightness(0.95)" }}
              />
            </div>

            <div style={{ borderTop: `1.5px solid ${textColor}`, width: "160px", marginBottom: "8px" }} />

            <p style={{ fontFamily: titleFont, fontWeight: 800, fontSize: "14px", margin: "0 0 2px 0", letterSpacing: "0.02em" }}>{data.mentorName || "Rehan Suman"}</p>
            <p style={{ fontWeight: 600, margin: "0 0 10px 0", color: "#555555" }}>Chief Technology Officer</p>

            <p style={{ margin: 0, fontWeight: 700, color: navyBlue }}>VeritasCo.</p>
            <p style={{ margin: 0, color: "#444444" }}>Maurya Lok Complex, New Dak Bunglow Rd.</p>
            <p style={{ margin: 0, color: "#444444" }}>Lodipur, Patna, Bihar 800001</p>
          </div>

          {/* Right Column: QR Code verification */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: "5px", textAlign: "right", width: "120px" }}>
            {verificationUrl ? (
              <>
                <div style={{ padding: "4px", background: "white", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "4px" }}>
                  <QRCodeCanvas value={verificationUrl} size={80} level="M" />
                </div>
                <p style={{ fontSize: "8px", color: "#666", margin: 0, maxWidth: "100px", lineHeight: 1.2 }}>
                  Scan to verify authenticity
                </p>
              </>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  )
})
CertificatePreview.displayName = "CertificatePreview"
