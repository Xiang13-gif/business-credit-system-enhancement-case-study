# CreditFlow BA Toolkit

CreditFlow BA Toolkit is a Banking Business Analyst portfolio web app for a simulated Credit Operations / Loan Origination enhancement project.

It demonstrates how a BA can translate banking process knowledge into requirements, business rules, UAT tracking, change request impact analysis, control risk review, and traceability.

## Overview

This project models a generalized commercial banking credit enhancement scenario. It is not a real banking system. The MVP uses mock data and local browser state to make the portfolio safe to publish on GitHub.

Core modules:

- Document Checklist Generator
- UAT Test Case Tracker
- Change Request Impact Analyzer
- Traceability Matrix
- Project Case Study page

## Why I Built This

I built this project to demonstrate Business Analyst capability beyond writing generic requirements. The app shows how banking credit workflows can be broken down into rules, test scenarios, control risks, change impacts, and delivery tracking.

The project is designed for recruiter, hiring manager, and interviewer review.

## Key Features

### Document Checklist Generator

- Rule-based document checklist generation
- Inputs for application type, facility type, collateral type, customer type, risk level, and financial statement availability
- Required / Conditional / Optional document tagging
- Business rule rationale for every generated document
- Risk warning panel for waiver, unsecured exposure, and high-risk customer scenarios
- CSV export

### UAT Test Case Tracker

- Realistic banking UAT cases
- Filters by priority, status, role, and keyword
- Editable UAT status dropdown
- Summary metrics and pass-rate progress bar
- Failed case highlighting
- Linked defect ID display
- CSV export
- Local browser persistence for status changes

### Change Request Impact Analyzer

- Preloaded banking-style change requests
- Impacted requirements
- Impacted UAT test cases
- Impacted roles and business rules
- Control risk and operational risk
- BA recommendation
- Suggested test scope
- CSV export

### Traceability Matrix

- Requirement-to-business-rule-to-test-case-to-change-request mapping
- Searchable matrix
- Status badges for Active, Updated, and Pending Review items

## Skills Demonstrated

- Banking domain knowledge
- Credit operations / loan origination understanding
- Business requirement analysis
- Business rule design
- UAT planning and delivery tracking
- Change request impact analysis
- Risk and control thinking
- BA recommendation writing
- Requirement traceability
- Frontend development with Next.js and TypeScript
- GitHub-ready project documentation

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn-style reusable UI components
- Lucide React icons
- Mock data and local state

## Screenshots

Screenshots can be added after deployment:

- `screenshots/home.png`
- `screenshots/checklist-generator.png`
- `screenshots/uat-tracker.png`
- `screenshots/change-impact-analyzer.png`
- `screenshots/traceability-matrix.png`

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

## Build

```bash
pnpm run build
pnpm run start
```

## Deploy to Vercel

Recommended settings:

- Framework preset: Next.js
- Install command: `pnpm install`
- Build command: `pnpm run build`
- Output: Next.js default

## Future Enhancement

- User login
- Role-based access control
- Next.js API routes
- PostgreSQL / Supabase database
- Prisma ORM
- Excel / PDF export
- Approval workflow
- Audit trail persistence
- Dashboard charts by role, module, defect severity, and release cycle

## Disclaimer

This is a portfolio project using mock data. It is not connected to any real bank system and does not contain confidential information, production data, internal policy wording, customer information, employee information, or vendor details.

