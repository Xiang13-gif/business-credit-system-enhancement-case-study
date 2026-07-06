import { Badge, Card, PageHeader } from "@/components/ui";

const sections = [
  {
    title: "Problem Statement",
    items: [
      "Large commercial lending teams often manage document gaps, approval authority, exception reviews, UAT evidence, and management reporting across fragmented tools.",
      "A strong BA must translate those workflow pain points into clear requirements, controls, business rules, test coverage, and stakeholder-ready reporting."
    ]
  },
  {
    title: "Business Context",
    items: [
      "The scenario is based on a generalized global commercial credit / loan origination modernization program.",
      "User groups include RM, Credit Analyst, Approver, Credit Admin, and System Admin."
    ]
  },
  {
    title: "Proposed Solution",
    items: [
      "A portfolio platform that simulates document checklist automation, approval routing, policy exception governance, UAT monitoring, CR impact analysis, audit evidence, and traceability.",
      "This portfolio version uses mock data and local state so it can be safely published without confidential information."
    ]
  },
  {
    title: "Functional Scope",
    items: [
      "Approval Routing Simulator with exposure, risk, collateral, segment, exception severity, maker-checker, and escalation logic.",
      "Policy Exception Register with severity, owner, mitigation, aging, approval authority, evidence, requirement linkage, and UAT coverage.",
      "Document Checklist Generator with rule-based output and risk warnings.",
      "UAT Test Case Tracker with filters, status updates, metrics, and export.",
      "Change Request Impact Analyzer with control risk and BA recommendation.",
      "Traceability Matrix linking requirements, rules, test cases, and CRs."
    ]
  },
  {
    title: "Risk Control Consideration",
    items: [
      "Approval route overrides require reason, authorized role, and audit trail.",
      "Missing financial statements require waiver approval and audit trail.",
      "High risk customers require enhanced due diligence.",
      "Failed high-priority UAT cases should block release sign-off until retested."
    ]
  },
  {
    title: "Future Enhancement",
    items: [
      "Role-based login, API routes, database persistence, Excel/PDF export, and workflow approval.",
      "Supabase/PostgreSQL plus Prisma can be added without changing the current business domain model."
    ]
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        description="A case study page explaining the banking transformation story, BA decisions, risk controls, delivery artifacts, and confidentiality boundary behind the platform."
        eyebrow="Project Case Study"
        title="Global Credit Modernization Case Study"
      />
      <div className="space-y-6 p-5 md:p-8">
        <Card>
          <div className="flex flex-wrap gap-2">
            {[
              "Global Banking BA",
              "Commercial Credit",
              "Approval Routing",
              "Policy Exceptions",
              "Requirement Analysis",
              "UAT Planning",
              "Control Risk",
              "Next.js"
            ].map((item) => (
              <Badge key={item} tone="info">
                {item}
              </Badge>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-6 text-muted-foreground">
            Global Commercial Credit Modernization Platform was built as a GitHub portfolio project to demonstrate practical Business Analyst and Product Analyst capability in banking transformation work. The project focuses on how a BA structures requirements, delegated authority rules, policy exception governance, UAT coverage, change request impact, operational dashboards, risk controls, and traceability.
          </p>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This is a portfolio project using mock data. It is not connected to any real bank system and does not contain confidential information, production data, internal policy wording, customer information, employee information, or vendor details.
          </p>
        </Card>
      </div>
    </>
  );
}
