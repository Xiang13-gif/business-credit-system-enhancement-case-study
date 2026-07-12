import type {
  BenefitMetric,
  CreditMemoProfile,
  CriticalDataElement,
  CutoverStep,
  DataQualityIssue,
  GovernedRule,
  HypercareMetric,
  ProductRoadmapItem,
  ReleaseGate,
  RuleTestScenario
} from "@/lib/types";

export const creditMemoProfiles: CreditMemoProfile[] = [
  {
    caseId: "CASE-1007",
    industry: "Regional wholesale and commodity trading",
    yearsInBusiness: 11,
    facilityPurpose: "Seasonal working capital support for inventory purchases and receivable timing gaps.",
    requestedTenor: "12-month revolving overdraft",
    annualRevenue: 72000000,
    ebitda: 5100000,
    debtServiceCoverageRatio: 1.12,
    leverageRatio: 4.8,
    financialPeriod: "FY2025 management accounts",
    relationshipHistory: "Three-year relationship with elevated utilisation during seasonal trading peaks.",
    primaryRepaymentSource: "Operating cash flow from wholesale trading receipts.",
    keyRisks: [
      "High single-name exposure with unsecured collateral position.",
      "Customer concentration and commodity price volatility may compress working-capital liquidity.",
      "Enhanced due diligence and critical exception mitigation remain incomplete."
    ],
    mitigants: [
      "Monthly borrowing-base monitoring and covenant reporting.",
      "Group Credit Committee approval with no delegated-authority override.",
      "Documented exception expiry and escalation if mitigation evidence is not completed."
    ],
    conditions: [
      "Complete enhanced due diligence before first utilisation.",
      "Provide the latest customer concentration schedule and aged receivables report.",
      "Obtain approval for all critical policy exceptions before facility activation."
    ],
    sourceRecordIds: ["CASE-1007", "EXC002", "EXC003", "EXC005", "TC011", "TC012", "TC014"],
    missingEvidence: [
      "Enhanced due diligence completion evidence",
      "Latest customer concentration schedule",
      "Approved critical exception mitigation"
    ],
    previousVersionNotes: [
      "Exposure updated from USD 16.0m to USD 18.5m.",
      "Approval route escalated from Country Credit Committee to Group Credit Committee.",
      "EDD completion added as a condition precedent."
    ]
  },
  {
    caseId: "CASE-1001",
    industry: "Precision component manufacturing",
    yearsInBusiness: 8,
    facilityPurpose: "Renewal of term financing used for production equipment and working-capital support.",
    requestedTenor: "36-month amortising term loan",
    annualRevenue: 6800000,
    ebitda: 740000,
    debtServiceCoverageRatio: 1.28,
    leverageRatio: 2.7,
    financialPeriod: "FY2024 audited statements and FY2025 management accounts",
    relationshipHistory: "Five-year relationship with acceptable repayment conduct and one current document waiver request.",
    primaryRepaymentSource: "Cash flow generated from component manufacturing contracts.",
    keyRisks: [
      "Latest audited financial statements are unavailable at renewal review.",
      "Partial collateral coverage leaves residual reliance on operating cash flow.",
      "Waiver control must be completed before submission."
    ],
    mitigants: [
      "Interim management accounts and current bank statements support the latest performance assessment.",
      "Existing repayment conduct remains acceptable in the sample scenario.",
      "Time-bound waiver requires independent approval and a committed delivery date."
    ],
    conditions: [
      "Approve the financial-statement waiver before credit submission.",
      "Deliver FY2025 audited statements within 90 days of approval.",
      "Retain monthly management accounts until audited evidence is received."
    ],
    sourceRecordIds: ["CASE-1001", "EXC001", "TC002", "TC010", "CR001"],
    missingEvidence: ["Approved financial-statement waiver", "FY2025 audited financial statements"],
    previousVersionNotes: [
      "Renewal tenor retained at 36 months.",
      "Financial-statement waiver added to the submission package.",
      "Alternative evidence requirement strengthened."
    ]
  },
  {
    caseId: "CASE-1006",
    industry: "Import and export trade services",
    yearsInBusiness: 13,
    facilityPurpose: "Enhancement of trade line capacity to support confirmed purchase orders and supplier settlement.",
    requestedTenor: "12-month renewable trade line",
    annualRevenue: 8600000,
    ebitda: 1200000,
    debtServiceCoverageRatio: 1.65,
    leverageRatio: 1.9,
    financialPeriod: "FY2025 audited statements",
    relationshipHistory: "Seven-year relationship with satisfactory trade settlement and no current policy exception.",
    primaryRepaymentSource: "Receipts from confirmed trade contracts and buyer settlements.",
    keyRisks: [
      "Trade-document discrepancies may delay settlement.",
      "Counterparty concentration requires continued monitoring."
    ],
    mitigants: [
      "Fully secured position with documented trade controls.",
      "Confirmed purchase-order evidence and approved buyer limits.",
      "Trade document rules remain in the regression test pack."
    ],
    conditions: [
      "Complete final facility setup checklist before limit activation.",
      "Retain buyer-limit monitoring throughout the facility tenor."
    ],
    sourceRecordIds: ["CASE-1006", "TC003", "TC006", "TC008", "CR002"],
    missingEvidence: [],
    previousVersionNotes: [
      "Trade line increased from USD 750k to USD 980k.",
      "Product document mapping confirmed through UAT.",
      "Case moved to Ready for Facility Setup."
    ]
  }
];

