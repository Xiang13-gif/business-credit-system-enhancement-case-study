import type { ChangeRequest, TraceabilityItem, UatTestCase } from "@/lib/types";

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
    remarks: "Submission block wording requires refinement."
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
  }
];
