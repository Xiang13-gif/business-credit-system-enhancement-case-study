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

export type LifecycleStepStatus = "Completed" | "In Progress" | "Blocked" | "Pending";

export type ReadinessGateStatus = "Pass" | "Watch" | "Block";

export type FinancialStatementStatus = "Available" | "Not Available" | "Waiver Requested";

export type RequirementLevel = "Required" | "Conditional" | "Optional";

export type DocumentStatus = "Not Uploaded" | "Uploaded" | "Verified" | "Waived" | "Not Applicable";

export type WaiverApprovalStatus = "Not Requested" | "Draft" | "Pending Approval" | "Approved" | "Rejected";

export type DocumentSlaStatus = "On Track" | "Watch" | "Breach";

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
export type DefectStatus = "Open" | "In Fix" | "Ready for Retest" | "Retest Failed" | "Closed" | "Risk Accepted";
export type RiskAcceptanceStatus = "Not Required" | "Pending" | "Approved" | "Rejected";

export interface DefectRecord {
  id: string;
  title: string;
  linkedTestCaseId: string;
  requirementId: string;
  module: string;
  severity: DefectSeverity;
  priority: UatPriority;
  status: DefectStatus;
  owner: string;
  raisedDate: string;
  targetFixDate: string;
  businessImpact: string;
  rootCause: string;
  resolution: string;
  retestEvidence: string;
  riskAcceptanceStatus: RiskAcceptanceStatus;
  riskAcceptanceReason: string;
  riskAcceptedBy: string;
  updatedAt: string;
}

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

export interface CaseLifecycleStep {
  id: string;
  title: string;
  ownerRole: UatRole;
  status: LifecycleStepStatus;
  agingDays: number;
  controlObjective: string;
  evidence: string;
  riskSignal: string;
}

export interface CaseReadinessGate {
  id: string;
  title: string;
  status: ReadinessGateStatus;
  ownerRole: UatRole;
  evidence: string;
  linkedRequirement: string;
  linkedTestCase: string;
}

export interface CreditCase360 {
  id: string;
  customerName: string;
  relationshipManager: string;
  creditAnalyst: string;
  applicationType: ApplicationType;
  customerSegment: CustomerSegment;
  facilityType: FacilityType;
  exposure: number;
  riskLevel: RiskLevel;
  collateralCoverage: CollateralCoverage;
  currentStage: PipelineStage;
  ownerRole: UatRole;
  agingDays: number;
  documentReadiness: number;
  approvalTier: ApprovalTier;
  approvalRouteConfirmed: boolean;
  policyExceptionIds: string[];
  uatCaseIds: string[];
  changeRequestIds: string[];
  lifecycleSteps: CaseLifecycleStep[];
  readinessGates: CaseReadinessGate[];
  executiveSummary: string;
  baRecommendation: string;
  nextBestActions: string[];
}

export interface TraceabilityItem {
  requirementId: string;
  requirementDescription: string;
  relatedBusinessRule: string;
  relatedTestCaseId: string;
  relatedChangeRequest: string;
  status: "Active" | "Updated" | "Pending Review";
}

export type MemoSectionStatus = "Generated" | "Needs Evidence" | "Reviewed" | "Approved";
export type EvidenceConfidence = "High" | "Medium" | "Low";
export type MemoApprovalStatus = "Draft" | "In Review" | "Approved" | "Blocked";

export interface CreditMemoProfile {
  caseId: string;
  industry: string;
  yearsInBusiness: number;
  facilityPurpose: string;
  requestedTenor: string;
  annualRevenue: number;
  ebitda: number;
  debtServiceCoverageRatio: number;
  leverageRatio: number;
  financialPeriod: string;
  relationshipHistory: string;
  primaryRepaymentSource: string;
  keyRisks: string[];
  mitigants: string[];
  conditions: string[];
  sourceRecordIds: string[];
  missingEvidence: string[];
  previousVersionNotes: string[];
}

export interface CreditMemoSection {
  id: string;
  title: string;
  narrative: string;
  sourceFields: string[];
  businessRuleIds: string[];
  confidence: EvidenceConfidence;
  missingEvidence: string[];
  status: MemoSectionStatus;
}

export type RuleLifecycleStatus = "Draft" | "Under Review" | "Approved" | "Active" | "Retired";
export type ImpactRating = "Low" | "Medium" | "High" | "Critical";

export interface GovernedRule {
  id: string;
  title: string;
  currentVersion: string;
  proposedVersion: string;
  status: RuleLifecycleStatus;
  ownerRole: UatRole;
  approverRole: UatRole;
  effectiveDate: string;
  lastReviewed: string;
  riskRating: ImpactRating;
  currentLogic: string;
  proposedLogic: string;
  changeRationale: string;
  linkedRequirements: string[];
  linkedUatCases: string[];
  impactedRoles: UatRole[];
  impactedDocuments: string[];
  impactedControls: string[];
}

export interface RuleTestScenario {
  id: string;
  name: string;
  description: string;
  linkedRuleId: string;
  input: ChecklistInput;
  expectedDocumentIds: string[];
  expectedRuleIds: string[];
  expectedOutcome: string;
}

export type DataQualityStatus = "Healthy" | "Watch" | "Breach";

export interface CriticalDataElement {
  id: string;
  businessTerm: string;
  definition: string;
  sourceSystem: string;
  sourceField: string;
  transformation: string;
  linkedRule: string;
  outputUsage: string;
  owner: string;
  qualityScore: number;
  lineageCoverage: number;
  status: DataQualityStatus;
  qualityChecks: string[];
}

export interface DataQualityIssue {
  id: string;
  dataElementId: string;
  severity: ImpactRating;
  issue: string;
  rootCause: string;
  downstreamImpact: string;
  owner: string;
  status: "Open" | "In Remediation" | "Accepted" | "Closed";
  dueDate: string;
}

export interface BenefitMetric {
  id: string;
  label: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  direction: "Increase" | "Decrease";
  owner: string;
  measurement: string;
  source: string;
}

export interface ProductRoadmapItem {
  id: string;
  feature: string;
  horizon: "Now" | "Next" | "Later";
  outcome: string;
  valueScore: number;
  riskReductionScore: number;
  effortScore: number;
  priorityScore: number;
  status: "Discovery" | "Ready" | "In Delivery" | "Released";
}

export type ReleaseGateStatus = "Pass" | "Watch" | "Block";

export interface ReleaseGate {
  id: string;
  domain: "Business" | "Data" | "Technology" | "Controls" | "Operations" | "People";
  title: string;
  status: ReleaseGateStatus;
  owner: string;
  exitCriteria: string;
  evidence: string;
  linkedItems: string[];
  signOff: string;
}

export interface CutoverStep {
  id: string;
  sequence: number;
  window: string;
  title: string;
  owner: string;
  status: "Pending" | "Ready" | "Completed" | "Blocked";
  validation: string;
  rollbackTrigger: string;
}

export interface HypercareMetric {
  id: string;
  label: string;
  target: string;
  current: string;
  status: "On Track" | "Watch" | "Breach";
  owner: string;
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