export const governedRules: GovernedRule[] = [
  {
    id: "BR004",
    title: "Property collateral evidence",
    currentVersion: "2.2",
    proposedVersion: "2.3",
    status: "Under Review",
    ownerRole: "Credit Admin",
    approverRole: "Approver",
    effectiveDate: "2026-09-01",
    lastReviewed: "2026-06-18",
    riskRating: "High",
    currentLogic: "Property collateral requires title deed, valuation report, fire insurance policy, and charge document.",
    proposedLogic: "Add a current land search report and require valuation age of no more than 24 months before submission.",
    changeRationale: "Close the gap between collateral ownership evidence, valuation recency, and security perfection readiness.",
    linkedRequirements: ["REQ005", "REQ028"],
    linkedUatCases: ["TC001", "TC017"],
    impactedRoles: ["RM", "Credit Analyst", "Credit Admin", "Approver"],
    impactedDocuments: ["Title Deed", "Valuation Report", "Land Search Report", "Charge Document"],
    impactedControls: ["Submission gate", "Collateral recency validation", "Security perfection checklist"]
  },
  {
    id: "BR005",
    title: "Financial statement waiver",
    currentVersion: "2.1",
    proposedVersion: "2.2",
    status: "Approved",
    ownerRole: "Credit Analyst",
    approverRole: "Approver",
    effectiveDate: "2026-08-15",
    lastReviewed: "2026-06-27",
    riskRating: "Critical",
    currentLogic: "Missing latest financial statements require waiver approval and exception tracking.",
    proposedLogic: "Waiver also requires alternative financial evidence, an expiry date, accountable owner, and overdue escalation.",
    changeRationale: "Prevent open-ended waivers from clearing submission without compensating evidence and follow-up accountability.",
    linkedRequirements: ["REQ002", "REQ024", "REQ025"],
    linkedUatCases: ["TC002", "TC010", "TC012"],
    impactedRoles: ["RM", "Credit Analyst", "Approver"],
    impactedDocuments: ["Waiver Approval Form", "Financial Statement Exception Memo", "Management Account"],
    impactedControls: ["Maker-checker", "Waiver expiry", "SLA escalation", "Audit trail"]
  },
  {
    id: "BR006",
    title: "High risk enhanced due diligence",
    currentVersion: "1.4",
    proposedVersion: "1.4",
    status: "Active",
    ownerRole: "Credit Analyst",
    approverRole: "Approver",
    effectiveDate: "2026-04-01",
    lastReviewed: "2026-06-10",
    riskRating: "Critical",
    currentLogic: "High risk customers require enhanced due diligence and a high-risk approval note before submission.",
    proposedLogic: "No change proposed. Rule remains active under quarterly control review.",
    changeRationale: "Quarterly review confirmed the existing control remains fit for purpose.",
    linkedRequirements: ["REQ004"],
    linkedUatCases: ["TC004"],
    impactedRoles: ["RM", "Credit Analyst", "Approver"],
    impactedDocuments: ["Enhanced Due Diligence Checklist", "High Risk Approval Note"],
    impactedControls: ["Compliance gate", "Submission blocker"]
  },
  {
    id: "BR013",
    title: "Risk-based approval authority",
    currentVersion: "3.0",
    proposedVersion: "3.1",
    status: "Draft",
    ownerRole: "Approver",
    approverRole: "System Admin",
    effectiveDate: "2026-10-01",
    lastReviewed: "2026-06-21",
    riskRating: "Critical",
    currentLogic: "Approval authority considers exposure, risk, segment, collateral coverage, application type, and exception severity.",
    proposedLogic: "Add aggregate group exposure and cross-border indicator as mandatory routing inputs.",
    changeRationale: "Individual facility exposure may understate approval authority when related group exposure is material.",
    linkedRequirements: ["REQ017", "REQ029"],
    linkedUatCases: ["TC011", "TC018"],
    impactedRoles: ["Credit Analyst", "Approver", "System Admin"],
    impactedDocuments: ["Approval Memo", "Group Exposure Schedule"],
    impactedControls: ["Delegated authority", "Group exposure aggregation", "Route escalation"]
  },
  {
    id: "BR014",
    title: "Controlled route override",
    currentVersion: "1.3",
    proposedVersion: "1.3",
    status: "Active",
    ownerRole: "System Admin",
    approverRole: "Approver",
    effectiveDate: "2026-03-15",
    lastReviewed: "2026-06-12",
    riskRating: "High",
    currentLogic: "Route overrides require an authorized role, reason, maker-checker validation, and audit evidence.",
    proposedLogic: "No change proposed. Monitor override volume and aged approvals through the control dashboard.",
    changeRationale: "Existing control remains effective; monitoring is the current priority.",
    linkedRequirements: ["REQ018"],
    linkedUatCases: ["TC012"],
    impactedRoles: ["Approver", "System Admin"],
    impactedDocuments: ["Approval Route Override Record"],
    impactedControls: ["Maker-checker", "Reason code", "Audit trail"]
  },
  {
    id: "BR015",
    title: "Exception and pipeline visibility",
    currentVersion: "1.8",
    proposedVersion: "1.9",
    status: "Approved",
    ownerRole: "Credit Admin",
    approverRole: "Approver",
    effectiveDate: "2026-08-01",
    lastReviewed: "2026-06-25",
    riskRating: "Medium",
    currentLogic: "Exceptions and owner changes refresh dashboards and remain linked to requirements and UAT evidence.",
    proposedLogic: "Add executive escalation for critical exceptions aged beyond five working days.",
    changeRationale: "Management needs an earlier signal before critical exceptions become approval bottlenecks.",
    linkedRequirements: ["REQ019", "REQ020", "REQ021"],
    linkedUatCases: ["TC013", "TC014", "TC015"],
    impactedRoles: ["Credit Analyst", "Approver", "Credit Admin"],
    impactedDocuments: ["Exception Register", "Executive Dashboard"],
    impactedControls: ["Aging escalation", "Management reporting", "Traceability"]
  }
];

