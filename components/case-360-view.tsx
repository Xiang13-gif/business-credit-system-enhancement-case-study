"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  FileSearch,
  Route,
  ShieldCheck,
  ShieldX,
  Workflow
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/approval-routing";
import { recordAuditEvent } from "@/lib/audit-log";
import {
  changeRequests,
  creditCase360Records,
  policyExceptions,
  uatTestCases
} from "@/lib/mock-data";
import type {
  CaseLifecycleStep,
  CaseReadinessGate,
  CreditCase360,
  LifecycleStepStatus,
  ReadinessGateStatus
} from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

function gateTone(status: ReadinessGateStatus) {
  if (status === "Pass") {
    return "success";
  }
  if (status === "Watch") {
    return "warning";
  }
  return "danger";
}

function stepTone(status: LifecycleStepStatus) {
  if (status === "Completed") {
    return "success";
  }
  if (status === "In Progress") {
    return "warning";
  }
  if (status === "Blocked") {
    return "danger";
  }
  return "default";
}

function readinessScore(caseRecord: CreditCase360) {
  const scoreByStatus = { Pass: 100, Watch: 55, Block: 0 };
  const total = caseRecord.readinessGates.reduce((sum, gate) => sum + scoreByStatus[gate.status], 0);
  return Math.round(total / caseRecord.readinessGates.length);
}

function releasePosture(caseRecord: CreditCase360) {
  if (caseRecord.readinessGates.some((gate) => gate.status === "Block")) {
    return "Not Ready";
  }
  if (caseRecord.readinessGates.some((gate) => gate.status === "Watch")) {
    return "Controlled Watch";
  }
  return "Ready";
}

function releaseTone(posture: string) {
  if (posture === "Ready") {
    return "success";
  }
  if (posture === "Controlled Watch") {
    return "warning";
  }
  return "danger";
}

