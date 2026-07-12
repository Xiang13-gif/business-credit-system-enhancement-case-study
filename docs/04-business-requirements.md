# Business Requirements

## Requirement Principles

The requirements below are written to be testable and explainable. Each requirement includes a business rationale so that the technology team understands why the feature matters.

## Functional Requirements

| ID | Requirement | Rationale | Acceptance Criteria |
| --- | --- | --- | --- |
| FR-001 | The system shall allow RM users to create a business credit application linked to a business customer profile. | Credit applications need a single case record to support tracking and audit. | A new case can be created with customer ID, customer name, segment, business registration number, and RM owner. |
| FR-002 | The system shall capture one or more requested facilities under the same credit application. | Business customers may request multiple facilities in one approval package. | A case can include facility type, amount, tenor, purpose, repayment source, and secured/unsecured flag. |
| FR-003 | The system shall validate mandatory fields before submission to Credit Review. | Prevents incomplete applications from entering the analyst queue. | Submit action is blocked when mandatory fields are missing and the system displays the missing item list. |
| FR-004 | The system shall generate a document checklist based on customer type, facility type, collateral type, and new/renewal indicator. | Reduces manual interpretation and improves document completeness. | Checklist items change when product or collateral attributes change. |
| FR-005 | The system shall allow document status to be marked as Not Uploaded, Uploaded, Verified, Waived, or Not Applicable. | Credit Admin needs a controlled view of document readiness. | Each document item has status, owner, updated date, and waiver reason if waived. |
| FR-006 | The system shall assign submitted applications to a Credit Analyst queue based on segment and portfolio rules. | Supports workload visibility and structured ownership. | Submitted cases appear in the correct queue with timestamp and owner. |
| FR-007 | The system shall capture credit assessment sections for business profile, financial performance, repayment conduct, collateral, and recommendation. | Provides a structured approval package. | Analyst can save each section and submit recommendation when required sections are completed. |
| FR-008 | The system shall support structured policy exception capture. | Exceptions should be categorized and approved, not hidden in free-text comments. | User can select exception type, severity, reason, mitigating factor, and required approval level. |
| FR-009 | The system shall recommend an approval route based on total exposure, risk grade, exception severity, and secured/unsecured status. | Reduces manual routing error while preserving approval authority. | Approval route is displayed before submission and can only be overridden with reason and authorized role. |
| FR-010 | The system shall support credit decisions of Approved, Rejected, Deferred, and Withdrawn. | Standardizes case outcomes and reporting. | Decision reason is mandatory for Rejected, Deferred, and Withdrawn outcomes. |
| FR-011 | The system shall generate condition precedent items after approval. | Approval does not mean the case is ready for facility setup. | Approved cases create condition items based on facility and collateral rules. |
| FR-012 | The system shall prevent a case from being marked Ready for Facility Setup until mandatory conditions are completed or waived. | Supports credit administration control. | Ready status is blocked when mandatory condition items remain open. |
| FR-013 | The system shall maintain an audit trail for status changes, owner changes, approvals, overrides, waivers, and document verification. | Supports traceability and review. | Audit log shows user, timestamp, old value, new value, and reason where applicable. |
| FR-014 | The system shall provide a dashboard showing case volume, aging, status distribution, and bottlenecks. | Management needs operational visibility without offline trackers. | Dashboard can be filtered by segment, RM team, analyst queue, facility type, and date range. |
| FR-015 | The system shall allow case comments with tagged owners and due dates. | Reduces status chasing and keeps clarification in the case record. | Comment can assign an action owner and due date; open actions are visible in the case summary. |
| FR-016 | The system shall restrict access by role and portfolio. | Credit data is sensitive and should be available only to authorized users. | RM can access assigned portfolio cases; Credit users can access assigned queues; admin rights are restricted. |
| FR-017 | The system shall recommend an approval route using exposure, risk level, collateral coverage, customer segment, application type, facility type, and exception severity. | Reduces delegated authority interpretation errors. | Route recommendation shows approval tier, score, rationale, SLA, controls, and escalation triggers. |
| FR-018 | The system shall require authorized role, reason, maker-checker validation, and audit trail for approval route overrides. | Approval routing changes are control-sensitive. | Override cannot be completed without reason, authority, and audit evidence. |
| FR-019 | The system shall maintain a policy exception register with severity, owner, mitigation, approval tier, aging, evidence, linked requirement, and linked test case. | Exceptions should be visible and reportable, not hidden in notes. | Register can be filtered by status and severity and exported for review. |
| FR-020 | The system shall show credit pipeline aging, bottlenecks, owner role, exception count, and document readiness in the executive dashboard. | Management needs visibility into operational credit blockers. | Dashboard highlights aged cases, owner role, risk level, exposure, document readiness, and exception count. |
| FR-021 | The system shall provide a Case 360 view showing case profile, lifecycle steps, readiness gates, linked exceptions, UAT evidence, change requests, BA recommendation, and next best actions. | Stakeholders need one evidence-led case view instead of switching across disconnected trackers. | User can select a case and see lifecycle status, owners, blockers, evidence, and linked artifacts. |
| FR-022 | The system shall derive release posture from readiness gate statuses. | A case should not appear ready while required evidence is blocked. | Case posture is Not Ready when any gate is Block, Controlled Watch when gates are Watch only, and Ready when all gates Pass. |
| FR-023 | The system shall route waived document items through waiver approval workflow. | Waivers are control-sensitive and should not clear readiness without independent approval. | Waiver item has reason, maker role, approver role, approval status, decision note, and maker-checker validation. |
| FR-024 | The system shall calculate SLA status for document follow-up based on aging days and document state. | Operations teams need early visibility of documentation delays. | Document item displays On Track, Watch, or Breach based on status, requirement level, waiver status, and aging days. |
| FR-025 | The system shall generate a package summary for credit submission readiness. | Reviewers need a concise view of posture, blockers, waiver status, SLA risk, and BA recommendation. | Package summary shows posture, readiness, blockers, waiver counts, SLA counts, and BA recommendation with export option. |
| FR-026 | The system shall generate a structured commercial credit memorandum from governed case evidence. | The product name and business outcome require actual document generation, not only a checklist. | Eight memo sections are generated for executive summary, borrower, facility, financial analysis, risks, exceptions, conditions, and recommendation. |
| FR-027 | The system shall display source fields, governed rules, confidence, missing evidence, and review status for every generated memo section. | Automated narrative must remain explainable and cannot conceal unsupported conclusions. | Each section exposes source lineage, rule IDs, confidence, missing evidence, and lifecycle status. |
| FR-028 | The system shall block credit memo approval until evidence grounding, public-data masking, human review, and independent approval criteria pass. | Document automation in a controlled credit environment cannot replace accountable judgment. | Unsupported sections remain Needs Evidence; approver action is disabled until all evidence-ready sections are reviewed and governance toggles are enabled. |
| FR-029 | The system shall govern high-impact business rules through versioned lifecycle states. | Rule changes can alter mandatory evidence, approval authority, and control outcomes. | Rule record shows owner, checker, current and proposed versions, effective date, status, rationale, and activation gate. |
| FR-030 | The system shall assess rule-change impact and execute controlled regression scenarios before activation. | Requirements, documents, roles, controls, data, procedures, and UAT must remain aligned. | Impact view lists downstream scope and Test Lab compares actual engine output with expected documents and rules. |
| FR-031 | The system shall maintain a critical data element register with source-to-output lineage and data-quality issue impact. | Credit decisions are only reliable when material input data is defined, owned, traceable, and controlled. | User can trace source system, field, transformation, rule, output, owner, checks, quality score, lineage coverage, and linked issues. |
| FR-032 | The system shall maintain measurable benefits with baseline, target, current result, accountable owner, and evidence source. | Senior BA and Product Owner decisions require proof of value after delivery. | Outcome scorecard calculates realization progress and displays definition, owner, and measurement evidence. |
| FR-033 | The system shall recalculate financial viability from controlled value-case assumptions. | Investment decisions should respond transparently to volume, effort, cost, and implementation assumptions. | Annual benefit, hours released, payback, net benefit, ROI, and Proceed/Rework recommendation refresh when assumptions change. |
| FR-034 | The system shall derive Go, Conditional Go, or No-Go posture from evidence-led release gates. | Status reporting should not override open business, UAT, data, control, operational, people, or technology blockers. | Any Block gate results in No-Go, Watch-only gates result in Conditional Go, and all Pass gates result in Go. |
| FR-035 | The system shall maintain sequenced cutover validation, rollback triggers, decision evidence, and hypercare thresholds. | Production transition requires explicit ownership and recovery criteria. | Every cutover step has sequence, window, owner, status, validation, and rollback trigger; hypercare metrics have target, current status, and owner. |

