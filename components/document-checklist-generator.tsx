"use client";

import { AlertTriangle, CheckCircle2, Download, FileText, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { defaultChecklistInput, generateChecklist } from "@/lib/checklist-rules";
import type {
  ApplicationType,
  ChecklistInput,
  CollateralType,
  CustomerType,
  DocumentSlaStatus,
  DocumentStatus,
  DocumentCategory,
  FacilityType,
  FinancialStatementStatus,
  RequirementLevel,
  RiskLevel,
  UatRole,
  WaiverApprovalStatus
} from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

const applicationTypes: ApplicationType[] = ["New", "Renewal", "Enhancement"];
const facilityTypes: FacilityType[] = ["Term Loan", "Overdraft", "Trade Line", "Bank Guarantee"];
const collateralTypes: CollateralType[] = [
  "Property",
  "Cash Deposit",
  "Fixed Deposit",
  "Corporate Guarantee",
  "Personal Guarantee",
  "Debenture",
  "Unsecured"
];
const customerTypes: CustomerType[] = ["Individual", "Sole Proprietor", "Partnership", "SME Company", "Corporate"];
const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];
const financialStatuses: FinancialStatementStatus[] = ["Available", "Not Available", "Waiver Requested"];
const documentStatuses: DocumentStatus[] = ["Not Uploaded", "Uploaded", "Verified", "Waived", "Not Applicable"];
const workflowRoles: UatRole[] = ["RM", "Credit Analyst", "Approver", "Credit Admin", "System Admin"];
const categories: Array<DocumentCategory | "All"> = [
  "All",
  "General",
  "Financial",
  "Facility",
  "Collateral",
  "Compliance / Control"
];

type DocumentReviewState = {
  status: DocumentStatus;
  waiverReason: string;
  waiverStatus: WaiverApprovalStatus;
  waiverMakerRole: UatRole;
  waiverApproverRole: UatRole;
  waiverDecisionNote: string;
  agingDays: number;
};

const defaultDocumentReviewState: DocumentReviewState = {
  status: "Not Uploaded",
  waiverReason: "",
  waiverStatus: "Not Requested",
  waiverMakerRole: "RM",
  waiverApproverRole: "Approver",
  waiverDecisionNote: "",
  agingDays: 0
};

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select className="control" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function requirementTone(level: RequirementLevel) {
  if (level === "Required") {
    return "danger";
  }
  if (level === "Conditional") {
    return "warning";
  }
  return "default";
}

function statusTone(status: DocumentStatus) {
  if (status === "Verified" || status === "Not Applicable") {
    return "success";
  }
  if (status === "Uploaded" || status === "Waived") {
    return "warning";
  }
  return "danger";
}

function waiverTone(status: WaiverApprovalStatus) {
  if (status === "Approved") {
    return "success";
  }
  if (status === "Pending Approval" || status === "Draft") {
    return "warning";
  }
  if (status === "Rejected") {
    return "danger";
  }
  return "default";
}

function slaTone(status: DocumentSlaStatus) {
  if (status === "Breach") {
    return "danger";
  }
  if (status === "Watch") {
    return "warning";
  }
  return "success";
}

function isSubmissionReadyStatus(status: DocumentStatus) {
  return status === "Uploaded" || status === "Verified" || status === "Waived" || status === "Not Applicable";
}

function isWaiverMakerCheckerClear(reviewState: DocumentReviewState) {
  return reviewState.waiverMakerRole !== reviewState.waiverApproverRole;
}

function isWaiverComplete(reviewState: DocumentReviewState) {
  if (reviewState.status !== "Waived") {
    return true;
  }

  return (
    reviewState.waiverReason.trim().length > 0 &&
    reviewState.waiverStatus === "Approved" &&
    isWaiverMakerCheckerClear(reviewState)
  );
}

