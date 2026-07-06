# Global Commercial Credit Modernization Platform

A flagship Banking Business Analyst / Product Analyst portfolio project for commercial lending workflow modernization.

Live site: [https://xiang13-gif.github.io/business-credit-system-enhancement-case-study/](https://xiang13-gif.github.io/business-credit-system-enhancement-case-study/)

The project simulates how a global bank could modernize commercial credit operations through document automation, risk-based approval routing, policy exception governance, UAT traceability, audit evidence, and executive dashboards.

## Portfolio Positioning

This is not a generic dashboard demo. It is a banking transformation case study designed to show how a BA can translate commercial lending pain points into requirements, business rules, controls, UAT scope, change impact analysis, traceability, and management reporting.

Target review audience:

- Banking Business Analyst hiring managers
- Product Analyst and Product Owner teams
- Credit Operations and Lending Services teams
- Risk, Controls, and Transformation teams
- Recruiters screening for financial services domain capability

## Business Problem

Commercial credit workflows often involve multiple facilities, documents, collateral items, policy exceptions, approval authorities, UAT cycles, and operational handoffs.

Common pain points modeled in this project:

- RM submissions with missing documents or unclear waiver status
- Manual approval routing and delegated authority interpretation
- Policy exceptions captured in notes instead of structured registers
- Credit pipeline bottlenecks tracked outside the system
- UAT defects and retests disconnected from requirements
- Weak visibility across control evidence, audit trail, and change impact

## Core Modules

| Module | Purpose |
| --- | --- |
| Executive Dashboard | Pipeline exposure, aging, bottlenecks, owner role, exception severity, document readiness, UAT health, CR priority, and traceability status. |
| Approval Routing Simulator | Risk-based delegated authority using exposure, risk level, collateral coverage, customer segment, facility type, and exception severity. |
| Policy Exception Register | Exception governance with severity, mitigation, owner, aging, approval tier, control evidence, requirement linkage, and UAT coverage. |
| Document Checklist Generator | Rule-based document checklist generation for commercial credit applications. |
| UAT Test Case Tracker | UAT execution, defect linkage, retest tracking, pass rate, filters, and export. |
| Change Request Impact Analyzer | CR impact across requirements, UAT scope, roles, business rules, controls, operational risk, and BA recommendation. |
| Role-Based Workflow View | RM, Credit Analyst, Approver, Credit Admin, and System Admin lenses for role-specific impact. |
| Traceability Matrix | Requirement-to-business-rule-to-test-case-to-change-request linkage. |
| Audit Trail | Local activity log for exports, UAT updates, role review, route simulation, and CR review. |
| Case Study Page | Project story, scope, risk controls, future enhancements, and confidentiality boundary. |

## Key Capabilities Demonstrated

- Commercial banking and loan origination domain knowledge
- Business requirement analysis and acceptance criteria thinking
- Approval matrix and delegated authority rule design
- Policy exception governance and maker-checker control
- Document checklist logic and waiver handling
- UAT planning, defect tracking, retest workflow, and release readiness
- Change request impact analysis and scope control
- Requirement traceability and audit evidence
- Executive dashboard storytelling for credit operations
- Frontend implementation with Next.js, TypeScript, Tailwind CSS, and Recharts

## Sample Portfolio Metrics

The application uses mock data only. Metrics are portfolio assumptions for demonstration:

- Pipeline exposure and case aging by owner role
- Document readiness percentage
- Policy exception severity and aging
- UAT pass rate, failed cases, blocked cases, and pending retest
- High-priority change request count
- Requirement traceability coverage

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn-style reusable UI primitives
- Lucide React icons
- Recharts
- Mock data and local browser state

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Executive portfolio overview and module entry points |
| `/dashboard` | Credit operations control room |
| `/approval-routing` | Risk-based approval routing simulator |
| `/exceptions` | Policy exception register |
| `/checklist` | Rule-based document checklist generator |
| `/uat` | UAT tracker with defect and retest workflow |
| `/change-requests` | Change request impact analyzer |
| `/roles` | Role-based workflow and stakeholder view |
| `/traceability` | Requirement-to-test-to-CR matrix |
| `/audit` | Local activity log and audit trail |
| `/about` | Project case study and BA positioning |

## How to Run

```bash
pnpm install
pnpm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Quality Checks

```bash
pnpm run check
```

This runs:

- sensitive file and token scan
- ESLint
- TypeScript typecheck
- production build

## Deploy to Vercel

Recommended settings:

- Framework preset: Next.js
- Install command: `pnpm install`
- Build command: `pnpm run build`
- Output: Next.js default

## LinkedIn Project Summary

Built a Global Commercial Credit Modernization Platform simulator to demonstrate how a Banking Business Analyst can modernize commercial lending workflows through document automation, approval routing, policy exception governance, UAT traceability, audit controls, and operational dashboards.

Suggested highlights:

- Designed risk-based approval routing logic using exposure, risk level, collateral coverage, customer segment, and exception severity.
- Built a policy exception register with severity, mitigation, aging, approval authority, control evidence, and UAT linkage.
- Created executive dashboard views for pipeline aging, bottlenecks, document readiness, UAT health, change requests, and traceability.
- Modeled BA artifacts including requirements, business rules, UAT cases, change impact analysis, traceability, and audit trail.

## Future Enhancements

- User login and role-based access control
- API routes and database persistence
- PostgreSQL / Supabase database
- Prisma ORM
- Excel / PDF export
- Workflow approval state machine
- Server-side audit trail persistence
- Release cycle planning and defect aging
- Reviewer comments and sign-off workflow

## Disclaimer

This is a portfolio project using mock data and generalized banking logic. It is not connected to any real bank system and does not contain confidential information, production data, internal policy wording, customer information, employee information, or vendor details.
