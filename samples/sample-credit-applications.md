# Sample Credit Applications

Synthetic sample data for discussion and SQL examples. Amounts, names, IDs, and dates are fictional.

| application_id | customer_name | segment | application_type | facility_type | requested_amount_myr | risk_grade | status | current_owner_group | submitted_date | decision_date | exception_flag |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| BCS-2026-000101 | Suria Components Sdn Bhd | SME | Renewal | Overdraft | 750000 | B | Pending Credit Review | Credit Analyst | 2026-01-08 |  | N |
| BCS-2026-000102 | Meranti Foods Enterprise | SME | New | Term Loan | 420000 | C | Pending RM Action | RM | 2026-01-09 |  | Y |
| BCS-2026-000103 | Kencana Medical Supplies Sdn Bhd | Commercial | Enhancement | Trade Line | 1800000 | B | Pending Credit Approval | Credit Approver | 2026-01-10 |  | N |
| BCS-2026-000104 | Northline Engineering Sdn Bhd | Commercial | Renewal | Bank Guarantee | 2500000 | C | Pending Exception Approval | Exception Approver | 2026-01-11 |  | Y |
| BCS-2026-000105 | Awan Tekstil Sdn Bhd | SME | New | Term Loan | 600000 | D | Rejected | RM | 2026-01-12 | 2026-01-19 | Y |
| BCS-2026-000106 | Prima Agro Trading | SME | Renewal | Overdraft | 350000 | A | Ready for Facility Setup | Credit Admin | 2026-01-13 | 2026-01-17 | N |
| BCS-2026-000107 | Delta Marine Services Sdn Bhd | Commercial | Restructure | Term Loan | 3200000 | D | Pending Credit Approval | Credit Approver | 2026-01-14 |  | Y |
| BCS-2026-000108 | Jaya Packaging Sdn Bhd | SME | Enhancement | Trade Line | 950000 | B | Pending Conditions | Credit Admin | 2026-01-15 | 2026-01-21 | N |

## Notes

- `requested_amount_myr` is the proposed amount for the facility in this sample row.
- `exception_flag` indicates whether at least one structured exception exists.
- Blank `decision_date` means the case is still open.
- The data is intentionally small so the business logic remains easy to review.

