# Defect and Release Control Specification

## Objective

Connect failed UAT evidence to a governed defect lifecycle and ensure the release recommendation changes automatically when defect risk changes.

## Defect Lifecycle

| Current Status | Action | Control Requirement | Next Status |
| --- | --- | --- | --- |
| Open | Start Fix | Owner assigned | In Fix |
| In Fix | Submit for Retest | Resolution and fix detail recorded | Ready for Retest |
| Ready for Retest | Pass and Close | Successful retest evidence recorded | Closed |
| Ready for Retest | Fail Retest | Failed outcome recorded | Retest Failed |
| Retest Failed | Return to Fix | Defect returned to delivery owner | In Fix |
| Open / In Fix / Retest Failed | Approve Risk Acceptance | Accountable approver and residual-risk rationale recorded | Risk Accepted |

## Release Derivation

| Defect Position | UAT Defect Gate | Release Effect |
| --- | --- | --- |
| Any unresolved Critical or High defect | Block | No-Go |
| No Critical or High open; Medium or Low defects remain | Watch | Conditional Go |
| Defects have approved risk acceptance | Watch | Conditional Go with named owner and monitoring |
| All defects closed with retest evidence | Pass | Defect control does not block Go |

`REL-002` is system-derived from the shared defect register and cannot be manually changed. `REL-008` is derived from all prerequisite release gates and cannot be manually changed. This prevents a user from overriding evidence without resolving the underlying control item.

## Functional Requirements

- `DEF-REQ-001`: Failed or blocked UAT cases without an existing defect can raise a linked defect.
- `DEF-REQ-002`: Each defect records test case, requirement, severity, priority, owner, business impact, root cause, target date, resolution, and retest evidence.
- `DEF-REQ-003`: A defect cannot move to Ready for Retest without resolution detail.
- `DEF-REQ-004`: A defect cannot close without successful retest evidence.
- `DEF-REQ-004A`: Successful defect closure synchronizes the linked UAT case to Passed and Retest Passed.
- `DEF-REQ-005`: Critical and High defects block the UAT release gate until closed or formally risk accepted.
- `DEF-REQ-006`: Risk acceptance requires an accountable authority and documented rationale.
- `DEF-REQ-007`: Risk acceptance results in Watch rather than Pass.
- `DEF-REQ-008`: Defect and release decisions create audit events and persist after browser refresh.

## Acceptance Scenarios

1. Given an unlinked failed UAT case, when the UAT Coordinator raises a defect, then a new linked defect appears in the Defect Register.
2. Given an In Fix defect without resolution detail, when the owner submits it for retest, then the transition is blocked.
3. Given a Ready for Retest defect without evidence, when the UAT Lead attempts closure, then the transition is blocked.
4. Given an unresolved Critical defect, when Release Readiness is opened, then `REL-002` is Block and the release posture is No-Go.
5. Given only approved risk-accepted defects, when Release Readiness is opened, then the defect gate is Watch and the posture cannot be Go.
6. Given all defects closed with retest evidence and all other gates passed, when Release Readiness is opened, then the posture is Go.

## MVP Boundary

The register uses mock data and browser local storage. A production implementation would require authenticated role permissions, immutable audit history, server-side workflow validation, attachment controls, notification SLAs, and database persistence.
