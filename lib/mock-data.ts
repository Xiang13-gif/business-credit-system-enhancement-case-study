import type {
  ChangeRequest,
  CreditPipelineCase,
  PolicyException,
  TraceabilityItem,
  UatTestCase
} from "@/lib/types";

export const uatTestCases: UatTestCase[] = [
  {
    id: "TC001",
    module: "Document Checklist Generator",
    requirementId: "REQ001",
    scenario: "Verify document checklist generated for New Term Loan with Property collateral.",
    testSteps: "Select New, Term Loan, Property, SME Company, Medium risk, financial statement available.",
    expectedResult: "System generates onboarding, financial, facility, property collateral, and control documents.",
    priority: "High",
    status: "Passed",
    role: "RM",
    assignedTester: "BA Tester 01",
    executionDate: "2026-02-03",
    retestStatus: "Not Required",
    remarks: "Checklist generated as expected."
  },
  {
    id: "TC002",
    module: "Document Checklist Generator",
    requirementId: "REQ002",
    scenario: "Verify waiver form is required when financial statement is missing.",
    testSteps: "Select financial statement status as Not Available.",
    expectedResult: "Waiver Approval Form and Financial Statement Exception Memo are generated as required documents.",
    priority: "High",
    status: "Failed",
    role: "Credit Analyst",
    assignedTester: "BA Tester 02",
    executionDate: "2026-02-04",
    defectId: "DEF-014",
    defectSeverity: "High",
    rootCause: "Rule engine mapping did not add exception memo when financial statement was unavailable.",
    retestStatus: "Pending Retest",
    remarks: "Exception memo was missing in first test run."
  },
  {
    id: "TC003",
    module: "Document Checklist Generator",
    requirementId: "REQ003",
    scenario: "Verify Enhancement application requires revised approval memo.",
    testSteps: "Select Enhancement application type and any facility type.",
    expectedResult: "Revised Approval Memo and Updated Facility Documentation are displayed.",
    priority: "Medium",
    status: "In Progress",
    role: "Credit Analyst",
    assignedTester: "BA Tester 03",
    executionDate: "2026-02-05",
    retestStatus: "Not Required",
    remarks: "Pending regression check for trade facility."
  },
  {
    id: "TC004",
    module: "Document Checklist Generator",
    requirementId: "REQ004",
    scenario: "Verify High Risk customer requires Enhanced Due Diligence checklist.",
    testSteps: "Select Risk Level as High.",
    expectedResult: "Enhanced Due Diligence Checklist and High Risk Approval Note are required.",
    priority: "High",
    status: "Passed",
    role: "Approver",
    assignedTester: "BA Tester 04",
    executionDate: "2026-02-05",
    retestStatus: "Not Required",
    remarks: "EDD generated and warning displayed."
  },
  {
    id: "TC005",
    module: "Document Checklist Generator",
    requirementId: "REQ005",
    scenario: "Verify Overdraft with Fixed Deposit collateral requires FD Receipt.",
    testSteps: "Select Overdraft and Fixed Deposit collateral.",
    expectedResult: "Fixed Deposit Receipt and Set-off Letter are required.",
    priority: "Medium",
    status: "Passed",
    role: "Credit Admin",
    assignedTester: "BA Tester 05",
    executionDate: "2026-02-06",
    retestStatus: "Not Required",
    remarks: "Security documents generated correctly."
  },
  {
    id: "TC006",
    module: "Document Checklist Generator",
    requirementId: "REQ006",
    scenario: "Verify Trade Line application displays trade facility documents.",
    testSteps: "Select Trade Line facility type.",
    expectedResult: "Trade Facility Agreement and Supporting Trade Documents are required.",
    priority: "Medium",
    status: "Not Started",
    role: "RM",
    assignedTester: "BA Tester 01",
    executionDate: "",
    retestStatus: "Not Required",
    remarks: "Planned for next UAT cycle."
  },
  {
    id: "TC007",
    module: "Document Checklist Generator",
    requirementId: "REQ007",
    scenario: "Verify Bank Guarantee application displays BG Application Form and Counter Indemnity.",
    testSteps: "Select Bank Guarantee facility type.",
    expectedResult: "BG Application Form, Counter Indemnity, and Beneficiary Details are required.",
    priority: "High",
    status: "Blocked",
    role: "RM",
    assignedTester: "BA Tester 02",
    executionDate: "2026-02-07",
    defectId: "DEF-021",
    defectSeverity: "Medium",
    rootCause: "Product document mapping is awaiting confirmation from business product owner.",
    retestStatus: "Pending Retest",
    remarks: "Blocked pending product document mapping confirmation."
  },
  {
    id: "TC008",
    module: "UAT Test Case Tracker",
    requirementId: "REQ008",
    scenario: "Verify Credit Admin can update document completion status.",
    testSteps: "Open UAT tracker, update relevant status, and confirm summary metrics refresh.",
    expectedResult: "Status is updated in UI and stored locally for the browser session.",
    priority: "Medium",
    status: "Passed",
    role: "Credit Admin",
    assignedTester: "BA Tester 03",
    executionDate: "2026-02-08",
    retestStatus: "Not Required",
    remarks: "Local state update works."
  },
  {
    id: "TC009",
    module: "Change Request Impact Analyzer",
    requirementId: "REQ009",
    scenario: "Verify Approver can view missing document exception impact.",
    testSteps: "Select CR001 and review impacted requirements, UAT cases, and control risk.",
    expectedResult: "Impact analysis displays waiver workflow, exception tracking, and approval controls.",
    priority: "High",
    status: "In Progress",
    role: "Approver",
    assignedTester: "BA Tester 04",
    executionDate: "2026-02-09",
    retestStatus: "Not Required",
    remarks: "Recommendation copy under review."
  },
  {
    id: "TC010",
    module: "Document Checklist Generator",
    requirementId: "REQ002",
    scenario: "Verify RM cannot proceed if mandatory documents are missing unless waiver is approved.",
    testSteps: "Set financial statement as missing and confirm warning and waiver requirement.",
    expectedResult: "System requires waiver approval before missing mandatory financial statement can be bypassed.",
    priority: "High",
    status: "Failed",
    role: "RM",
    assignedTester: "BA Tester 05",
    executionDate: "2026-02-10",
    defectId: "DEF-027",
    defectSeverity: "Critical",
    rootCause: "Submission control message did not clearly state waiver approval prerequisite.",
    retestStatus: "Retest Failed",
    remarks: "Submission block wording requires refinement."
  },
  {
    id: "TC011",
    module: "Approval Routing Simulator",
    requirementId: "REQ017",
    scenario: "Verify approval route escalates when exposure, risk level, and exception severity increase.",
    testSteps: "Enter USD 12,000,000 exposure, High risk, Unsecured collateral, and Critical exception.",
    expectedResult: "System recommends Group Credit Committee with maker-checker controls and escalation triggers.",
    priority: "High",
    status: "Passed",
    role: "Approver",
    assignedTester: "BA Tester 04",
    executionDate: "2026-02-11",
    retestStatus: "Not Required",
    remarks: "Route escalated to committee as expected."
  },
  {
    id: "TC012",
    module: "Approval Routing Simulator",
    requirementId: "REQ018",
    scenario: "Verify approval override requires reason and audit evidence.",
    testSteps: "Generate Regional Credit Manager route and attempt override without reason.",
    expectedResult: "Override is blocked until authorized role and reason are captured.",
    priority: "High",
    status: "In Progress",
    role: "System Admin",
    assignedTester: "BA Tester 02",
    executionDate: "2026-02-12",
    retestStatus: "Not Required",
    remarks: "Awaiting final copy for override reason code validation."
  },
  {
    id: "TC013",
    module: "Policy Exception Register",
    requirementId: "REQ019",
    scenario: "Verify pending policy exceptions appear with severity, owner, mitigation, and aging.",
    testSteps: "Open exception register and filter for Pending Approval exceptions.",
    expectedResult: "System displays exception owner, mitigation, approval tier, aging, and control evidence.",
    priority: "Medium",
    status: "Passed",
    role: "Credit Analyst",
    assignedTester: "BA Tester 03",
    executionDate: "2026-02-12",
    retestStatus: "Not Required",
    remarks: "Exception register shows required governance fields."
  },
  {
    id: "TC014",
    module: "Executive Dashboard",
    requirementId: "REQ020",
    scenario: "Verify pipeline dashboard highlights bottlenecks and overdue cases.",
    testSteps: "Review executive dashboard and confirm aging by stage and owner role is visible.",
    expectedResult: "Dashboard displays aged cases, pending owner, exception volume, and document readiness.",
    priority: "High",
    status: "Blocked",
    role: "Credit Admin",
    assignedTester: "BA Tester 05",
    executionDate: "2026-02-13",
    defectId: "DEF-034",
    defectSeverity: "Medium",
    rootCause: "Business team requested updated SLA aging threshold before sign-off.",
    retestStatus: "Pending Retest",
    remarks: "Blocked pending SLA threshold confirmation."
  }
];

