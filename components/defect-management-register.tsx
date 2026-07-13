"use client";

import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  Download,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  TestTube2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import {
  assessDefectRelease,
  readDefects,
  resetDefects,
  seedDefects,
  writeDefects
} from "@/lib/defect-management";
import { uatTestCases } from "@/lib/mock-data";
import type { DefectRecord, DefectSeverity, DefectStatus } from "@/lib/types";
import { resetLinkedUatState, syncUatFromDefect } from "@/lib/uat-state";
import { downloadCsv, toCsv } from "@/lib/utils";

const severities: Array<DefectSeverity | "All"> = ["All", "Critical", "High", "Medium", "Low"];
const statuses: Array<DefectStatus | "All"> = ["All", "Open", "In Fix", "Ready for Retest", "Retest Failed", "Closed", "Risk Accepted"];
const lifecycle: DefectStatus[] = ["Open", "In Fix", "Ready for Retest", "Closed"];

function severityTone(severity: DefectSeverity) {
  return severity === "Critical" || severity === "High" ? "danger" : severity === "Medium" ? "warning" : "default";
}

function defectStatusTone(status: DefectStatus) {
  if (status === "Closed") {
    return "success";
  }
  if (status === "Risk Accepted" || status === "Ready for Retest") {
    return "warning";
  }
  if (status === "Retest Failed") {
    return "danger";
  }
  return "info";
}

function releaseTone(status: "Pass" | "Watch" | "Block") {
  return status === "Pass" ? "success" : status === "Watch" ? "warning" : "danger";
}

