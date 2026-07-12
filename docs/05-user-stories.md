# User Stories

## Epic 1: Credit Application Intake

### US-001: Create Business Credit Application

As a Relationship Manager, I want to create a business credit application under a customer profile so that the credit request can be tracked as one case.

Acceptance criteria:

- Given I am an RM with access to the customer portfolio, when I create a new application, then the system records the customer, RM owner, creation date, and case status as Draft.
- Given the customer is not in my portfolio, when I try to create an application, then the system blocks the action.
- Given the application is saved, when I reopen it, then all saved facility and document details remain available.

### US-002: Capture Multiple Facilities

As an RM, I want to capture multiple requested facilities in one application so that the approval package reflects the full customer request.

Acceptance criteria:

- Given a draft case, when I add term loan and overdraft facilities, then both facilities appear under the same application.
- Given a facility amount is missing, when I submit the case, then submission is blocked.
- Given multiple facilities exist, when the approval route is calculated, then total exposure is used.

## Epic 2: Document Checklist

### US-003: Generate Checklist by Facility Type

As an RM, I want the system to generate required documents based on facility and collateral type so that I know what must be uploaded before submission.

Acceptance criteria:

- Given facility type is Term Loan and collateral is Property, when the checklist is generated, then valuation and property security documents are included.
- Given the facility type changes, when I refresh the checklist, then irrelevant checklist items are removed or marked not applicable.
- Given a mandatory document is missing, when I submit the case, then the system shows the missing item.

### US-004: Verify Documents

As a Credit Admin user, I want to verify uploaded documents so that readiness can be confirmed before downstream processing.

Acceptance criteria:

- Given a document is uploaded, when I mark it Verified, then the system records my user ID and timestamp.
- Given a document is mandatory, when it is still Not Uploaded, then the case cannot be marked Ready for Facility Setup.
- Given a document is waived, when the waiver is approved, then the waiver reason appears in the checklist.

### US-004A: Approve Document Waiver

As an Approver, I want document waivers to require reason and maker-checker review so that waived items do not bypass control without evidence.

Acceptance criteria:

- Given a document is marked Waived, when no waiver reason is provided, then the submission gate remains blocked.
- Given a waiver request is submitted, when maker role and approver role are the same, then approval is blocked.
- Given a waiver request has reason and maker-checker separation, when the approver approves it, then the document can contribute to readiness.

### US-004B: Review Package Summary and SLA

As a BA Reviewer, I want a package summary and SLA indicators so that I can explain whether the credit submission package is ready, blocked, or under controlled watch.

Acceptance criteria:

- Given required documents are missing or waivers are not approved, when I open the summary, then package posture is Blocked.
- Given required items are ready but document aging has watch or breach items, when I open the summary, then package posture is Controlled Watch.
- Given the summary is exported, then readiness, waiver, SLA, blocker, and BA recommendation fields are included.

## Epic 3: Credit Assessment and Exceptions

### US-005: Structured Credit Assessment

As a Credit Analyst, I want to complete structured assessment sections so that approvers can review the case consistently.

Acceptance criteria:

- Given a case is in Pending Credit Review, when I complete the required assessment sections, then I can submit a recommendation.
- Given a required assessment section is incomplete, when I submit, then the system blocks the action.
- Given I submit a recommendation, when the case is routed, then the approver can view the assessment summary.

### US-006: Capture Policy Exception

As a Credit Analyst, I want to record policy exceptions in structured fields so that exceptions can be reviewed and reported.

Acceptance criteria:

- Given an exception is identified, when I create an exception, then exception type, severity, reason, and mitigating factor are mandatory.
- Given exception severity is Major or Critical, when the case is routed, then exception approval is required before final credit approval.
- Given an exception is rejected, when the case returns to RM or Analyst, then the rejection reason is visible.
- Given an exception remains open beyond SLA, when I open the exception register, then aging and owner role are highlighted.

## Epic 4: Approval Routing

### US-007: Recommended Approval Route

As a Credit Approver, I want the system to recommend the approval route based on exposure and risk so that the case goes to the correct authority level.

