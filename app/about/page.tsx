import { Badge, Card, PageHeader } from "@/components/ui";

const sections = [
  {
    title: "Problem Statement",
    items: [
      "Commercial lending teams often manage source data, document drafting, checklist gaps, rule changes, approval authority, exceptions, UAT, release readiness, and benefits across fragmented tools.",
      "A senior BA must connect those concerns into controlled decisions with clear ownership, evidence, measurable outcomes, and an explainable recommendation."
    ]
  },
  {
    title: "Business Context",
    items: [
      "The scenario is based on a generalized global commercial credit / loan origination modernization program.",
      "User groups include RM, Credit Analyst, Approver, Credit Admin, System Admin, Rule Product Owner, Data Owner, Product Owner, and Release Steering Committee."
    ]
  },
  {
    title: "Proposed Solution",
    items: [
      "An evidence-led credit transformation platform connecting actual credit memo generation, checklist automation, business rule governance, data lineage, approval routing, policy exceptions, UAT, value realization, and release assurance.",
      "This portfolio version uses mock data and local state so it can be safely published without confidential information."
    ]
  },
  {
    title: "Functional Scope",
    items: [
      "Smart Credit Memo Studio with eight generated sections, source lineage, governed rules, confidence, missing-evidence blockers, review, approval, version comparison, evidence export, and print-to-PDF.",
      "Business Rule Governance Center with versions, owner/checker lifecycle, impact analysis, regression Test Lab, traceability coverage, and activation gate.",
      "Data Lineage and Quality Hub with critical data definitions, source-to-decision flow, quality scores, downstream issue impact, ownership, and remediation.",
      "Benefits Realization and Product Value with adjustable financial assumptions, outcome scorecard, metric ownership, and outcome-led roadmap.",
      "Release and Cutover Command Center with evidence-led Go / No-Go gates, migration, SOP, training, cutover validation, rollback, and hypercare.",
      "Document Checklist Generator with rule-based output, document status tracking, waiver approval workflow, submission readiness gate, SLA aging indicators, package summary, and export.",
      "Credit Case 360 with lifecycle status, readiness gates, linked evidence, BA recommendation, and next best actions.",
      "Approval Routing Simulator with exposure, risk, collateral, segment, exception severity, maker-checker, and escalation logic.",
      "Policy Exception Register with severity, owner, mitigation, aging, approval authority, evidence, requirement linkage, and UAT coverage.",
      "UAT Test Case Tracker with filters, status updates, metrics, and export.",
      "Change Request Impact Analyzer with control risk and BA recommendation.",
      "Traceability Matrix linking requirements, rules, test cases, and CRs."
    ]
  },
  {
    title: "Risk Control Consideration",
    items: [
      "Mandatory document gaps should block submission unless a controlled waiver path is used.",
      "Waived documents require a reason before the submission gate can clear.",
      "Waiver approval should preserve maker-checker segregation before a waived item is treated as ready.",
      "Document aging should surface SLA watch or breach items for operational follow-up.",
      "Approval route overrides require reason, authorized role, and audit trail.",
      "Missing financial statements require waiver approval and audit trail.",
      "High risk customers require enhanced due diligence.",
      "Generated memo narrative should remain linked to source evidence and cannot be approved when support is incomplete.",
      "Rule changes should not activate without maker-checker, effective date, impact scope, and passed required regression evidence.",
      "Critical data quality breaches must show downstream decision impact and accountable remediation.",
      "Failed high-priority UAT or other blocking readiness gates should produce a No-Go recommendation.",
      "Every cutover step requires validation and rollback criteria before the production window."
    ]
  },
  {
    title: "Professional Positioning",
    items: [
      "Primary positioning: Banking Credit Transformation Business Analyst specializing in commercial lending automation, rule governance, data lineage, delivery assurance, and value realization.",
      "Relevant career paths: Senior Business Analyst, Lead BA, Lending Systems BA, Credit Transformation Analyst, Business Systems Analyst, Product Analyst, Proxy Product Owner, and Product Owner."
    ]
  },
  {
    title: "Future Enhancement",
    items: [
      "Role-based login, API and database persistence, enterprise document templates, digital signature, reviewer comments, and production workflow state machine.",
      "A controlled LLM gateway could add retrieval, model registry, monitoring, fallback, and model-risk approval without changing the current evidence and human-review domain model."
    ]
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        description="A case study explaining the credit transformation problem, senior BA decisions, document and rule controls, data governance, delivery assurance, value evidence, and confidentiality boundary."
        eyebrow="Project Case Study"
        title="Credit Transformation Case Study"
      />
      <div className="space-y-6 p-5 md:p-8">
        <Card>
          <div className="flex flex-wrap gap-2">
            {[
              "Global Banking BA",
              "Commercial Credit",
              "Credit Memo Automation",
              "Rule Governance",
              "Data Lineage",
              "Benefits Realization",
              "Release Assurance",
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
            Business Document Generation Automation was built as a GitHub portfolio project to demonstrate Senior Business Analyst and Product Owner capability in commercial credit transformation. It shows how a BA connects evidence-grounded document generation, rule and data governance, delegated authority, exception control, UAT, cutover, release decisions, measurable outcomes, and end-to-end traceability.
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
