"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Plus,
  RefreshCcw,
  RotateCcw,
  Save,
  ShieldCheck,
  UserRoundCheck,
  Workflow
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/approval-routing";
import { recordAuditEvent } from "@/lib/audit-log";
import {
  createWorkflowCase,
  deriveWorkflow,
  nextStage,
  readWorkflowCases,
  resetWorkflowCases,
  seedWorkflowCases,
  workflowStages,
  writeWorkflowCases,
  type UnifiedCreditCase,
  type WorkflowDecisionType,
  type WorkflowStage
} from "@/lib/case-workflow";
import type {
  ApplicationType,
  CollateralType,
  CustomerSegment,
  CustomerType,
  FacilityType,
  FinancialStatementStatus,
  RiskLevel
} from "@/lib/types";

type WorkspaceView = "Case Input" | "Checklist" | "Tasks & Decisions";

const views: WorkspaceView[] = ["Case Input", "Checklist", "Tasks & Decisions"];
const applicationTypes: ApplicationType[] = ["New", "Renewal", "Enhancement"];
const facilityTypes: FacilityType[] = ["Term Loan", "Overdraft", "Trade Line", "Bank Guarantee"];
const collateralTypes: CollateralType[] = ["Property", "Cash Deposit", "Fixed Deposit", "Corporate Guarantee", "Personal Guarantee", "Debenture", "Unsecured"];
const customerTypes: CustomerType[] = ["Individual", "Sole Proprietor", "Partnership", "SME Company", "Corporate"];
const customerSegments: CustomerSegment[] = ["SME", "Mid-Market", "Large Corporate"];
const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];
const financialStatuses: FinancialStatementStatus[] = ["Available", "Not Available", "Waiver Requested"];
const decisionTypes: WorkflowDecisionType[] = ["Approve", "Conditional Approve", "Return"];

function stageTone(stage: WorkflowStage) {
  if (stage === "Completed") {
    return "success";
  }
  if (stage === "Returned") {
    return "danger";
  }
  if (stage === "Approval" || stage === "Documentation") {
    return "warning";
  }
  return "info";
}

function priorityTone(priority: "High" | "Medium" | "Low") {
  return priority === "High" ? "danger" : priority === "Medium" ? "warning" : "default";
}

