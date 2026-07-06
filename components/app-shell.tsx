import {
  BarChart3,
  ClipboardCheck,
  FileSearch,
  FileCheck2,
  GitPullRequestArrow,
  History,
  Home,
  Info,
  Network,
  Route,
  ShieldAlert,
  ShieldCheck,
  Users
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Executive Dashboard", icon: BarChart3 },
  { href: "/case-360", label: "Case 360", icon: FileSearch },
  { href: "/approval-routing", label: "Approval Routing", icon: Route },
  { href: "/exceptions", label: "Exception Register", icon: ShieldAlert },
  { href: "/checklist", label: "Document Checklist", icon: FileCheck2 },
  { href: "/uat", label: "UAT Tracker", icon: ClipboardCheck },
  { href: "/change-requests", label: "CR Impact", icon: GitPullRequestArrow },
  { href: "/traceability", label: "Traceability", icon: Network },
  { href: "/roles", label: "Role View", icon: Users },
  { href: "/audit", label: "Audit Trail", icon: History },
  { href: "/about", label: "About Project", icon: Info }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold">Credit Modernization</p>
                <p className="text-xs text-muted-foreground">Global Banking Portfolio</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4 text-xs leading-5 text-muted-foreground">
            Mock banking data only. No confidential bank information.
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur md:px-8">
          <Link className="font-semibold lg:hidden" href="/">
            Credit Modernization
          </Link>
          <div className="hidden text-sm text-muted-foreground lg:block">
            Commercial lending workflow, controls, UAT, and executive visibility
          </div>
          <ThemeToggle />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
