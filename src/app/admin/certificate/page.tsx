"use client"

import { CertificateForm } from "@/components/admin/CertificateForm"
import { CertificatePreview } from "@/components/admin/CertificatePreview"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft, Send, Code, Globe, Loader2, Info } from "lucide-react"
import Link from "next/link"
import * as htmlToImage from "html-to-image"
import jsPDF from "jspdf"
import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useCertificateStore } from "@/store/useCertificateStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CertificateEditorPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#0d1424] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <CertificateEditorContent />
    </Suspense>
  )
}

function CertificateEditorContent() {
  const searchParams = useSearchParams()
  const applicationId = searchParams?.get("applicationId")
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isLoadingApp, setIsLoadingApp] = useState(false)
  const [appData, setAppData] = useState<any>(null)
  
  const updateData = useCertificateStore((state) => state.updateData)

  useEffect(() => {
    if (applicationId) {
      setIsLoadingApp(true)
      fetch(`/api/admin/application/${applicationId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setAppData(data)
            // Pre-fill the Zustand store so the Form and Preview inherit it
            updateData({
              studentName: data.user?.studentProfile?.fullName || data.user?.name || "",
              collegeName: data.user?.studentProfile?.instituteName || "",
              domain: data.domain?.name || "",
              startDate: new Date(data.startDate).toISOString().split('T')[0],
              endDate: new Date(data.completionDate).toISOString().split('T')[0],
              issueDate: new Date().toISOString().split('T')[0],
            })
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingApp(false))
    }
  }, [applicationId, updateData])

  const downloadPdf = async () => {
    const element = document.getElementById('certificate-preview')
    if (!element) return
    
    setIsGenerating(true)
    try {
      if (appData) {
        // 1. Save to database first so the QR Code link is valid
        const saveRes = await fetch("/api/admin/certificate/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId: appData.id,
            certificateId: useCertificateStore.getState().data.certificateId,
            studentName: useCertificateStore.getState().data.studentName,
            collegeName: useCertificateStore.getState().data.collegeName,
            domain: useCertificateStore.getState().data.domain,
            startDate: useCertificateStore.getState().data.startDate,
            endDate: useCertificateStore.getState().data.endDate,
            issueDate: useCertificateStore.getState().data.issueDate,
          })
        })

        if (!saveRes.ok) throw new Error("Failed to save certificate")
      }

      // 2. Generate Image & PDF
      const imgData = await htmlToImage.toJpeg(element, { 
        quality: 1.0,
        pixelRatio: 3 
      })
      
      const width = element.offsetWidth * 3
      const height = element.offsetHeight * 3

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [width, height]
      })
      
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height)
      const studentName = appData?.user?.studentProfile?.fullName || useCertificateStore.getState().data.studentName || 'Student';
      pdf.save(`VeritasCo_Certificate_${studentName.replace(/\s+/g, '_')}.pdf`)
    } catch (err) {
      console.error(err)
      alert("Error generating certificate.")
    } finally {
      setIsGenerating(false)
    }
  }

  const sendEmail = async () => {
    const defaultEmail = appData?.user?.email || ""
    const email = window.prompt("Enter student's email address to send certificate:", defaultEmail)
    if (!email) return

    const element = document.getElementById('certificate-preview')
    if (!element) return
    
    setIsSending(true)
    try {
      if (appData) {
        // 1. Save to database first
        const saveRes = await fetch("/api/admin/certificate/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId: appData.id,
            certificateId: useCertificateStore.getState().data.certificateId,
            studentName: useCertificateStore.getState().data.studentName,
            collegeName: useCertificateStore.getState().data.collegeName,
            domain: useCertificateStore.getState().data.domain,
            startDate: useCertificateStore.getState().data.startDate,
            endDate: useCertificateStore.getState().data.endDate,
            issueDate: useCertificateStore.getState().data.issueDate,
          })
        })

        if (!saveRes.ok) {
          throw new Error("Failed to save certificate to database")
        }
      }

      // 2. Generate Image
      const imgData = await htmlToImage.toJpeg(element, { 
        quality: 0.8,
        pixelRatio: 2 
      })

      // 3. Send Email
      const certificateId = useCertificateStore.getState().data.certificateId || appData?.certificate?.certificateId;
      const studentName = appData?.user?.studentProfile?.fullName?.split(" ")[0] || useCertificateStore.getState().data.studentName.split(" ")[0] || "Student";
      
      const res = await fetch("/api/admin/certificate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          imageData: imgData,
          studentName,
          verificationUrl: `${window.location.origin}/verify/${certificateId}`
        })
      })

      if (res.ok) {
        alert("Certificate issued and emailed successfully!")
      } else {
        alert("Failed to send email.")
      }
    } catch (err) {
      console.error(err)
      alert("Error generating certificate for email.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="h-screen w-full bg-[#0d1424] flex flex-col overflow-hidden">
      {/* Topbar */}
      <header className="h-14 bg-[#0d1424] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <h1 className="text-sm font-bold text-white uppercase tracking-widest">
            VeritasCo Certificate Generator
          </h1>
          {isLoadingApp && (
            <span className="flex items-center text-xs text-[#4F8DFF]">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Loading Application Data...
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Moved buttons to the sidebar for better visibility */}
        </div>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar Form & Actions */}
        <aside className="w-full md:w-[420px] bg-[#0d1424] border-r border-white/10 shrink-0 h-full overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            <CertificateForm prefillData={appData} />
          </div>
          
          {/* MASSIVE ACTION BUTTONS AT BOTTOM OF SIDEBAR */}
          <div className="p-4 border-t border-white/10 bg-[#080c16] flex flex-col gap-3 shrink-0">
            <Button 
              onClick={sendEmail} 
              disabled={isSending || isGenerating}
              className="w-full bg-[#4F8DFF] hover:bg-[#4F8DFF]/90 text-white font-bold h-12 text-sm shadow-lg shadow-blue-900/20"
            >
              {isSending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending Email...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Generate & Send Email</>
              )}
            </Button>
            <Button 
              onClick={downloadPdf} 
              disabled={isGenerating || isSending}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 font-bold h-12 text-sm"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating PDF...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" /> Download High-Res PDF</>
              )}
            </Button>
          </div>
        </aside>
        
        {/* Center Preview */}
        <main className="flex-1 bg-[#1e293b] h-full overflow-auto flex flex-col relative p-8">
          <div className="max-w-[1000px] mx-auto w-full mb-8">
             <CertificatePreview />
          </div>

          {/* Project Details Panel (Below Preview) */}
          {appData && (
            <div className="max-w-[1000px] mx-auto w-full pb-12">
              <Card className="bg-[#0d1424] border-white/10 shadow-2xl text-slate-300">
                <CardHeader className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#4F8DFF]" />
                    <CardTitle className="text-lg text-white">Student Project Verification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project Title</h4>
                      <p className="text-sm text-white font-medium">{appData.projectTitle}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">GitHub Repository</h4>
                      <a href={appData.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-[#4F8DFF] hover:underline">
                        <Code className="w-4 h-4 mr-1.5" />
                        {appData.githubUrl}
                      </a>
                    </div>
                    {appData.liveUrl && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Live URL</h4>
                        <a href={appData.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-[#4F8DFF] hover:underline">
                          <Globe className="w-4 h-4 mr-1.5" />
                          {appData.liveUrl}
                        </a>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {appData.technologies.map((tech: string) => (
                          <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Features Implemented</h4>
                      <p className="text-sm leading-relaxed">{appData.features}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Key Contributions</h4>
                      <p className="text-sm leading-relaxed">{appData.contribution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
        
      </div>
    </div>
  )
}