## Non-Functional Requirements

| ID | Requirement | Rationale | Acceptance Criteria |
| --- | --- | --- | --- |
| NFR-001 | The system shall keep an audit trail for critical business actions. | Credit process decisions must be traceable. | Audit trail is available for status, approval, waiver, and override actions. |
| NFR-002 | The system shall support maker-checker control for waiver and override actions. | Reduces control risk for sensitive actions. | User who creates a waiver or override cannot approve the same item. |
| NFR-003 | The dashboard shall refresh at least daily for management reporting. | Daily pipeline visibility is enough for operational credit management. | Dashboard data reflects previous business day data by agreed cut-off time. |
| NFR-004 | System response time for case search shall be acceptable for operational use. | Users frequently search case records during daily work. | Search results return within agreed service level for normal usage volume. |
| NFR-005 | Data export shall be controlled by user role. | Prevents unnecessary extraction of sensitive credit information. | Only authorized roles can export dashboard or case-level data. |
| NFR-006 | Generated narrative shall be explainable and reproducible from approved evidence and versioned rules. | Reviewers must be able to understand why content was produced. | Memo evidence map records section, source fields, rule IDs, confidence, version, and missing evidence. |
| NFR-007 | Public portfolio output shall mask customer and employee identifiers by default. | Demonstration safety should not rely only on users remembering to remove identifiers. | Public masking is enabled by default and forms part of the approval control gate. |
| NFR-008 | Rule and release lifecycle actions shall preserve maker-checker and audit evidence. | High-impact changes and go-live decisions require accountable segregation. | Lifecycle events record actor, action, reference, details, timestamp, and control impact. |
| NFR-009 | Critical data quality thresholds and lineage coverage shall be visible before downstream decisions are treated as reliable. | Poor source data propagates into rules, documents, and reports. | Breach status and downstream impact are visible for affected data elements. |

