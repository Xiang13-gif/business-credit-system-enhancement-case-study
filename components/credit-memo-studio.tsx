"use client";

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Database,
  Download,
  FileText,
  GitCompareArrows,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/approval-routing";
import { recordAuditEvent } from "@/lib/audit-log";
import {
  calculateMemoApprovalStatus,
  calculateMemoEvidenceCoverage,
  generateCreditMemo,
  redactMemoText
} from "@/lib/credit-memo";
import { creditCase360Records, policyExceptions } from "@/lib/mock-data";
import { creditMemoProfiles } from "@/lib/transformation-data";
import type { CreditMemoSection, MemoSectionStatus } from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

type DraftingMode = "Controlled Template" | "Assisted Draft";

function confidenceTone(confidence: CreditMemoSection["confidence"]) {
  if (confidence === "High") {
    return "success" as const;
  }
  if (confidence === "Medium") {
    return "warning" as const;
  }
  return "danger" as const;
}

function statusTone(status: MemoSectionStatus) {
  if (status === "Approved") {
    return "success" as const;
  }
  if (status === "Reviewed") {
    return "info" as const;
  }
  if (status === "Needs Evidence") {
    return "danger" as const;
  }
  return "default" as const;
}

function approvalTone(status: string) {
  if (status === "Approved") {
    return "success" as const;
  }
  if (status === "In Review") {
    return "warning" as const;
  }
  if (status === "Blocked") {
    return "danger" as const;
  }
  return "default" as const;
}

