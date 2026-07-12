# Stakeholders and RACI

## Stakeholder Summary

| Stakeholder | Main Responsibility | Current Pain Point | Enhancement Benefit |
| --- | --- | --- | --- |
| Relationship Manager | Captures customer request, facilities, documents, and business justification. | Unclear missing items and repeated clarification requests. | Clear validation, checklist, and case status. |
| Credit Analyst | Reviews financials, risk, collateral, conduct, and recommendation. | Time spent on incomplete submissions. | Cleaner queue and structured assessment inputs. |
| Credit Approver | Reviews application package and records credit decision. | Routing and exception context may not be clear. | Better approval package and exception visibility. |
| Credit Administration | Verifies documentation and readiness after approval. | Conditions and required documents may be tracked manually. | Controlled checklist and readiness status. |
| Compliance | Reviews relevant risk indicators where required. | Late involvement when risk indicators are discovered manually. | Earlier trigger based on defined risk flags. |
| Business Product Owner | Owns priority, scope, and benefit realization. | Difficulty seeing process bottlenecks. | Dashboard and measurable process controls. |
| Rule Product Owner | Owns business-rule definition, version, effective date, and lifecycle decision. | Rules may be embedded across code, procedure, and informal interpretation. | Governed registry, impact analysis, regression evidence, and activation control. |
| Credit Data Owner / Steward | Owns business definitions, quality thresholds, lineage, and remediation decisions. | Source issues are discovered only after they affect decisions or reports. | Critical data register with source-to-output lineage and downstream impact. |
| Release Manager / Change Lead | Coordinates readiness, cutover, communications, support, and hypercare. | Go-live status may be reported without consistent exit criteria or rollback evidence. | Evidence-led gates, sequenced runbook, and early-life monitoring. |
| Technology Team | Designs and implements system changes. | Requirements can be scattered across emails and meetings. | Structured requirements, rules, data dictionary, and API contract. |
| UAT Testers | Validate business scenarios before release. | Test cases may focus on screens rather than full business flows. | Scenario-led UAT coverage. |

## RACI Matrix

| Activity | RM | Credit Analyst | Credit Approver | Credit Admin | Compliance | Product Owner | Tech Team |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Define business problem | C | C | C | C | C | A | C |
| Confirm mandatory fields | R | R | C | C | C | A | C |
| Define approval matrix logic | C | R | A | C | C | A | C |
| Define document checklist rules | R | C | C | A | C | A | C |
| Define exception categories | C | R | A | C | C | A | C |
| Build system changes | I | I | I | I | I | A | R |
| Prepare UAT scenarios | R | R | C | R | C | A | C |
| Execute UAT | R | R | R | R | C | A | I |
| Sign off release | C | C | C | C | C | A | R |

Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed.

## Key BA Engagement Points

| Stage | BA Focus |
| --- | --- |
| Discovery | Understand handoffs, rework causes, manual trackers, and reporting gaps. |
| Requirement shaping | Convert pain points into requirements with business rationale and acceptance criteria. |
| Rule definition | Confirm approval routing, exception categories, and checklist generation logic with business owners. |
| Rule governance | Compare current and proposed logic, identify downstream impact, agree checker and effective date, and define required regression evidence. |
| Data governance | Define critical data, source-to-output lineage, quality thresholds, ownership, and downstream issue impact. |
| Build support | Clarify requirements, review prototypes, and confirm edge cases. |
| UAT | Ensure tests cover end-to-end credit scenarios, not only field-level validation. |
| Value realization | Agree baseline, target, metric definition, accountable owner, evidence source, benefit assumptions, and roadmap trade-offs. |
| Release readiness | Convert acceptance into measurable gates; confirm migration, procedures, training, cutover validation, rollback, support, and post-release monitoring. |
