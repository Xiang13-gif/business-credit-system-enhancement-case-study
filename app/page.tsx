import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  GitPullRequestArrow,
  Network,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, PageHeader, StatCard } from "@/components/ui";
import { changeRequests, traceabilityMatrix, uatTestCases } from "@/lib/mock-data";

const modules = [
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
  }
];

export default function HomePage() {
  const failedCases = uatTestCases.filter((item) => item.status === "Failed").length;
  const highPriorityOpen = uatTestCases.filter((item) => item.priority === "High" && item.status !== "Passed").length;

  return (
    <>
      <PageHeader
        actions={
          <>
            <Button href="/checklist">
              Open Toolkit
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/about" variant="secondary">
              Project Case Study
            </Button>
          </>
        }
        description="A recruiter-friendly Banking BA web app demonstrating credit operations domain knowledge, document checklist logic, UAT tracking, change request impact analysis, control risk thinking, and requirement traceability."
        eyebrow="Credit Operations BA Portfolio"
        title="CreditFlow BA Toolkit"
      />

      <div className="space-y-6 p-5 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="UAT Test Cases" value={uatTestCases.length} helper="Mock delivery scope" />
          <StatCard label="Change Requests" value={changeRequests.length} helper="Impact analyzer data" />
          <StatCard label="Traceability Rows" value={traceabilityMatrix.length} helper="Requirement linkage" />
          <StatCard label="Open High Priority" value={highPriorityOpen} tone={highPriorityOpen > 0 ? "warning" : "success"} helper={`${failedCases} failed cases`} />
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
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
                "Banking / credit system domain knowledge",
                "Business rule and checklist design",
                "UAT planning and delivery tracking",
                "Change request impact analysis",
                "Control risk and BA recommendation writing",
                "Requirement-to-test traceability"
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
                  This MVP uses mock data and generalized banking logic. It is not connected to any real bank system and does not contain confidential data.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