export const changeRequests: ChangeRequest[] = [
  {
    id: "CR001",
    title: "Allow waiver for missing financial statement",
    description:
      "Allow users to proceed with loan application when latest financial statement is not available, provided waiver approval is obtained.",
    impactedRequirements: [
      "REQ002 - Require waiver if financial statement is missing",
      "REQ009 - Display missing document exception to approver",
      "REQ010 - Block RM submission unless waiver is approved"
    ],
    impactedUatCases: ["TC002", "TC010"],
    impactedRoles: ["RM", "Credit Analyst", "Approver"],
    impactedBusinessRules: ["BR005"],
    controlRisk: [
      "Application may proceed without sufficient financial assessment.",
      "Credit risk may increase if waiver is approved without proper justification.",
      "Audit trail must evidence maker, checker, reason, and approval timestamp."
    ],
    operationalRisk: [
      "RM may overuse waiver path if exception reporting is weak.",
      "Approver may not notice missing financials unless the approval memo highlights the waiver."
    ],
    baRecommendation:
      "Allow waiver only with approver authorization, mandatory justification, supporting remarks, and audit trail. Waived cases should be highlighted in approval memo and exception report.",
    suggestedTestScope: [
      "Positive waiver approval flow",
      "Negative submission block without waiver",
      "Audit trail verification",
      "Approval memo exception display",
      "Dashboard exception count refresh"
    ],
    implementationPriority: "High"
  },
  {
    id: "CR002",
    title: "Add collateral type Corporate Guarantee",
    description:
      "Add Corporate Guarantee as a new collateral type and generate relevant guarantee documents.",
    impactedRequirements: [
      "REQ005 - Generate checklist by collateral type",
      "REQ011 - Capture guarantor authority evidence",
      "REQ012 - Track guarantee documentation readiness"
    ],
    impactedUatCases: ["TC001", "TC005"],
    impactedRoles: ["RM", "Credit Admin", "Approver"],
    impactedBusinessRules: ["BR012", "BR010"],
    controlRisk: [
      "Incorrect guarantee document may cause legal enforceability issue.",
      "Guarantor authority may be missed if board approval is not required."
    ],
    operationalRisk: [
      "Credit Admin may receive incomplete guarantee package.",
      "Existing checklist regression may be affected for Personal Guarantee and Debenture."
    ],
    baRecommendation:
      "Add Corporate Guarantee Agreement, Board Resolution, and Authorized Signatory Verification as mandatory documents. Include regression testing for other collateral types.",
    suggestedTestScope: [
      "Corporate Guarantee checklist generation",
      "Company authority document validation",
      "Regression for Personal Guarantee",
      "Regression for Property collateral",
      "Credit Admin readiness view"
    ],
    implementationPriority: "Medium"
  },
  {
    id: "CR003",
    title: "Make Enhanced Due Diligence mandatory for High Risk customers",
    description:
      "For customers tagged as High Risk, system must automatically require Enhanced Due Diligence Checklist.",
    impactedRequirements: [
      "REQ004 - Require EDD for high risk customer",
      "REQ013 - Block submission when high risk control documents are missing",
      "REQ014 - Display compliance document category"
    ],
    impactedUatCases: ["TC004"],
    impactedRoles: ["RM", "Credit Analyst", "Approver"],
    impactedBusinessRules: ["BR006"],
    controlRisk: [
      "High risk customers may be approved without sufficient compliance review.",
      "EDD bypass may weaken AML/KYC control evidence."
    ],
    operationalRisk: [
      "Compliance team may be involved too late if the checklist does not trigger early.",
      "UAT scope must cover both Medium and High risk journeys."
    ],
    baRecommendation:
      "System should block submission if EDD checklist is missing for High Risk customers. EDD status should be visible to Credit Analyst and Approver.",
    suggestedTestScope: [
      "High risk EDD generation",
      "Submission block when EDD missing",
      "Medium risk regression",
      "Approver visibility",
      "Audit trail for EDD waiver if any"
    ],
    implementationPriority: "High"
  },
  {
    id: "CR004",
    title: "Add UAT tracking for failed test cases",
    description:
      "Enhance UAT Tracker to show failed cases, linked defect ID and retest status.",
    impactedRequirements: [
      "REQ008 - Track UAT test case status",
      "REQ015 - Link defects to failed test cases",
      "REQ016 - Report high priority open items"
    ],
    impactedUatCases: ["TC008", "TC009", "TC010"],
    impactedRoles: ["System Admin", "Credit Admin", "RM"],
    impactedBusinessRules: ["BR005", "BR006"],
    controlRisk: [
      "Failed test cases may be missed before production release.",
      "Release sign-off may be granted while high priority defects remain open."
    ],
    operationalRisk: [
      "UAT team may track defects outside the system.",
      "Retest status may not be visible to business sign-off owners."
    ],
    baRecommendation:
      "All failed high-priority test cases must be retested and passed before sign-off. UAT dashboard should highlight failed cases with missing defect IDs.",
    suggestedTestScope: [
      "Status update workflow",
      "Failed case highlighting",
      "Defect ID mandatory rule for failed cases",
      "Pass rate recalculation",
      "Export UAT report"
    ],
    implementationPriority: "Medium"
  },
  {
    id: "CR005",
    title: "Introduce risk-based approval routing",
    description:
      "Generate approval authority based on total exposure, risk level, collateral coverage, customer segment, application type, and exception severity.",
    impactedRequirements: [
      "REQ017 - Recommend approval route before Credit Review submission",
      "REQ018 - Require controlled override for approval route changes",
      "REQ020 - Refresh pipeline dashboard when route or owner changes"
    ],
    impactedUatCases: ["TC011", "TC012", "TC014"],
    impactedRoles: ["RM", "Credit Analyst", "Approver", "System Admin"],
    impactedBusinessRules: ["BR013", "BR014", "BR015"],
    controlRisk: [
      "Incorrect routing may lead to approval outside delegated authority.",
      "Manual route overrides may weaken audit evidence if reason and owner are not captured.",
      "High-risk or unsecured cases may be approved without sufficient committee visibility."
    ],
    operationalRisk: [
      "Credit Analyst may spend extra time clarifying authority level.",
      "Approver workload may increase if routing thresholds are not calibrated.",
      "Dashboard aging may be misleading if owner changes are not reflected."
    ],
    baRecommendation:
      "Adopt transparent risk-based routing with threshold rules, override reason codes, maker-checker validation, and traceability to UAT regression scenarios.",
    suggestedTestScope: [
      "Low exposure fully secured route",
      "High exposure unsecured route",
      "Critical exception escalation",
      "Override reason validation",
      "Audit trail and dashboard owner refresh"
    ],
    implementationPriority: "High"
  }
];

