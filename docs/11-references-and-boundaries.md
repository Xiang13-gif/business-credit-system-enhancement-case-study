# References and Boundaries

## Public References Used

This project is informed by public references only. Jurisdiction-specific sources are used as examples of banking risk and technology control expectations, not as real project policy.

| Source | URL | How It Informs the Case Study |
| --- | --- | --- |
| Bank Negara Malaysia Credit Risk policy document | https://www.bnm.gov.my/documents/20124/938039/pd_Credit_Risk_2023.pdf | Supports the need for structured credit risk management, credit administration, monitoring, and controls. |
| Bank Negara Malaysia Risk Management in Technology policy document | https://www.bnm.gov.my/documents/20124/938039/pd-rmit-nov25.pdf | Supports attention to access control, audit trail, operational resilience, and technology risk considerations. |
| Basel Committee principles for the management of credit risk | https://www.bis.org/bcbs/publ/d595.htm | Provides general credit risk management principles used to frame process controls and approval discipline. |
| Bank Negara Malaysia CCRIS overview | https://www.bnm.gov.my/ccris | Provides public context that borrower credit history is relevant to credit assessment, without using real data. |
| Bank Negara Malaysia SME financing page | https://www.bnm.gov.my/sme-financing | Provides public context on SME financing relevance in Malaysia. |

## How Sources Are Used

The sources are not copied into the requirements. They are used to frame the logic of this case study:

- A credit process should have structured application, assessment, approval, administration, monitoring, and control points.
- Technology changes in banking should consider access control, audit trail, operational risk, and accountability.
- SME and commercial financing processes require more than simple front-end digitization because credit judgment, documentation, and approval authority still matter.

## Confidentiality Boundaries

This repository does not include:

- Any bank name as the project owner
- Any internal system screen or workflow
- Any production data
- Any real customer details
- Any employee names or IDs
- Any internal policy wording
- Any vendor or implementation partner information
- Any confidential defect, release, or incident information

All examples are synthetic and designed for portfolio demonstration.

## Portfolio Positioning

This case study can be described in an interview as:

"I prepared an anonymized global commercial credit modernization case study based on banking BA work. It covers business problem framing, As-Is and To-Be process, stakeholder mapping, approval routing, policy exception governance, business rules, data dictionary, UAT scenarios, change request assessment, dashboard requirements, SQL analysis, and an API contract. I avoided confidential information and used public banking risk references to keep the case grounded."

## Suggested Interview Talking Points

- Why commercial credit is different from retail loan origination
- Why the goal is controlled workflow improvement, not full auto-approval
- How mandatory field validation reduces rework
- How approval routing and exception handling improve auditability
- How UAT should follow end-to-end business journeys
- How BA artifacts help business and technology teams agree on scope
