import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#07111F] mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
            <p><strong>Last Updated:</strong> September 2026</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you register for an internship, including your name, email address, educational institution, and project details (such as GitHub URLs).</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to process your internship application, issue verifiable certificates, provide support, and communicate with you about your application status.</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">3. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. Your payment data is handled securely by our payment processors and is never stored on our servers.</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">4. Certificate Verification</h2>
            <p>Please note that by obtaining a certificate from VeritasCo, the details of your certificate (Name, Domain, Duration) will be publicly verifiable via our verification portal to allow employers to validate your credentials.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