export const ruleTestScenarios: RuleTestScenario[] = [
  {
    id: "RT-001",
    name: "New term loan with property collateral",
    description: "Validates core onboarding, facility, and property-security evidence.",
    linkedRuleId: "BR004",
    input: {
      applicationType: "New",
      facilityType: "Term Loan",
      collateralType: "Property",
      customerType: "SME Company",
      riskLevel: "Medium",
      financialStatementStatus: "Available"
    },
    expectedDocumentIds: ["DOC001", "DOC031", "DOC032", "DOC033", "DOC034"],
    expectedRuleIds: ["BR001", "BR004"],
    expectedOutcome: "All current property documents are generated."
  },
  {
    id: "RT-002",
    name: "Missing financial statements",
    description: "Validates compensating evidence and waiver governance.",
    linkedRuleId: "BR005",
    input: {
      applicationType: "Renewal",
      facilityType: "Term Loan",
      collateralType: "Debenture",
      customerType: "SME Company",
      riskLevel: "Medium",
      financialStatementStatus: "Not Available"
    },
    expectedDocumentIds: ["DOC015", "DOC017", "DOC018"],
    expectedRuleIds: ["BR005"],
    expectedOutcome: "Waiver, exception memo, and alternative evidence are mandatory."
  },
  {
    id: "RT-003",
    name: "High-risk customer",
    description: "Validates EDD and high-risk approval evidence.",
    linkedRuleId: "BR006",
    input: {
      applicationType: "New",
      facilityType: "Overdraft",
      collateralType: "Fixed Deposit",
      customerType: "Corporate",
      riskLevel: "High",
      financialStatementStatus: "Available"
    },
    expectedDocumentIds: ["DOC044", "DOC045"],
    expectedRuleIds: ["BR006"],
    expectedOutcome: "EDD documents are generated as submission blockers."
  },
  {
    id: "RT-004",
    name: "High-risk unsecured exposure",
    description: "Validates combined credit-risk and compliance controls.",
    linkedRuleId: "BR013",
    input: {
      applicationType: "New",
      facilityType: "Overdraft",
      collateralType: "Unsecured",
      customerType: "Corporate",
      riskLevel: "High",
      financialStatementStatus: "Available"
    },
    expectedDocumentIds: ["DOC042", "DOC043", "DOC044", "DOC045"],
    expectedRuleIds: ["BR006", "BR007"],
    expectedOutcome: "Unsecured justification, repayment analysis, and EDD evidence are generated."
  },
  {
    id: "RT-005",
    name: "Proposed property evidence change",
    description: "Tests the proposed land-search requirement before rule activation.",
    linkedRuleId: "BR004",
    input: {
      applicationType: "Renewal",
      facilityType: "Term Loan",
      collateralType: "Property",
      customerType: "SME Company",
      riskLevel: "Medium",
      financialStatementStatus: "Available"
    },
    expectedDocumentIds: ["DOC031", "DOC032", "DOC033", "DOC034", "DOC046"],
    expectedRuleIds: ["BR004"],
    expectedOutcome: "Expected design gap: DOC046 Land Search Report is not active until BR004 v2.3 is implemented."
  }
];

