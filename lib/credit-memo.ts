import { formatCurrency } from "@/lib/approval-routing";
import type {
  CreditCase360,
  CreditMemoProfile,
  CreditMemoSection,
  EvidenceConfidence,
  MemoApprovalStatus,
  MemoSectionStatus,
  PolicyException
} from "@/lib/types";

function sectionStatus(missingEvidence: string[]): MemoSectionStatus {
  return missingEvidence.length > 0 ? "Needs Evidence" : "Generated";
}

function confidenceFor(missingEvidence: string[], fallback: EvidenceConfidence = "High"): EvidenceConfidence {
  if (missingEvidence.length >= 2) {
    return "Low";
  }
  if (missingEvidence.length === 1) {
    return "Medium";
  }
  return fallback;
}

function sentenceList(items: string[]) {
  return items.join(" ");
}

export function generateCreditMemo(
  caseRecord: CreditCase360,
  profile: CreditMemoProfile,
  exceptions: PolicyException[]
): CreditMemoSection[] {
  const financialEvidence = profile.missingEvidence.filter((item) =>
    /financial|statement|accounts|concentration|receivable/i.test(item)
  );
  const controlEvidence = profile.missingEvidence.filter((item) =>
    /due diligence|exception|waiver|approval/i.test(item)
  );
  const routeEvidence = caseRecord.approvalRouteConfirmed ? [] : ["Final approval route confirmation"];
  const openExceptions = exceptions.filter((item) => item.status !== "Approved");
  const exceptionEvidence = openExceptions.map((item) => `${item.id} ${item.type} approval`);

  return [
    {
      id: "MEMO-01",
      title: "Executive Summary",
      narrative: `${caseRecord.customerName} requests ${formatCurrency(caseRecord.exposure)} through a ${caseRecord.applicationType.toLowerCase()} ${caseRecord.facilityType.toLowerCase()} application. The case is assessed as ${caseRecord.riskLevel.toLowerCase()} risk with a ${caseRecord.collateralCoverage.toLowerCase()} collateral position. ${caseRecord.executiveSummary}`,
      sourceFields: ["Case 360.customerName", "Case 360.exposure", "Case 360.riskLevel", "Case 360.executiveSummary"],
      businessRuleIds: ["BR013", "BR015"],
      confidence: confidenceFor([...controlEvidence, ...routeEvidence]),
      missingEvidence: [...controlEvidence, ...routeEvidence],
      status: sectionStatus([...controlEvidence, ...routeEvidence])
    },
    {
      id: "MEMO-02",
      title: "Borrower and Relationship Profile",
      narrative: `${caseRecord.customerName} operates in ${profile.industry} and has been in business for ${profile.yearsInBusiness} years. ${profile.relationshipHistory}`,
      sourceFields: ["Customer Master.customer_name", "KYC.industry", "Customer Master.incorporation_date", "CRM.relationship_history"],
      businessRuleIds: ["BR001", "BR010"],
      confidence: "High",
      missingEvidence: [],
      status: "Generated"
    },
    {
      id: "MEMO-03",
      title: "Facility Request",
      narrative: `The proposed ${caseRecord.facilityType.toLowerCase()} exposure is ${formatCurrency(caseRecord.exposure)} for ${profile.requestedTenor}. The stated purpose is ${profile.facilityPurpose} The primary repayment source is ${profile.primaryRepaymentSource}`,
      sourceFields: ["Loan Origination.facility_type", "Loan Origination.total_exposure_amt", "Application.facility_purpose", "Credit Analysis.repayment_source"],
      businessRuleIds: ["BR003", "BR007", "BR008", "BR009", "BR013"],
      confidence: "High",
      missingEvidence: [],
      status: "Generated"
    },
    {
      id: "MEMO-04",
      title: "Financial Analysis",
      narrative: `For ${profile.financialPeriod}, reported annual revenue is ${formatCurrency(profile.annualRevenue)} and EBITDA is ${formatCurrency(profile.ebitda)}, representing an EBITDA margin of ${((profile.ebitda / profile.annualRevenue) * 100).toFixed(1)}%. Debt service coverage is ${profile.debtServiceCoverageRatio.toFixed(2)}x and leverage is ${profile.leverageRatio.toFixed(2)}x. The figures remain subject to the evidence status identified below.`,
      sourceFields: ["Financials.period_end_date", "Financials.annual_revenue", "Financials.ebitda", "Credit Analysis.dscr", "Credit Analysis.leverage"],
      businessRuleIds: ["BR002", "BR005", "BR007"],
      confidence: confidenceFor(financialEvidence),
      missingEvidence: financialEvidence,
      status: sectionStatus(financialEvidence)
    },
    {
      id: "MEMO-05",
      title: "Key Risks and Mitigants",
      narrative: `Key risks: ${sentenceList(profile.keyRisks)} Proposed mitigants: ${sentenceList(profile.mitigants)}`,
      sourceFields: ["Credit Analysis.key_risks", "Credit Analysis.mitigants", "Case 360.riskLevel", "Exception Register.mitigation"],
      businessRuleIds: ["BR005", "BR006", "BR007", "BR015"],
      confidence: confidenceFor(controlEvidence),
      missingEvidence: controlEvidence,
      status: sectionStatus(controlEvidence)
    },
    {
      id: "MEMO-06",
      title: "Policy Exceptions and Controls",
      narrative: exceptions.length === 0
        ? "No policy exceptions are linked to this sample case. Standard document, approval, and audit controls remain applicable."
        : `The case contains ${exceptions.length} linked policy exception${exceptions.length === 1 ? "" : "s"}. ${exceptions.map((item) => `${item.id} (${item.severity}, ${item.status}) requires ${item.mitigation}`).join(" ")}`,
      sourceFields: ["Exception Register.status", "Exception Register.severity", "Exception Register.mitigation", "Exception Register.approval_tier"],
      businessRuleIds: ["BR005", "BR006", "BR014", "BR015"],
      confidence: confidenceFor(exceptionEvidence),
      missingEvidence: exceptionEvidence,
      status: sectionStatus(exceptionEvidence)
    },
    {
      id: "MEMO-07",
      title: "Conditions and Approval Authority",
      narrative: `Recommended approval authority is ${caseRecord.approvalTier}. ${caseRecord.approvalRouteConfirmed ? "The route is confirmed in the current case record." : "The route remains indicative and must be confirmed before formal submission."} Proposed conditions: ${sentenceList(profile.conditions)}`,
      sourceFields: ["Decision Service.recommended_approval_tier", "Case 360.approvalRouteConfirmed", "Credit Analysis.conditions"],
      businessRuleIds: ["BR013", "BR014"],
      confidence: confidenceFor(routeEvidence),
      missingEvidence: routeEvidence,
      status: sectionStatus(routeEvidence)
    },
    {
      id: "MEMO-08",
      title: "Credit Recommendation",
      narrative: caseRecord.baRecommendation,
      sourceFields: ["Case 360.baRecommendation", "Case 360.readinessGates", "UAT Evidence.status", "Audit Trail.referenceId"],
      businessRuleIds: ["BR013", "BR014", "BR015"],
      confidence: confidenceFor([...profile.missingEvidence, ...routeEvidence]),
      missingEvidence: [...profile.missingEvidence, ...routeEvidence],
      status: sectionStatus([...profile.missingEvidence, ...routeEvidence])
    }
  ];
}

export function calculateMemoEvidenceCoverage(sections: CreditMemoSection[]) {
  const confidenceScore = { High: 100, Medium: 75, Low: 45 };
  const total = sections.reduce((sum, section) => sum + confidenceScore[section.confidence], 0);
  return Math.round(total / sections.length);
}

export function calculateMemoApprovalStatus(
  sections: CreditMemoSection[],
  controlsReady: boolean
): MemoApprovalStatus {
  if (!controlsReady || sections.some((section) => section.status === "Needs Evidence")) {
    return "Blocked";
  }
  if (sections.every((section) => section.status === "Approved")) {
    return "Approved";
  }
  if (sections.some((section) => section.status === "Reviewed")) {
    return "In Review";
  }
  return "Draft";
}

export function redactMemoText(text: string, caseRecord: CreditCase360) {
  return text
    .replaceAll(caseRecord.customerName, "[BORROWER NAME]")
    .replaceAll(caseRecord.relationshipManager, "[RM ID]")
    .replaceAll(caseRecord.creditAnalyst, "[ANALYST ID]");
}
