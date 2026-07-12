import { generateApprovalRoute } from "@/lib/approval-routing";
import { generateChecklist } from "@/lib/checklist-rules";
import type {
  ApplicationType,
  ChecklistInput,
  CollateralCoverage,
  CollateralType,
  CustomerSegment,
  CustomerType,
  ExceptionSeverity,
  FacilityType,
  FinancialStatementStatus,
  RiskLevel,
  UatRole
} from "@/lib/types";

export type WorkflowStage = "Draft" | "Credit Review" | "Approval" | "Documentation" | "Completed" | "Returned";
export type WorkflowDecisionType = "Approve" | "Conditional Approve" | "Return";

export interface WorkflowDecision {
  id: string;
  type: WorkflowDecisionType;
  actor: string;
  actorRole: UatRole;
  reason: string;
  timestamp: string;
}

export interface UnifiedCreditCase {
  id: string;
  customerName: string;
  relationshipManager: string;
  applicationType: ApplicationType;
  facilityType: FacilityType;
  collateralType: CollateralType;
  customerType: CustomerType;
  customerSegment: CustomerSegment;
  riskLevel: RiskLevel;
  financialStatementStatus: FinancialStatementStatus;
  totalExposure: number;
  stage: WorkflowStage;
  ownerRole: UatRole;
  documentReadyIds: string[];
  waiverApproved: boolean;
  creditRecommendation: string;
  decisions: WorkflowDecision[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTask {
  id: string;
  ownerRole: UatRole;
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Waiting" | "Complete";
}

const STORAGE_KEY = "creditflow-unified-cases";

export const workflowStages: WorkflowStage[] = ["Draft", "Credit Review", "Approval", "Documentation", "Completed"];

export const seedWorkflowCases: UnifiedCreditCase[] = [
  {
    id: "CASE-WF-1001",
    customerName: "Aster Precision Manufacturing Sdn Bhd",
    relationshipManager: "Nadia Rahman",
    applicationType: "New",
    facilityType: "Term Loan",
    collateralType: "Property",
    customerType: "SME Company",
    customerSegment: "SME",
    riskLevel: "Medium",
    financialStatementStatus: "Available",
    totalExposure: 2_500_000,
    stage: "Draft",
    ownerRole: "RM",
    documentReadyIds: ["DOC001", "DOC002", "DOC003", "DOC004", "DOC006", "DOC007", "DOC014"],
    waiverApproved: false,
    creditRecommendation: "",
    decisions: [],
    createdAt: "2026-07-08T02:30:00.000Z",
    updatedAt: "2026-07-10T06:15:00.000Z"
  },
  {
    id: "CASE-WF-1002",
    customerName: "Meridian Trade Solutions Sdn Bhd",
    relationshipManager: "Daniel Wong",
    applicationType: "Renewal",
    facilityType: "Trade Line",
    collateralType: "Unsecured",
    customerType: "Corporate",
    customerSegment: "Mid-Market",
    riskLevel: "High",
    financialStatementStatus: "Waiver Requested",
    totalExposure: 6_800_000,
    stage: "Returned",
    ownerRole: "RM",
    documentReadyIds: ["DOC001", "DOC002", "DOC003", "DOC004", "DOC005", "DOC008", "DOC009", "DOC017", "DOC019"],
    waiverApproved: false,
    creditRecommendation: "Return to RM until waiver approval and enhanced due diligence evidence are complete.",
    decisions: [
      {
        id: "DEC-SEED-1002",
        type: "Return",
        actor: "Country Credit Reviewer",
        actorRole: "Approver",
        reason: "Financial waiver and Enhanced Due Diligence evidence are incomplete.",
        timestamp: "2026-07-10T08:40:00.000Z"
      }
    ],
    createdAt: "2026-07-01T01:00:00.000Z",
    updatedAt: "2026-07-10T08:40:00.000Z"
  }
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readWorkflowCases() {
  if (!canUseStorage()) {
    return seedWorkflowCases;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedWorkflowCases));
    return seedWorkflowCases;
  }

  try {
    const parsed = JSON.parse(stored) as UnifiedCreditCase[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedWorkflowCases;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedWorkflowCases));
    return seedWorkflowCases;
  }
}

export function writeWorkflowCases(cases: UnifiedCreditCase[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }
}

export function resetWorkflowCases() {
  writeWorkflowCases(seedWorkflowCases);
  return seedWorkflowCases;
}