export const criticalDataElements: CriticalDataElement[] = [
  {
    id: "CDE-001",
    businessTerm: "Customer Identifier",
    definition: "Unique identifier used to link borrower records across onboarding, lending, and reporting.",
    sourceSystem: "CRM / Customer Master",
    sourceField: "customer_id",
    transformation: "Trim, uppercase, and validate uniqueness before case creation.",
    linkedRule: "BR001",
    outputUsage: "Case 360, Credit Memo, Audit Trail",
    owner: "Customer Data Steward",
    qualityScore: 100,
    lineageCoverage: 100,
    status: "Healthy",
    qualityChecks: ["Mandatory", "Unique", "Cross-system match"]
  },
  {
    id: "CDE-002",
    businessTerm: "Total Exposure",
    definition: "Aggregate approved and proposed exposure used for delegated-authority routing.",
    sourceSystem: "Loan Origination System",
    sourceField: "total_exposure_amt",
    transformation: "Convert to reporting currency and aggregate related facilities.",
    linkedRule: "BR013",
    outputUsage: "Approval Routing, Credit Memo, Executive Dashboard",
    owner: "Credit Risk Data Owner",
    qualityScore: 98,
    lineageCoverage: 100,
    status: "Healthy",
    qualityChecks: ["Non-negative", "Currency present", "Facility reconciliation"]
  },
  {
    id: "CDE-003",
    businessTerm: "Risk Level",
    definition: "Controlled risk classification used for EDD, routing, and management reporting.",
    sourceSystem: "Credit Risk Engine",
    sourceField: "risk_grade_band",
    transformation: "Map internal grade bands to Low, Medium, or High portfolio classification.",
    linkedRule: "BR006, BR013",
    outputUsage: "Checklist, Approval Routing, Credit Memo",
    owner: "Credit Risk Data Owner",
    qualityScore: 94,
    lineageCoverage: 100,
    status: "Watch",
    qualityChecks: ["Valid code", "Effective date", "Override evidence"]
  },
  {
    id: "CDE-004",
    businessTerm: "Financial Statement Date",
    definition: "Period end date of the latest audited or management financial evidence.",
    sourceSystem: "Document Management System",
    sourceField: "financial_period_end_date",
    transformation: "Calculate age in months and compare with policy recency threshold.",
    linkedRule: "BR002, BR005",
    outputUsage: "Checklist, Waiver Workflow, Credit Memo",
    owner: "Credit Operations Data Steward",
    qualityScore: 82,
    lineageCoverage: 88,
    status: "Watch",
    qualityChecks: ["Date present", "Document period match", "Recency threshold"]
  },
  {
    id: "CDE-005",
    businessTerm: "Collateral Value",
    definition: "Latest eligible value used to assess security coverage and approval authority.",
    sourceSystem: "Collateral Management System",
    sourceField: "eligible_collateral_value",
    transformation: "Apply haircut, valuation currency conversion, and recency validation.",
    linkedRule: "BR004, BR013",
    outputUsage: "Approval Routing, Credit Memo, Security Readiness",
    owner: "Collateral Data Steward",
    qualityScore: 76,
    lineageCoverage: 72,
    status: "Breach",
    qualityChecks: ["Valuation date", "Haircut applied", "Currency match", "Asset identifier"]
  },
  {
    id: "CDE-006",
    businessTerm: "Approval Tier",
    definition: "Highest required delegated-authority level calculated from risk and exposure inputs.",
    sourceSystem: "Credit Decision Service",
    sourceField: "recommended_approval_tier",
    transformation: "Evaluate rule score and select the highest applicable authority tier.",
    linkedRule: "BR013, BR014",
    outputUsage: "Approval Routing, Case 360, Credit Memo",
    owner: "Delegated Authority Owner",
    qualityScore: 100,
    lineageCoverage: 100,
    status: "Healthy",
    qualityChecks: ["Rule version present", "Input completeness", "Override segregation"]
  },
  {
    id: "CDE-007",
    businessTerm: "Waiver Approval Status",
    definition: "Controlled state showing whether missing mandatory evidence has an independently approved waiver.",
    sourceSystem: "Workflow Service",
    sourceField: "waiver_approval_status",
    transformation: "Map workflow state and verify maker-checker before readiness clearance.",
    linkedRule: "BR005",
    outputUsage: "Submission Gate, Exception Register, Credit Memo",
    owner: "Credit Control Owner",
    qualityScore: 91,
    lineageCoverage: 96,
    status: "Watch",
    qualityChecks: ["Valid status", "Reason present", "Maker-checker", "Expiry date"]
  },
  {
    id: "CDE-008",
    businessTerm: "Document Readiness",
    definition: "Percentage of required documents verified or covered by an approved controlled waiver.",
    sourceSystem: "Document Checklist Service",
    sourceField: "document_readiness_pct",
    transformation: "Calculate verified required items divided by all required items.",
    linkedRule: "BR001-BR012",
    outputUsage: "Submission Gate, Case 360, Executive Dashboard",
    owner: "Credit Operations Data Steward",
    qualityScore: 96,
    lineageCoverage: 100,
    status: "Healthy",
    qualityChecks: ["Required-item denominator", "Waiver approval validation", "Real-time refresh"]
  }
];

