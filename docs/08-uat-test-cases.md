# UAT Test Cases

These UAT cases focus on business outcomes and control points. They are written for business testers, not only system testers.

## Test Data Assumptions

| Data Item | Value |
| --- | --- |
| RM user | RM-017 |
| Credit Analyst | CA-006 |
| Level 1 Approver | AP-L1-002 |
| Level 2 Approver | AP-L2-004 |
| Credit Admin | CAD-004 |
| Sample customer | Suria Components Sdn Bhd |
| Sample application | BCS-2026-UAT-001 |

## UAT Scenarios

| Test ID | Scenario | Precondition | Steps | Expected Result | Priority |
| --- | --- | --- | --- | --- | --- |
| UAT-001 | Create draft business credit application | RM has access to customer portfolio. | Create new application for sample customer and save draft. | Application ID is generated and status is Draft. | High |
| UAT-002 | Block submission when facility is missing | Application is in Draft status. | Click Submit without adding a facility. | Submission is blocked and missing facility message is shown. | High |
| UAT-003 | Capture multiple facilities | Application is in Draft status. | Add overdraft and term loan facilities with required fields. | Both facilities are saved under the same application. | High |
| UAT-004 | Generate checklist for property-secured term loan | Term loan is marked secured with property collateral. | Save facility and collateral details. | Property-related checklist items are generated. | High |
| UAT-005 | Block submission when mandatory document is missing | Checklist contains mandatory items. | Attempt submission with a mandatory document Not Uploaded. | Submission is blocked and missing item is displayed. | High |
| UAT-006 | Submit complete application to Credit Review | Mandatory fields and documents are completed. | Click Submit. | Status changes to Pending Credit Review and analyst queue is assigned. | High |
| UAT-007 | Complete structured credit assessment | Case is assigned to Credit Analyst. | Fill assessment sections and submit recommendation. | Recommendation is saved and case proceeds to routing. | High |
| UAT-008 | Capture medium-severity exception | Analyst identifies documentation exception. | Add exception type, severity, reason, and mitigating factor. | Exception record is created with Pending status. | High |
| UAT-009 | Route high-severity exception for approval | Exception severity is High. | Submit case for routing. | Case goes to Pending Exception Approval before final credit approval. | High |
| UAT-010 | Calculate Level 2 approval route | Total exposure is MYR 1.2m and risk grade is A-B. | Run approval route calculation. | Level 2 Approver is recommended. | High |
| UAT-011 | Require reason for route override | Authorized user changes recommended route. | Override route and save without reason. | Save is blocked until reason is entered. | Medium |
| UAT-012 | Prevent maker from approving own waiver | User created a document waiver. | Same user attempts to approve waiver. | System blocks approval due to maker-checker rule. | High |
| UAT-013 | Record approved decision | Case is pending approver action. | Approver selects Approved and submits. | Case moves to Pending Conditions. | High |
| UAT-014 | Require rejection reason | Case is pending approver action. | Approver selects Rejected without reason. | Decision is blocked until reason is entered. | High |
| UAT-015 | Generate conditions precedent after approval | Case is approved. | Open conditions tab. | Required conditions are generated based on facility and collateral. | High |
| UAT-016 | Block readiness with open mandatory condition | Mandatory condition remains open. | Credit Admin clicks Ready for Facility Setup. | Status change is blocked and open condition list is shown. | High |
| UAT-017 | Mark case ready after conditions completed | Mandatory conditions are completed or waived. | Credit Admin clicks Ready for Facility Setup. | Status changes to Ready for Facility Setup. | High |
| UAT-018 | Dashboard shows overdue cases | Cases exceed SLA threshold. | Open dashboard and filter by current month. | Overdue cases are highlighted in aging view. | Medium |
| UAT-019 | Audit trail records waiver | Waiver is created and approved. | Open audit trail. | Maker, checker, timestamp, reason, and status changes are visible. | High |
| UAT-020 | Role access restriction | RM tries to open non-portfolio case. | Search and open case outside portfolio. | Access is denied or record is not visible. | High |

## UAT Exit Criteria

| Area | Exit Criteria |
| --- | --- |
| Critical scenarios | All High priority UAT cases passed or have approved workaround. |
| Defect severity | No open Severity 1 or Severity 2 defects. |
| Business sign-off | Product Owner, Credit, RM representative, and Credit Admin representative sign off. |
| Reporting | Dashboard values reconcile to agreed test data sample. |
| Access control | Role-based access tests passed for RM, Credit, Approver, and Admin roles. |

## Defect Triage Fields

| Field | Description |
| --- | --- |
| Defect ID | Unique defect reference. |
| Test ID | UAT case linked to defect. |
| Severity | Severity 1, 2, 3, or 4. |
| Business Impact | Practical impact on user journey or control. |
| Owner | Technology, Business, Data, or Access Management. |
| Target Fix Date | Expected resolution date. |
| Retest Status | Not Retested, Passed, Failed. |

