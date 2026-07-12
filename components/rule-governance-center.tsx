"use client";

import {
  AlertTriangle,
  ArrowRight,
  Beaker,
  CheckCircle2,
  FileCheck2,
  GitCompareArrows,
  Network,
  Play,
  ShieldCheck,
  Users
} from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { generateChecklist } from "@/lib/checklist-rules";
import { governedRules, ruleTestScenarios } from "@/lib/transformation-data";
import type { RuleLifecycleStatus } from "@/lib/types";

type TestResult = {
  scenarioId: string;
  missingDocuments: string[];
  missingRules: string[];
  generatedDocuments: number;
  generatedRules: number;
  outcome: "Pass" | "Design Gap" | "Fail";
};

function statusTone(status: RuleLifecycleStatus) {
  if (status === "Active") {
    return "success" as const;
  }
  if (status === "Approved") {
    return "info" as const;
  }
  if (status === "Under Review") {
    return "warning" as const;
  }
  if (status === "Retired") {
    return "default" as const;
  }
  return "danger" as const;
}

function riskTone(risk: string) {
  if (risk === "Critical") {
    return "danger" as const;
  }
  if (risk === "High") {
    return "warning" as const;
  }
  return "info" as const;
}

export function RuleGovernanceCenter() {
  const [selectedRuleId, setSelectedRuleId] = useState("BR004");
  const [selectedScenarioId, setSelectedScenarioId] = useState("RT-005");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RuleLifecycleStatus>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const selectedRule = governedRules.find((item) => item.id === selectedRuleId) ?? governedRules[0];
  const selectedScenario = ruleTestScenarios.find((item) => item.id === selectedScenarioId) ?? ruleTestScenarios[0];
  const selectedStatus = statusOverrides[selectedRule.id] ?? selectedRule.status;
  const requiredScenario = selectedRule.id === "BR004"
    ? ruleTestScenarios.find((item) => item.id === "RT-005")
    : ruleTestScenarios.find((item) => item.linkedRuleId === selectedRule.id);
  const requiredTestPassed = Boolean(
    requiredScenario
    && testResult?.scenarioId === requiredScenario.id
    && testResult.outcome === "Pass"
  );

  const activeRules = governedRules.filter((item) => (statusOverrides[item.id] ?? item.status) === "Active").length;
  const pendingRules = governedRules.filter((item) => ["Draft", "Under Review", "Approved"].includes(statusOverrides[item.id] ?? item.status)).length;
  const criticalRules = governedRules.filter((item) => item.riskRating === "Critical").length;
  const linkedUat = new Set(governedRules.flatMap((item) => item.linkedUatCases)).size;

  const selectRule = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    const nextScenario = ruleId === "BR004"
      ? ruleTestScenarios.find((item) => item.id === "RT-005")
      : ruleTestScenarios.find((item) => item.linkedRuleId === ruleId);
    if (nextScenario) {
      setSelectedScenarioId(nextScenario.id);
    }
    setTestResult(null);
  };

  const runScenario = () => {
    const result = generateChecklist(selectedScenario.input);
    const documentIds = result.documents.map((item) => item.id);
    const ruleIds = result.triggeredRules.map((item) => item.id);
    const missingDocuments = selectedScenario.expectedDocumentIds.filter((item) => !documentIds.includes(item));
    const missingRules = selectedScenario.expectedRuleIds.filter((item) => !ruleIds.includes(item));
    const isExpectedGap = selectedScenario.expectedOutcome.startsWith("Expected design gap");
    const outcome = missingDocuments.length === 0 && missingRules.length === 0
      ? "Pass"
      : isExpectedGap
        ? "Design Gap"
        : "Fail";
    setTestResult({
      scenarioId: selectedScenario.id,
      missingDocuments,
      missingRules,
      generatedDocuments: result.documents.length,
      generatedRules: result.triggeredRules.length,
      outcome
    });
    recordAuditEvent({
      actor: "BA Lead",
      action: "Rule regression scenario executed",
      module: "Rule Governance",
      referenceId: selectedScenario.id,
      details: `${selectedScenario.name} completed with outcome ${outcome}; ${missingDocuments.length} document gaps and ${missingRules.length} rule gaps.`,
      controlImpact: outcome === "Pass" ? "Medium" : "High"
    });
  };

  const advanceWorkflow = () => {
    const nextStatus: Partial<Record<RuleLifecycleStatus, RuleLifecycleStatus>> = {
      Draft: "Under Review",
      "Under Review": "Approved",
      Approved: "Active"
    };
    const next = nextStatus[selectedStatus];
    if (!next || ((selectedStatus === "Under Review" || selectedStatus === "Approved") && !requiredTestPassed)) {
      return;
    }
    setStatusOverrides((current) => ({ ...current, [selectedRule.id]: next }));
    recordAuditEvent({
      actor: selectedStatus === "Draft" ? selectedRule.ownerRole : selectedRule.approverRole,
      action: "Rule lifecycle advanced",
      module: "Rule Governance",
      referenceId: selectedRule.id,
      details: `${selectedRule.id} ${selectedRule.proposedVersion} moved from ${selectedStatus} to ${next}.`,
      controlImpact: selectedRule.riskRating === "Critical" ? "High" : "Medium"
    });
  };

  const actionLabel = selectedStatus === "Draft"
    ? "Submit for Review"
    : selectedStatus === "Under Review"
      ? "Approve Version"
      : selectedStatus === "Approved"
        ? "Activate Version"
        : "Rule Active";
  const actionDisabled = selectedStatus === "Active"
    || ((selectedStatus === "Under Review" || selectedStatus === "Approved") && !requiredTestPassed);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Governed Rules" value={governedRules.length} helper="High-impact sample rules" />
        <StatCard label="Active Rules" value={activeRules} tone="success" />
        <StatCard label="Pending Change" value={pendingRules} tone={pendingRules > 0 ? "warning" : "success"} />
        <StatCard label="Critical Rules" value={criticalRules} tone={criticalRules > 0 ? "danger" : "success"} />
        <StatCard label="Linked UAT" value={linkedUat} helper="Regression evidence" />
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Business Rule Registry</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Controlled ownership, lifecycle, versions, and traceability for decision-sensitive rules.</p>
          </div>
          <Badge tone={statusTone(selectedStatus)}>{selectedRule.id} / {selectedStatus}</Badge>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left">Rule</th>
                <th className="px-4 py-3 text-left">Version</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Risk</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Approver</th>
                <th className="px-4 py-3 text-left">Effective</th>
                <th className="px-4 py-3 text-left">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {governedRules.map((item) => {
                const itemStatus = statusOverrides[item.id] ?? item.status;
                const coverage = Math.min(100, 55 + item.linkedRequirements.length * 10 + item.linkedUatCases.length * 8);
                return (
                  <tr className={`border-t align-top ${selectedRule.id === item.id ? "bg-primary/5" : ""}`} key={item.id}>
                    <td className="px-4 py-3">
                      <button className="text-left font-semibold text-primary hover:underline" onClick={() => selectRule(item.id)} type="button">
                        {item.id}: {item.title}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.currentVersion} → {item.proposedVersion}</td>
                    <td className="px-4 py-3"><Badge tone={statusTone(itemStatus)}>{itemStatus}</Badge></td>
                    <td className="px-4 py-3"><Badge tone={riskTone(item.riskRating)}>{item.riskRating}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{item.ownerRole}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.approverRole}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.effectiveDate}</td>
                    <td className="px-4 py-3">
                      <div className="w-28"><ProgressBar value={coverage} /></div>
                      <p className="mt-1 text-xs text-muted-foreground">{coverage}%</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <GitCompareArrows className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Rule Version Comparison</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedRule.id}: {selectedRule.changeRationale}</p>
              </div>
            </div>
            <Badge tone={riskTone(selectedRule.riskRating)}>{selectedRule.riskRating}</Badge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Current {selectedRule.currentVersion}</p>
                <Badge tone="default">Current</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedRule.currentLogic}</p>
            </div>
            <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Proposed {selectedRule.proposedVersion}</p>
                <Badge tone="info">Proposed</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedRule.proposedLogic}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button disabled={actionDisabled} onClick={advanceWorkflow} title={actionDisabled && selectedStatus !== "Active" ? `Pass ${requiredScenario?.id ?? "required regression"} before advancing` : actionLabel}>
              <CheckCircle2 className="h-4 w-4" />
              {actionLabel}
            </Button>
            <p className="text-xs text-muted-foreground">
              Maker: {selectedRule.ownerRole} / Checker: {selectedRule.approverRole}
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <Network className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Impact Analysis</h2>
              <p className="mt-1 text-sm text-muted-foreground">Downstream scope that must move with the proposed rule.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ImpactList icon={FileCheck2} items={selectedRule.impactedDocuments} title="Documents" />
            <ImpactList icon={Users} items={selectedRule.impactedRoles} title="Roles" />
            <ImpactList icon={ShieldCheck} items={selectedRule.impactedControls} title="Controls" />
            <ImpactList icon={Beaker} items={selectedRule.linkedUatCases} title="UAT Scope" />
          </div>
          <div className="mt-4 rounded-md border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
            BA recommendation: keep {selectedRule.proposedVersion} outside the active ruleset until linked requirements, regression evidence, operating procedure, and effective-date communication are complete.
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <div className="flex items-start gap-3">
            <Beaker className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Rule Scenario Test Lab</h2>
              <p className="mt-1 text-sm text-muted-foreground">Execute the real checklist engine against controlled expected outcomes.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="grid gap-2 text-sm font-medium">
              Regression scenario
              <select className="control" value={selectedScenarioId} onChange={(event) => { setSelectedScenarioId(event.target.value); setTestResult(null); }}>
                {ruleTestScenarios.map((item) => <option key={item.id} value={item.id}>{item.id}: {item.name}</option>)}
              </select>
            </label>
            <Button onClick={runScenario}>
              <Play className="h-4 w-4" />
              Run Scenario
            </Button>
          </div>

          <div className="mt-4 rounded-md border bg-muted/30 p-4">
            <p className="text-sm font-semibold">{selectedScenario.description}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Expected: {selectedScenario.expectedOutcome}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="info">{selectedScenario.input.applicationType}</Badge>
              <Badge tone="info">{selectedScenario.input.facilityType}</Badge>
              <Badge tone="info">{selectedScenario.input.collateralType}</Badge>
              <Badge tone={selectedScenario.input.riskLevel === "High" ? "danger" : "warning"}>{selectedScenario.input.riskLevel} Risk</Badge>
            </div>
          </div>

          {testResult ? (
            <div className={`mt-4 rounded-md border p-4 ${testResult.outcome === "Pass" ? "border-success/30 bg-success/10" : testResult.outcome === "Design Gap" ? "border-warning/40 bg-warning/10" : "border-danger/30 bg-danger/10"}`}>
              <div className="flex items-center gap-3">
                {testResult.outcome === "Pass" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <AlertTriangle className={`h-5 w-5 ${testResult.outcome === "Design Gap" ? "text-warning" : "text-danger"}`} />}
                <p className="font-semibold">{testResult.outcome}</p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="text-sm text-muted-foreground">Generated documents: <span className="font-semibold text-foreground">{testResult.generatedDocuments}</span></div>
                <div className="text-sm text-muted-foreground">Triggered rules: <span className="font-semibold text-foreground">{testResult.generatedRules}</span></div>
                <div className="text-sm text-muted-foreground">Missing documents: <span className="font-semibold text-foreground">{testResult.missingDocuments.join(", ") || "None"}</span></div>
                <div className="text-sm text-muted-foreground">Missing rules: <span className="font-semibold text-foreground">{testResult.missingRules.join(", ") || "None"}</span></div>
              </div>
            </div>
          ) : null}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Activation Gate</h2>
          <div className="mt-4 space-y-3">
            {[
              ["Owner and checker separated", selectedRule.ownerRole !== selectedRule.approverRole],
              ["Requirement linkage present", selectedRule.linkedRequirements.length > 0],
              ["UAT scope identified", selectedRule.linkedUatCases.length > 0],
              [`Required scenario ${requiredScenario?.id ?? "N/A"} passed`, requiredTestPassed],
              ["Effective date assigned", Boolean(selectedRule.effectiveDate)]
            ].map(([label, passed]) => (
              <div className="flex items-center justify-between gap-3 rounded-md border p-3" key={String(label)}>
                <span className="text-sm text-muted-foreground">{label}</span>
                <Badge tone={passed ? "success" : "danger"}>{passed ? "Clear" : "Blocked"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <Network className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Traceability Coverage</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {governedRules.map((item) => (
            <div className="rounded-md border p-4" key={`coverage-${item.id}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{item.id}</p>
                <Badge tone={statusTone(statusOverrides[item.id] ?? item.status)}>{statusOverrides[item.id] ?? item.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  ["REQ", item.linkedRequirements.length],
                  ["UAT", item.linkedUatCases.length],
                  ["DOC", item.impactedDocuments.length],
                  ["ROLE", item.impactedRoles.length]
                ].map(([label, value]) => (
                  <div className="rounded-md bg-muted/60 px-2 py-3" key={`${item.id}-${label}`}>
                    <p className="font-semibold text-foreground">{value}</p>
                    <p className="mt-1 text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ImpactList({
  icon: Icon,
  items,
  title
}: {
  icon: typeof FileCheck2;
  items: readonly string[];
  title: string;
}) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground" key={item}>
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
