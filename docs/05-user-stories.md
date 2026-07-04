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
- Given exception severity is High, when the case is routed, then exception approval is required before final credit approval.
- Given an exception is rejected, when the case returns to RM or Analyst, then the rejection reason is visible.

## Epic 4: Approval Routing

### US-007: Recommended Approval Route

As a Credit Approver, I want the system to recommend the approval route based on exposure and risk so that the case goes to the correct authority level.

Acceptance criteria:

- Given total exposure is within Level 1 limit and risk grade is acceptable, when the route is calculated, then Level 1 approval is recommended.
- Given a high-risk grade or high-severity exception exists, when the route is calculated, then the route is escalated.
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

