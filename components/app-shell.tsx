import {
  BarChart3,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  FileSearch,
  FileCheck2,
  FilePenLine,
  GitBranch,
  GitPullRequestArrow,
  History,
  Home,
  Info,
  Menu,
  Network,
  Rocket,
  Route,
  ShieldAlert,
  ShieldCheck,
  Users,
  Workflow
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/workflow", label: "Unified Workflow", icon: Workflow },
      { href: "/case-360", label: "Case 360", icon: FileSearch },
      { href: "/memo", label: "Credit Memo Studio", icon: FilePenLine }
    ]
  },
  {
    label: "Decision Governance",
    items: [
      { href: "/checklist", label: "Document Checklist", icon: FileCheck2 },
      { href: "/rules", label: "Rule Governance", icon: GitBranch },
      { href: "/approval-routing", label: "Approval Routing", icon: Route },
      { href: "/exceptions", label: "Exception Register", icon: ShieldAlert },
      { href: "/data-governance", label: "Data Governance", icon: Database }
    ]
  },
  {
    label: "Delivery Assurance",
    items: [
      { href: "/uat", label: "UAT Tracker", icon: ClipboardCheck },
      { href: "/change-requests", label: "CR Impact", icon: GitPullRequestArrow },
      { href: "/release", label: "Release Readiness", icon: Rocket },
      { href: "/traceability", label: "Traceability", icon: Network }
    ]
  },
  {
    label: "Insights",
    items: [
      { href: "/dashboard", label: "Executive Dashboard", icon: BarChart3 },
      { href: "/value", label: "Value Realization", icon: CircleDollarSign },
      { href: "/roles", label: "Role View", icon: Users },
      { href: "/audit", label: "Audit Trail", icon: History },
      { href: "/about", label: "About Project", icon: Info }
    ]
  }
];

function NavigationGroups({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav className={mobile ? "space-y-5" : "space-y-5 px-3 py-4"}>
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">{group.label}</p>
          <div className="mt-1 space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

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
                <p className="text-base font-semibold">Credit Transformation</p>
                <p className="text-xs text-muted-foreground">Decision &amp; Governance Case</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto"><NavigationGroups /></div>
          <div className="border-t p-4 text-xs leading-5 text-muted-foreground">
            Mock banking data only. No confidential bank information.
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <details className="group relative">
              <summary
                aria-label="Open navigation"
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
              >
                <Menu className="h-5 w-5" />
              </summary>
              <div className="absolute left-0 top-12 z-50 max-h-[calc(100vh-5rem)] w-[min(88vw,340px)] overflow-y-auto rounded-md border bg-card p-3 shadow-soft">
                <NavigationGroups mobile />
              </div>
            </details>
            <Link className="font-semibold" href="/">
              Credit Transformation
            </Link>
          </div>
          <div className="hidden text-sm text-muted-foreground lg:block">
            Documents, decisions, data, value, and release evidence
          </div>
          <ThemeToggle />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
