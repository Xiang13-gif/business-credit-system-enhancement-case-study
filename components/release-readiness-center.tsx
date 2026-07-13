"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  Flag,
  History,
  RefreshCw,
  Rocket,
  ShieldX
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { assessUatSignOff, readDefects, seedDefects } from "@/lib/defect-management";
import {
  readReleaseDecisionState,
  resetReleaseDecisionState,
  type ReleaseDecisionSnapshot,
  writeReleaseDecisionState
} from "@/lib/release-state";
import { cutoverSteps, hypercareMetrics, releaseGates } from "@/lib/transformation-data";
import { uatTestCases } from "@/lib/mock-data";
import type { DefectRecord, ReleaseGate, ReleaseGateStatus, UatStatus } from "@/lib/types";
import { readUatStatusMap } from "@/lib/uat-state";
import { downloadCsv, toCsv } from "@/lib/utils";

function hypercareTone(status: string) {
  if (status === "On Track") {
    return "success" as const;
  }
  if (status === "Watch") {
    return "warning" as const;
  }
  return "danger" as const;
}

export function ReleaseReadinessCenter() {
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ReleaseGateStatus>>({});
  const [decision, setDecision] = useState<ReleaseDecisionSnapshot | null>(null);
  const [defects, setDefects] = useState<DefectRecord[]>(seedDefects);
  const [uatStatusOverrides, setUatStatusOverrides] = useState<Record<string, UatStatus>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDefects(readDefects());
      setUatStatusOverrides(readUatStatusMap());
      const releaseState = readReleaseDecisionState();
      setStatusOverrides(releaseState.statusOverrides);
      setDecision(releaseState.decision);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const uatAssessment = assessUatSignOff(uatTestCases, uatStatusOverrides, defects);
  const { defectAssessment, highPriorityOpen: highPriorityUatOpen } = uatAssessment;
  const uatDefectGateStatus: ReleaseGateStatus = defectAssessment.status === "Block" || highPriorityUatOpen.length > 0
    ? "Block"
    : defectAssessment.status;
  const uatDefectEvidence = `${defectAssessment.evidence} ${highPriorityUatOpen.length} high-priority UAT cases remain unpassed without approved risk acceptance.`;
  const preliminaryGates: ReleaseGate[] = releaseGates.map((item) => {
    if (item.id === "REL-002") {
      return {
        ...item,
        status: uatDefectGateStatus,
        evidence: uatDefectEvidence,
        signOff: uatDefectGateStatus === "Pass" ? "Signed by UAT Lead" : uatDefectGateStatus === "Watch" ? "Conditional" : "Pending"
      };
    }
    return { ...item, status: statusOverrides[item.id] ?? item.status };
  });
  const prerequisiteGates = preliminaryGates.filter((item) => item.id !== "REL-008");
  const steeringGateStatus: ReleaseGateStatus = prerequisiteGates.some((item) => item.status === "Block")
    ? "Block"
    : prerequisiteGates.some((item) => item.status === "Watch")
      ? "Watch"
      : "Pass";
  const gates = preliminaryGates.map((item) => item.id === "REL-008" ? {
    ...item,
    status: steeringGateStatus,
    evidence: steeringGateStatus === "Block"
      ? "Final decision remains blocked by one or more prerequisite release gates."
      : steeringGateStatus === "Watch"
        ? "No blocking prerequisite remains; residual watch items require named owners and formal acceptance."
        : "All prerequisite release gates pass with accountable sign-off evidence.",
    signOff: steeringGateStatus === "Pass" ? "Ready for Steering Sign-Off" : steeringGateStatus === "Watch" ? "Conditional" : "Pending"
  } : item);
  const passCount = gates.filter((item) => item.status === "Pass").length;
  const watchCount = gates.filter((item) => item.status === "Watch").length;
  const blockCount = gates.filter((item) => item.status === "Block").length;
  const readinessScore = Math.round(gates.reduce((sum, item) => sum + ({ Pass: 100, Watch: 55, Block: 0 }[item.status]), 0) / gates.length);
  const cutoverReady = cutoverSteps.filter((item) => ["Ready", "Completed"].includes(item.status)).length;
  const posture = blockCount > 0 ? "No-Go" : watchCount > 0 ? "Conditional Go" : "Go";
  const decisionIsCurrent = Boolean(
    decision &&
    decision.posture === posture &&
    decision.blockerCount === blockCount &&
    decision.watchCount === watchCount
  );

  const updateGate = (gateId: string, status: ReleaseGateStatus) => {
    if (gateId === "REL-002" || gateId === "REL-008") {
      return;
    }
    const gate = releaseGates.find((item) => item.id === gateId);
    setStatusOverrides((current) => {
      const next = { ...current, [gateId]: status };
      writeReleaseDecisionState({ statusOverrides: next, decision: null });
      return next;
    });
    setDecision(null);
    if (gate) {
      recordAuditEvent({
        actor: gate.owner,
        action: "Release gate updated",
        module: "Release Readiness",
        referenceId: gate.id,
        details: `${gate.title} moved to ${status} in the go-live decision simulation.`,
        controlImpact: status === "Block" ? "High" : "Medium"
      });
    }
  };

  const resetGates = () => {
    const reset = resetReleaseDecisionState();
    setStatusOverrides(reset.statusOverrides);
    setDecision(reset.decision);
  };

  const recordDecision = () => {
    const snapshot: ReleaseDecisionSnapshot = {
      actor: "Release Steering Committee",
      posture,
      blockerCount: blockCount,
      watchCount,
      recordedAt: new Date().toISOString()
    };
    setDecision(snapshot);
    writeReleaseDecisionState({ statusOverrides, decision: snapshot });
    recordAuditEvent({
      actor: "Release Steering Committee",
      action: "Go-live decision recorded",
      module: "Release Readiness",
      referenceId: "RELEASE-R2.4",
      details: `Recorded ${posture} recommendation with ${blockCount} blockers and ${watchCount} watch gates.`,
      controlImpact: posture === "Go" ? "Medium" : "High"
    });
  };

  const exportDecisionPack = () => {
    downloadCsv(
      "release-r2-4-decision-pack.csv",
      toCsv(gates.map((item) => ({
        gateId: item.id,
        domain: item.domain,
        gate: item.title,
        status: item.status,
        owner: item.owner,
        exitCriteria: item.exitCriteria,
        evidence: item.evidence,
        linkedItems: item.linkedItems.join("; "),
        signOff: item.signOff,
        releasePosture: posture,
        openCriticalDefects: defectAssessment.criticalOpen.length,
        openHighDefects: defectAssessment.highOpen.length,
        pendingRetest: defectAssessment.pendingRetest.length,
        riskAcceptedDefects: defectAssessment.accepted.length,
        highPriorityUatOpen: highPriorityUatOpen.length,
        decisionRecordedAt: decision?.recordedAt ?? "Not recorded"
      })))
    );
    recordAuditEvent({
      actor: "Release Manager",
      action: "Release decision pack exported",
      module: "Release Readiness",
      referenceId: "RELEASE-R2.4",
      details: `Exported ${gates.length} readiness gates with ${posture} recommendation.`,
      controlImpact: posture === "Go" ? "Medium" : "High"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Release Posture" value={posture} tone={posture === "Go" ? "success" : posture === "Conditional Go" ? "warning" : "danger"} />
        <StatCard label="Readiness Score" value={`${readinessScore}%`} tone={readinessScore >= 85 ? "success" : readinessScore >= 55 ? "warning" : "danger"} />
        <StatCard label="Blocking Gates" value={blockCount} tone={blockCount > 0 ? "danger" : "success"} />
        <StatCard label="Critical / High Defects" value={defectAssessment.criticalOpen.length + defectAssessment.highOpen.length} tone={defectAssessment.status === "Block" ? "danger" : "success"} helper={`${passCount} gates passed`} />
        <StatCard label="UAT Open / Retest" value={`${highPriorityUatOpen.length} / ${defectAssessment.pendingRetest.length}`} tone={highPriorityUatOpen.length + defectAssessment.pendingRetest.length > 0 ? "warning" : "success"} helper={`${watchCount} watch gates`} />
        <StatCard label="Cutover Ready" value={`${cutoverReady}/${cutoverSteps.length}`} tone={cutoverReady === cutoverSteps.length ? "success" : "warning"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <Rocket className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Go-Live Readiness Gates</h2>
                <p className="mt-1 text-sm text-muted-foreground">Release R2.4 / evidence cut-off 11 July 2026.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={resetGates} variant="secondary">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={exportDecisionPack} variant="secondary">
                <Download className="h-4 w-4" />
                Decision Pack
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1120px] border-collapse text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Domain / Gate</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-left">Exit Criteria</th>
                  <th className="px-4 py-3 text-left">Current Evidence</th>
                  <th className="px-4 py-3 text-left">Linked Items</th>
                  <th className="px-4 py-3 text-left">Sign-Off</th>
                </tr>
              </thead>
              <tbody>
                {gates.map((item) => (
                  <tr className="border-t align-top" key={item.id}>
                    <td className="px-4 py-3">
                      <Badge tone="info">{item.domain}</Badge>
                      <p className="mt-2 font-semibold">{item.id}: {item.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Status for ${item.title}`}
                        className="control h-9 min-w-28"
                        disabled={item.id === "REL-002" || item.id === "REL-008"}
                        onChange={(event) => updateGate(item.id, event.target.value as ReleaseGateStatus)}
                        value={item.status}
                      >
                        {(["Pass", "Watch", "Block"] as ReleaseGateStatus[]).map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.owner}</td>
                    <td className="px-4 py-3 max-w-xs text-muted-foreground">{item.exitCriteria}</td>
                    <td className="px-4 py-3 max-w-xs text-muted-foreground">{item.evidence}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.linkedItems.join(", ")}</td>
                    <td className="px-4 py-3"><Badge tone={item.signOff.startsWith("Signed") ? "success" : item.signOff === "Pending" ? "danger" : "warning"}>{item.signOff}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            {posture === "Go" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" /> : posture === "Conditional Go" ? <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" /> : <ShieldX className="mt-0.5 h-5 w-5 text-danger" />}
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Steering Recommendation</p>
              <h2 className="mt-2 text-2xl font-semibold">{posture}</h2>
            </div>
          </div>

          <div className="mt-5">
            <ProgressBar value={readinessScore} />
            <p className="mt-2 text-sm text-muted-foreground">{readinessScore}% evidence-weighted readiness</p>
          </div>

          <div className="mt-5 space-y-3">
            <DecisionCheck label="No open blocking gate" passed={blockCount === 0} />
            <DecisionCheck label="No open critical or high defect" passed={defectAssessment.criticalOpen.length + defectAssessment.highOpen.length === 0} />
            <DecisionCheck label="All high-priority UAT passed or accepted" passed={highPriorityUatOpen.length === 0} />
            <DecisionCheck label="All defect retests resolved" passed={defectAssessment.pendingRetest.length === 0} />
            <DecisionCheck label="All watch gates accepted" passed={watchCount === 0} />
            <DecisionCheck label="Cutover runbook ready" passed={cutoverReady >= 3} />
            <DecisionCheck label="Training threshold achieved" passed />
            <DecisionCheck label="Rollback triggers defined" passed={cutoverSteps.every((item) => Boolean(item.rollbackTrigger))} />
          </div>

          <div className={`mt-5 rounded-md border p-4 text-sm leading-6 ${posture === "No-Go" ? "border-danger/30 bg-danger/10 text-danger" : posture === "Conditional Go" ? "border-warning/30 bg-warning/10 text-muted-foreground" : "border-success/30 bg-success/10 text-muted-foreground"}`}>
            {posture === "No-Go"
              ? "Do not proceed. Close the failed high-priority control test and obtain final data-quality disposition before reconvening the release decision."
              : posture === "Conditional Go"
                ? "Proceed only with named risk owners, dated remediation, monitoring thresholds, and documented steering acceptance."
                : "Proceed within the approved cutover window and monitor the agreed hypercare indicators."}
          </div>

          <div className="mt-5">
            <Button onClick={recordDecision}>
              <Flag className="h-4 w-4" />
              {decisionIsCurrent ? "Decision Recorded" : decision ? "Re-record Decision" : "Record Decision"}
            </Button>
          </div>
          {decision ? (
            <p className={`mt-3 text-xs ${decisionIsCurrent ? "text-muted-foreground" : "text-warning"}`}>
              {decisionIsCurrent
                ? `Recorded by ${decision.actor} on ${new Date(decision.recordedAt).toLocaleString("en-MY")}.`
                : "The saved decision is outdated because the current gate position has changed. Re-recording is required."}
            </p>
          ) : null}
        </Card>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Cutover Runbook</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sequenced ownership, validation evidence, and explicit rollback conditions.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {cutoverSteps.map((item) => (
            <div className="rounded-md border p-4" key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">{item.sequence}</div>
                <Badge tone={item.status === "Completed" || item.status === "Ready" ? "success" : item.status === "Blocked" ? "danger" : "default"}>{item.status}</Badge>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-normal text-primary">{item.window}</p>
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">Owner: {item.owner}</p>
              <div className="mt-4 space-y-3 text-xs leading-5 text-muted-foreground">
                <div className="rounded-md bg-muted/40 p-3"><span className="font-semibold text-foreground">Validation:</span> {item.validation}</div>
                <div className="rounded-md border border-danger/20 bg-danger/5 p-3"><span className="font-semibold text-foreground">Rollback:</span> {item.rollbackTrigger}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <div className="flex items-start gap-3">
            <History className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Hypercare Control Panel</h2>
              <p className="mt-1 text-sm text-muted-foreground">Early-life indicators, thresholds, current position, and accountable owner.</p>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Indicator</th>
                  <th className="px-4 py-3 text-left">Target</th>
                  <th className="px-4 py-3 text-left">Current</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                </tr>
              </thead>
              <tbody>
                {hypercareMetrics.map((item) => (
                  <tr className="border-t" key={item.id}>
                    <td className="px-4 py-3 font-semibold">{item.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.target}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.current}</td>
                    <td className="px-4 py-3"><Badge tone={hypercareTone(item.status)}>{item.status}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{item.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Release BA Responsibilities</h2>
          <div className="mt-4 space-y-3">
            {[
              "Translate business acceptance into measurable exit criteria.",
              "Keep residual risks linked to accountable decision owners.",
              "Reconcile migration evidence with downstream business impact.",
              "Confirm procedures, training, support, and operational ownership.",
              "Present a concise, evidence-led Go / No-Go recommendation."
            ].map((item) => (
              <div className="flex items-start gap-3 rounded-md border p-3 text-sm leading-6 text-muted-foreground" key={item}>
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DecisionCheck({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge tone={passed ? "success" : "danger"}>{passed ? "Clear" : "Open"}</Badge>
    </div>
  );
}