export const policyExceptions: PolicyException[] = [
  {
    id: "EXC001",
    type: "Missing latest audited financial statement",
    severity: "Major",
    facilityType: "Term Loan",
    status: "Pending Approval",
    ownerRole: "Credit Analyst",
    agingDays: 6,
    mitigation: "Management accounts, bank statements, and tax return required as alternate evidence.",
    approvalTier: "Country Credit Committee",
    linkedRequirement: "REQ002",
    linkedTestCase: "TC002",
    controlEvidence: "Waiver form, exception memo, approver decision, and audit timestamp."
  },
  {
    id: "EXC002",
    type: "Unsecured exposure above standard threshold",
    severity: "Critical",
    facilityType: "Overdraft",
    status: "Pending Approval",
    ownerRole: "Approver",
    agingDays: 9,
    mitigation: "Additional repayment capacity analysis and monthly conduct monitoring.",
    approvalTier: "Group Credit Committee",
    linkedRequirement: "REQ017",
    linkedTestCase: "TC011",
    controlEvidence: "Exception register, committee approval note, and route override history."
  },
  {
    id: "EXC003",
    type: "High risk customer EDD pending",
    severity: "Major",
    facilityType: "Trade Line",
    status: "Draft",
    ownerRole: "RM",
    agingDays: 3,
    mitigation: "EDD checklist to be completed before submission to Credit Review.",
    approvalTier: "Country Credit Committee",
    linkedRequirement: "REQ004",
    linkedTestCase: "TC004",
    controlEvidence: "EDD checklist, screening result, and compliance review note."
  },
  {
    id: "EXC004",
    type: "Corporate guarantee authority evidence incomplete",
    severity: "Minor",
    facilityType: "Bank Guarantee",
    status: "Approved",
    ownerRole: "Credit Admin",
    agingDays: 2,
    mitigation: "Board resolution obtained with authorized signatory verification.",
    approvalTier: "Regional Credit Manager",
    linkedRequirement: "REQ005",
    linkedTestCase: "TC005",
    controlEvidence: "Board resolution, signatory evidence, and guarantee agreement."
  },
  {
    id: "EXC005",
    type: "Trade facility product document mapping pending",
    severity: "Minor",
    facilityType: "Trade Line",
    status: "Expired",
    ownerRole: "System Admin",
    agingDays: 14,
    mitigation: "Product owner to confirm final document mapping before next UAT cycle.",
    approvalTier: "Regional Credit Manager",
    linkedRequirement: "REQ006",
    linkedTestCase: "TC006",
    controlEvidence: "Product owner sign-off and updated checklist rule mapping."
  }
];

