import type { ApprovalRouteResult, ApprovalRoutingInput, ApprovalTier } from "@/lib/types";

export const defaultApprovalInput: ApprovalRoutingInput = {
  applicationType: "New",
  facilityType: "Term Loan",
  customerSegment: "Mid-Market",
  totalExposure: 2_500_000,
  riskLevel: "Medium",
  collateralCoverage: "Partially Secured",
  exceptionSeverity: "Major"
};

function exposureScore(exposure: number) {
  if (exposure >= 10_000_000) {
    return 5;
  }
  if (exposure >= 5_000_000) {
    return 4;
  }
  if (exposure >= 1_000_000) {
    return 3;
  }
  if (exposure >= 250_000) {
    return 2;
  }
  return 1;
}

function tierFromScore(score: number): ApprovalTier {
  if (score >= 10) {
    return "Group Credit Committee";
  }
  if (score >= 7) {
    return "Country Credit Committee";
  }
  if (score >= 4) {
    return "Regional Credit Manager";
  }
  return "Credit Analyst Review";
}

function slaFromTier(tier: ApprovalTier) {
  return {
    "Credit Analyst Review": 2,
    "Regional Credit Manager": 4,
    "Country Credit Committee": 7,
    "Group Credit Committee": 10
  }[tier];
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    currency: "MYR",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}

export function generateApprovalRoute(input: ApprovalRoutingInput): ApprovalRouteResult {
  const scoreParts = [
    exposureScore(input.totalExposure),
    { Low: 0, Medium: 1, High: 3 }[input.riskLevel],
    { "Fully Secured": 0, "Partially Secured": 1, Unsecured: 3 }[input.collateralCoverage],
    { None: 0, Minor: 1, Major: 3, Critical: 5 }[input.exceptionSeverity],
    { New: 1, Renewal: 0, Enhancement: 1 }[input.applicationType],
    { SME: 0, "Mid-Market": 1, "Large Corporate": 2 }[input.customerSegment]
  ];

  const score = scoreParts.reduce((total, item) => total + item, 0);
  const tier = tierFromScore(score);
  const makerCheckerRequired = input.exceptionSeverity !== "None" || input.collateralCoverage === "Unsecured";

  const rationale = [
    `${formatCurrency(input.totalExposure)} total exposure places the case in score band ${exposureScore(input.totalExposure)}.`,
    `${input.riskLevel} risk and ${input.collateralCoverage.toLowerCase()} collateral influence approval authority.`,
    `${input.applicationType} ${input.facilityType} for ${input.customerSegment} segment requires ${tier}.`
  ];

  if (input.exceptionSeverity !== "None") {
    rationale.push(`${input.exceptionSeverity} policy exception requires visible mitigation and approval evidence.`);
  }

  const requiredControls = [
    "Approval route must be displayed before submission to Credit Review.",
    "Approval override requires reason code, authorized role, and audit trail.",
    "Final decision must record approver, timestamp, decision reason, and approval conditions."
  ];

  if (makerCheckerRequired) {
    requiredControls.push("Maker-checker control is required because the case includes exception or unsecured exposure.");
  }

  if (input.riskLevel === "High") {
    requiredControls.push("Enhanced due diligence status must be visible to Credit Analyst and Approver.");
  }

  const escalationTriggers = [
    "Exposure amount changes after Credit Analyst recommendation.",
    "Risk level is upgraded during review.",
    "New policy exception is added after approval route generation."
  ];

  if (input.exceptionSeverity === "Critical") {
    escalationTriggers.push("Critical exception should escalate directly to committee review.");
  }

  return {
    tier,
    score,
    slaDays: slaFromTier(tier),
    makerCheckerRequired,
    rationale,
    requiredControls,
    escalationTriggers
  };
}
