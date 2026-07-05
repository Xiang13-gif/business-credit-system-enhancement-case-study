# Information Architecture

## Navigation

| Page | Purpose |
| --- | --- |
| Home | Portfolio introduction, quick stats, module entry points. |
| Dashboard | Portfolio analytics for UAT, checklist, CR, and traceability metrics. |
| Checklist Generator | Rule-driven document requirement generation. |
| UAT Tracker | UAT test case management and delivery monitoring. |
| CR Impact | Change request impact analysis and BA recommendation. |
| Role View | Stakeholder responsibilities, control focus, role UAT queue, and CR exposure. |
| Traceability | Requirement-to-rule-to-test-to-CR mapping. |
| Audit Trail | Local activity log for key BA workflow actions. |
| About Project | Case study explaining BA thinking and portfolio positioning. |

## Data Model

| Model | Description |
| --- | --- |
| ChecklistInput | User-selected application, facility, collateral, customer, risk, and financial statement values. |
| ChecklistDocument | Generated document with category, requirement level, reason, and business rule. |
| BusinessRule | Rule ID, description, and control point. |
| UatTestCase | Test case ID, requirement, scenario, steps, expected result, priority, status, role, tester, defect, retest status, root cause, and remarks. |
| ChangeRequest | CR impact across requirements, UAT, roles, rules, risks, recommendation, and test scope. |
| TraceabilityItem | Requirement mapping to business rule, UAT case, CR, and status. |
| AuditEvent | Local event record showing workflow action, actor, module, and timestamp. |

## Business Rule Design

The checklist module uses a rule engine in `lib/checklist-rules.ts`. UI selections are passed into `generateChecklist`, which returns:

- generated documents
- triggered business rules
- risk warnings

The UI does not hardcode final checklist output. It renders the rule engine result.

## Page Design

The interface is designed like an enterprise internal dashboard:

- left navigation
- summary cards
- filter panels
- data tables
- charts
- badges
- risk panels
- export actions
- local activity log
- dark mode support
