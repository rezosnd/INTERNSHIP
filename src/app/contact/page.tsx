import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#07111F] mb-8">Contact Us</h1>
          <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
            <p>We are here to help. If you have any questions about our internship programs, verification process, or platform, please feel free to reach out to us.</p>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-8">
              <h2 className="text-xl font-bold text-[#07111F] mb-2">Email Support</h2>
              <p className="text-[#4F8DFF] font-medium text-lg mb-6">
                <a href="mailto:admin@veritasco.tech">admin@veritasco.tech</a>
              </p>
              
              <h2 className="text-xl font-bold text-[#07111F] mb-2">Business Hours</h2>
              <p className="text-slate-600 mb-6">Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