Acceptance criteria:

- Given total exposure is low, collateral is fully secured, and no exception exists, when the route is calculated, then a lower authority route is recommended.
- Given high exposure, unsecured collateral, high risk, or critical exception exists, when the route is calculated, then the route is escalated.
- Given the route is calculated, when the result is displayed, then rationale, SLA, maker-checker requirement, and escalation triggers are visible.
- Given an authorized user overrides the route, when the override is saved, then reason and audit trail are mandatory.

### US-008: Record Credit Decision

As a Credit Approver, I want to record a decision and reason so that the outcome is clear and reportable.

Acceptance criteria:

- Given a case is pending my approval, when I approve it, then the case moves to Pending Conditions.
- Given I reject the case, when I submit the decision, then rejection reason is mandatory.
- Given I defer the case, when I submit the decision, then clarification items and owner are mandatory.

## Epic 5: Reporting and Monitoring

### US-009: View Credit Pipeline Dashboard

As a Product Owner, I want a dashboard showing case volume, value, status, aging, and bottlenecks so that I can monitor operational performance.

Acceptance criteria:

- Given dashboard data is refreshed, when I select a date range, then case count and amount update.
- Given cases are pending more than the SLA threshold, when I open aging view, then overdue cases are highlighted.
- Given I filter by RM team or analyst queue, when I apply the filter, then all dashboard metrics update consistently.

### US-010: Track Open Actions

As a case owner, I want open actions with owner and due date so that pending items are visible without separate follow-up trackers.

Acceptance criteria:

- Given I create an action, when I assign an owner and due date, then it appears in the case action list.
- Given an action is overdue, when the case summary is opened, then the overdue action is highlighted.
- Given all required actions are closed, when the case moves forward, then the system allows the next status.

## Epic 6: Case Lifecycle Visibility

### US-011: Review Credit Case 360

As a Credit Operations lead, I want to inspect a single commercial credit case from intake to readiness so that I can understand the case status without switching across multiple trackers.

Acceptance criteria:

- Given I open Case 360, when I select a case, then the system displays customer profile, facility, exposure, current stage, owner, document readiness, approval tier, release posture, and BA recommendation.
- Given the case has linked policy exceptions, UAT cases, or change requests, when I review the evidence sections, then each linked item is visible with status and control context.
- Given the case is not ready, when I review next best actions, then each action identifies the practical owner or control follow-up needed.

### US-012: Calculate Readiness From Gates

As an Approver, I want release posture to be calculated from readiness gates so that blocked evidence cannot be hidden by a manually selected status.

Acceptance criteria:

- Given any readiness gate is Block, when the case is reviewed, then release posture is Not Ready.
- Given no readiness gate is Block but at least one gate is Watch, when the case is reviewed, then release posture is Controlled Watch.
- Given all readiness gates are Pass, when the case is reviewed, then release posture is Ready.
- Given a readiness gate is displayed, when I review the gate details, then owner role, evidence, linked requirement, and linked UAT case are visible.

## Epic 7: Evidence-Grounded Credit Memo

### US-013: Generate Controlled Credit Memo

As a Credit Analyst, I want to generate a structured credit memorandum from governed case evidence so that drafting is faster without losing source traceability.

Acceptance criteria:

- Given a supported credit case, when I generate a draft, then executive summary, borrower profile, facility request, financial analysis, risks and mitigants, exceptions, conditions, and recommendation sections are created.
- Given a section is generated, when I inspect it, then source fields, business rule IDs, confidence, missing evidence, and review status are visible.
- Given a new version is generated, when I compare versions, then the approved change summary is visible.
- Given the evidence map is exported, then every section and its control metadata are included.

### US-014: Control Memo Review and Approval

As a Credit Approver, I want unsupported evidence and incomplete human review to block approval so that generated narrative cannot bypass credit accountability.

Acceptance criteria:

- Given a section has missing evidence, when the memo is generated, then the section is marked Needs Evidence and the memo posture is Blocked.
- Given an evidence-ready section, when the Credit Analyst reviews it, then status changes to Reviewed and an audit event is recorded.
- Given grounding, human review, or public masking is disabled, when approval is attempted, then the action remains blocked.
- Given all sections are evidence-ready and reviewed, when the independent approver approves the memo, then all sections become Approved.

