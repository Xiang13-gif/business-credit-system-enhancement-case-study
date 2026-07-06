export type ApplicationType = "New" | "Renewal" | "Enhancement";

export type FacilityType = "Term Loan" | "Overdraft" | "Trade Line" | "Bank Guarantee";

export type CollateralType =
  | "Property"
  | "Cash Deposit"
  | "Fixed Deposit"
  | "Corporate Guarantee"
  | "Personal Guarantee"
  | "Debenture"
  | "Unsecured";

export type CustomerType =
  | "Individual"
  | "Sole Proprietor"
  | "Partnership"
  | "SME Company"
  | "Corporate";

export type RiskLevel = "Low" | "Medium" | "High";

export type CustomerSegment = "SME" | "Mid-Market" | "Large Corporate";

export type CollateralCoverage = "Fully Secured" | "Partially Secured" | "Unsecured";

export type ExceptionSeverity = "None" | "Minor" | "Major" | "Critical";

export type ApprovalTier =
  | "Credit Analyst Review"
  | "Regional Credit Manager"
  | "Country Credit Committee"
  | "Group Credit Committee";

export type PipelineStage =
  | "Pending RM Action"
  | "Credit Analysis"
  | "Approval Review"
  | "Documentation"
  | "Ready for Facility Setup";

export type FinancialStatementStatus = "Available" | "Not Available" | "Waiver Requested";

export type RequirementLevel = "Required" | "Conditional" | "Optional";

export type DocumentCategory =
  | "General"
  | "Financial"
  | "Facility"
  | "Collateral"
  | "Compliance / Control";

export interface ChecklistInput {
  applicationType: ApplicationType;
  facilityType: FacilityType;
  collateralType: CollateralType;
  customerType: CustomerType;
  riskLevel: RiskLevel;
  financialStatementStatus: FinancialStatementStatus;
}

export interface ApprovalRoutingInput {
  applicationType: ApplicationType;
  facilityType: FacilityType;
  customerSegment: CustomerSegment;
  totalExposure: number;
  riskLevel: RiskLevel;
  collateralCoverage: CollateralCoverage;
  exceptionSeverity: ExceptionSeverity;
}

export interface ApprovalRouteResult {
  tier: ApprovalTier;
  score: number;
  slaDays: number;
  makerCheckerRequired: boolean;
  rationale: string[];
  requiredControls: string[];
  escalationTriggers: string[];
}

export interface ChecklistDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  requirementLevel: RequirementLevel;
  reason: string;
  businessRuleId: string;
}

export interface ChecklistResult {
  documents: ChecklistDocument[];
  warnings: string[];
  triggeredRules: BusinessRule[];
}

export interface BusinessRule {
  id: string;
  title: string;
  description: string;
  controlPoint: string;
}

export type UatPriority = "High" | "Medium" | "Low";
export type UatStatus = "Not Started" | "In Progress" | "Passed" | "Failed" | "Blocked";
export type UatRole = "RM" | "Credit Analyst" | "Approver" | "Credit Admin" | "System Admin";
export type DefectSeverity = "Critical" | "High" | "Medium" | "Low";
export type RetestStatus = "Not Required" | "Pending Retest" | "Retest Passed" | "Retest Failed";

export interface UatTestCase {
  id: string;
  module: string;
  requirementId: string;
  scenario: string;
  testSteps: string;
  expectedResult: string;
  priority: UatPriority;
  status: UatStatus;
  role: UatRole;
  assignedTester: string;
  executionDate: string;
  defectId?: string;
  defectSeverity?: DefectSeverity;
  rootCause?: string;
  retestStatus: RetestStatus;
  remarks: string;
}

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  impactedRequirements: string[];
  impactedUatCases: string[];
  impactedRoles: UatRole[];
  impactedBusinessRules: string[];
  controlRisk: string[];
  operationalRisk: string[];
  baRecommendation: string;
  suggestedTestScope: string[];
  implementationPriority: "High" | "Medium" | "Low";
}

export interface PolicyException {
  id: string;
  type: string;
  severity: Exclude<ExceptionSeverity, "None">;
  facilityType: FacilityType;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Expired";
  ownerRole: UatRole;
  agingDays: number;
  mitigation: string;
  approvalTier: ApprovalTier;
  linkedRequirement: string;
  linkedTestCase: string;
  controlEvidence: string;
}

export interface CreditPipelineCase {
  id: string;
  customerSegment: CustomerSegment;
  facilityType: FacilityType;
  exposure: number;
  riskLevel: RiskLevel;
  stage: PipelineStage;
  ownerRole: UatRole;
  agingDays: number;
  exceptionCount: number;
  documentReadiness: number;
}

export interface TraceabilityItem {
  requirementId: string;
  requirementDescription: string;
  relatedBusinessRule: string;
  relatedTestCaseId: string;
  relatedChangeRequest: string;
  status: "Active" | "Updated" | "Pending Review";
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  referenceId: string;
  details: string;
  controlImpact: "Low" | "Medium" | "High";
}
