import type {
  DefectRecord,
  DefectSeverity,
  RetestStatus,
  UatTestCase
} from "@/lib/types";

const STORAGE_KEY = "creditflow-defect-register";

export const seedDefects: DefectRecord[] = [
  {
    id: "DEF-014",
    title: "Financial statement exception memo not generated",
    linkedTestCaseId: "TC002",
    requirementId: "REQ002",
    module: "Document Checklist Generator",
    severity: "High",
    priority: "High",
    status: "Ready for Retest",
    owner: "Rule Engineering Lead",
    raisedDate: "2026-02-04",
    targetFixDate: "2026-02-12",
    businessImpact: "RM may submit a waiver case without the exception memo needed for Credit review and audit evidence.",
    rootCause: "Rule mapping omitted the exception memo when financial statement status was Not Available.",
    resolution: "Updated BR005 mapping to add the exception memo and waiver approval form as mandatory documents.",
    retestEvidence: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    updatedAt: "2026-02-11T08:20:00.000Z"
  },
  {
    id: "DEF-021",
    title: "Bank Guarantee document mapping awaiting confirmation",
    linkedTestCaseId: "TC007",
    requirementId: "REQ007",
    module: "Document Checklist Generator",
    severity: "Medium",
    priority: "High",
    status: "In Fix",
    owner: "Trade Product Owner",
    raisedDate: "2026-02-07",
    targetFixDate: "2026-02-16",
    businessImpact: "Incomplete product mapping may produce an inconsistent Bank Guarantee documentation package.",
    rootCause: "Counter-indemnity ownership and supporting document rules were not signed off during refinement.",
    resolution: "Product owner is validating the final mapping against the approved mock requirement set.",
    retestEvidence: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    updatedAt: "2026-02-12T03:10:00.000Z"
  },
  {
    id: "DEF-027",
    title: "Waiver submission blocker message is unclear",
    linkedTestCaseId: "TC010",
    requirementId: "REQ002",
    module: "Document Checklist Generator",
    severity: "Critical",
    priority: "High",
    status: "Retest Failed",
    owner: "Credit Workflow Lead",
    raisedDate: "2026-02-10",
    targetFixDate: "2026-02-14",
    businessImpact: "A user may misunderstand the control and attempt to progress without independent waiver approval.",
    rootCause: "Validation message described the missing document but did not state the approval prerequisite.",
    resolution: "Added explicit waiver approval, maker-checker, and submission-block language to the control message.",
    retestEvidence: "Retest on build R2.4.6 still allowed an ambiguous message when waiver reason was blank.",
    riskAcceptanceStatus: "Pending",
    riskAcceptanceReason: "Temporary operational review proposed until the corrected build passes regression.",
    riskAcceptedBy: "",
    updatedAt: "2026-02-12T09:45:00.000Z"
  },
  {
    id: "DEF-034",
    title: "Dashboard SLA aging threshold not finalised",
    linkedTestCaseId: "TC014",
    requirementId: "REQ020",
    module: "Executive Dashboard",
    severity: "Medium",
    priority: "High",
    status: "Open",
    owner: "Credit Operations Product Owner",
    raisedDate: "2026-02-13",
    targetFixDate: "2026-02-18",
    businessImpact: "Operational users may see incorrect watch or breach classification for aged credit cases.",
    rootCause: "The final SLA threshold was not approved before UAT execution.",
    resolution: "",
    retestEvidence: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    updatedAt: "2026-02-13T05:30:00.000Z"
  }
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readDefects(): DefectRecord[] {
  if (!canUseStorage()) {
    return seedDefects;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDefects));
    return seedDefects;
  }

  try {
    const parsed = JSON.parse(stored) as DefectRecord[];
    return Array.isArray(parsed) ? parsed : seedDefects;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDefects));
    return seedDefects;
  }
}

export function writeDefects(defects: DefectRecord[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defects));
  }
}

export function resetDefects() {
  writeDefects(seedDefects);
  return seedDefects;
}

function nextDefectId(defects: DefectRecord[]) {
  const highest = defects.reduce((current, defect) => {
    const sequence = Number(defect.id.replace("DEF-", ""));
    return Number.isFinite(sequence) ? Math.max(current, sequence) : current;
  }, 0);
  return `DEF-${String(highest + 1).padStart(3, "0")}`;
}

export function createDefectFromTestCase(testCase: UatTestCase, defects: DefectRecord[]) {
  const timestamp = new Date().toISOString();
  const severity: DefectSeverity = testCase.priority === "High" ? "High" : testCase.priority === "Medium" ? "Medium" : "Low";
  const reservedId = testCase.defectId && !defects.some((defect) => defect.id === testCase.defectId)
    ? testCase.defectId
    : nextDefectId(defects);
  const defect: DefectRecord = {
    id: reservedId,
    title: `UAT failure: ${testCase.scenario}`,
    linkedTestCaseId: testCase.id,
    requirementId: testCase.requirementId,
    module: testCase.module,
    severity,
    priority: testCase.priority,
    status: "Open",
    owner: "Technology Delivery Lead",
    raisedDate: timestamp.slice(0, 10),
    targetFixDate: "",
    businessImpact: testCase.expectedResult,
    rootCause: "Pending defect triage.",
    resolution: "",
    retestEvidence: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    updatedAt: timestamp
  };
  const updated = [defect, ...defects];
  writeDefects(updated);
  return { defect, updated };
}

export function retestStatusFromDefect(defect?: DefectRecord): RetestStatus {
  if (!defect) {
    return "Not Required";
  }
  if (defect.status === "Closed") {
    return "Retest Passed";
  }
  if (defect.status === "Retest Failed") {
    return "Retest Failed";
  }
  return "Pending Retest";
}

export function assessDefectRelease(defects: DefectRecord[]) {
  const unresolved = defects.filter((defect) => !["Closed", "Risk Accepted"].includes(defect.status));
  const accepted = defects.filter((defect) => defect.status === "Risk Accepted" && defect.riskAcceptanceStatus === "Approved");
  const criticalOpen = unresolved.filter((defect) => defect.severity === "Critical");
  const highOpen = unresolved.filter((defect) => defect.severity === "High");
  const mediumLowOpen = unresolved.filter((defect) => defect.severity === "Medium" || defect.severity === "Low");
  const pendingRetest = unresolved.filter((defect) => defect.status === "Ready for Retest" || defect.status === "Retest Failed");
  const status = criticalOpen.length > 0 || highOpen.length > 0
    ? "Block" as const
    : mediumLowOpen.length > 0 || accepted.length > 0
      ? "Watch" as const
      : "Pass" as const;

  const evidence = status === "Block"
    ? `${criticalOpen.length} critical and ${highOpen.length} high defects remain unresolved; ${pendingRetest.length} await successful retest.`
    : status === "Watch"
      ? `${mediumLowOpen.length} medium/low defects remain open and ${accepted.length} defects have approved risk acceptance.`
      : "All defects are closed with successful retest evidence; no residual UAT defect blocks release.";

  return {
    status,
    evidence,
    criticalOpen,
    highOpen,
    mediumLowOpen,
    pendingRetest,
    accepted,
    unresolved
  };
}
