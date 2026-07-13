import type {
  DefectRecord,
  DefectSeverity,
  RetestStatus,
  UatStatus,
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
    retestTester: "",
    retestDate: "",
    retestBuild: "",
    retestEnvironment: "UAT",
    retestEvidenceReference: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    riskAcceptedByRole: "",
    riskAcceptanceExpiry: "",
    compensatingControl: "",
    monitoringOwner: "",
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
    retestTester: "",
    retestDate: "",
    retestBuild: "",
    retestEnvironment: "UAT",
    retestEvidenceReference: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    riskAcceptedByRole: "",
    riskAcceptanceExpiry: "",
    compensatingControl: "",
    monitoringOwner: "",
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
    retestTester: "UAT Control Tester",
    retestDate: "2026-02-12",
    retestBuild: "R2.4.6",
    retestEnvironment: "UAT",
    retestEvidenceReference: "UAT-EVD-027-R1",
    riskAcceptanceStatus: "Pending",
    riskAcceptanceReason: "Temporary operational review proposed until the corrected build passes regression.",
    riskAcceptedBy: "",
    riskAcceptedByRole: "",
    riskAcceptanceExpiry: "",
    compensatingControl: "Daily manual review of waiver submissions until the validation fix passes regression.",
    monitoringOwner: "Credit Operations Control Lead",
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
    retestTester: "",
    retestDate: "",
    retestBuild: "",
    retestEnvironment: "UAT",
    retestEvidenceReference: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    riskAcceptedByRole: "",
    riskAcceptanceExpiry: "",
    compensatingControl: "",
    monitoringOwner: "",
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
    const parsed = JSON.parse(stored) as Array<Partial<DefectRecord>>;
    if (!Array.isArray(parsed)) {
      return seedDefects;
    }
    const normalized = parsed.map(normalizeDefect);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDefects));
    return seedDefects;
  }
}

function normalizeDefect(defect: Partial<DefectRecord>): DefectRecord {
  return {
    id: defect.id ?? "DEF-UNKNOWN",
    title: defect.title ?? "Untitled defect",
    linkedTestCaseId: defect.linkedTestCaseId ?? "",
    requirementId: defect.requirementId ?? "",
    module: defect.module ?? "Unassigned",
    severity: defect.severity ?? "Medium",
    priority: defect.priority ?? "Medium",
    status: defect.status ?? "Open",
    owner: defect.owner ?? "Technology Delivery Lead",
    raisedDate: defect.raisedDate ?? "",
    targetFixDate: defect.targetFixDate ?? "",
    businessImpact: defect.businessImpact ?? "Pending assessment.",
    rootCause: defect.rootCause ?? "Pending defect triage.",
    resolution: defect.resolution ?? "",
    retestEvidence: defect.retestEvidence ?? "",
    retestTester: defect.retestTester ?? "",
    retestDate: defect.retestDate ?? "",
    retestBuild: defect.retestBuild ?? "",
    retestEnvironment: defect.retestEnvironment ?? "UAT",
    retestEvidenceReference: defect.retestEvidenceReference ?? "",
    riskAcceptanceStatus: defect.riskAcceptanceStatus ?? "Not Required",
    riskAcceptanceReason: defect.riskAcceptanceReason ?? "",
    riskAcceptedBy: defect.riskAcceptedBy ?? "",
    riskAcceptedByRole: defect.riskAcceptedByRole ?? "",
    riskAcceptanceExpiry: defect.riskAcceptanceExpiry ?? "",
    compensatingControl: defect.compensatingControl ?? "",
    monitoringOwner: defect.monitoringOwner ?? "",
    updatedAt: defect.updatedAt ?? new Date().toISOString()
  };
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
    retestTester: "",
    retestDate: "",
    retestBuild: "",
    retestEnvironment: "UAT",
    retestEvidenceReference: "",
    riskAcceptanceStatus: "Not Required",
    riskAcceptanceReason: "",
    riskAcceptedBy: "",
    riskAcceptedByRole: "",
    riskAcceptanceExpiry: "",
    compensatingControl: "",
    monitoringOwner: "",
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

export function isApprovedRiskAccepted(defect?: DefectRecord) {
  return defect?.status === "Risk Accepted" && defect.riskAcceptanceStatus === "Approved";
}

export function assessDefectRelease(defects: DefectRecord[]) {
  const unresolved = defects.filter((defect) => defect.status !== "Closed" && !isApprovedRiskAccepted(defect));
  const accepted = defects.filter(isApprovedRiskAccepted);
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

export function assessUatSignOff(
  testCases: UatTestCase[],
  statusOverrides: Record<string, UatStatus>,
  defects: DefectRecord[]
) {
  const defectAssessment = assessDefectRelease(defects);
  const acceptedCaseIds = new Set(
    defects.filter(isApprovedRiskAccepted).map((defect) => defect.linkedTestCaseId)
  );
  const effectiveCases = testCases.map((testCase) => ({
    ...testCase,
    status: statusOverrides[testCase.id] ?? testCase.status,
    riskAccepted: acceptedCaseIds.has(testCase.id)
  }));
  const blockingCases = effectiveCases.filter((testCase) =>
    !testCase.riskAccepted && (
      (testCase.priority === "High" && testCase.status !== "Passed") ||
      testCase.status === "Failed" ||
      testCase.status === "Blocked"
    )
  );
  const highPriorityOpen = blockingCases.filter((testCase) => testCase.priority === "High");
  const position = defectAssessment.status === "Block" || blockingCases.length > 0
    ? "Block" as const
    : defectAssessment.status === "Watch" || acceptedCaseIds.size > 0
      ? "Watch" as const
      : "Pass" as const;

  return {
    position,
    effectiveCases,
    blockingCases,
    highPriorityOpen,
    acceptedCaseIds,
    defectAssessment
  };
}

export function assessDefectSla(defect: DefectRecord, asOf = new Date()) {
  if (defect.status === "Closed") {
    return { status: "Closed" as const, days: 0, label: "Closed" };
  }
  if (!defect.targetFixDate) {
    return { status: "Not Set" as const, days: 0, label: "Target date required" };
  }

  const target = new Date(`${defect.targetFixDate}T23:59:59.999Z`);
  if (Number.isNaN(target.getTime())) {
    return { status: "Not Set" as const, days: 0, label: "Invalid target date" };
  }

  const differenceDays = Math.ceil((target.getTime() - asOf.getTime()) / 86_400_000);
  if (differenceDays < 0) {
    const overdueDays = Math.abs(differenceDays);
    return { status: "Breach" as const, days: overdueDays, label: `${overdueDays}d overdue` };
  }
  if (differenceDays <= 2) {
    return { status: "Watch" as const, days: differenceDays, label: `${differenceDays}d remaining` };
  }
  return { status: "On Track" as const, days: differenceDays, label: `${differenceDays}d remaining` };
}
