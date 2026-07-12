# Change Request Log

The examples below show how change requests can be assessed during delivery. They are synthetic but written in the style of a real project log.

## Change Request Summary

| CR ID | Request | Raised By | Impact Area | BA Assessment | Decision |
| --- | --- | --- | --- | --- | --- |
| CR001 | Allow controlled waiver for missing financial statement. | RM Team | Checklist, exception, approval | Acceptable only with alternative evidence, reason, expiry, independent approval, and audit trail. | Approved with control |
| CR002 | Add Corporate Guarantee collateral type. | Credit Operations | Checklist, legal evidence, UAT | Requires guarantee agreement, authority evidence, signatory verification, and collateral regression. | Approved |
| CR003 | Make EDD mandatory for High Risk customers. | Credit Risk | Compliance, checklist, submission gate | High control value; EDD must be a submission blocker with approver visibility. | Approved |
| CR004 | Add failed UAT, defect, root cause, and retest tracking. | UAT Lead | Delivery assurance | Required so open high-priority failures cannot disappear from release reporting. | Approved |
| CR005 | Introduce risk-based approval routing. | Credit Risk | Delegated authority, controls, reporting | Adopt transparent scoring, override controls, maker-checker, and route regression. | Approved with control |
| CR006 | Add Credit Case 360 lifecycle view. | Credit Operations | Lifecycle, controls, UAT evidence | Consolidates readiness, blockers, linked evidence, recommendation, and next actions. | Approved |
| CR007 | Introduce evidence-grounded Credit Memo Studio. | Credit Transformation | Document intelligence, controls | Require source lineage, confidence, missing-evidence blockers, human review, masking, versioning, and independent approval. | Approved with control |
| CR008 | Establish business rule governance and impact testing. | Rule Product Owner | Rules, requirements, UAT, operations | Require controlled versions, maker-checker lifecycle, impact analysis, regression, and activation gate. | Approved |
| CR009 | Add critical data lineage and benefits realization. | Data Owner / Product Owner | Data governance, product value | Link source data to decisions and govern outcomes through baseline, target, owner, evidence, and financial viability. | Approved |
| CR010 | Add release, cutover, and hypercare controls. | Release Steering Committee | Release assurance | Derive Go / No-Go from evidence and require cutover validation, rollback triggers, and early-life monitoring. | Approved |

## Change Request Assessment Template

| Assessment Area | Questions |
| --- | --- |
| Business value | What problem does the request solve? Is it required for go-live or a later enhancement? |
| Control impact | Does it affect approval authority, waiver, audit trail, or segregation of duties? |
| Data impact | Are new fields, validations, or reporting dimensions required? |
| Process impact | Which roles and handoffs change? |
| Testing impact | Which UAT scenarios must be added or amended? |
| Delivery impact | Does it affect timeline, dependencies, or release scope? |

## Example CR Detail: CR001

### Request

Allow RM to submit a case when the latest audited financial statements are not yet available, provided that an approved waiver is captured.

### Business Reason

Some renewal cases may require processing before final audited financial statements are available. The business needs a controlled way to proceed using interim management accounts and other supporting documents.

### BA Assessment

The request is reasonable, but it should not create a bypass. The system should require:

- Document waiver reason
- Supporting interim documents
- Exception category = Documentation
- Exception severity based on business rule
- Approval by authorized role
- Audit trail entry

### Requirement Impact

Affected artifacts:

- FR-005 Document status
- FR-008 Exception capture
- NFR-002 Maker-checker control
- UAT-008 Capture exception
- UAT-012 Prevent maker from approving own waiver

### Decision

Approved with control requirements.