export function Case360View() {
  const [selectedId, setSelectedId] = useState(creditCase360Records[0].id);
  const selectedCase = useMemo(
    () => creditCase360Records.find((item) => item.id === selectedId) ?? creditCase360Records[0],
    [selectedId]
  );
  const relatedExceptions = policyExceptions.filter((item) => selectedCase.policyExceptionIds.includes(item.id));
  const relatedUatCases = uatTestCases.filter((item) => selectedCase.uatCaseIds.includes(item.id));
  const relatedChangeRequests = changeRequests.filter((item) => selectedCase.changeRequestIds.includes(item.id));
  const score = readinessScore(selectedCase);
  const posture = releasePosture(selectedCase);
  const blockedGates = selectedCase.readinessGates.filter((gate) => gate.status === "Block").length;
  const watchGates = selectedCase.readinessGates.filter((gate) => gate.status === "Watch").length;

  const selectCase = (caseId: string) => {
    const next = creditCase360Records.find((item) => item.id === caseId);
    setSelectedId(caseId);
    if (next) {
      recordAuditEvent({
        actor: "Portfolio Reviewer",
        action: "Case 360 reviewed",
        module: "Case 360",
        referenceId: next.id,
        details: `Reviewed ${next.id} lifecycle view with ${next.readinessGates.length} gates and ${next.policyExceptionIds.length} exceptions.`,
        controlImpact: releasePosture(next) === "Ready" ? "Medium" : "High"
      });
    }
  };

  const exportSnapshot = () => {
    downloadCsv(
      `${selectedCase.id.toLowerCase()}-case-360.csv`,
      toCsv([
        { area: "Customer", value: selectedCase.customerName },
        { area: "Facility", value: selectedCase.facilityType },
        { area: "Exposure", value: formatCurrency(selectedCase.exposure) },
        { area: "Current Stage", value: selectedCase.currentStage },
        { area: "Owner", value: selectedCase.ownerRole },
        { area: "Readiness Score", value: `${score}%` },
        { area: "Release Posture", value: posture },
        { area: "Policy Exceptions", value: selectedCase.policyExceptionIds.join("; ") || "None" },
        { area: "UAT Evidence", value: selectedCase.uatCaseIds.join("; ") },
        { area: "BA Recommendation", value: selectedCase.baRecommendation }
      ])
    );

    recordAuditEvent({
      actor: "Portfolio Reviewer",
      action: "Case 360 snapshot exported",
      module: "Case 360",
      referenceId: selectedCase.id,
      details: `Exported lifecycle snapshot for ${selectedCase.id} with release posture ${posture}.`,
      controlImpact: posture === "Ready" ? "Medium" : "High"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Release Posture" value={posture} tone={releaseTone(posture)} />
        <StatCard label="Readiness Score" value={`${score}%`} tone={score >= 85 ? "success" : score >= 55 ? "warning" : "danger"} />
        <StatCard label="Blocked Gates" value={blockedGates} tone={blockedGates > 0 ? "danger" : "success"} />
        <StatCard label="Watch Gates" value={watchGates} tone={watchGates > 0 ? "warning" : "success"} />
        <StatCard label="Exposure" value={formatCurrency(selectedCase.exposure)} helper={selectedCase.customerSegment} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Case Selector</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a case to inspect the end-to-end credit journey.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <select className="control" value={selectedId} onChange={(event) => selectCase(event.target.value)}>
              {creditCase360Records.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}: {item.customerName}
                </option>
              ))}
            </select>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Current Owner</p>
              <p className="mt-2 text-sm font-semibold">{selectedCase.ownerRole}</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedCase.currentStage}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Document Readiness</p>
              <p className="mt-2 text-sm font-semibold">{selectedCase.documentReadiness}%</p>
              <div className="mt-3">
                <ProgressBar value={selectedCase.documentReadiness} />
              </div>
            </div>

            <Button onClick={exportSnapshot} variant="secondary">
              <Download className="h-4 w-4" />
              Export Snapshot
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info">{selectedCase.id}</Badge>
              <Badge tone={selectedCase.riskLevel === "High" ? "danger" : selectedCase.riskLevel === "Medium" ? "warning" : "success"}>
                {selectedCase.riskLevel} Risk
              </Badge>
              <Badge tone={releaseTone(posture)}>{posture}</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">{selectedCase.customerName}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedCase.executiveSummary}</p>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <SummaryItem label="Facility" value={selectedCase.facilityType} />
              <SummaryItem label="Application" value={selectedCase.applicationType} />
              <SummaryItem label="Collateral" value={selectedCase.collateralCoverage} />
              <SummaryItem label="Approval Tier" value={selectedCase.approvalTier} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <Route className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">BA Decision Logic</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The case is assessed through five linked controls: document readiness, approval authority,
                  policy exception governance, UAT evidence, and audit evidence. The release posture changes
                  only when those gates move from Block or Watch to Pass.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <h2 className="text-lg font-semibold">Lifecycle Timeline</h2>
          <div className="mt-5 space-y-4">
            {selectedCase.lifecycleSteps.map((step) => (
              <LifecycleStepCard key={step.id} step={step} />
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold">Readiness Gates</h2>
            <div className="mt-4 space-y-3">
              {selectedCase.readinessGates.map((gate) => (
                <ReadinessGateCard gate={gate} key={gate.id} />
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">BA Recommendation</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedCase.baRecommendation}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <EvidenceCard
          emptyText="No policy exceptions linked to this case."
          items={relatedExceptions.map((item) => ({
            badge: item.id,
            title: item.type,
            subtitle: `${item.severity} / ${item.status} / ${item.approvalTier}`,
            detail: item.controlEvidence,
            tone: item.severity === "Critical" ? "danger" : item.severity === "Major" ? "warning" : "info"
          }))}
          title="Policy Exceptions"
        />
        <EvidenceCard
          emptyText="No UAT cases linked to this case."
          items={relatedUatCases.map((item) => ({
            badge: item.id,
            title: item.scenario,
            subtitle: `${item.priority} priority / ${item.status}`,
            detail: item.remarks,
            tone: item.status === "Passed" ? "success" : item.status === "Failed" || item.status === "Blocked" ? "danger" : "warning"
          }))}
          title="UAT Evidence"
        />
        <EvidenceCard
          emptyText="No change requests linked to this case."
          items={relatedChangeRequests.map((item) => ({
            badge: item.id,
            title: item.title,
            subtitle: `${item.implementationPriority} priority`,
            detail: item.baRecommendation,
            tone: item.implementationPriority === "High" ? "danger" : item.implementationPriority === "Medium" ? "warning" : "info"
          }))}
          title="Change Requests"
        />
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Next Best Actions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {selectedCase.nextBestActions.map((item) => (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground" key={item}>
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function LifecycleStepCard({ step }: { step: CaseLifecycleStep }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <StepStatusIcon status={step.status} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{step.title}</h3>
              <Badge tone={stepTone(step.status)}>{step.status}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.controlObjective}</p>
          </div>
        </div>
        <div className="shrink-0 text-sm text-muted-foreground">
          {step.ownerRole} / {step.agingDays} days
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">{step.evidence}</div>
        <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-muted-foreground">{step.riskSignal}</div>
      </div>
    </div>
  );
}

function ReadinessGateCard({ gate }: { gate: CaseReadinessGate }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <GateStatusIcon status={gate.status} />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{gate.title}</h3>
            <Badge tone={gateTone(gate.status)}>{gate.status}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{gate.evidence}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {gate.ownerRole} / {gate.linkedRequirement} / {gate.linkedTestCase}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepStatusIcon({ status }: { status: LifecycleStepStatus }) {
  if (status === "Completed") {
    return <CheckCircle2 className="h-5 w-5" />;
  }
  if (status === "Blocked") {
    return <ShieldX className="h-5 w-5" />;
  }
  if (status === "In Progress") {
    return <Clock3 className="h-5 w-5" />;
  }
  return <FileSearch className="h-5 w-5" />;
}

function GateStatusIcon({ status }: { status: ReadinessGateStatus }) {
  if (status === "Pass") {
    return <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />;
  }
  if (status === "Watch") {
    return <AlertTriangle className="mt-0.5 h-5 w-5 text-primary" />;
  }
  return <ShieldX className="mt-0.5 h-5 w-5 text-primary" />;
}

function EvidenceCard({
  title,
  items,
  emptyText
}: {
  title: string;
  emptyText: string;
  items: Array<{
    badge: string;
    title: string;
    subtitle: string;
    detail: string;
    tone: "default" | "success" | "warning" | "danger" | "info";
  }>;
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div className="rounded-lg border p-4" key={`${title}-${item.badge}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={item.tone}>{item.badge}</Badge>
                <span className="text-xs text-muted-foreground">{item.subtitle}</span>
              </div>
              <p className="mt-3 text-sm font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