function statusTone(status: "Open" | "Waiting" | "Complete") {
  return status === "Complete" ? "success" : status === "Open" ? "warning" : "default";
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} UTC`;
}

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
      <select className="control" onChange={(event) => onChange(event.target.value as T)} value={value}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function UnifiedCaseWorkflow() {
  const [cases, setCases] = useState<UnifiedCreditCase[]>(seedWorkflowCases);
  const [selectedId, setSelectedId] = useState(seedWorkflowCases[0].id);
  const [activeView, setActiveView] = useState<WorkspaceView>("Case Input");
  const [decisionType, setDecisionType] = useState<WorkflowDecisionType>("Approve");
  const [decisionReason, setDecisionReason] = useState("");
  const [notice, setNotice] = useState("Select a case and complete the control requirements to move it forward.");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readWorkflowCases();
      setCases(stored);
      setSelectedId((current) => stored.some((item) => item.id === current) ? current : stored[0].id);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedCase = cases.find((item) => item.id === selectedId) ?? cases[0];
  const derived = useMemo(() => deriveWorkflow(selectedCase), [selectedCase]);
  const openTasks = derived.tasks.filter((task) => task.status === "Open").length;
  const proposedNextStage = nextStage(selectedCase);

  const persistCases = (updated: UnifiedCreditCase[]) => {
    setCases(updated);
    writeWorkflowCases(updated);
  };

  const updateCase = <K extends keyof UnifiedCreditCase>(key: K, value: UnifiedCreditCase[K]) => {
    const timestamp = new Date().toISOString();
    const updated = cases.map((item) => item.id === selectedCase.id ? { ...item, [key]: value, updatedAt: timestamp } : item);
    persistCases(updated);
  };

  const createCase = () => {
    const highestSequence = cases.reduce((highest, item) => {
      const sequence = Number(item.id.split("-").at(-1));
      return Number.isFinite(sequence) ? Math.max(highest, sequence) : highest;
    }, 1000);
    const next = createWorkflowCase(highestSequence + 1);
    persistCases([next, ...cases]);
    setSelectedId(next.id);
    setActiveView("Case Input");
    setNotice(`${next.id} created and saved locally.`);
    recordAuditEvent({
      actor: "Portfolio RM",
      action: "Credit case created",
      module: "Unified Case Workflow",
      referenceId: next.id,
      details: "Created a new commercial credit case in Draft stage.",
      controlImpact: "Medium"
    });
  };

  const resetCases = () => {
    const reset = resetWorkflowCases();
    setCases(reset);
    setSelectedId(reset[0].id);
    setActiveView("Case Input");
    setNotice("Demo cases restored to their original state.");
    recordAuditEvent({
      actor: "Portfolio Reviewer",
      action: "Workflow demo reset",
      module: "Unified Case Workflow",
      referenceId: "ALL-CASES",
      details: "Restored the unified workflow demo data.",
      controlImpact: "Low"
    });
  };

  const markRequiredReady = () => {
    updateCase("documentReadyIds", derived.requiredDocuments.map((document) => document.id));
    setNotice(`${derived.requiredDocuments.length} mandatory documents marked ready for workflow simulation.`);
  };

  const toggleDocument = (documentId: string) => {
    const isReady = selectedCase.documentReadyIds.includes(documentId);
    updateCase(
      "documentReadyIds",
      isReady
        ? selectedCase.documentReadyIds.filter((id) => id !== documentId)
        : [...selectedCase.documentReadyIds, documentId]
    );
  };

  const advanceCase = () => {
    if (!proposedNextStage || derived.blockers.length > 0) {
      setNotice(derived.blockers[0] ?? "This case has already completed the workflow.");
      return;
    }

    const previousStage = selectedCase.stage;
    const timestamp = new Date().toISOString();
    const updated = cases.map((item) => item.id === selectedCase.id
      ? { ...item, ...proposedNextStage, updatedAt: timestamp }
      : item);
    persistCases(updated);
    setNotice(`${selectedCase.id} moved from ${previousStage} to ${proposedNextStage.stage}.`);
    recordAuditEvent({
      actor: selectedCase.ownerRole,
      action: "Workflow stage advanced",
      module: "Unified Case Workflow",
      referenceId: selectedCase.id,
      details: `${selectedCase.id} moved from ${previousStage} to ${proposedNextStage.stage}; ownership transferred to ${proposedNextStage.ownerRole}.`,
      controlImpact: proposedNextStage.stage === "Approval" ? "High" : "Medium"
    });
  };

  const recordDecision = () => {
    if (decisionReason.trim().length < 10) {
      setNotice("Decision rationale must contain at least 10 characters.");
      return;
    }
    if (selectedCase.stage !== "Approval") {
      setNotice("Credit decisions can only be recorded while the case is in Approval stage.");
      return;
    }

    const timestamp = new Date().toISOString();
    const decision = {
      id: `DEC-${Date.now()}`,
      type: decisionType,
      actor: "Portfolio Credit Approver",
      actorRole: "Approver" as const,
      reason: decisionReason.trim(),
      timestamp
    };
    const returned = decisionType === "Return";
    const updated = cases.map((item) => item.id === selectedCase.id
      ? {
          ...item,
          decisions: [decision, ...item.decisions],
          stage: returned ? "Returned" as const : item.stage,
          ownerRole: returned ? "RM" as const : item.ownerRole,
          updatedAt: timestamp
        }
      : item);
    persistCases(updated);
    setDecisionReason("");
    setNotice(returned ? `${selectedCase.id} returned to RM for remediation.` : `${decisionType} decision recorded. The case may proceed to Documentation.`);
    recordAuditEvent({
      actor: decision.actor,
      action: `Credit decision: ${decisionType}`,
      module: "Unified Case Workflow",
      referenceId: selectedCase.id,
      details: decision.reason,
      controlImpact: "High"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Current Stage" value={selectedCase.stage} tone={selectedCase.stage === "Completed" ? "success" : selectedCase.stage === "Returned" ? "danger" : "default"} />
        <StatCard label="Current Owner" value={selectedCase.ownerRole} helper={selectedCase.relationshipManager} />
        <StatCard label="Document Readiness" value={`${derived.readiness}%`} tone={derived.readiness === 100 ? "success" : "warning"} />
        <StatCard label="Submission Blockers" value={derived.blockers.length} tone={derived.blockers.length > 0 ? "danger" : "success"} />
        <StatCard label="Open Tasks" value={openTasks} tone={openTasks > 0 ? "warning" : "success"} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Workflow className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">Unified Case Workspace</h2>
                <Badge tone={stageTone(selectedCase.stage)}>{selectedCase.stage}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{notice}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={createCase} variant="secondary"><Plus className="h-4 w-4" />New Case</Button>
            <Button onClick={resetCases} variant="ghost"><RefreshCcw className="h-4 w-4" />Reset Demo</Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(260px,1fr)_minmax(0,2fr)]">
          <label className="grid gap-2 text-sm font-medium">
            Active Credit Case
            <select className="control" onChange={(event) => setSelectedId(event.target.value)} value={selectedCase.id}>
              {cases.map((item) => <option key={item.id} value={item.id}>{item.id}: {item.customerName}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryItem label="Exposure" value={formatCurrency(selectedCase.totalExposure)} />
            <SummaryItem label="Risk" value={selectedCase.riskLevel} />
            <SummaryItem label="Approval Route" value={derived.route.tier} />
            <SummaryItem label="Updated" value={formatTimestamp(selectedCase.updatedAt)} />
          </div>
        </div>
      </Card>

      <Card className="p-2">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
          {views.map((view) => (
            <button
              className={`h-10 rounded-md px-3 text-sm font-semibold transition ${activeView === view ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              key={view}
              onClick={() => setActiveView(view)}
              type="button"
            >
              {view}
            </button>
          ))}
        </div>
      </Card>

      {activeView === "Case Input" ? (
        <CaseInputView caseRecord={selectedCase} derived={derived} onAdvance={advanceCase} onUpdate={updateCase} />
      ) : null}

      {activeView === "Checklist" ? (
        <ChecklistView
          caseRecord={selectedCase}
          derived={derived}
          onMarkRequiredReady={markRequiredReady}
          onToggleDocument={toggleDocument}
          onWaiverChange={(approved) => updateCase("waiverApproved", approved)}
        />
      ) : null}

      {activeView === "Tasks & Decisions" ? (
        <TasksAndDecisionsView
          caseRecord={selectedCase}
          decisionReason={decisionReason}
          decisionType={decisionType}
          derived={derived}
          onAdvance={advanceCase}
          onDecisionReasonChange={setDecisionReason}
          onDecisionTypeChange={setDecisionType}
          onRecordDecision={recordDecision}
        />
      ) : null}
    </div>
  );
}

