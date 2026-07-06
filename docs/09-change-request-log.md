# Change Request Log

The examples below show how change requests can be assessed during delivery. They are synthetic but written in the style of a real project log.

## Change Request Summary

| CR ID | Request | Raised By | Impact Area | BA Assessment | Decision |
| --- | --- | --- | --- | --- | --- |
| CR-001 | Add "Restructure" as application type. | Credit Risk | Intake, routing, reporting | Valid business need. Requires application type list update and extra reporting filter. | Approved |
| CR-002 | Allow RM to submit case without latest financial statements if waiver is requested. | RM Team | Checklist, exception, approval | Acceptable only if waiver reason and approver are mandatory. Requires maker-checker control. | Approved with control |
| CR-003 | Add SMS notification to customer after approval. | Business | Customer communication | Outside current system scope and requires customer communication approval. | Deferred |
| CR-004 | Allow route override by Credit Analyst. | Credit Team | Approval routing | Control risk if too broad. Recommend restricted override permission with mandatory reason. | Partially approved |
| CR-005 | Include existing facility exposure from core banking in approval route. | Credit Risk | Integration, routing | Strong business value but depends on interface readiness. Manual input retained for portfolio version. | Deferred to Phase 2 |
| CR-006 | Add dashboard view by industry sector. | Product Owner | Reporting | Low implementation risk if industry sector is available in customer profile. | Approved |

## Change Request Assessment Template

| Assessment Area | Questions |
| --- | --- |
| Business value | What problem does the request solve? Is it required for go-live or a later enhancement? |
| Control impact | Does it affect approval authority, waiver, audit trail, or segregation of duties? |
| Data impact | Are new fields, validations, or reporting dimensions required? |
| Process impact | Which roles and handoffs change? |
| Testing impact | Which UAT scenarios must be added or amended? |
| Delivery impact | Does it affect timeline, dependencies, or release scope? |

## Example CR Detail: CR-002

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
