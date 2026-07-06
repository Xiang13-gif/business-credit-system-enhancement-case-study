# Information Architecture

## Navigation

| Page | Purpose |
| --- | --- |
| Home | Portfolio introduction, quick stats, module entry points. |
| Dashboard | Credit operations control room for pipeline aging, owner bottlenecks, exceptions, UAT, CR, and traceability metrics. |
| Case 360 | End-to-end case lifecycle evidence across case profile, documents, analysis, approval route, exceptions, UAT, audit, readiness gates, BA recommendation, and next actions. |
| Approval Routing | Risk-based delegated authority simulation for exposure, risk, collateral, segment, and exception severity. |
| Exception Register | Policy exception governance with severity, owner, mitigation, aging, approval tier, and evidence. |
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
| ApprovalRoutingInput | Application, facility, segment, exposure, risk, collateral coverage, and exception severity. |
| ApprovalRouteResult | Recommended approval tier, routing score, SLA, maker-checker requirement, rationale, controls, and escalation triggers. |
| ChecklistDocument | Generated document with category, requirement level, reason, and business rule. |
| BusinessRule | Rule ID, description, and control point. |
| PolicyException | Exception ID, type, severity, status, owner, mitigation, approval tier, linked requirement, linked UAT case, and evidence. |
| CreditPipelineCase | Case ID, segment, facility, exposure, risk, stage, owner role, aging, exception count, and document readiness. |
| CreditCase360 | Case-level lifecycle record with profile, current stage, owner, approval tier, linked exception IDs, linked UAT IDs, readiness gates, BA recommendation, and next best actions. |
| CaseLifecycleStep | Workflow step status, owner, aging, control objective, evidence, and risk signal. |
| CaseReadinessGate | Gate status, owner, evidence, linked requirement, and linked UAT case. |
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
