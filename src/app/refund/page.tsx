import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#07111F] mb-8">Refund Policy</h1>
          <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">Processing Fees</h2>
            <p>The internship registration and processing fee is generally non-refundable once the application has been processed and a certificate has been generated.</p>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">Eligible Refunds</h2>
            <p>Refunds will only be issued under the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Multiple accidental payments for the same application.</li>
              <li>Technical failures on our platform that prevent you from submitting your project details within 30 days of payment.</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">Non-Eligible Refunds</h2>
            <p>Refunds will not be issued for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Applications rejected due to plagiarism or invalid project URLs.</li>
              <li>Change of mind after the application has been submitted.</li>
              <li>Failure to complete the internship project.</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-[#07111F] mt-8 mb-4">Contact Us</h2>
            <p>If you believe you are eligible for a refund, please contact us at <strong>admin@veritasco.tech</strong> within 7 days of your payment with your receipt and application details.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