export const dataQualityIssues: DataQualityIssue[] = [
  {
    id: "DQI-017",
    dataElementId: "CDE-005",
    severity: "Critical",
    issue: "Three property records use stale valuation dates after source migration.",
    rootCause: "Legacy valuation date was mapped to upload date instead of valuation effective date.",
    downstreamImpact: "Collateral coverage and approval routing may be overstated.",
    owner: "Collateral Data Steward",
    status: "In Remediation",
    dueDate: "2026-07-18"
  },
  {
    id: "DQI-021",
    dataElementId: "CDE-004",
    severity: "High",
    issue: "Financial period is missing for 7% of migrated management accounts.",
    rootCause: "Optional field in the legacy document index.",
    downstreamImpact: "Recency rules cannot distinguish current evidence from stale evidence.",
    owner: "Credit Operations Data Steward",
    status: "Open",
    dueDate: "2026-07-22"
  },
  {
    id: "DQI-024",
    dataElementId: "CDE-003",
    severity: "Medium",
    issue: "Two manually overridden risk grades do not contain an effective date.",
    rootCause: "Historical override workflow did not enforce effective dating.",
    downstreamImpact: "EDD and approval routing audit evidence is incomplete.",
    owner: "Credit Risk Data Owner",
    status: "Accepted",
    dueDate: "2026-07-31"
  },
  {
    id: "DQI-026",
    dataElementId: "CDE-007",
    severity: "High",
    issue: "One approved waiver has no expiry date after workflow conversion.",
    rootCause: "Expiry became mandatory only in the proposed rule version.",
    downstreamImpact: "An open-ended waiver could continue to clear readiness controls.",
    owner: "Credit Control Owner",
    status: "In Remediation",
    dueDate: "2026-07-15"
  }
];

