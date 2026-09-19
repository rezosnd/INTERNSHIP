import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#07111F] mb-8">About VeritasCo</h1>
          <div className="prose prose-lg max-w-none text-slate-600 space-y-6">
            <p>
              VeritasCo is a premier technology platform dedicated to bridging the gap between academic learning and real-world industry demands. We specialize in providing immersive internship experiences where students can build, learn, and prove their skills.
            </p>
            <h2 className="text-2xl font-bold text-[#07111F] mt-12 mb-4">Our Mission</h2>
            <p>
              Our mission is to empower the next generation of engineers, designers, and managers by providing access to enterprise-level projects. We believe that true learning happens through building, and our platform is designed to facilitate that growth.
            </p>
            <h2 className="text-2xl font-bold text-[#07111F] mt-12 mb-4">What We Do</h2>
            <p>
              We partner with top-tier technical talent to deliver verifiable, high-quality internship certificates. By evaluating real GitHub contributions and live deployments, we ensure that every certificate issued by VeritasCo holds genuine weight in the job market.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