function getSlaStatus(requirementLevel: RequirementLevel, reviewState: DocumentReviewState): DocumentSlaStatus {
  if (reviewState.status === "Verified" || reviewState.status === "Not Applicable") {
    return "On Track";
  }

  if (reviewState.status === "Waived") {
    if (reviewState.waiverStatus === "Approved") {
      return "On Track";
    }
    if (reviewState.agingDays >= 3) {
      return "Breach";
    }
    if (reviewState.agingDays >= 2) {
      return "Watch";
    }
    return "On Track";
  }

  if (reviewState.status === "Uploaded") {
    if (reviewState.agingDays >= 4) {
      return "Breach";
    }
    if (reviewState.agingDays >= 2) {
      return "Watch";
    }
    return "On Track";
  }

  if (requirementLevel === "Required") {
    if (reviewState.agingDays >= 5) {
      return "Breach";
    }
    if (reviewState.agingDays >= 3) {
      return "Watch";
    }
  }

  if (requirementLevel === "Conditional" && reviewState.agingDays >= 7) {
    return "Watch";
  }

  return "On Track";
}

export function DocumentChecklistGenerator() {
  const [input, setInput] = useState<ChecklistInput>(defaultChecklistInput);
  const [category, setCategory] = useState<DocumentCategory | "All">("All");
  const [documentReview, setDocumentReview] = useState<Record<string, DocumentReviewState>>({});

  const result = useMemo(() => generateChecklist(input), [input]);
  const filteredDocuments = result.documents.filter((document) => category === "All" || document.category === category);
  const requiredCount = result.documents.filter((document) => document.requirementLevel === "Required").length;
  const conditionalCount = result.documents.filter((document) => document.requirementLevel === "Conditional").length;
  const optionalCount = result.documents.filter((document) => document.requirementLevel === "Optional").length;
  const requiredDocuments = result.documents.filter((document) => document.requirementLevel === "Required");

  const getReviewState = (documentId: string) => documentReview[documentId] ?? defaultDocumentReviewState;
  const reviewedDocuments = result.documents.map((document) => {
    const reviewState = getReviewState(document.id);
    const slaStatus = getSlaStatus(document.requirementLevel, reviewState);
    return { document, reviewState, slaStatus };
  });
  const readyRequiredDocuments = requiredDocuments.filter((document) => {
    const reviewState = getReviewState(document.id);
    return isSubmissionReadyStatus(reviewState.status) && isWaiverComplete(reviewState);
  });
  const missingRequiredDocuments = requiredDocuments.filter((document) => getReviewState(document.id).status === "Not Uploaded");
  const incompleteWaiverDocuments = result.documents.filter((document) => {
    const reviewState = getReviewState(document.id);
    return reviewState.status === "Waived" && reviewState.waiverReason.trim().length === 0;
  });
  const pendingWaiverDocuments = result.documents.filter((document) => {
    const reviewState = getReviewState(document.id);
    return (
      reviewState.status === "Waived" &&
      reviewState.waiverReason.trim().length > 0 &&
      ["Not Requested", "Draft", "Pending Approval"].includes(reviewState.waiverStatus)
    );
  });
  const rejectedWaiverDocuments = result.documents.filter((document) => {
    const reviewState = getReviewState(document.id);
    return reviewState.status === "Waived" && reviewState.waiverStatus === "Rejected";
  });
  const makerCheckerWaiverDocuments = result.documents.filter((document) => {
    const reviewState = getReviewState(document.id);
    return reviewState.status === "Waived" && !isWaiverMakerCheckerClear(reviewState);
  });
  const approvedWaiverDocuments = result.documents.filter((document) => {
    const reviewState = getReviewState(document.id);
    return reviewState.status === "Waived" && reviewState.waiverStatus === "Approved";
  });
  const slaWatchDocuments = reviewedDocuments.filter((item) => item.slaStatus === "Watch");
  const slaBreachDocuments = reviewedDocuments.filter((item) => item.slaStatus === "Breach");
  const submissionBlockers = [
    ...missingRequiredDocuments.map((document) => `${document.name} is still Not Uploaded.`),
    ...incompleteWaiverDocuments.map((document) => `${document.name} is Waived but missing waiver reason.`),
    ...pendingWaiverDocuments.map((document) => `${document.name} waiver is not approved yet.`),
    ...rejectedWaiverDocuments.map((document) => `${document.name} waiver was rejected.`),
    ...makerCheckerWaiverDocuments.map((document) => `${document.name} waiver maker and approver cannot be the same role.`)
  ];
  const readinessPercentage = requiredCount === 0 ? 100 : Math.round((readyRequiredDocuments.length / requiredCount) * 100);
  const waiverCount = result.documents.filter((document) => getReviewState(document.id).status === "Waived").length;
  const verifiedCount = result.documents.filter((document) => getReviewState(document.id).status === "Verified").length;
  const uploadedCount = result.documents.filter((document) => getReviewState(document.id).status === "Uploaded").length;
  const canSubmit = submissionBlockers.length === 0;
  const packagePosture = !canSubmit
    ? "Blocked"
    : slaBreachDocuments.length > 0 || slaWatchDocuments.length > 0
      ? "Controlled Watch"
      : "Ready";
  const baRecommendation =
    packagePosture === "Blocked"
      ? "Do not submit. Resolve missing documents, waiver approvals, and maker-checker blockers before moving to Credit Review."
      : packagePosture === "Controlled Watch"
        ? "Submission may proceed with documented operations follow-up for SLA watch or breach items."
        : "Proceed to submission. Required document readiness and waiver controls are clear.";

  const updateInput = <K extends keyof ChecklistInput>(key: K, value: ChecklistInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const updateDocumentReview = (documentId: string, patch: Partial<DocumentReviewState>) => {
    setDocumentReview((current) => {
      const nextState = { ...(current[documentId] ?? defaultDocumentReviewState), ...patch };
      return { ...current, [documentId]: nextState };
    });
  };

  const updateDocumentStatus = (documentId: string, status: DocumentStatus) => {
    setDocumentReview((current) => {
      const currentState = current[documentId] ?? defaultDocumentReviewState;
      const nextState: DocumentReviewState =
        status === "Waived"
          ? {
              ...currentState,
              status,
              waiverStatus: currentState.waiverStatus === "Not Requested" ? "Draft" : currentState.waiverStatus
            }
          : {
              ...currentState,
              status,
              waiverReason: "",
              waiverStatus: "Not Requested",
              waiverDecisionNote: ""
            };

      return { ...current, [documentId]: nextState };
    });
  };

  const submitWaiverRequest = (documentId: string) => {
    const document = result.documents.find((item) => item.id === documentId);
    const reviewState = getReviewState(documentId);
    const hasReason = reviewState.waiverReason.trim().length > 0;
    const makerCheckerClear = isWaiverMakerCheckerClear(reviewState);

    updateDocumentReview(documentId, {
      status: "Waived",
      waiverStatus: hasReason && makerCheckerClear ? "Pending Approval" : "Draft",
      waiverDecisionNote: hasReason
        ? makerCheckerClear
          ? "Waiver request submitted for independent approval."
          : "Submission blocked because maker and approver are the same role."
        : "Waiver reason is required before approval routing."
    });

    recordAuditEvent({
      actor: reviewState.waiverMakerRole,
      action: "Waiver request reviewed",
      module: "Document Checklist",
      referenceId: document?.id ?? documentId,
      details: `${document?.name ?? documentId} waiver ${hasReason && makerCheckerClear ? "submitted for approval" : "kept in draft due to control blocker"}.`,
      controlImpact: hasReason && makerCheckerClear ? "Medium" : "High"
    });
  };

  const approveWaiver = (documentId: string) => {
    const document = result.documents.find((item) => item.id === documentId);
    const reviewState = getReviewState(documentId);
    const canApprove =
      reviewState.waiverReason.trim().length > 0 &&
      reviewState.waiverStatus === "Pending Approval" &&
      isWaiverMakerCheckerClear(reviewState);

    updateDocumentReview(documentId, {
      waiverStatus: canApprove ? "Approved" : reviewState.waiverStatus,
      waiverDecisionNote: canApprove
        ? "Waiver approved with maker-checker control."
        : "Approval blocked until waiver is pending, justified, and maker-checker clear."
    });

    recordAuditEvent({
      actor: reviewState.waiverApproverRole,
      action: canApprove ? "Waiver approved" : "Waiver approval blocked",
      module: "Document Checklist",
      referenceId: document?.id ?? documentId,
      details: `${document?.name ?? documentId} waiver ${canApprove ? "approved" : "was not approved because control criteria were not met"}.`,
      controlImpact: canApprove ? "Medium" : "High"
    });
  };

  const rejectWaiver = (documentId: string) => {
    const document = result.documents.find((item) => item.id === documentId);
    const reviewState = getReviewState(documentId);

    updateDocumentReview(documentId, {
      waiverStatus: "Rejected",
      waiverDecisionNote: "Waiver rejected. Required evidence must be uploaded or a new justification must be submitted."
    });

    recordAuditEvent({
      actor: reviewState.waiverApproverRole,
      action: "Waiver rejected",
      module: "Document Checklist",
      referenceId: document?.id ?? documentId,
      details: `${document?.name ?? documentId} waiver was rejected by ${reviewState.waiverApproverRole}.`,
      controlImpact: "High"
    });
  };

  const markRequiredUploaded = () => {
    setDocumentReview((current) => {
      const next = { ...current };
      requiredDocuments.forEach((document) => {
        const currentState = next[document.id] ?? defaultDocumentReviewState;
        next[document.id] = {
          ...currentState,
          status: currentState.status === "Not Uploaded" ? "Uploaded" : currentState.status
        };
      });
      return next;
    });
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Required documents marked uploaded",
      module: "Document Checklist",
      referenceId: `${input.applicationType} ${input.facilityType}`,
      details: `Marked missing required checklist items as Uploaded for ${input.applicationType}, ${input.facilityType}, ${input.collateralType}.`,
      controlImpact: "Medium"
    });
  };

  const clearDocumentStatuses = () => {
    setDocumentReview({});
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Checklist statuses cleared",
      module: "Document Checklist",
      referenceId: `${input.applicationType} ${input.facilityType}`,
      details: "Cleared document status review state and returned the submission gate to default blockers.",
      controlImpact: "Low"
    });
  };

  const exportPackageSummary = () => {
    downloadCsv(
      "credit-submission-package-summary.csv",
      toCsv([
        { metric: "Application Type", value: input.applicationType },
        { metric: "Facility Type", value: input.facilityType },
        { metric: "Collateral Type", value: input.collateralType },
        { metric: "Customer Type", value: input.customerType },
        { metric: "Risk Level", value: input.riskLevel },
        { metric: "Financial Statement", value: input.financialStatementStatus },
        { metric: "Package Posture", value: packagePosture },
        { metric: "Required Readiness", value: `${readinessPercentage}%` },
        { metric: "Submission Blockers", value: submissionBlockers.length },
        { metric: "Approved Waivers", value: approvedWaiverDocuments.length },
        { metric: "Pending Waivers", value: pendingWaiverDocuments.length },
        { metric: "Rejected Waivers", value: rejectedWaiverDocuments.length },
        { metric: "SLA Watch Items", value: slaWatchDocuments.length },
        { metric: "SLA Breach Items", value: slaBreachDocuments.length },
        { metric: "BA Recommendation", value: baRecommendation }
      ])
    );
    recordAuditEvent({
      actor: "BA Reviewer",
      action: "Package summary exported",
      module: "Document Checklist",
      referenceId: `${input.applicationType} ${input.facilityType}`,
      details: `Exported package summary with posture ${packagePosture}, ${submissionBlockers.length} blockers, and ${slaBreachDocuments.length} SLA breaches.`,
      controlImpact: packagePosture === "Blocked" ? "High" : "Medium"
    });
  };

  const exportChecklist = () => {
    downloadCsv(
      "document-checklist-readiness.csv",
      toCsv(
        result.documents.map((document) => {
          const reviewState = getReviewState(document.id);
          return {
            id: document.id,
            name: document.name,
            category: document.category,
            requirementLevel: document.requirementLevel,
            status: reviewState.status,
            agingDays: reviewState.agingDays,
            slaStatus: getSlaStatus(document.requirementLevel, reviewState),
            waiverReason: reviewState.waiverReason,
            waiverStatus: reviewState.waiverStatus,
            waiverMakerRole: reviewState.waiverMakerRole,
            waiverApproverRole: reviewState.waiverApproverRole,
            waiverDecisionNote: reviewState.waiverDecisionNote,
            submissionBlocking:
              document.requirementLevel === "Required" &&
              (!isSubmissionReadyStatus(reviewState.status) || !isWaiverComplete(reviewState))
                ? "Yes"
                : "No",
            businessRuleId: document.businessRuleId,
            reason: document.reason
          };
        })
      )
    );
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Checklist exported",
      module: "Document Checklist",
      referenceId: `${input.applicationType} ${input.facilityType}`,
      details: `Exported ${result.documents.length} documents for ${input.applicationType}, ${input.facilityType}, ${input.collateralType}, ${input.riskLevel} risk.`,
      controlImpact: result.warnings.length > 0 ? "High" : "Medium"
    });
  };

  const resetChecklist = () => {
    setInput(defaultChecklistInput);
    setCategory("All");
    setDocumentReview({});
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Checklist inputs reset",
      module: "Document Checklist",
      referenceId: "DEFAULT",
      details: "Checklist inputs were reset to the default New Term Loan with Property collateral scenario.",
      controlImpact: "Low"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Documents" value={result.documents.length} helper="Generated by rule engine" />
        <StatCard label="Required" value={requiredCount} tone="danger" helper="Submission control items" />
        <StatCard label="Conditional" value={conditionalCount} tone="warning" helper="Depends on case context" />
        <StatCard label="Optional" value={optionalCount} helper="Supporting evidence" />
        <StatCard label="Readiness" value={`${readinessPercentage}%`} tone={canSubmit ? "success" : "warning"} helper={`${readyRequiredDocuments.length}/${requiredCount} required ready`} />
        <StatCard label="Blockers" value={submissionBlockers.length} tone={canSubmit ? "success" : "danger"} helper="Submission gate" />
        <StatCard label="Open Waivers" value={pendingWaiverDocuments.length} tone={pendingWaiverDocuments.length > 0 ? "warning" : "success"} helper={`${approvedWaiverDocuments.length} approved`} />
        <StatCard label="SLA Breach" value={slaBreachDocuments.length} tone={slaBreachDocuments.length > 0 ? "danger" : "success"} helper={`${slaWatchDocuments.length} watch items`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Application Inputs</h2>
                <p className="mt-1 text-sm text-muted-foreground">The output changes when business context changes.</p>
              </div>
              <Button onClick={resetChecklist} variant="ghost">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="mt-5 grid gap-4">
              <SelectField label="Application Type" value={input.applicationType} options={applicationTypes} onChange={(value) => updateInput("applicationType", value)} />
              <SelectField label="Facility Type" value={input.facilityType} options={facilityTypes} onChange={(value) => updateInput("facilityType", value)} />
              <SelectField label="Collateral Type" value={input.collateralType} options={collateralTypes} onChange={(value) => updateInput("collateralType", value)} />
              <SelectField label="Customer Type" value={input.customerType} options={customerTypes} onChange={(value) => updateInput("customerType", value)} />
              <SelectField label="Risk Level" value={input.riskLevel} options={riskLevels} onChange={(value) => updateInput("riskLevel", value)} />
              <SelectField label="Financial Statement" value={input.financialStatementStatus} options={financialStatuses} onChange={(value) => updateInput("financialStatementStatus", value)} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Submission Gate</h2>
                <p className="mt-1 text-sm text-muted-foreground">Required documents must be uploaded, verified, waived, or not applicable.</p>
              </div>
              <Badge tone={canSubmit ? "success" : "danger"}>{canSubmit ? "Ready" : "Blocked"}</Badge>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">Required readiness</span>
                <span className="text-muted-foreground">{readinessPercentage}%</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={readinessPercentage} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Uploaded</p>
                <p className="mt-1 text-lg font-semibold">{uploadedCount}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Verified</p>
                <p className="mt-1 text-lg font-semibold">{verifiedCount}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Waived</p>
                <p className="mt-1 text-lg font-semibold">{waiverCount}</p>
              </div>
            </div>

            {submissionBlockers.length > 0 ? (
              <div className="mt-5 rounded-lg border border-danger/20 bg-danger/10 p-4">
                <p className="text-sm font-semibold text-danger">Open blockers</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {submissionBlockers.slice(0, 4).map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                  {submissionBlockers.length > 4 ? <li>{submissionBlockers.length - 4} more blockers.</li> : null}
                </ul>
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-success/20 bg-success/10 p-4 text-sm text-success">
                Required document gate is clear for submission.
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={markRequiredUploaded} variant="secondary">
                <CheckCircle2 className="h-4 w-4" />
                Mark Required Uploaded
              </Button>
              <Button onClick={clearDocumentStatuses} variant="ghost">
                Clear Statuses
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Package Summary</h2>
                <p className="mt-1 text-sm text-muted-foreground">Credit submission pack posture and BA recommendation.</p>
              </div>
              <Badge tone={packagePosture === "Ready" ? "success" : packagePosture === "Controlled Watch" ? "warning" : "danger"}>
                {packagePosture}
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              {[
                ["Application", `${input.applicationType} ${input.facilityType}`],
                ["Collateral", input.collateralType],
                ["Risk", `${input.riskLevel} risk`],
                ["Waivers", `${approvedWaiverDocuments.length} approved / ${pendingWaiverDocuments.length} open / ${rejectedWaiverDocuments.length} rejected`],
                ["SLA", `${slaBreachDocuments.length} breach / ${slaWatchDocuments.length} watch`]
              ].map(([label, value]) => (
                <div className="flex items-start justify-between gap-4 rounded-lg border p-3" key={label}>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-semibold">BA Recommendation</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{baRecommendation}</p>
            </div>

            <div className="mt-5">
              <Button onClick={exportPackageSummary} variant="secondary">
                <FileText className="h-4 w-4" />
                Export Summary
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {result.warnings.length > 0 ? (
            <Card className="border-warning/40 bg-warning/10">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 text-warning-foreground dark:text-warning" />
                <div>
                  <h2 className="font-semibold">Risk Warning</h2>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {result.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}

          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Waiver Approval Queue</h2>
                <p className="mt-1 text-sm text-muted-foreground">Maker-checker workflow for documents marked as waived.</p>
              </div>
              <Badge tone={pendingWaiverDocuments.length > 0 ? "warning" : waiverCount > 0 ? "success" : "default"}>
                {waiverCount} waivers
              </Badge>
            </div>

            <div className="mt-5 grid gap-3">
              {reviewedDocuments.filter((item) => item.reviewState.status === "Waived").length === 0 ? (
                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  No waiver requests yet. Set a document status to Waived to simulate approval governance.
                </div>
              ) : (
                reviewedDocuments
                  .filter((item) => item.reviewState.status === "Waived")
                  .map(({ document, reviewState }) => (
                    <div className="rounded-lg border p-4" key={document.id}>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-semibold">{document.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{document.businessRuleId} / {document.requirementLevel}</p>
                        </div>
                        <Badge tone={waiverTone(reviewState.waiverStatus)}>{reviewState.waiverStatus}</Badge>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <label className="grid gap-2 text-sm font-medium">
                          Maker Role
                          <select
                            className="control"
                            value={reviewState.waiverMakerRole}
                            onChange={(event) => updateDocumentReview(document.id, { waiverMakerRole: event.target.value as UatRole })}
                          >
                            {workflowRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                          Approver Role
                          <select
                            className="control"
                            value={reviewState.waiverApproverRole}
                            onChange={(event) => updateDocumentReview(document.id, { waiverApproverRole: event.target.value as UatRole })}
                          >
                            {workflowRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="grid gap-2 text-sm font-medium">
                          Approval Status
                          <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3">
                            <Badge tone={waiverTone(reviewState.waiverStatus)}>{reviewState.waiverStatus}</Badge>
                          </div>
                        </div>
                      </div>

                      {!isWaiverMakerCheckerClear(reviewState) ? (
                        <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-danger">
                          Maker-checker breach: maker and approver cannot be the same role.
                        </div>
                      ) : null}

                      {reviewState.waiverDecisionNote ? (
                        <p className="mt-4 rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                          {reviewState.waiverDecisionNote}
                        </p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => submitWaiverRequest(document.id)} variant="secondary">
                          <ShieldCheck className="h-4 w-4" />
                          Submit Request
                        </Button>
                        <Button onClick={() => approveWaiver(document.id)} variant="secondary">
                          Approve
                        </Button>
                        <Button onClick={() => rejectWaiver(document.id)} variant="ghost">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Generated Checklist</h2>
                <p className="mt-1 text-sm text-muted-foreground">Documents are grouped by category with status, waiver evidence, and rule rationale.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select className="control" value={category} onChange={(event) => setCategory(event.target.value as DocumentCategory | "All")}>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Button onClick={exportChecklist} variant="secondary">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[1480px] border-collapse text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="px-4 py-3 text-left">Document</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Level</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Aging</th>
                    <th className="px-4 py-3 text-left">SLA</th>
                    <th className="px-4 py-3 text-left">Waiver Reason</th>
                    <th className="px-4 py-3 text-left">Rule</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => {
                    const reviewState = getReviewState(document.id);
                    const slaStatus = getSlaStatus(document.requirementLevel, reviewState);
                    return (
                      <tr className="border-t align-top" key={document.id}>
                        <td className="px-4 py-3 font-medium">{document.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{document.category}</td>
                        <td className="px-4 py-3">
                          <Badge tone={requirementTone(document.requirementLevel)}>{document.requirementLevel}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="grid gap-2">
                            <select
                              className="control min-w-[160px]"
                              value={reviewState.status}
                              onChange={(event) => updateDocumentStatus(document.id, event.target.value as DocumentStatus)}
                            >
                              {documentStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <Badge tone={statusTone(reviewState.status)}>{reviewState.status}</Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="control w-24"
                            min={0}
                            onChange={(event) => updateDocumentReview(document.id, { agingDays: Number(event.target.value) })}
                            type="number"
                            value={reviewState.agingDays}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={slaTone(slaStatus)}>{slaStatus}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {reviewState.status === "Waived" ? (
                            <input
                              className="control min-w-[220px]"
                              onChange={(event) => updateDocumentReview(document.id, { waiverReason: event.target.value })}
                              placeholder="Required for waived item"
                              value={reviewState.waiverReason}
                            />
                          ) : (
                            <span className="text-muted-foreground">Not required</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{document.businessRuleId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{document.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Triggered Business Rules</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {result.triggeredRules.map((item) => (
                <div className="rounded-lg border p-4" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{item.id}</h3>
                    <Badge tone="info">{item.controlPoint}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
