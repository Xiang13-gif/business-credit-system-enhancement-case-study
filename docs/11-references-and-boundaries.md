# References and Boundaries

## Public References Used

This project is informed by public references only. Jurisdiction-specific sources are used as examples of banking risk and technology control expectations, not as real project policy.

| Source | URL | How It Informs the Case Study |
| --- | --- | --- |
| Bank Negara Malaysia Credit Risk policy document | https://www.bnm.gov.my/documents/20124/938039/pd_Credit_Risk_2023.pdf | Supports the need for structured credit risk management, credit administration, monitoring, and controls. |
| Bank Negara Malaysia Risk Management in Technology policy document | https://www.bnm.gov.my/documents/20124/938039/pd-rmit-nov25.pdf | Supports attention to access control, audit trail, operational resilience, and technology risk considerations. |
| Basel Committee principles for the management of credit risk | https://www.bis.org/bcbs/publ/d595.htm | Provides general credit risk management principles used to frame process controls and approval discipline. |
| Basel Committee BCBS 239 principles | https://www.bis.org/publ/bcbs239.htm | Supports governance, accuracy, completeness, timeliness, adaptability, and risk data aggregation expectations. |
| Basel Committee 2026 BCBS 239 implementation newsletter | https://www.bis.org/publ/bcbs_nl36.htm | Highlights continuing industry focus on governance, data lineage, changing technology, cross-border complexity, and compensating controls. |
| IIBA Business Analysis Standard | https://www.iiba.org/globalassets/business-analysis-resources/the-business-analysis-standard/files/the-business-analysis-standard.pdf | Frames the portfolio across change, need, solution, stakeholder, value, and context, including strategy and solution evaluation. |
| IIBA Product Ownership Analysis | https://www.iiba.org/business-analysis-certifications/certificate-in-product-ownership-analysis-iiba-cpoa/ | Supports outcome measurement, financial viability, product roadmap, value optimization, and continuous learning. |
| Bank Negara Malaysia CCRIS overview | https://www.bnm.gov.my/ccris | Provides public context that borrower credit history is relevant to credit assessment, without using real data. |
| Bank Negara Malaysia SME financing page | https://www.bnm.gov.my/sme-financing | Provides public context on SME financing relevance in Malaysia. |

## How Sources Are Used

The sources are not copied into the requirements. They are used to frame the logic of this case study:

- A credit process should have structured application, assessment, approval, administration, monitoring, and control points.
- Technology changes in banking should consider access control, audit trail, operational risk, and accountability.
- Critical risk data should have clear governance, ownership, data quality, and source-to-output lineage.
- Business rules that influence documents or delegated authority should be versioned, tested, independently approved, and effective-dated.
- Automated document content should remain grounded in evidence and subject to accountable human review.
- Product delivery should be evaluated through measurable outcomes and financial viability, not feature completion alone.
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

"I prepared an anonymized commercial credit transformation case study showing how a Senior Banking BA or Product Owner can connect evidence-grounded credit memo generation, governed business rules, delegated authority, policy exceptions, critical data lineage, UAT, cutover, release decisions, and benefits realization. I avoided confidential information and used public banking risk and business-analysis references to keep the case grounded."

## Suggested Interview Talking Points

- Why commercial credit is different from retail loan origination
- Why the goal is controlled workflow improvement, not full auto-approval
- How mandatory field validation reduces rework
- How approval routing and exception handling improve auditability
- How UAT should follow end-to-end business journeys
- How BA artifacts help business and technology teams agree on scope
- Why generated credit memo content must expose source evidence, confidence, and missing-data blockers
- How a rule change moves from proposal through impact analysis, regression, approval, effective date, and activation
- How data quality issues propagate into approval authority, document content, readiness, and management reporting
- How a Senior BA turns UAT, migration, operating procedures, training, rollback, and residual risk into a Go / No-Go recommendation
- How a Product Owner separates feature delivery from realized value and financial viability
