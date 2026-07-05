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

export interface TraceabilityItem {
  requirementId: string;
  requirementDescription: string;
  relatedBusinessRule: string;
  relatedTestCaseId: string;
  relatedChangeRequest: string;
  status: "Active" | "Updated" | "Pending Review";
}
