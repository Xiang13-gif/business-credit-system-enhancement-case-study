import { Badge, Card, PageHeader } from "@/components/ui";

const sections = [
  {
    title: "Problem Statement",
    items: [
      "Credit application teams often rely on manual document follow-up, separate UAT trackers, and scattered change request impact notes.",
      "A BA needs a structured way to explain requirements, controls, test coverage, and change impact to business and technology stakeholders."
    ]
  },
  {
    title: "Business Context",
    items: [
      "The scenario is based on a generalized commercial credit / loan origination enhancement.",
      "User groups include RM, Credit Analyst, Approver, Credit Admin, and System Admin."
    ]
  },
  {
    title: "Proposed Solution",
    items: [
      "A lightweight BA toolkit that simulates checklist generation, UAT monitoring, CR impact analysis, and traceability.",
      "The MVP uses mock data and local state so it can be safely published as a portfolio project."
    ]
  },
  {
    title: "Functional Scope",
    items: [
      "Document Checklist Generator with rule-based output and risk warnings.",
      "UAT Test Case Tracker with filters, status updates, metrics, and export.",
      "Change Request Impact Analyzer with control risk and BA recommendation.",
      "Traceability Matrix linking requirements, rules, test cases, and CRs."
    ]
  },
  {
    title: "Risk Control Consideration",
    items: [
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
        description="A project case study page that explains the BA thinking behind the toolkit, not only the UI."
        eyebrow="Project Case Study"
        title="Why This Project Exists"
      />
      <div className="space-y-6 p-5 md:p-8">
        <Card>
          <div className="flex flex-wrap gap-2">
            {[
              "Banking BA",
              "Credit Operations",
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
            CreditFlow BA Toolkit was built as a GitHub portfolio project to demonstrate practical Business Analyst capability in banking system enhancement work. The project focuses on how a BA structures requirements, business rules, UAT coverage, change request impact, risk controls, and traceability.
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