export const benefitMetrics: BenefitMetric[] = [
  {
    id: "BEN-001",
    label: "First-time-right submission",
    baseline: 61,
    target: 88,
    current: 79,
    unit: "%",
    direction: "Increase",
    owner: "Head of Credit Operations",
    measurement: "Cases entering Credit Analysis without document rework divided by submitted cases.",
    source: "Workflow event log"
  },
  {
    id: "BEN-002",
    label: "Submission-to-decision TAT",
    baseline: 9.4,
    target: 5.5,
    current: 6.8,
    unit: "days",
    direction: "Decrease",
    owner: "Credit Transformation Product Owner",
    measurement: "Average working days from complete submission to final decision.",
    source: "Case lifecycle timestamps"
  },
  {
    id: "BEN-003",
    label: "Manual follow-up time",
    baseline: 3.8,
    target: 2.1,
    current: 2.5,
    unit: "hours/case",
    direction: "Decrease",
    owner: "Credit Operations Manager",
    measurement: "Average RM and operations effort spent chasing and validating documents.",
    source: "Time study sample"
  },
  {
    id: "BEN-004",
    label: "Uncontrolled waiver rate",
    baseline: 14,
    target: 2,
    current: 5,
    unit: "%",
    direction: "Decrease",
    owner: "Credit Control Owner",
    measurement: "Waived required documents without complete maker-checker evidence.",
    source: "Waiver control report"
  },
  {
    id: "BEN-005",
    label: "Rule regression coverage",
    baseline: 35,
    target: 95,
    current: 83,
    unit: "%",
    direction: "Increase",
    owner: "UAT Lead",
    measurement: "Active high-impact rules with at least one passed regression scenario.",
    source: "Rule governance test lab"
  },
  {
    id: "BEN-006",
    label: "Critical data lineage coverage",
    baseline: 42,
    target: 100,
    current: 91,
    unit: "%",
    direction: "Increase",
    owner: "Credit Data Owner",
    measurement: "Critical data elements with documented source-to-output lineage.",
    source: "Data governance inventory"
  }
];