## Reporting Requirements

| ID | Report | Purpose |
| --- | --- | --- |
| RPT-001 | Credit Pipeline Summary | Show case count and amount by status, segment, and facility type. |
| RPT-002 | Aging by Owner | Identify cases pending action by RM, Credit Analyst, Approver, or Credit Admin. |
| RPT-003 | Exception Register | Track exception category, severity, approval status, and aging. |
| RPT-004 | Document Readiness | Show missing, waived, and verified documents by case. |
| RPT-005 | Turnaround Time | Measure time from submission to credit decision and from approval to readiness. |
| RPT-006 | Case Readiness Summary | Show release posture, blocked gates, watch gates, linked exceptions, UAT evidence, and next action owner for selected cases. |
| RPT-007 | Submission Package Summary | Show package posture, waiver approval position, SLA risk, blockers, and BA recommendation. |
| RPT-008 | Credit Memo Evidence Map | Show section status, confidence, source fields, governed rules, and missing evidence. |
| RPT-009 | Rule Governance Register | Show version, lifecycle, owner, checker, risk, impact scope, UAT coverage, and activation gate. |
| RPT-010 | Critical Data and DQ Register | Show definitions, source lineage, quality score, issues, downstream impact, owner, and remediation date. |
| RPT-011 | Benefits Realization Scorecard | Show baseline, target, current result, realization progress, owner, evidence source, and financial viability. |
| RPT-012 | Release Decision Pack | Show readiness gates, evidence, linked items, sign-off, cutover validation, rollback triggers, and Go / No-Go posture. |