export const creditPipelineCases: CreditPipelineCase[] = [
  {
    id: "CASE-1001",
    customerSegment: "SME",
    facilityType: "Term Loan",
    exposure: 750000,
    riskLevel: "Medium",
    stage: "Pending RM Action",
    ownerRole: "RM",
    agingDays: 5,
    exceptionCount: 1,
    documentReadiness: 68
  },
  {
    id: "CASE-1002",
    customerSegment: "Mid-Market",
    facilityType: "Overdraft",
    exposure: 2500000,
    riskLevel: "High",
    stage: "Credit Analysis",
    ownerRole: "Credit Analyst",
    agingDays: 8,
    exceptionCount: 2,
    documentReadiness: 76
  },
  {
    id: "CASE-1003",
    customerSegment: "Large Corporate",
    facilityType: "Trade Line",
    exposure: 12000000,
    riskLevel: "Medium",
    stage: "Approval Review",
    ownerRole: "Approver",
    agingDays: 11,
    exceptionCount: 1,
    documentReadiness: 91
  },
  {
    id: "CASE-1004",
    customerSegment: "SME",
    facilityType: "Bank Guarantee",
    exposure: 430000,
    riskLevel: "Low",
    stage: "Documentation",
    ownerRole: "Credit Admin",
    agingDays: 4,
    exceptionCount: 0,
    documentReadiness: 88
  },
  {
    id: "CASE-1005",
    customerSegment: "Mid-Market",
    facilityType: "Term Loan",
    exposure: 5600000,
    riskLevel: "High",
    stage: "Approval Review",
    ownerRole: "Approver",
    agingDays: 13,
    exceptionCount: 2,
    documentReadiness: 82
  },
  {
    id: "CASE-1006",
    customerSegment: "SME",
    facilityType: "Trade Line",
    exposure: 980000,
    riskLevel: "Medium",
    stage: "Ready for Facility Setup",
    ownerRole: "Credit Admin",
    agingDays: 1,
    exceptionCount: 0,
    documentReadiness: 100
  },
  {
    id: "CASE-1007",
    customerSegment: "Large Corporate",
    facilityType: "Overdraft",
    exposure: 18500000,
    riskLevel: "High",
    stage: "Credit Analysis",
    ownerRole: "Credit Analyst",
    agingDays: 15,
    exceptionCount: 3,
    documentReadiness: 64
  }
];