export function createWorkflowCase(sequence: number): UnifiedCreditCase {
  const timestamp = new Date().toISOString();
  return {
    id: `CASE-WF-${String(sequence).padStart(4, "0")}`,
    customerName: "New Commercial Customer",
    relationshipManager: "Portfolio RM",
    applicationType: "New",
    facilityType: "Term Loan",
    collateralType: "Property",
    customerType: "SME Company",
    customerSegment: "SME",
    riskLevel: "Medium",
    financialStatementStatus: "Available",
    totalExposure: 1_000_000,
    stage: "Draft",
    ownerRole: "RM",
    documentReadyIds: [],
    waiverApproved: false,
    creditRecommendation: "",
    decisions: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function collateralCoverage(collateral: CollateralType): CollateralCoverage {
  if (collateral === "Unsecured") {
    return "Unsecured";
  }
  if (["Property", "Cash Deposit", "Fixed Deposit"].includes(collateral)) {
    return "Fully Secured";
  }
  return "Partially Secured";
}

function exceptionSeverity(caseRecord: UnifiedCreditCase): ExceptionSeverity {
  if (caseRecord.financialStatementStatus === "Not Available" && caseRecord.riskLevel === "High") {
    return "Critical";
  }
  if (caseRecord.financialStatementStatus !== "Available") {
    return "Major";
  }
  return "None";
}

export function deriveWorkflow(caseRecord: UnifiedCreditCase) {
  const checklistInput: ChecklistInput = {
    applicationType: caseRecord.applicationType,
    facilityType: caseRecord.facilityType,
    collateralType: caseRecord.collateralType,
    customerType: caseRecord.customerType,
    riskLevel: caseRecord.riskLevel,
    financialStatementStatus: caseRecord.financialStatementStatus
  };
  const checklist = generateChecklist(checklistInput);
  const route = generateApprovalRoute({
    applicationType: caseRecord.applicationType,
    facilityType: caseRecord.facilityType,
    customerSegment: caseRecord.customerSegment,
    totalExposure: caseRecord.totalExposure,
    riskLevel: caseRecord.riskLevel,
    collateralCoverage: collateralCoverage(caseRecord.collateralType),
    exceptionSeverity: exceptionSeverity(caseRecord)
  });
  const requiredDocuments = checklist.documents.filter((document) => document.requirementLevel === "Required");
  const missingDocuments = requiredDocuments.filter((document) => !caseRecord.documentReadyIds.includes(document.id));
  const blockers: string[] = [];

  if (!caseRecord.customerName.trim()) {
    blockers.push("Customer name is required.");
  }
  if (caseRecord.totalExposure <= 0) {
    blockers.push("Total exposure must be greater than zero.");
  }
  if (missingDocuments.length > 0) {
    blockers.push(`${missingDocuments.length} mandatory document${missingDocuments.length === 1 ? " is" : "s are"} not ready.`);
  }
  if (caseRecord.financialStatementStatus !== "Available" && !caseRecord.waiverApproved) {
    blockers.push("Financial statement waiver requires independent approval.");
  }
  if (caseRecord.stage === "Credit Review" && caseRecord.creditRecommendation.trim().length < 20) {
    blockers.push("Credit recommendation must contain at least 20 characters before approval routing.");
  }
  if (caseRecord.stage === "Approval" && !caseRecord.decisions.some((decision) => decision.type !== "Return")) {
    blockers.push("An approval decision and rationale must be recorded.");
  }

  const readiness = requiredDocuments.length === 0
    ? 100
    : Math.round(((requiredDocuments.length - missingDocuments.length) / requiredDocuments.length) * 100);

  return {
    checklist,
    route,
    requiredDocuments,
    missingDocuments,
    blockers,
    readiness,
    tasks: buildTasks(caseRecord, missingDocuments.length)
  };
}

function buildTasks(caseRecord: UnifiedCreditCase, missingDocumentCount: number): WorkflowTask[] {
  const tasks: WorkflowTask[] = [];

  tasks.push({
    id: `${caseRecord.id}-DOCS`,
    ownerRole: "RM",
    title: "Complete mandatory documents",
    detail: missingDocumentCount > 0 ? `${missingDocumentCount} mandatory documents remain outstanding.` : "Mandatory document set is complete.",
    priority: missingDocumentCount > 0 ? "High" : "Low",
    status: missingDocumentCount > 0 ? "Open" : "Complete"
  });

  if (caseRecord.financialStatementStatus !== "Available") {
    tasks.push({
      id: `${caseRecord.id}-WAIVER`,
      ownerRole: "Approver",
      title: "Review financial statement waiver",
      detail: caseRecord.waiverApproved ? "Independent waiver approval is recorded." : "Waiver approval is required before submission.",
      priority: "High",
      status: caseRecord.waiverApproved ? "Complete" : "Open"
    });
  }

  tasks.push({
    id: `${caseRecord.id}-ANALYSIS`,
    ownerRole: "Credit Analyst",
    title: "Complete credit recommendation",
    detail: caseRecord.creditRecommendation.trim().length >= 20 ? "Credit recommendation is available." : "Credit analysis and recommendation are pending.",
    priority: "High",
    status: caseRecord.creditRecommendation.trim().length >= 20 ? "Complete" : caseRecord.stage === "Credit Review" ? "Open" : "Waiting"
  });

  tasks.push({
    id: `${caseRecord.id}-DECISION`,
    ownerRole: "Approver",
    title: "Record credit decision",
    detail: caseRecord.decisions.length > 0 ? `Latest decision: ${caseRecord.decisions[0].type}.` : "Approval decision has not been recorded.",
    priority: "High",
    status: caseRecord.decisions.some((decision) => decision.type !== "Return") ? "Complete" : caseRecord.stage === "Approval" ? "Open" : "Waiting"
  });

  tasks.push({
    id: `${caseRecord.id}-DOCADMIN`,
    ownerRole: "Credit Admin",
    title: "Complete facility documentation",
    detail: caseRecord.stage === "Completed" ? "Facility documentation workflow completed." : "Starts after credit approval.",
    priority: "Medium",
    status: caseRecord.stage === "Completed" ? "Complete" : caseRecord.stage === "Documentation" ? "Open" : "Waiting"
  });

  return tasks;
}

export function nextStage(caseRecord: UnifiedCreditCase): Pick<UnifiedCreditCase, "stage" | "ownerRole"> | null {
  const route: Record<Exclude<WorkflowStage, "Completed" | "Returned">, Pick<UnifiedCreditCase, "stage" | "ownerRole">> = {
    Draft: { stage: "Credit Review", ownerRole: "Credit Analyst" },
    "Credit Review": { stage: "Approval", ownerRole: "Approver" },
    Approval: { stage: "Documentation", ownerRole: "Credit Admin" },
    Documentation: { stage: "Completed", ownerRole: "Credit Admin" }
  };

  if (caseRecord.stage === "Returned") {
    return { stage: "Credit Review", ownerRole: "Credit Analyst" };
  }
  if (caseRecord.stage === "Completed") {
    return null;
  }
  return route[caseRecord.stage];
}
