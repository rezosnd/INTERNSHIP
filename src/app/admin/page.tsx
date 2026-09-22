import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Briefcase, IndianRupee, LayoutDashboard, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsPanel } from "./SettingsPanel";

import { SendOfferButton } from "@/components/admin/SendOfferButton";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  // Fetch KPI Data
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  
  const activeApplications = await prisma.internshipApplication.count({
    where: {
      status: {
        in: ["PAID", "UNDER_REVIEW", "APPROVED", "CERTIFICATE_PROCESSING"]
      }
    }
  });

  const certificatesIssued = await prisma.certificate.count({
    where: { status: "ISSUED" }
  });

  const totalRevenueResult = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCESS" }
  });
  
  const totalRevenue = (totalRevenueResult._sum.amount || 0) / 100; // Convert paise to INR

  // Fetch recent applications
  const applications = await prisma.internshipApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { studentProfile: true }
      },
      domain: true,
      certificate: true
    },
    take: 20
  });

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { studentProfile: true }
      },
      application: true
    },
    take: 50
  });

  const settings = await prisma.platformSettings.findUnique({
    where: { id: "global" }
  });
  const currentFee = settings?.feeAmount ?? 349;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <Link href="/" className="inline-block">
              <Image src="/images/veritasco.png" alt="VeritasCo Logo" width={160} height={40} className="h-8 w-auto object-contain" />
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3 mt-4">Admin Controls</p>
          <Link href="/admin">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </div>
          </Link>
          <Link href="/admin/certificate">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Award className="w-5 h-5" />
              Certificate Generator
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#07111F]">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Platform overview and management.</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#07111F]">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Internships</CardTitle>
              <Briefcase className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeApplications}</div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Certificates Issued</CardTitle>
              <Award className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{certificatesIssued}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <Card className="border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-border">
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Review and manage student internship applications.</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Domain</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Certificate</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                          No applications found.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app: any) => (
                        <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-[#07111F]">
                              {app.user.studentProfile?.fullName || app.user.name || "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground">{app.user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {app.domain.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-[#07111F]">{app.status.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="px-6 py-4">
                            {app.certificate ? (
                              <span className="text-emerald-600 font-medium text-xs flex items-center gap-1">
                                <Award className="w-3 h-3" /> Issued
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">Pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {app.status === "SUBMITTED" ? (
                              <SendOfferButton applicationId={app.id} />
                            ) : (
                              <Link href={`/admin/certificate?applicationId=${app.id}`}>
                                <Button variant="outline" size="sm" className="h-8">
                                  Generate
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card className="border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-border">
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View recent transactions and their statuses.</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Transaction ID</th>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment: any) => (
                        <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-[#07111F] font-mono text-xs">
                              {payment.razorpayOrderId || payment.id}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-[#07111F]">
                              {payment.user.studentProfile?.fullName || payment.user.name || "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground">{payment.user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-[#07111F]">₹{payment.amount / 100}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-destructive/10 text-destructive'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsPanel initialFeeAmount={currentFee} />
          </TabsContent>

        </Tabs>
        
      </main>
    </div>
  );
}
