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

## Non-Functional Requirements

| ID | Requirement | Rationale | Acceptance Criteria |
| --- | --- | --- | --- |
| NFR-001 | The system shall keep an audit trail for critical business actions. | Credit process decisions must be traceable. | Audit trail is available for status, approval, waiver, and override actions. |
| NFR-002 | The system shall support maker-checker control for waiver and override actions. | Reduces control risk for sensitive actions. | User who creates a waiver or override cannot approve the same item. |
| NFR-003 | The dashboard shall refresh at least daily for management reporting. | Daily pipeline visibility is enough for operational credit management. | Dashboard data reflects previous business day data by agreed cut-off time. |
| NFR-004 | System response time for case search shall be acceptable for operational use. | Users frequently search case records during daily work. | Search results return within agreed service level for normal usage volume. |
| NFR-005 | Data export shall be controlled by user role. | Prevents unnecessary extraction of sensitive credit information. | Only authorized roles can export dashboard or case-level data. |

## Reporting Requirements

| ID | Report | Purpose |
| --- | --- | --- |
| RPT-001 | Credit Pipeline Summary | Show case count and amount by status, segment, and facility type. |
| RPT-002 | Aging by Owner | Identify cases pending action by RM, Credit Analyst, Approver, or Credit Admin. |
| RPT-003 | Exception Register | Track exception category, severity, approval status, and aging. |
| RPT-004 | Document Readiness | Show missing, waived, and verified documents by case. |
| RPT-005 | Turnaround Time | Measure time from submission to credit decision and from approval to readiness. |
