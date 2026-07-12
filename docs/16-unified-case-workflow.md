# Unified Case Workflow Specification

## Objective

Connect credit application intake, document requirements, credit analysis, delegated authority, approval decisions, operational tasks, and audit evidence through one controlled case record.

## Workflow States

| Current State | Business Action | Control Gate | Next State | Owner |
| --- | --- | --- | --- | --- |
| Draft | Submit for credit review | Customer details, positive exposure, mandatory documents, and waiver approval are complete | Credit Review | Credit Analyst |
| Returned | Resubmit corrected case | Returned control gaps are resolved | Credit Review | Credit Analyst |
| Credit Review | Submit recommendation | Credit recommendation contains sufficient rationale | Approval | Approver |
| Approval | Record credit decision | Approve or Conditional Approve decision includes rationale | Documentation | Credit Admin |
| Approval | Return case | Return decision includes remediation rationale | Returned | RM |
| Documentation | Complete facility documentation | Required document set remains complete | Completed | Credit Admin |

## Functional Requirements

- `WF-REQ-001`: Users can create and maintain multiple mock commercial credit cases.
- `WF-REQ-002`: Case changes recalculate document requirements and delegated approval authority from governed business rules.
- `WF-REQ-003`: Invalid stage transitions are blocked with an explainable reason.
- `WF-REQ-004`: Outstanding work is presented by accountable banking role.
- `WF-REQ-005`: Approval, conditional approval, and return decisions require a rationale and timestamp.
- `WF-REQ-006`: Case state and decisions persist after a browser refresh.
- `WF-REQ-007`: Material workflow actions generate audit events.

## Business Rules

- Mandatory documents must be ready before RM submission.
- Missing or waived financial statements require independent waiver approval.
- High-risk cases inherit Enhanced Due Diligence document controls from the checklist rule engine.
- Credit Review cannot complete without a documented recommendation.
- Approval cannot complete without an accountable decision and rationale.
- A Return decision transfers ownership to RM and allows controlled resubmission.
- Approval authority is recalculated when exposure, risk, collateral, segment, application type, or exception context changes.

## Acceptance Scenarios

1. Given a Draft case with missing mandatory documents, when RM attempts submission, then the transition is blocked and the missing count is shown.
2. Given a complete Draft case, when RM submits it, then the case moves to Credit Review and ownership moves to Credit Analyst.
3. Given a Credit Review case without recommendation text, when the user attempts to proceed, then Approval remains blocked.
4. Given an Approval case, when the Approver records an approval with rationale, then Documentation becomes available.
5. Given an Approval case, when the Approver returns it, then the case moves to Returned and ownership moves to RM.
6. Given a saved case, when the page is refreshed, then the latest stage, documents, recommendation, tasks, and decisions remain available.

## MVP Data Boundary

The workflow uses mock data and browser local storage. It does not authenticate users, upload confidential documents, or connect to a bank system. Production implementation would require server-side authorization, database persistence, immutable audit storage, and approved document-management integration.