export const productRoadmap: ProductRoadmapItem[] = [
  {
    id: "RM-001",
    feature: "Evidence-grounded Credit Memo Studio",
    horizon: "Now",
    outcome: "Reduce drafting time while preserving source traceability and human approval.",
    valueScore: 10,
    riskReductionScore: 9,
    effortScore: 6,
    priorityScore: 8.8,
    status: "In Delivery"
  },
  {
    id: "RM-002",
    feature: "Business Rule Governance Center",
    horizon: "Now",
    outcome: "Control rule versions, approvals, impact analysis, and regression evidence.",
    valueScore: 9,
    riskReductionScore: 10,
    effortScore: 5,
    priorityScore: 9.0,
    status: "In Delivery"
  },
  {
    id: "RM-003",
    feature: "Critical Data Lineage and DQ Hub",
    horizon: "Now",
    outcome: "Make source-to-decision data quality and ownership visible.",
    valueScore: 9,
    riskReductionScore: 10,
    effortScore: 7,
    priorityScore: 8.6,
    status: "Ready"
  },
  {
    id: "RM-004",
    feature: "Benefits Realization Dashboard",
    horizon: "Now",
    outcome: "Connect delivery scope to operational value, controls, and product investment decisions.",
    valueScore: 9,
    riskReductionScore: 6,
    effortScore: 4,
    priorityScore: 8.3,
    status: "In Delivery"
  },
  {
    id: "RM-005",
    feature: "Release and Cutover Command Center",
    horizon: "Next",
    outcome: "Provide evidence-led go-live, migration, training, and hypercare decisions.",
    valueScore: 8,
    riskReductionScore: 9,
    effortScore: 6,
    priorityScore: 8.0,
    status: "Ready"
  },
  {
    id: "RM-006",
    feature: "Core lending platform integration",
    horizon: "Next",
    outcome: "Replace manual case input with governed API and reconciliation controls.",
    valueScore: 10,
    riskReductionScore: 8,
    effortScore: 10,
    priorityScore: 7.4,
    status: "Discovery"
  },
  {
    id: "RM-007",
    feature: "Portfolio-wide predictive bottleneck alerts",
    horizon: "Later",
    outcome: "Identify likely SLA breaches early using explainable operational indicators.",
    valueScore: 7,
    riskReductionScore: 6,
    effortScore: 8,
    priorityScore: 6.1,
    status: "Discovery"
  }
];

export const releaseGates: ReleaseGate[] = [
  {
    id: "REL-001",
    domain: "Business",
    title: "End-to-end business journey sign-off",
    status: "Pass",
    owner: "Business Product Owner",
    exitCriteria: "All priority journeys are demonstrated and accepted by accountable business owners.",
    evidence: "Six priority journeys signed off in the release decision pack.",
    linkedItems: ["TC001", "TC011", "TC015", "TC016"],
    signOff: "Signed 2026-07-07"
  },
  {
    id: "REL-002",
    domain: "Controls",
    title: "High-priority UAT and control defects",
    status: "Block",
    owner: "UAT Lead",
    exitCriteria: "No open critical defect and all high control-impact cases pass or receive formal risk acceptance.",
    evidence: "TC010 retest remains failed and DEF-027 has no approved risk acceptance.",
    linkedItems: ["TC002", "TC010", "DEF-027"],
    signOff: "Pending"
  },
  {
    id: "REL-003",
    domain: "Data",
    title: "Migration reconciliation and data quality",
    status: "Watch",
    owner: "Data Migration Lead",
    exitCriteria: "Record counts reconcile, critical fields meet threshold, and open defects have approved disposition.",
    evidence: "99.4% record reconciliation; collateral valuation date issue is in remediation.",
    linkedItems: ["CDE-005", "DQI-017", "DQI-021"],
    signOff: "Conditional"
  },
  {
    id: "REL-004",
    domain: "Technology",
    title: "Deployment and rollback rehearsal",
    status: "Pass",
    owner: "Technology Release Manager",
    exitCriteria: "Deployment runbook and rollback path are rehearsed within the approved window.",
    evidence: "Dry run completed in 74 minutes against a 90-minute target.",
    linkedItems: ["RUNBOOK-07", "DR-02"],
    signOff: "Signed 2026-07-08"
  },
  {
    id: "REL-005",
    domain: "Operations",
    title: "SOP and service readiness",
    status: "Watch",
    owner: "Credit Operations Manager",
    exitCriteria: "Procedures, queues, SLAs, escalation contacts, and support model are approved.",
    evidence: "SOP approved; final SLA threshold for aged document alerts remains open.",
    linkedItems: ["SOP-CR-12", "TC014"],
    signOff: "Conditional"
  },
  {
    id: "REL-006",
    domain: "People",
    title: "Training and adoption readiness",
    status: "Pass",
    owner: "Change Lead",
    exitCriteria: "At least 90% of impacted users complete role-based training and support materials are available.",
    evidence: "94% completion across RM, Credit Analyst, Approver, and Credit Admin groups.",
    linkedItems: ["TRN-RM-01", "TRN-CR-02", "KB-19"],
    signOff: "Signed 2026-07-09"
  },
  {
    id: "REL-007",
    domain: "Controls",
    title: "Access and segregation-of-duties review",
    status: "Pass",
    owner: "Technology Risk Manager",
    exitCriteria: "Role access, privileged access, and maker-checker conflicts are independently reviewed.",
    evidence: "No critical conflict found; two low-risk access removals scheduled before cutover.",
    linkedItems: ["ACR-2026-07", "BR014"],
    signOff: "Signed 2026-07-09"
  },
  {
    id: "REL-008",
    domain: "Business",
    title: "Go-live decision and residual risk acceptance",
    status: "Block",
    owner: "Release Steering Committee",
    exitCriteria: "All blockers are closed or explicitly accepted by the accountable decision authority.",
    evidence: "Decision is pending closure of DEF-027 and final data-quality disposition.",
    linkedItems: ["REL-002", "REL-003", "DEF-027"],
    signOff: "Pending"
  }
];

