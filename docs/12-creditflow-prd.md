# CreditFlow BA Toolkit PRD

## Product Name

CreditFlow BA Toolkit

## Product Objective

Create a GitHub-ready Banking Business Analyst portfolio app that demonstrates credit operations domain knowledge, requirement analysis, document checklist logic, UAT tracking, change request impact analysis, control risk thinking, and traceability.

## Target Audience

- Recruiters
- Hiring managers
- Interviewers
- Banking BA leads
- Product owners reviewing BA capability

## Problem Statement

Banking BA work is often difficult to show in a portfolio because real project artifacts are confidential. This MVP provides a safe, anonymized simulation of common BA deliverables in a commercial credit enhancement project.

## Scope

In scope:

- Document Checklist Generator
- UAT Test Case Tracker
- Change Request Impact Analyzer
- Traceability Matrix
- Project Case Study page
- Mock data
- Local browser state for UAT status updates

Out of scope:

- Real customer data
- Real bank policy
- Authentication
- Database persistence
- Production workflow approval
- Core banking integration

## Functional Requirements

| ID | Requirement |
| --- | --- |
| REQ001 | Generate checklist based on application type. |
| REQ002 | Require waiver if financial statement is missing. |
| REQ003 | Require revised approval memo for enhancement application. |
| REQ004 | Require EDD for high risk customer. |
| REQ005 | Generate collateral documents based on collateral type. |
| REQ006 | Generate trade facility documents for Trade Line. |
| REQ007 | Generate BG Application Form and Counter Indemnity for Bank Guarantee. |
| REQ008 | Track UAT test case status and delivery metrics. |
| REQ009 | Show change request impact across requirements, UAT, controls, and roles. |

## Success Criteria

- User can generate checklist from business inputs.
- User can filter and update UAT case status.
- User can analyze CR impact and BA recommendation.
- User can view traceability matrix.
- App builds successfully with TypeScript.
- Repository contains no confidential data or secrets.
