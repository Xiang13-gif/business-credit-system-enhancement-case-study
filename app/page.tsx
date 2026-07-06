import {
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  Gauge,
  GitPullRequestArrow,
  History,
  Network,
  Route,
  ShieldAlert,
  ShieldCheck,
  Users
} from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, PageHeader, StatCard } from "@/components/ui";
import {
  creditPipelineCases,
  policyExceptions,
  uatTestCases
} from "@/lib/mock-data";

const modules = [
  {
    title: "Credit Case 360",
    description: "End-to-end case view linking RM intake, documents, credit analysis, approval route, exceptions, UAT evidence, audit controls, and readiness.",
    href: "/case-360",
    icon: FileSearch,
    badge: "Case Lifecycle"
  },
  {
    title: "Executive Dashboard",
    description: "Pipeline aging, bottlenecks, exception volume, document readiness, UAT health, and CR priority.",
    href: "/dashboard",
    icon: BarChart3,
    badge: "Executive View"
  },
  {
    title: "Approval Routing Simulator",
    description: "Risk-based delegated authority using exposure, risk level, collateral coverage, segment, and exception severity.",
    href: "/approval-routing",
    icon: Route,
    badge: "Authority"
  },
  {
    title: "Policy Exception Register",
    description: "Exception governance with severity, mitigation, owner, aging, approval tier, control evidence, and UAT linkage.",
    href: "/exceptions",
    icon: ShieldAlert,
    badge: "Risk Control"
  },
  {
    title: "Document Checklist Generator",
    description: "Rule-driven document requirements for application type, facility type, collateral, risk level, and waiver status.",
    href: "/checklist",
    icon: FileCheck2,
    badge: "Rule Engine"
  },
  {
    title: "UAT Test Case Tracker",
    description: "Testing dashboard with filters, editable status, defect linkage, pass rate, and high-priority open item tracking.",
    href: "/uat",
    icon: ClipboardCheck,
    badge: "Delivery"
  },
  {
    title: "Change Request Impact Analyzer",
    description: "CR impact view across requirements, UAT scope, business rules, roles, control risk, and BA recommendation.",
    href: "/change-requests",
    icon: GitPullRequestArrow,
    badge: "Impact Analysis"
  },
  {
    title: "Traceability Matrix",
    description: "Mini RTM linking requirements to business rules, UAT test cases, change requests, and delivery status.",
    href: "/traceability",
    icon: Network,
    badge: "BA Artifact"
  },
  {
    title: "Role-Based View",
    description: "Switch RM, Credit Analyst, Approver, Credit Admin, and System Admin lenses to see role-specific impact.",
    href: "/roles",
    icon: Users,
    badge: "Stakeholders"
  },
  {
    title: "Audit Trail",
    description: "Local activity log showing UAT changes, CR review, exports, and role switching as control evidence.",
    href: "/audit",
    icon: History,
    badge: "Controls"
  }
];

export default function HomePage() {
  const failedCases = uatTestCases.filter((item) => item.status === "Failed").length;
  const highPriorityOpen = uatTestCases.filter((item) => item.priority === "High" && item.status !== "Passed").length;
  const overduePipelineCases = creditPipelineCases.filter((item) => item.agingDays >= 7).length;
  const criticalExceptions = policyExceptions.filter((item) => item.severity === "Critical").length;
  const totalExposure = creditPipelineCases.reduce((total, item) => total + item.exposure, 0);
  const documentReadiness = Math.round(
    creditPipelineCases.reduce((total, item) => total + item.documentReadiness, 0) / creditPipelineCases.length
  );

  return (
    <>
      <PageHeader
        actions={
          <>
            <Button href="/case-360">
              Open Case 360
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/about" variant="secondary">
              Project Case Study
            </Button>
          </>
        }
        description="A flagship Banking Business Analyst / Product Analyst case study that simulates how a global bank could modernize commercial lending workflow through approval routing, policy exception governance, document controls, UAT traceability, audit evidence, and operational dashboards."
        eyebrow="Global Banking Portfolio Case Study"
        title="Global Commercial Credit Modernization Platform"
      />

      <div className="space-y-6 p-5 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Pipeline Exposure" value={`$${Math.round(totalExposure / 1_000_000)}M`} helper={`${creditPipelineCases.length} sample cases`} />
          <StatCard label="Document Readiness" value={`${documentReadiness}%`} tone={documentReadiness >= 85 ? "success" : "warning"} />
          <StatCard label="Overdue Cases" value={overduePipelineCases} tone={overduePipelineCases > 0 ? "danger" : "success"} helper="Aging at 7+ days" />
          <StatCard label="Critical Exceptions" value={criticalExceptions} tone={criticalExceptions > 0 ? "danger" : "success"} />
          <StatCard label="Open High Priority" value={highPriorityOpen} tone={highPriorityOpen > 0 ? "warning" : "success"} helper={`${failedCases} failed cases`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Executive Case Study</h2>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
                  This project models a commercial credit transformation program for a global banking environment:
                  reduce manual follow-up, improve delegated authority controls, evidence policy exceptions, connect
                  UAT to requirements, and give management a clearer view of pipeline bottlenecks.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                "Commercial loan origination",
                "Risk-based approval routing",
                "Policy exception governance",
                "UAT and traceability control"
              ].map((item) => (
                <div className="rounded-lg border bg-muted/30 p-4 text-sm font-medium" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Recruiter Signal</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Built to show business analysis, product thinking, banking operations, controls, data storytelling,
                  and delivery discipline in one coherent portfolio project.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link href={module.href} key={module.href}>
                <Card className="flex h-full flex-col justify-between transition hover:-translate-y-0.5 hover:border-primary/40">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge tone="info">{module.badge}</Badge>
                    </div>
                    <h2 className="mt-5 text-lg font-semibold">{module.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
                    View module <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card>
            <h2 className="text-xl font-semibold">Portfolio Positioning</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                "Commercial banking and credit workflow domain knowledge",
                "Business rule and delegated authority design",
                "UAT planning, defect tracking, and release readiness",
                "Change request impact analysis and scope control",
                "Risk, control, audit, and maker-checker thinking",
                "Requirement-to-test-to-exception traceability"
              ].map((item) => (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Confidentiality Boundary</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  This portfolio uses mock data and generalized banking logic. It is not connected to any real bank system and does not contain confidential data.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