export const cutoverSteps: CutoverStep[] = [
  {
    id: "CUT-001",
    sequence: 1,
    window: "Fri 20:00",
    title: "Confirm business freeze and capture control totals",
    owner: "Business Cutover Lead",
    status: "Ready",
    validation: "Case, document, waiver, and user control totals are signed.",
    rollbackTrigger: "Control total cannot be reconciled to source systems."
  },
  {
    id: "CUT-002",
    sequence: 2,
    window: "Fri 21:00",
    title: "Extract and validate migration files",
    owner: "Data Migration Lead",
    status: "Ready",
    validation: "Checksums, record counts, and critical field completeness pass.",
    rollbackTrigger: "Any critical data element falls below agreed threshold."
  },
  {
    id: "CUT-003",
    sequence: 3,
    window: "Sat 00:00",
    title: "Deploy application and rule package",
    owner: "Technology Release Manager",
    status: "Ready",
    validation: "Application health checks and active rule versions match the release manifest.",
    rollbackTrigger: "Health checks fail or rule manifest differs from approved versions."
  },
  {
    id: "CUT-004",
    sequence: 4,
    window: "Sat 02:00",
    title: "Load data and complete reconciliation",
    owner: "Data Migration Lead",
    status: "Pending",
    validation: "Source-to-target counts and financial control totals reconcile.",
    rollbackTrigger: "Unexplained variance exceeds 0.5% or affects a critical field."
  },
  {
    id: "CUT-005",
    sequence: 5,
    window: "Sat 05:00",
    title: "Execute business smoke tests",
    owner: "Business Product Owner",
    status: "Pending",
    validation: "Checklist, memo, routing, waiver, and audit journeys complete successfully.",
    rollbackTrigger: "Priority journey cannot complete or produces incorrect control outcome."
  },
  {
    id: "CUT-006",
    sequence: 6,
    window: "Sat 07:00",
    title: "Issue go-live communication and open hypercare",
    owner: "Change Lead",
    status: "Pending",
    validation: "Steering decision, support contacts, and known issues are communicated.",
    rollbackTrigger: "Steering committee issues a No-Go decision."
  }
];

export const hypercareMetrics: HypercareMetric[] = [
  { id: "HYP-001", label: "Priority incidents", target: "0 critical", current: "0 critical", status: "On Track", owner: "Service Manager" },
  { id: "HYP-002", label: "Failed rule executions", target: "< 0.5%", current: "0.3%", status: "On Track", owner: "Rule Product Owner" },
  { id: "HYP-003", label: "Document generation success", target: "> 99%", current: "98.7%", status: "Watch", owner: "Document Service Owner" },
  { id: "HYP-004", label: "User support backlog", target: "< 20", current: "14", status: "On Track", owner: "Change Lead" },
  { id: "HYP-005", label: "Data reconciliation breaks", target: "0 critical", current: "1 high", status: "Watch", owner: "Data Migration Lead" }
];