function CaseInputView({
  caseRecord,
  derived,
  onAdvance,
  onUpdate
}: {
  caseRecord: UnifiedCreditCase;
  derived: ReturnType<typeof deriveWorkflow>;
  onAdvance: () => void;
  onUpdate: <K extends keyof UnifiedCreditCase>(key: K, value: UnifiedCreditCase[K]) => void;
}) {
  const next = nextStage(caseRecord);
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Card>
        <div className="flex items-start gap-3">
          <ClipboardList className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Application Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Changes recalculate checklist requirements, approval authority, blockers, and tasks.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">Customer Name<input className="control" onChange={(event) => onUpdate("customerName", event.target.value)} value={caseRecord.customerName} /></label>
          <label className="grid gap-2 text-sm font-medium">Relationship Manager<input className="control" onChange={(event) => onUpdate("relationshipManager", event.target.value)} value={caseRecord.relationshipManager} /></label>
          <SelectField label="Application Type" onChange={(value) => onUpdate("applicationType", value)} options={applicationTypes} value={caseRecord.applicationType} />
          <SelectField label="Facility Type" onChange={(value) => onUpdate("facilityType", value)} options={facilityTypes} value={caseRecord.facilityType} />
          <SelectField label="Customer Type" onChange={(value) => onUpdate("customerType", value)} options={customerTypes} value={caseRecord.customerType} />
          <SelectField label="Customer Segment" onChange={(value) => onUpdate("customerSegment", value)} options={customerSegments} value={caseRecord.customerSegment} />
          <SelectField label="Collateral Type" onChange={(value) => onUpdate("collateralType", value)} options={collateralTypes} value={caseRecord.collateralType} />
          <SelectField label="Risk Level" onChange={(value) => onUpdate("riskLevel", value)} options={riskLevels} value={caseRecord.riskLevel} />
          <SelectField label="Financial Statement" onChange={(value) => onUpdate("financialStatementStatus", value)} options={financialStatuses} value={caseRecord.financialStatementStatus} />
          <label className="grid gap-2 text-sm font-medium">Total Exposure<input className="control" min={0} onChange={(event) => onUpdate("totalExposure", Number(event.target.value))} step={50_000} type="number" value={caseRecord.totalExposure} /></label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Credit Recommendation
            <textarea
              className="min-h-28 rounded-md border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              onChange={(event) => onUpdate("creditRecommendation", event.target.value)}
              placeholder="Record the Credit Analyst assessment, repayment view, key risks, and recommendation..."
              value={caseRecord.creditRecommendation}
            />
          </label>
        </div>
        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Save className="h-4 w-4 text-success" />Changes save automatically in this browser.</div>
      </Card>

      <div className="space-y-6">
        <Card>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Integrated Control Output</h2>
              <p className="mt-1 text-sm text-muted-foreground">Generated from the same case record.</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <ControlRow label="Mandatory Documents" value={derived.requiredDocuments.length.toString()} />
            <ControlRow label="Triggered Rules" value={derived.checklist.triggeredRules.length.toString()} />
            <ControlRow label="Approval Authority" value={derived.route.tier} />
            <ControlRow label="Maker Checker" value={derived.route.makerCheckerRequired ? "Required" : "Standard"} />
            <ControlRow label="Target SLA" value={`${derived.route.slaDays} days`} />
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Workflow Gate</h2>
          <div className="mt-4 space-y-3">
            {derived.blockers.length === 0 ? (
              <div className="flex gap-3 rounded-md border border-success/20 bg-success/10 p-4 text-sm text-success"><CheckCircle2 className="h-5 w-5 shrink-0" />All controls for the current stage are satisfied.</div>
            ) : derived.blockers.map((blocker) => (
              <div className="flex gap-3 rounded-md border border-danger/20 bg-danger/10 p-4 text-sm text-danger" key={blocker}><AlertTriangle className="h-5 w-5 shrink-0" />{blocker}</div>
            ))}
          </div>
          <div className="mt-5">
            <Button disabled={!next || derived.blockers.length > 0} onClick={onAdvance}>
              {next ? `Advance to ${next.stage}` : "Workflow Complete"}<ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChecklistView({
  caseRecord,
  derived,
  onMarkRequiredReady,
  onToggleDocument,
  onWaiverChange
}: {
  caseRecord: UnifiedCreditCase;
  derived: ReturnType<typeof deriveWorkflow>;
  onMarkRequiredReady: () => void;
  onToggleDocument: (documentId: string) => void;
  onWaiverChange: (approved: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3"><FileCheck2 className="mt-1 h-5 w-5 text-primary" /><div><h2 className="text-lg font-semibold">Generated Document Checklist</h2><p className="mt-1 text-sm text-muted-foreground">Each status feeds the submission readiness gate.</p></div></div>
            <Button onClick={onMarkRequiredReady} variant="secondary"><CheckCircle2 className="h-4 w-4" />Mark Required Ready</Button>
          </div>
          <div className="mt-5 overflow-x-auto rounded-md border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="table-head"><tr><th className="px-4 py-3 text-left">Ready</th><th className="px-4 py-3 text-left">Document</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left">Level</th><th className="px-4 py-3 text-left">Rule</th></tr></thead>
              <tbody>
                {derived.checklist.documents.map((document) => {
                  const ready = caseRecord.documentReadyIds.includes(document.id);
                  return (
                    <tr className="border-t" key={document.id}>
                      <td className="px-4 py-3"><input aria-label={`Mark ${document.name} ready`} checked={ready} className="h-4 w-4 accent-primary" onChange={() => onToggleDocument(document.id)} type="checkbox" /></td>
                      <td className="px-4 py-3"><p className="font-medium">{document.name}</p><p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">{document.reason}</p></td>
                      <td className="px-4 py-3 text-muted-foreground">{document.category}</td>
                      <td className="px-4 py-3"><Badge tone={document.requirementLevel === "Required" ? "danger" : document.requirementLevel === "Conditional" ? "warning" : "default"}>{document.requirementLevel}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{document.businessRuleId}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold">Readiness</h2>
            <p className="mt-3 text-3xl font-semibold">{derived.readiness}%</p>
            <div className="mt-4"><ProgressBar value={derived.readiness} /></div>
            <p className="mt-3 text-sm text-muted-foreground">{derived.missingDocuments.length} mandatory documents outstanding.</p>
          </Card>
          {caseRecord.financialStatementStatus !== "Available" ? (
            <Card>
              <div className="flex items-start gap-3"><UserRoundCheck className="mt-1 h-5 w-5 text-primary" /><div><h2 className="text-lg font-semibold">Waiver Maker Checker</h2><p className="mt-1 text-sm text-muted-foreground">Independent approval is required for missing financial statements.</p></div></div>
              <label className="mt-5 flex items-center gap-3 rounded-md border p-4 text-sm font-medium"><input checked={caseRecord.waiverApproved} className="h-4 w-4 accent-primary" onChange={(event) => onWaiverChange(event.target.checked)} type="checkbox" />Waiver independently approved</label>
            </Card>
          ) : null}
          <Card>
            <h2 className="text-lg font-semibold">Rule Warnings</h2>
            <div className="mt-4 space-y-3">
              {derived.checklist.warnings.length > 0 ? derived.checklist.warnings.map((warning) => <div className="rounded-md border border-warning/30 bg-warning/10 p-4 text-sm" key={warning}>{warning}</div>) : <p className="text-sm text-muted-foreground">No additional rule warnings for this case.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TasksAndDecisionsView({
  caseRecord,
  decisionReason,
  decisionType,
  derived,
  onAdvance,
  onDecisionReasonChange,
  onDecisionTypeChange,
  onRecordDecision
}: {
  caseRecord: UnifiedCreditCase;
  decisionReason: string;
  decisionType: WorkflowDecisionType;
  derived: ReturnType<typeof deriveWorkflow>;
  onAdvance: () => void;
  onDecisionReasonChange: (value: string) => void;
  onDecisionTypeChange: (value: WorkflowDecisionType) => void;
  onRecordDecision: () => void;
}) {
  const next = nextStage(caseRecord);
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Role-Based Work Queue</h2>
          <div className="mt-5 overflow-x-auto rounded-md border">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="table-head"><tr><th className="px-4 py-3 text-left">Task</th><th className="px-4 py-3 text-left">Owner</th><th className="px-4 py-3 text-left">Priority</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
              <tbody>{derived.tasks.map((task) => <tr className="border-t" key={task.id}><td className="px-4 py-3"><p className="font-medium">{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{task.detail}</p></td><td className="px-4 py-3">{task.ownerRole}</td><td className="px-4 py-3"><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></td><td className="px-4 py-3"><Badge tone={statusTone(task.status)}>{task.status}</Badge></td></tr>)}</tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Decision History</h2>
          <div className="mt-4 space-y-3">
            {caseRecord.decisions.length === 0 ? <p className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">No credit decision has been recorded.</p> : caseRecord.decisions.map((decision) => <div className="rounded-md border p-4" key={decision.id}><div className="flex flex-wrap items-center gap-2"><Badge tone={decision.type === "Return" ? "danger" : "success"}>{decision.type}</Badge><span className="text-xs text-muted-foreground">{formatTimestamp(decision.timestamp)}</span></div><p className="mt-3 text-sm font-medium">{decision.actor} · {decision.actorRole}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{decision.reason}</p></div>)}
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <div className="flex items-start gap-3"><UserRoundCheck className="mt-1 h-5 w-5 text-primary" /><div><h2 className="text-lg font-semibold">Credit Decision</h2><p className="mt-1 text-sm text-muted-foreground">Available only in Approval stage.</p></div></div>
          <div className="mt-5 grid gap-4">
            <SelectField label="Decision" onChange={onDecisionTypeChange} options={decisionTypes} value={decisionType} />
            <label className="grid gap-2 text-sm font-medium">Decision Rationale<textarea className="min-h-28 rounded-md border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" onChange={(event) => onDecisionReasonChange(event.target.value)} placeholder="Record conditions, rationale, or remediation required..." value={decisionReason} /></label>
            <Button disabled={caseRecord.stage !== "Approval"} onClick={onRecordDecision}><ShieldCheck className="h-4 w-4" />Record Decision</Button>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Stage Control</h2>
          <div className="mt-4 space-y-2">
            {workflowStages.map((stage, index) => {
              const currentIndex = workflowStages.indexOf(caseRecord.stage === "Returned" ? "Draft" : caseRecord.stage);
              const complete = caseRecord.stage !== "Returned" && index < currentIndex;
              const current = stage === caseRecord.stage;
              return <div className="flex items-center gap-3 rounded-md border p-3" key={stage}><div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${complete ? "bg-success text-white" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{complete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</div><span className="text-sm font-medium">{stage}</span>{current ? <Badge tone="info">Current</Badge> : null}</div>;
            })}
            {caseRecord.stage === "Returned" ? <div className="flex items-center gap-3 rounded-md border border-danger/20 bg-danger/10 p-3 text-danger"><RotateCcw className="h-5 w-5" /><span className="text-sm font-medium">Returned to RM</span></div> : null}
          </div>
          <div className="mt-5"><Button disabled={!next || derived.blockers.length > 0} onClick={onAdvance}>{next ? `Advance to ${next.stage}` : "Workflow Complete"}<ArrowRight className="h-4 w-4" /></Button></div>
        </Card>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-md border bg-muted/30 p-3"><p className="text-[11px] font-semibold uppercase text-muted-foreground">{label}</p><p className="mt-2 break-words text-sm font-semibold">{value}</p></div>;
}

function ControlRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"><span className="text-sm text-muted-foreground">{label}</span><span className="max-w-[60%] text-right text-sm font-semibold">{value}</span></div>;
}
