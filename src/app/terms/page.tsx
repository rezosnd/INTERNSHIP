import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#07111F] mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
            <p><strong>Last Updated:</strong> September 2026</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using VeritasCo.tech, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">2. Internship Requirements</h2>
            <p>To receive a certificate of completion, users must submit valid project work. VeritasCo reserves the right to reject applications that contain plagiarized, incomplete, or invalid project submissions.</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">3. Payment & Processing</h2>
            <p>The processing fee covers the administrative cost of evaluating your project and generating the secure, verifiable credential. Payment of the fee does not guarantee a certificate if the submitted work violates our academic integrity policies.</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">4. Platform Modifications</h2>
            <p>VeritasCo reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice to the user.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