export function CreditMemoStudio() {
  const [selectedCaseId, setSelectedCaseId] = useState("CASE-1007");
  const [draftingMode, setDraftingMode] = useState<DraftingMode>("Controlled Template");
  const [groundingEnabled, setGroundingEnabled] = useState(true);
  const [humanReviewRequired, setHumanReviewRequired] = useState(true);
  const [publicMaskingEnabled, setPublicMaskingEnabled] = useState(true);
  const [sectionStatuses, setSectionStatuses] = useState<Record<string, MemoSectionStatus>>({});
  const [version, setVersion] = useState(1);
  const [showComparison, setShowComparison] = useState(false);

  const selectedCase = creditCase360Records.find((item) => item.id === selectedCaseId) ?? creditCase360Records[0];
  const profile = creditMemoProfiles.find((item) => item.caseId === selectedCase.id) ?? creditMemoProfiles[0];
  const relatedExceptions = policyExceptions.filter((item) => selectedCase.policyExceptionIds.includes(item.id));
  const generatedSections = useMemo(
    () => generateCreditMemo(selectedCase, profile, relatedExceptions),
    [profile, relatedExceptions, selectedCase]
  );
  const sections = generatedSections.map((section) => ({
    ...section,
    status: sectionStatuses[section.id] ?? section.status
  }));

  const evidenceCoverage = calculateMemoEvidenceCoverage(sections);
  const evidenceBlockers = sections.filter((section) => section.missingEvidence.length > 0);
  const reviewedSections = sections.filter((section) => ["Reviewed", "Approved"].includes(section.status)).length;
  const controlsReady = groundingEnabled && humanReviewRequired && publicMaskingEnabled;
  const approvalStatus = calculateMemoApprovalStatus(sections, controlsReady);
  const canApprove = controlsReady
    && evidenceBlockers.length === 0
    && sections.every((section) => ["Reviewed", "Approved"].includes(section.status));

  const changeCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSectionStatuses({});
    setVersion(1);
    setShowComparison(false);
  };

  const generateDraft = () => {
    setSectionStatuses(Object.fromEntries(generatedSections.map((section) => [section.id, section.status])));
    setVersion((current) => current + 1);
    recordAuditEvent({
      actor: "Credit Analyst",
      action: "Credit memo generated",
      module: "Credit Memo Studio",
      referenceId: selectedCase.id,
      details: `Generated ${draftingMode} v1.${version + 1} with ${evidenceCoverage}% evidence coverage and ${evidenceBlockers.length} evidence blockers.`,
      controlImpact: evidenceBlockers.length > 0 ? "High" : "Medium"
    });
  };

  const markReviewed = (sectionId?: string) => {
    const reviewable = sectionId
      ? sections.filter((section) => section.id === sectionId)
      : sections;
    setSectionStatuses((current) => ({
      ...current,
      ...Object.fromEntries(
        reviewable.map((section) => [
          section.id,
          section.missingEvidence.length > 0 ? "Needs Evidence" : "Reviewed"
        ])
      )
    }));
    recordAuditEvent({
      actor: "Credit Analyst",
      action: "Credit memo evidence reviewed",
      module: "Credit Memo Studio",
      referenceId: sectionId ?? selectedCase.id,
      details: sectionId ? `Reviewed memo section ${sectionId}.` : `Reviewed all evidence-ready sections for ${selectedCase.id}.`,
      controlImpact: "Medium"
    });
  };

  const approveMemo = () => {
    if (!canApprove) {
      return;
    }
    setSectionStatuses(Object.fromEntries(sections.map((section) => [section.id, "Approved"])));
    recordAuditEvent({
      actor: "Approver",
      action: "Credit memo approved",
      module: "Credit Memo Studio",
      referenceId: selectedCase.id,
      details: `Approved controlled credit memo v1.${version} after evidence and human-review gates passed.`,
      controlImpact: "High"
    });
  };

  const exportEvidenceMap = () => {
    downloadCsv(
      `${selectedCase.id.toLowerCase()}-memo-evidence-map.csv`,
      toCsv(sections.map((section) => ({
        sectionId: section.id,
        section: section.title,
        status: section.status,
        confidence: section.confidence,
        sourceFields: section.sourceFields.join("; "),
        businessRules: section.businessRuleIds.join("; "),
        missingEvidence: section.missingEvidence.join("; ") || "None"
      })))
    );
    recordAuditEvent({
      actor: "Credit Analyst",
      action: "Memo evidence map exported",
      module: "Credit Memo Studio",
      referenceId: selectedCase.id,
      details: `Exported ${sections.length} controlled memo sections with source and rule lineage.`,
      controlImpact: "Medium"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Memo Status" value={approvalStatus} tone={approvalStatus === "Approved" ? "success" : approvalStatus === "Blocked" ? "danger" : "warning"} />
        <StatCard label="Evidence Coverage" value={`${evidenceCoverage}%`} tone={evidenceCoverage >= 90 ? "success" : evidenceCoverage >= 70 ? "warning" : "danger"} />
        <StatCard label="Sections Reviewed" value={`${reviewedSections}/${sections.length}`} tone={reviewedSections === sections.length ? "success" : "warning"} />
        <StatCard label="Evidence Blockers" value={evidenceBlockers.length} tone={evidenceBlockers.length > 0 ? "danger" : "success"} />
        <StatCard label="Draft Version" value={`v1.${version}`} helper="Controlled portfolio version" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Draft Configuration</h2>
                <p className="mt-1 text-sm text-muted-foreground">Case, drafting mode, and governance profile.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <label className="grid gap-2 text-sm font-medium">
                Credit case
                <select className="control" value={selectedCaseId} onChange={(event) => changeCase(event.target.value)}>
                  {creditCase360Records.map((item) => (
                    <option key={item.id} value={item.id}>{item.id}: {item.customerName}</option>
                  ))}
                </select>
              </label>

              <div>
                <p className="text-sm font-medium">Drafting mode</p>
                <div className="mt-2 grid grid-cols-2 rounded-md border bg-muted/40 p-1">
                  {(["Controlled Template", "Assisted Draft"] as DraftingMode[]).map((mode) => (
                    <button
                      className={`min-h-9 rounded px-2 text-xs font-semibold transition ${draftingMode === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      key={mode}
                      onClick={() => setDraftingMode(mode)}
                      type="button"
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={generateDraft}>
                <RefreshCw className="h-4 w-4" />
                Generate Controlled Draft
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Responsible AI Gate</h2>
                <p className="mt-1 text-sm text-muted-foreground">Required controls for an approvable draft.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <ControlToggle
                checked={groundingEnabled}
                description="Every narrative section links to source fields and governed rules."
                icon={Database}
                label="Evidence grounding"
                onChange={setGroundingEnabled}
              />
              <ControlToggle
                checked={humanReviewRequired}
                description="Credit Analyst review is mandatory before independent approval."
                icon={UserCheck}
                label="Human review"
                onChange={setHumanReviewRequired}
              />
              <ControlToggle
                checked={publicMaskingEnabled}
                description="Borrower and staff identifiers are masked in the public portfolio view."
                icon={LockKeyhole}
                label="Public data masking"
                onChange={setPublicMaskingEnabled}
              />
            </div>

            <div className="mt-4 grid gap-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              <div className="flex justify-between gap-3"><span>Template</span><span className="font-medium text-foreground">CM-CREDIT-04</span></div>
              <div className="flex justify-between gap-3"><span>Prompt policy</span><span className="font-medium text-foreground">PG-2.1</span></div>
              <div className="flex justify-between gap-3"><span>Fallback</span><span className="font-medium text-foreground">Controlled template</span></div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Section Control</h2>
            <div className="mt-4 space-y-2">
              {sections.map((section) => (
                <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2" key={section.id}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{section.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{section.id}</p>
                  </div>
                  <button
                    aria-label={`Mark ${section.title} reviewed`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={section.missingEvidence.length > 0 || section.status === "Approved"}
                    onClick={() => markReviewed(section.id)}
                    title={section.missingEvidence.length > 0 ? "Resolve evidence before review" : "Mark reviewed"}
                    type="button"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="memo-print-area p-0">
            <div className="border-b px-6 py-5 md:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="info">{selectedCase.id}</Badge>
                    <Badge tone={approvalTone(approvalStatus)}>{approvalStatus}</Badge>
                    <Badge tone={selectedCase.riskLevel === "High" ? "danger" : "warning"}>{selectedCase.riskLevel} Risk</Badge>
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-normal text-muted-foreground">Commercial Credit Submission</p>
                  <h2 className="mt-2 text-2xl font-semibold">Credit Memorandum</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {publicMaskingEnabled ? "[BORROWER NAME]" : selectedCase.customerName} / {selectedCase.applicationType} {selectedCase.facilityType}
                  </p>
                </div>
                <div className="text-left text-sm text-muted-foreground md:text-right">
                  <p className="font-semibold text-foreground">Version 1.{version}</p>
                  <p className="mt-1">Owner: {publicMaskingEnabled ? "[ANALYST ID]" : selectedCase.creditAnalyst}</p>
                  <p className="mt-1">Authority: {selectedCase.approvalTier}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-px border-b bg-border sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Exposure", formatCurrency(selectedCase.exposure)],
                ["Collateral", selectedCase.collateralCoverage],
                ["Document readiness", `${selectedCase.documentReadiness}%`],
                ["Evidence coverage", `${evidenceCoverage}%`]
              ].map(([label, value]) => (
                <div className="bg-card px-6 py-4" key={label}>
                  <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{label}</p>
                  <p className="mt-2 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="px-6 py-2 md:px-8">
              {sections.map((section) => (
                <section className="border-b py-6 last:border-b-0" key={section.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-primary">{section.id}</p>
                      <h3 className="mt-1 text-lg font-semibold">{section.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={confidenceTone(section.confidence)}>{section.confidence} confidence</Badge>
                      <Badge tone={statusTone(section.status)}>{section.status}</Badge>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {publicMaskingEnabled ? redactMemoText(section.narrative, selectedCase) : section.narrative}
                  </p>

                  {section.missingEvidence.length > 0 ? (
                    <div className="mt-4 flex gap-3 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-semibold">Unsupported evidence</p>
                        <p className="mt-1 leading-6">{section.missingEvidence.join("; ")}</p>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Source lineage</p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{section.sourceFields.join(" / ")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Governed rules</p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{section.businessRuleIds.join(" / ")}</p>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2 print:hidden">
            <Button onClick={() => markReviewed()} variant="secondary">
              <UserCheck className="h-4 w-4" />
              Mark Evidence-Ready Sections Reviewed
            </Button>
            <Button disabled={!canApprove} onClick={approveMemo} title={!canApprove ? "Resolve evidence and complete review before approval" : "Approve controlled memo"}>
              <CheckCircle2 className="h-4 w-4" />
              Approve Memo
            </Button>
            <Button onClick={() => setShowComparison((current) => !current)} variant="secondary">
              <GitCompareArrows className="h-4 w-4" />
              Compare Version
            </Button>
            <Button onClick={exportEvidenceMap} variant="secondary">
              <Download className="h-4 w-4" />
              Evidence Map
            </Button>
            <Button onClick={() => window.print()} variant="secondary">
              <FileText className="h-4 w-4" />
              Print / Save PDF
            </Button>
          </div>

          {showComparison ? (
            <Card>
              <div className="flex items-start gap-3">
                <GitCompareArrows className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Version Comparison</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Approved changes from v1.{Math.max(0, version - 1)} to v1.{version}.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {profile.previousVersionNotes.map((note) => (
                  <div className="rounded-md border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground" key={note}>{note}</div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ControlToggle({
  checked,
  description,
  icon: Icon,
  label,
  onChange
}: {
  checked: boolean;
  description: string;
  icon: typeof Database;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-md border p-3">
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${checked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">{label}</span>
          <input checked={checked} className="h-4 w-4 accent-primary" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}
