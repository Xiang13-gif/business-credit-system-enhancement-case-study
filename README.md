# Business Credit System Enhancement Case Study

An anonymized Business Analyst portfolio project for a commercial banking credit platform.

This repository documents how a Business Credit System can be enhanced to improve SME and commercial credit application handling, approval routing, document completeness, and operational visibility. It is written as a realistic BA delivery pack, not as a production system.

## Case Context

A commercial bank uses a Business Credit System to support business financing applications submitted by Relationship Managers. The system supports facilities such as term loan, overdraft, trade line, and bank guarantee.

The enhancement focuses on a practical problem: credit applications often move between Relationship Managers, Credit Analysts, Approvers, Credit Administration, and Compliance with repeated follow-up, manual checklist tracking, and unclear case ownership. This causes rework, slower turnaround time, and weak visibility over pending cases.

The proposed enhancement introduces structured intake, validation rules, approval routing, credit documentation checklist logic, exception handling, and management reporting.

## Project Objective

Improve the credit application journey without pretending that commercial credit can be fully automated.

The target is to reduce rework, improve auditability, and make case status transparent from application creation to credit decision and disbursement readiness.

## Scope

In scope:

- Business credit application intake
- Facility and collateral capture
- Credit approval routing
- Policy exception handling
- Document checklist and condition precedent tracking
- Maker-checker control points
- Case status dashboard
- UAT scenarios and sample SQL analysis
- API contract for discussion with technology teams

Out of scope:

- Real credit scoring model
- Core banking posting
- Pricing engine
- Live customer data
- Production integration design

## Repository Guide

| Area | File | Purpose |
| --- | --- | --- |
| Business case | [docs/01-business-problem.md](docs/01-business-problem.md) | Explains the problem, goals, assumptions, and success measures. |
| Process | [docs/02-as-is-to-be-process.md](docs/02-as-is-to-be-process.md) | Shows the current and proposed credit workflow using Mermaid diagrams. |
| Stakeholders | [docs/03-stakeholders-and-raci.md](docs/03-stakeholders-and-raci.md) | Defines user groups, responsibilities, and RACI. |
| Requirements | [docs/04-business-requirements.md](docs/04-business-requirements.md) | Functional and non-functional requirements with rationale. |
| Agile delivery | [docs/05-user-stories.md](docs/05-user-stories.md) | Epics, user stories, and acceptance criteria. |
| Rules | [docs/06-business-rules-and-approval-matrix.md](docs/06-business-rules-and-approval-matrix.md) | Business rules, routing logic, exception types, and approval matrix. |
| Data | [docs/07-data-dictionary.md](docs/07-data-dictionary.md) | Data entities, fields, validations, and ownership. |
| Testing | [docs/08-uat-test-cases.md](docs/08-uat-test-cases.md) | UAT test cases for key business scenarios. |
| Governance | [docs/09-change-request-log.md](docs/09-change-request-log.md) | Change request examples and impact assessment. |
| Reporting | [docs/10-dashboard-mockup.md](docs/10-dashboard-mockup.md) | Dashboard layout, KPIs, and sample metrics. |
| Boundaries | [docs/11-references-and-boundaries.md](docs/11-references-and-boundaries.md) | Research basis, confidentiality note, and portfolio boundaries. |
| Sample data | [samples/sample-credit-applications.md](samples/sample-credit-applications.md) | Small synthetic data set for analysis examples. |
| SQL | [sql/credit_pipeline_analysis.sql](sql/credit_pipeline_analysis.sql) | Sample SQL queries for pipeline, SLA, and exception analysis. |
| API | [api/business-credit-application.yaml](api/business-credit-application.yaml) | OpenAPI-style contract for technical discussion. |

## What This Demonstrates

This case study is designed to show practical BA capability in banking:

- Translating an operational credit problem into structured requirements
- Writing requirements with business rationale, not generic feature lists
- Understanding credit application roles and approval controls
- Defining data fields, validations, and ownership
- Preparing UAT cases that test business outcomes
- Using SQL to support operational analysis
- Communicating with developers through an API contract
- Keeping confidentiality boundaries clear

## Evidence Basis

The design is informed by public banking and risk-management references, including:

- Bank Negara Malaysia Credit Risk policy document: https://www.bnm.gov.my/documents/20124/938039/pd_Credit_Risk_2023.pdf
- Bank Negara Malaysia Risk Management in Technology policy document: https://www.bnm.gov.my/documents/20124/938039/pd-rmit-nov25.pdf
- Basel Committee principles for credit risk management: https://www.bis.org/bcbs/publ/d595.htm
- Bank Negara Malaysia CCRIS overview: https://www.bnm.gov.my/ccris

The repository does not copy any bank's internal process, system screen, data, configuration, or policy wording.

## Confidentiality Note

This is a portfolio case study based on a generalized commercial banking scenario. All names, amounts, rules, workflows, data, and examples are synthetic. It is not affiliated with any bank and does not disclose client, employee, vendor, system, or production information.

## Suggested LinkedIn Summary

Business Credit System Enhancement case study covering commercial credit workflow, approval routing, document checklist controls, exception handling, data dictionary, UAT scenarios, SQL analysis, dashboard mockup, and API contract.

