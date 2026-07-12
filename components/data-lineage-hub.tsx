"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  Download,
  GitBranch,
  ShieldAlert,
  UserRoundCog
} from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { criticalDataElements, dataQualityIssues } from "@/lib/transformation-data";
import type { DataQualityStatus } from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

type StatusFilter = "All" | DataQualityStatus;

function statusTone(status: DataQualityStatus) {
  if (status === "Healthy") {
    return "success" as const;
  }
  if (status === "Watch") {
    return "warning" as const;
  }
  return "danger" as const;
}

function severityTone(severity: string) {
  if (severity === "Critical" || severity === "High") {
    return "danger" as const;
  }
  if (severity === "Medium") {
    return "warning" as const;
  }
  return "default" as const;
}

export function DataLineageHub() {
  const [selectedId, setSelectedId] = useState("CDE-005");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const selected = criticalDataElements.find((item) => item.id === selectedId) ?? criticalDataElements[0];
  const filteredElements = criticalDataElements.filter((item) => statusFilter === "All" || item.status === statusFilter);
  const selectedIssues = dataQualityIssues.filter((item) => item.dataElementId === selected.id);
  const averageQuality = Math.round(criticalDataElements.reduce((sum, item) => sum + item.qualityScore, 0) / criticalDataElements.length);
  const averageLineage = Math.round(criticalDataElements.reduce((sum, item) => sum + item.lineageCoverage, 0) / criticalDataElements.length);
  const breachCount = criticalDataElements.filter((item) => item.status === "Breach").length;
  const openIssueCount = dataQualityIssues.filter((item) => item.status !== "Closed").length;

  const exportInventory = () => {
    downloadCsv(
      "credit-critical-data-inventory.csv",
      toCsv(criticalDataElements.map((item) => ({
        id: item.id,
        businessTerm: item.businessTerm,
        definition: item.definition,
        sourceSystem: item.sourceSystem,
        sourceField: item.sourceField,
        transformation: item.transformation,
        linkedRule: item.linkedRule,
        outputUsage: item.outputUsage,
        owner: item.owner,
        qualityScore: item.qualityScore,
        lineageCoverage: item.lineageCoverage,
        status: item.status
      })))
    );
    recordAuditEvent({
      actor: "Credit Data Steward",
      action: "Critical data inventory exported",
      module: "Data Governance",
      referenceId: "CDE-INVENTORY",
      details: `Exported ${criticalDataElements.length} critical data elements with source-to-output lineage and quality scores.`,
      controlImpact: "Medium"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Critical Data Elements" value={criticalDataElements.length} helper="Credit decision scope" />
        <StatCard label="Average Data Quality" value={`${averageQuality}%`} tone={averageQuality >= 95 ? "success" : "warning"} />
        <StatCard label="Lineage Coverage" value={`${averageLineage}%`} tone={averageLineage >= 95 ? "success" : "warning"} />
        <StatCard label="Quality Breaches" value={breachCount} tone={breachCount > 0 ? "danger" : "success"} />
        <StatCard label="Open DQ Issues" value={openIssueCount} tone={openIssueCount > 0 ? "warning" : "success"} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Database className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Critical Data Element Register</h2>
              <p className="mt-1 text-sm text-muted-foreground">Business definition, accountable owner, quality position, and decision usage.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="grid grid-cols-4 rounded-md border bg-muted/40 p-1">
              {(["All", "Healthy", "Watch", "Breach"] as StatusFilter[]).map((item) => (
                <button
                  className={`h-9 rounded px-3 text-xs font-semibold transition ${statusFilter === item ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  key={item}
                  onClick={() => setStatusFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <Button onClick={exportInventory} variant="secondary">
              <Download className="h-4 w-4" />
              Export Inventory
            </Button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[1120px] border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left">Data Element</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Business Rule</th>
                <th className="px-4 py-3 text-left">Decision Output</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Quality</th>
                <th className="px-4 py-3 text-left">Lineage</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredElements.map((item) => (
                <tr className={`border-t align-top ${selected.id === item.id ? "bg-primary/5" : ""}`} key={item.id}>
                  <td className="px-4 py-3">
                    <button className="text-left font-semibold text-primary hover:underline" onClick={() => setSelectedId(item.id)} type="button">
                      {item.id}: {item.businessTerm}
                    </button>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">{item.definition}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.sourceSystem}<br /><span className="text-xs">{item.sourceField}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{item.linkedRule}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.outputUsage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.owner}</td>
                  <td className="px-4 py-3">
                    <div className="w-24"><ProgressBar value={item.qualityScore} /></div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.qualityScore}%</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.lineageCoverage}%</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(item.status)}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <GitBranch className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">Source-to-Decision Lineage</h2>
                <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{selected.id}: {selected.businessTerm}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={selected.qualityScore >= 95 ? "success" : selected.qualityScore >= 80 ? "warning" : "danger"}>{selected.qualityScore}% quality</Badge>
            <Badge tone={selected.lineageCoverage >= 95 ? "success" : "warning"}>{selected.lineageCoverage}% lineage</Badge>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          <LineageNode eyebrow="System of Record" title={selected.sourceSystem} value={selected.sourceField} />
          <FlowArrow />
          <LineageNode eyebrow="Transformation" title="Data Control" value={selected.transformation} />
          <FlowArrow />
          <LineageNode eyebrow="Decision Rule" title={selected.linkedRule} value="Versioned rule execution" />
          <FlowArrow />
          <LineageNode eyebrow="Downstream Use" title="Decision Outputs" value={selected.outputUsage} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-sm font-semibold">Data Quality Controls</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {selected.qualityChecks.map((item) => (
                <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground" key={item}>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <UserRoundCog className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Accountability</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{selected.owner}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Owns business definition, quality threshold, remediation decision, and downstream impact communication.</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Data Quality Issue Register</h2>
            <p className="mt-1 text-sm text-muted-foreground">Root cause, downstream decision impact, accountable owner, and remediation date.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {dataQualityIssues.map((issue) => {
            const element = criticalDataElements.find((item) => item.id === issue.dataElementId);
            return (
              <div className={`rounded-md border p-4 ${issue.dataElementId === selected.id ? "border-primary/40 bg-primary/5" : ""}`} key={issue.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={severityTone(issue.severity)}>{issue.severity}</Badge>
                    <Badge tone="default">{issue.status}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">Due {issue.dueDate}</span>
                </div>
                <h3 className="mt-4 font-semibold">{issue.id}: {element?.businessTerm}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{issue.issue}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <IssueField label="Root Cause" value={issue.rootCause} />
                  <IssueField label="Decision Impact" value={issue.downstreamImpact} />
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Owner: {issue.owner}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          {selectedIssues.length > 0 ? <AlertTriangle className="mt-0.5 h-5 w-5 text-danger" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />}
          <div>
            <h2 className="text-lg font-semibold">BA Data Recommendation</h2>
            <p className="mt-2 max-w-5xl text-sm leading-6 text-muted-foreground">
              {selectedIssues.length > 0
                ? `${selected.businessTerm} has ${selectedIssues.length} linked quality issue${selectedIssues.length === 1 ? "" : "s"}. Do not treat downstream approval or memo outputs as fully reliable until the owner completes remediation, reconciliation, and impact validation.`
                : `${selected.businessTerm} has no linked issue in the sample register. Continue periodic quality monitoring and preserve source-to-output lineage whenever the rule or source system changes.`}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LineageNode({ eyebrow, title, value }: { eyebrow: string; title: string; value: string }) {
  return (
    <div className="min-h-32 flex-1 rounded-md border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-normal text-primary">{eyebrow}</p>
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center text-primary">
      <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
    </div>
  );
}

function IssueField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 p-3">
      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{label}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}