export const traceabilityMatrix: TraceabilityItem[] = [
  {
    requirementId: "REQ001",
    requirementDescription: "Generate checklist based on application type.",
    relatedBusinessRule: "BR001",
    relatedTestCaseId: "TC001",
    relatedChangeRequest: "CR001",
    status: "Active"
  },
  {
    requirementId: "REQ002",
    requirementDescription: "Require waiver if financial statement is missing.",
    relatedBusinessRule: "BR005",
    relatedTestCaseId: "TC002, TC010",
    relatedChangeRequest: "CR001",
    status: "Updated"
  },
  {
    requirementId: "REQ003",
    requirementDescription: "Require revised approval memo for enhancement application.",
    relatedBusinessRule: "BR003",
    relatedTestCaseId: "TC003",
    relatedChangeRequest: "CR001",
    status: "Active"
  },
  {
    requirementId: "REQ004",
    requirementDescription: "Require EDD for high risk customer.",
    relatedBusinessRule: "BR006",
    relatedTestCaseId: "TC004",
    relatedChangeRequest: "CR003",
    status: "Active"
  },
  {
    requirementId: "REQ005",
    requirementDescription: "Generate collateral documents based on collateral type.",
    relatedBusinessRule: "BR004, BR011, BR012",
    relatedTestCaseId: "TC005",
    relatedChangeRequest: "CR002",
    status: "Updated"
  },
  {
    requirementId: "REQ006",
    requirementDescription: "Generate trade facility documents for Trade Line.",
    relatedBusinessRule: "BR008",
    relatedTestCaseId: "TC006",
    relatedChangeRequest: "CR002",
    status: "Active"
  },
  {
    requirementId: "REQ007",
    requirementDescription: "Generate BG Application Form and Counter Indemnity for Bank Guarantee.",
    relatedBusinessRule: "BR009",
    relatedTestCaseId: "TC007",
    relatedChangeRequest: "CR002",
    status: "Pending Review"
  },
  {
    requirementId: "REQ008",
    requirementDescription: "Track UAT status and refresh delivery metrics.",
    relatedBusinessRule: "BR005",
    relatedTestCaseId: "TC008",
    relatedChangeRequest: "CR004",
    status: "Updated"
  },
  {
    requirementId: "REQ009",
    requirementDescription: "Show change request impact on requirements, UAT, controls and roles.",
    relatedBusinessRule: "BR005",
    relatedTestCaseId: "TC009",
    relatedChangeRequest: "CR001",
    status: "Active"
  },
  {
    requirementId: "REQ017",
    requirementDescription: "Recommend approval route based on exposure, risk, collateral, segment, and exception severity.",
    relatedBusinessRule: "BR013, BR014",
    relatedTestCaseId: "TC011",
    relatedChangeRequest: "CR005",
    status: "Active"
  },
  {
    requirementId: "REQ018",
    requirementDescription: "Require reason, authorized role, and audit evidence when approval route is overridden.",
    relatedBusinessRule: "BR014",
    relatedTestCaseId: "TC012",
    relatedChangeRequest: "CR005",
    status: "Pending Review"
  },
  {
    requirementId: "REQ019",
    requirementDescription: "Track policy exceptions by severity, owner, mitigation, aging, approval tier, and evidence.",
    relatedBusinessRule: "BR005, BR006, BR015",
    relatedTestCaseId: "TC013",
    relatedChangeRequest: "CR001, CR003, CR005",
    status: "Active"
  },
  {
    requirementId: "REQ020",
    requirementDescription: "Show pipeline aging, bottlenecks, owner role, exception volume, and document readiness.",
    relatedBusinessRule: "BR015",
    relatedTestCaseId: "TC014",
    relatedChangeRequest: "CR005",
    status: "Updated"
  }
];