export function DefectManagementRegister() {
  const [defects, setDefects] = useState<DefectRecord[]>(seedDefects);
  const [selectedId, setSelectedId] = useState(seedDefects[0].id);
  const [severityFilter, setSeverityFilter] = useState<DefectSeverity | "All">("All");
  const [statusFilter, setStatusFilter] = useState<DefectStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("Select a defect to review triage, fix, retest, and release impact.");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readDefects();
      setDefects(stored);
      setSelectedId((current) => stored.some((defect) => defect.id === current) ? current : stored[0]?.id ?? "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const assessment = useMemo(() => assessDefectRelease(defects), [defects]);
  const selectedDefect = defects.find((defect) => defect.id === selectedId) ?? defects[0];
  const filteredDefects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return defects.filter((defect) =>
      (severityFilter === "All" || defect.severity === severityFilter) &&
      (statusFilter === "All" || defect.status === statusFilter) &&
      (term.length === 0 || [defect.id, defect.title, defect.linkedTestCaseId, defect.owner, defect.module].some((value) => value.toLowerCase().includes(term)))
    );
  }, [defects, search, severityFilter, statusFilter]);
  const closedCount = defects.filter((defect) => defect.status === "Closed").length;
  const closureRate = defects.length === 0 ? 100 : Math.round((closedCount / defects.length) * 100);

  const persist = (updated: DefectRecord[]) => {
    setDefects(updated);
    writeDefects(updated);
  };

  const updateDefect = <K extends keyof DefectRecord>(key: K, value: DefectRecord[K]) => {
    const timestamp = new Date().toISOString();
    persist(defects.map((defect) => defect.id === selectedDefect.id ? { ...defect, [key]: value, updatedAt: timestamp } : defect));
  };

  const transition = (nextStatus: DefectStatus) => {
    if (nextStatus === "Ready for Retest" && selectedDefect.resolution.trim().length < 10) {
      setNotice("Resolution details must contain at least 10 characters before retest handoff.");
      return;
    }
    if (nextStatus === "Closed" && selectedDefect.retestEvidence.trim().length < 10) {
      setNotice("Successful retest evidence must contain at least 10 characters before closure.");
      return;
    }

    const previous = selectedDefect.status;
    updateDefect("status", nextStatus);
    syncUatFromDefect(selectedDefect.linkedTestCaseId, nextStatus);
    setNotice(`${selectedDefect.id} moved from ${previous} to ${nextStatus}.`);
    recordAuditEvent({
      actor: nextStatus === "Closed" ? "UAT Lead" : selectedDefect.owner,
      action: "Defect status updated",
      module: "Defect Management",
      referenceId: selectedDefect.id,
      details: `${selectedDefect.id} moved from ${previous} to ${nextStatus}.`,
      controlImpact: selectedDefect.severity === "Critical" || selectedDefect.severity === "High" ? "High" : "Medium"
    });
  };

  const approveRiskAcceptance = () => {
    if (selectedDefect.riskAcceptanceReason.trim().length < 10 || selectedDefect.riskAcceptedBy.trim().length < 3) {
      setNotice("Risk acceptance requires an accountable approver and a clear rationale.");
      return;
    }
    const timestamp = new Date().toISOString();
    const updated = defects.map((defect) => defect.id === selectedDefect.id ? {
      ...defect,
      status: "Risk Accepted" as const,
      riskAcceptanceStatus: "Approved" as const,
      updatedAt: timestamp
    } : defect);
    persist(updated);
    setNotice(`${selectedDefect.id} received formal residual risk acceptance.`);
    recordAuditEvent({
      actor: selectedDefect.riskAcceptedBy,
      action: "Defect risk accepted",
      module: "Defect Management",
      referenceId: selectedDefect.id,
      details: selectedDefect.riskAcceptanceReason,
      controlImpact: "High"
    });
  };

  const restoreDemo = () => {
    const reset = resetDefects();
    resetLinkedUatState(uatTestCases, reset.map((defect) => defect.linkedTestCaseId));
    setDefects(reset);
    setSelectedId(reset[0].id);
    setNotice("Defect demo data restored.");
  };

  const exportRegister = () => {
    downloadCsv("release-r2-4-defect-register.csv", toCsv(filteredDefects.map((defect) => ({
      id: defect.id,
      title: defect.title,
      testCase: defect.linkedTestCaseId,
      requirement: defect.requirementId,
      severity: defect.severity,
      priority: defect.priority,
      status: defect.status,
      owner: defect.owner,
      targetFixDate: defect.targetFixDate,
      businessImpact: defect.businessImpact,
      rootCause: defect.rootCause,
      resolution: defect.resolution,
      retestEvidence: defect.retestEvidence,
      riskAcceptance: defect.riskAcceptanceStatus,
      riskAcceptedBy: defect.riskAcceptedBy
    }))));
    recordAuditEvent({
      actor: "UAT Lead",
      action: "Defect register exported",
      module: "Defect Management",
      referenceId: "RELEASE-R2.4",
      details: `Exported ${filteredDefects.length} defects with release status ${assessment.status}.`,
      controlImpact: assessment.status === "Block" ? "High" : "Medium"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total Defects" value={defects.length} />
        <StatCard label="Critical / High Open" value={assessment.criticalOpen.length + assessment.highOpen.length} tone={assessment.criticalOpen.length + assessment.highOpen.length > 0 ? "danger" : "success"} />
        <StatCard label="Pending Retest" value={assessment.pendingRetest.length} tone={assessment.pendingRetest.length > 0 ? "warning" : "success"} />
        <StatCard label="Risk Accepted" value={assessment.accepted.length} tone={assessment.accepted.length > 0 ? "warning" : "success"} />
        <StatCard label="Closure Rate" value={`${closureRate}%`} tone={closureRate === 100 ? "success" : "warning"} />
        <StatCard label="Release Gate" value={assessment.status} tone={releaseTone(assessment.status)} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary"><Bug className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-semibold">Defect Triage and Release Control</h2><p className="mt-1 text-sm text-muted-foreground">{notice}</p></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={restoreDemo} variant="ghost"><RefreshCw className="h-4 w-4" />Reset Demo</Button>
            <Button onClick={exportRegister} variant="secondary"><Download className="h-4 w-4" />Export Register</Button>
          </div>
        </div>
        <div className={`mt-5 flex gap-3 rounded-md border p-4 text-sm ${assessment.status === "Block" ? "border-danger/20 bg-danger/10 text-danger" : assessment.status === "Watch" ? "border-warning/30 bg-warning/10 text-muted-foreground" : "border-success/20 bg-success/10 text-success"}`}>
          {assessment.status === "Pass" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
          <span>{assessment.evidence}</span>
        </div>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_190px]">
          <label className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input className="control w-full pl-9" onChange={(event) => setSearch(event.target.value)} placeholder="Search defect, test case, module or owner" value={search} /></label>
          <select aria-label="Filter by severity" className="control" onChange={(event) => setSeverityFilter(event.target.value as DefectSeverity | "All")} value={severityFilter}>{severities.map((severity) => <option key={severity}>{severity}</option>)}</select>
          <select aria-label="Filter by defect status" className="control" onChange={(event) => setStatusFilter(event.target.value as DefectStatus | "All")} value={statusFilter}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card>
          <h2 className="text-lg font-semibold">Defect Queue</h2>
          <div className="mt-4 space-y-3">
            {filteredDefects.length === 0 ? <p className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">No defects match the filters.</p> : filteredDefects.map((defect) => (
              <button className={`w-full rounded-md border p-4 text-left transition hover:border-primary/40 ${defect.id === selectedDefect.id ? "border-primary bg-primary/5" : "bg-card"}`} key={defect.id} onClick={() => setSelectedId(defect.id)} type="button">
                <div className="flex flex-wrap items-center gap-2"><Badge tone={severityTone(defect.severity)}>{defect.severity}</Badge><Badge tone={defectStatusTone(defect.status)}>{defect.status}</Badge><span className="ml-auto text-xs font-semibold text-primary">{defect.id}</span></div>
                <p className="mt-3 text-sm font-semibold">{defect.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{defect.linkedTestCaseId} · {defect.owner}</p>
              </button>
            ))}
          </div>
        </Card>

        {selectedDefect ? (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div><div className="flex flex-wrap items-center gap-2"><Badge tone={severityTone(selectedDefect.severity)}>{selectedDefect.severity}</Badge><Badge tone={defectStatusTone(selectedDefect.status)}>{selectedDefect.status}</Badge><Badge tone="info">{selectedDefect.linkedTestCaseId}</Badge></div><h2 className="mt-4 text-xl font-semibold">{selectedDefect.id}: {selectedDefect.title}</h2><p className="mt-2 text-sm text-muted-foreground">{selectedDefect.module} · {selectedDefect.requirementId}</p></div>
                <ActionButtons defect={selectedDefect} onTransition={transition} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {lifecycle.map((status, index) => {
                  const currentIndex = lifecycle.indexOf(selectedDefect.status);
                  const complete = selectedDefect.status === "Closed" || (currentIndex >= 0 && index < currentIndex);
                  const current = selectedDefect.status === status;
                  return <div className={`rounded-md border p-3 ${current ? "border-primary bg-primary/5" : ""}`} key={status}><div className="flex items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${complete ? "bg-success text-white" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{complete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</span><span className="text-xs font-semibold">{status}</span></div></div>;
                })}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">Triage, Fix and Retest Evidence</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">Owner<input className="control" onChange={(event) => updateDefect("owner", event.target.value)} value={selectedDefect.owner} /></label>
                <label className="grid gap-2 text-sm font-medium">Target Fix Date<input className="control" onChange={(event) => updateDefect("targetFixDate", event.target.value)} type="date" value={selectedDefect.targetFixDate} /></label>
                <TextAreaField label="Business Impact" onChange={(value) => updateDefect("businessImpact", value)} value={selectedDefect.businessImpact} />
                <TextAreaField label="Root Cause" onChange={(value) => updateDefect("rootCause", value)} value={selectedDefect.rootCause} />
                <TextAreaField label="Resolution" onChange={(value) => updateDefect("resolution", value)} placeholder="Describe the implemented fix and build reference..." value={selectedDefect.resolution} />
                <TextAreaField label="Retest Evidence" onChange={(value) => updateDefect("retestEvidence", value)} placeholder="Record retest build, tester, outcome, and evidence reference..." value={selectedDefect.retestEvidence} />
              </div>
            </Card>

            {(selectedDefect.severity === "Critical" || selectedDefect.severity === "High") && selectedDefect.status !== "Closed" ? (
              <Card>
                <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5 text-primary" /><div><h2 className="text-lg font-semibold">Residual Risk Acceptance</h2><p className="mt-1 text-sm text-muted-foreground">This does not close the defect. It changes the release position from Block to Watch only when formally approved.</p></div></div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">Accepted By<input className="control" onChange={(event) => updateDefect("riskAcceptedBy", event.target.value)} placeholder="Accountable decision authority" value={selectedDefect.riskAcceptedBy} /></label>
                  <label className="grid gap-2 text-sm font-medium">Acceptance Status<input className="control" disabled value={selectedDefect.riskAcceptanceStatus} /></label>
                  <label className="grid gap-2 text-sm font-medium md:col-span-2">Risk Acceptance Rationale<textarea className="min-h-24 rounded-md border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" onChange={(event) => updateDefect("riskAcceptanceReason", event.target.value)} placeholder="State residual impact, compensating control, expiry, and monitoring owner..." value={selectedDefect.riskAcceptanceReason} /></label>
                </div>
                <div className="mt-4"><Button onClick={approveRiskAcceptance} variant="secondary"><ShieldCheck className="h-4 w-4" />Approve Risk Acceptance</Button></div>
              </Card>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ActionButtons({ defect, onTransition }: { defect: DefectRecord; onTransition: (status: DefectStatus) => void }) {
  if (defect.status === "Open") {
    return <Button onClick={() => onTransition("In Fix")}><Play className="h-4 w-4" />Start Fix</Button>;
  }
  if (defect.status === "In Fix") {
    return <Button onClick={() => onTransition("Ready for Retest")}><TestTube2 className="h-4 w-4" />Submit for Retest</Button>;
  }
  if (defect.status === "Ready for Retest") {
    return <div className="flex flex-wrap gap-2"><Button onClick={() => onTransition("Closed")}><CheckCircle2 className="h-4 w-4" />Pass and Close</Button><Button onClick={() => onTransition("Retest Failed")} variant="secondary"><AlertTriangle className="h-4 w-4" />Fail Retest</Button></div>;
  }
  if (defect.status === "Retest Failed") {
    return <Button onClick={() => onTransition("In Fix")}><RotateCcw className="h-4 w-4" />Return to Fix</Button>;
  }
  return <Badge tone={defect.status === "Closed" ? "success" : "warning"}>{defect.status}</Badge>;
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="grid gap-2 text-sm font-medium"><span>{label}</span><textarea className="min-h-28 rounded-md border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} /></label>;
}