## Epic 8: Business Rule Governance

### US-015: Govern Rule Version Lifecycle

As a Rule Product Owner, I want high-impact business rules to move through controlled version states so that effective logic is approved, dated, and auditable.

Acceptance criteria:

- Given a governed rule, when I open the registry, then current version, proposed version, status, owner, checker, effective date, risk, and linked artifacts are visible.
- Given a Draft rule, when the owner submits it, then status changes to Under Review.
- Given maker and checker are not separated, when approval is attempted, then activation is blocked.
- Given required regression evidence is missing or failed, when approval or activation is attempted, then the lifecycle gate remains blocked.

### US-016: Assess Rule Impact and Regression

As a Lead Business Analyst, I want to compare rule versions and test controlled scenarios so that downstream requirements, documents, roles, controls, data, and UAT remain aligned.

Acceptance criteria:

- Given a proposed rule, when I review impact analysis, then affected documents, roles, controls, requirements, and UAT cases are shown.
- Given a regression scenario, when I execute it, then actual document and rule output is compared with expected output.
- Given the proposed Land Search Report is not implemented, when RT-005 runs, then DOC046 is reported as a design gap.
- Given a design gap exists, when activation is attempted, then activation remains blocked.

## Epic 9: Data Governance

### US-017: Trace Critical Data to Decision Output

As a Credit Data Owner, I want to trace critical data from its system of record to decision outputs so that quality problems can be assessed before they affect credit decisions.

Acceptance criteria:

- Given a critical data element, when I select it, then business definition, source system, source field, transformation, linked rules, output usage, owner, and quality checks are visible.
- Given the data element has a quality issue, when I review the issue, then severity, root cause, downstream impact, owner, status, and due date are shown.
- Given quality or lineage falls below threshold, when the record is displayed, then Watch or Breach status is visible.
- Given the inventory is exported, then source-to-output lineage and quality fields are included.

## Epic 10: Product Value

### US-018: Evaluate Benefits and Roadmap Trade-Offs

As a Product Owner, I want to measure outcomes and recalculate financial viability so that investment and roadmap decisions are evidence-led.

Acceptance criteria:

- Given an outcome metric, when I review the scorecard, then baseline, target, current result, progress, owner, definition, and evidence source are visible.
- Given I change case volume, effort, cost, or implementation assumptions, when the values are saved, then annual benefit, hours released, payback, net benefit, ROI, and recommendation refresh.
- Given a roadmap item, when I review priority, then value, risk reduction, effort, outcome, horizon, and delivery status are visible.
- Given payback exceeds the agreed threshold, when the business case is evaluated, then the recommendation changes to Rework Case.

## Epic 11: Release and Operational Readiness

### US-019: Derive Evidence-Led Release Decision

As a Release Steering Committee member, I want release posture to be calculated from accountable readiness gates so that open blockers cannot be hidden in status reporting.

Acceptance criteria:

- Given any release gate is Block, when readiness is calculated, then posture is No-Go.
- Given no gate is Block but at least one gate is Watch, when readiness is calculated, then posture is Conditional Go.
- Given every gate is Pass, when readiness is calculated, then posture is Go.
- Given a decision is recorded or exported, when the audit trail is reviewed, then posture, blockers, watch items, actor, and reference are visible.

### US-020: Govern Cutover and Hypercare

As a Business Cutover Lead, I want each production transition step to have validation and rollback criteria so that the release can be controlled under time pressure.

Acceptance criteria:

- Given a cutover activity, when I review it, then sequence, window, owner, status, completion validation, and rollback trigger are visible.
- Given a critical reconciliation or smoke test fails, when the trigger is met, then the runbook provides an explicit rollback condition.
- Given the system enters hypercare, when indicators are reviewed, then each has target, current result, status, and accountable owner.
- Given an indicator breaches threshold, when governance is reviewed, then the item is highlighted for escalation.
