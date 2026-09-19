import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, FileText, CreditCard, Award, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Application Details", href: "/dashboard#application", icon: FileText },
    { name: "Certificate", href: "/dashboard#certificate", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <Link href="/" className="inline-block">
              <Image src="/images/veritasco.png" alt="VeritasCo Logo" width={160} height={40} className="h-8 w-auto object-contain" />
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <div className="mb-4 px-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dashboard</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#07111F] hover:bg-muted font-medium transition-colors cursor-pointer">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">{session.user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{session.user.email}</span>
            </div>
          </div>
          <LogoutButton variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </LogoutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-border p-4 sticky top-0 z-10 flex justify-between items-center">
          <Link href="/">
            <span className="text-lg font-bold tracking-tight text-[#07111F]">
              VeritasCo<span className="text-primary">.</span>
            </span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {session.user.name?.charAt(0) || "U"}
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 pb-24 md:pb-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 flex justify-around p-3 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 p-2">
              <Icon className="w-6 h-6 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
