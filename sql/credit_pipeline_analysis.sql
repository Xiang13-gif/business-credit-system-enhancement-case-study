/*
Business Credit System Enhancement Case Study
Sample SQL analysis for pipeline, aging, turnaround time, and exception monitoring.

The table and column names are illustrative. The queries are designed for BA discussion,
not for a specific production database.
*/

-- 1. Credit pipeline by status
SELECT
    status,
    COUNT(*) AS case_count,
    SUM(requested_amount_myr) AS total_requested_amount_myr
FROM credit_applications
GROUP BY status
ORDER BY case_count DESC;

-- 2. Aging by current owner group
SELECT
    current_owner_group,
    COUNT(*) AS open_cases,
    AVG(days_in_current_status) AS avg_days_in_status,
    SUM(CASE WHEN days_in_current_status > sla_days THEN 1 ELSE 0 END) AS cases_beyond_sla
FROM credit_applications
WHERE status NOT IN ('Rejected', 'Withdrawn', 'Ready for Facility Setup')
GROUP BY current_owner_group
ORDER BY cases_beyond_sla DESC, avg_days_in_status DESC;

-- 3. Submission-to-decision turnaround time
SELECT
    segment,
    application_type,
    COUNT(*) AS decided_cases,
    AVG(DATEDIFF(day, submitted_date, decision_date)) AS avg_submission_to_decision_days
FROM credit_applications
WHERE decision_date IS NOT NULL
GROUP BY segment, application_type
ORDER BY avg_submission_to_decision_days DESC;

-- 4. Exception volume and approval outcome
SELECT
    exception_type,
    severity,
    approval_status,
    COUNT(*) AS exception_count
FROM credit_exceptions
GROUP BY exception_type, severity, approval_status
ORDER BY exception_type, severity, approval_status;

-- 5. Applications with missing mandatory documents
SELECT
    a.application_id,
    a.customer_name,
    a.status,
    d.document_name,
    d.document_status,
    a.current_owner_group
FROM credit_applications a
JOIN document_checklist d
    ON a.application_id = d.application_id
WHERE d.mandatory_flag = 'Y'
  AND d.document_status IN ('Not Uploaded', 'Uploaded')
ORDER BY a.application_id, d.document_name;

-- 6. Route override monitoring
SELECT
    application_id,
    recommended_approval_level,
    final_approval_level,
    override_reason,
    override_by,
    override_timestamp
FROM approval_routing_audit
WHERE recommended_approval_level <> final_approval_level
ORDER BY override_timestamp DESC;

-- 7. Cases blocked from facility setup due to open conditions
SELECT
    c.application_id,
    c.customer_name,
    cp.condition_name,
    cp.condition_status,
    cp.condition_owner,
    cp.due_date
FROM credit_applications c
JOIN conditions_precedent cp
    ON c.application_id = cp.application_id
WHERE c.status = 'Pending Conditions'
  AND cp.mandatory_flag = 'Y'
  AND cp.condition_status NOT IN ('Completed', 'Waived')
ORDER BY cp.due_date ASC;

-- 8. RM action workload
SELECT
    rm_owner,
    COUNT(*) AS pending_rm_cases,
    SUM(CASE WHEN days_in_current_status > sla_days THEN 1 ELSE 0 END) AS overdue_cases
FROM credit_applications
WHERE status = 'Pending RM Action'
GROUP BY rm_owner
ORDER BY overdue_cases DESC, pending_rm_cases DESC;

