import {
  ArrowRight,
  BarChart3,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  FileCheck2,
  FilePenLine,
  FileSearch,
  Gauge,
  GitBranch,
  GitPullRequestArrow,
  History,
  Network,
  Rocket,
  Route,
  ShieldAlert,
  ShieldCheck,
  Users,
  Workflow
} from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, PageHeader, StatCard } from "@/components/ui";
import {
  creditPipelineCases,
  uatTestCases
} from "@/lib/mock-data";
import {
  criticalDataElements,
  governedRules,
  releaseGates
} from "@/lib/transformation-data";

const modules = [
  {
    title: "Unified Case Workflow",
    description: "Create and save a credit case, complete rule-driven documents, route approvals, manage role tasks, record decisions, and control stage transitions.",
    href: "/workflow",
    icon: Workflow,
    badge: "Operational Workflow"
  },
  {
    title: "Smart Credit Memo Studio",
    description: "Evidence-grounded commercial credit memo generation with source lineage, confidence, review, versioning, approval gates, and responsible AI controls.",
    href: "/memo",
    icon: FilePenLine,
    badge: "Document Intelligence"
  },
  {
    title: "Business Rule Governance",
    description: "Rule registry, version comparison, maker-checker workflow, impact analysis, regression test lab, and activation evidence.",
    href: "/rules",
    icon: GitBranch,
    badge: "Decision Governance"
  },
  {
    title: "Data Lineage and Quality",
    description: "Critical data elements traced from source systems through transformations and rules into credit decisions and reports.",
    href: "/data-governance",
    icon: Database,
    badge: "Data Governance"
  },
  {
    title: "Benefits Realization",
    description: "Adjustable business case, outcome scorecard, financial viability, metric ownership, and outcome-led product roadmap.",
    href: "/value",
    icon: CircleDollarSign,
    badge: "Product Value"
  },
  {
    title: "Release and Cutover",
    description: "Evidence-led Go / No-Go gates, migration readiness, cutover runbook, rollback triggers, and hypercare controls.",
    href: "/release",
    icon: Rocket,
    badge: "Delivery Assurance"
  },
  {
    title: "Document Checklist Generator",
    description: "Rule-driven document requirements for application type, facility type, collateral, risk level, and waiver status.",
    href: "/checklist",
    icon: FileCheck2,
    badge: "Rule Engine"
  },
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
  const totalExposure = creditPipelineCases.reduce((total, item) => total + item.exposure, 0);
  const documentReadiness = Math.round(
    creditPipelineCases.reduce((total, item) => total + item.documentReadiness, 0) / creditPipelineCases.length
  );
  const pendingRuleChanges = governedRules.filter((item) => item.status !== "Active").length;
  const dataQualityBreaches = criticalDataElements.filter((item) => item.status === "Breach").length;
  const releaseBlockers = releaseGates.filter((item) => item.status === "Block").length;

  return (
    <>
      <PageHeader
        actions={
          <>
            <Button href="/workflow">
              Run Unified Workflow
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/rules" variant="secondary">
              Explore Rule Governance
            </Button>
          </>
        }
        description="A senior-level Banking Business Analyst / Product Owner portfolio case that connects evidence-grounded credit memo generation, business rule governance, critical data lineage, control assurance, measurable value, and release ownership."
        eyebrow="Commercial Credit Transformation Portfolio"
        title="Business Document Generation Automation"
      />

      <div className="space-y-6 p-5 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <StatCard label="Pipeline Exposure" value={`$${Math.round(totalExposure / 1_000_000)}M`} helper={`${creditPipelineCases.length} sample cases`} />
          <StatCard label="Document Readiness" value={`${documentReadiness}%`} tone={documentReadiness >= 85 ? "success" : "warning"} />
          <StatCard label="Rule Changes" value={pendingRuleChanges} tone={pendingRuleChanges > 0 ? "warning" : "success"} helper="Draft to approved" />
          <StatCard label="Data Breaches" value={dataQualityBreaches} tone={dataQualityBreaches > 0 ? "danger" : "success"} />
          <StatCard label="Release Blockers" value={releaseBlockers} tone={releaseBlockers > 0 ? "danger" : "success"} />
          <StatCard label="Open High Priority" value={highPriorityOpen} tone={highPriorityOpen > 0 ? "warning" : "success"} helper={`${failedCases} failed cases`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">End-to-End Credit Transformation Case</h2>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
                  This project models how a commercial credit team can move from fragmented document follow-up to a
                  governed decision platform: generate evidence-grounded submissions, control rules and data, manage
                  policy exceptions, prove release readiness, and measure whether the product delivers value.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                "Evidence-grounded document generation",
                "Rule and data governance",
                "Value and roadmap ownership",
                "Release and operational assurance"
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
                  Positioned for Senior Business Analyst, Lead BA, Lending Systems BA, Credit Transformation,
                  Product Analyst, and Product Owner conversations.
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
                "Evidence-grounded document intelligence",
                "Commercial banking and credit workflow domain knowledge",
                "Business rule governance and delegated authority design",
                "Critical data lineage, quality, and ownership",
                "Benefits realization and product roadmap trade-offs",
                "UAT, cutover, hypercare, and release readiness",
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
