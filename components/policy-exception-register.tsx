"use client";

import { Download, Filter, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { policyExceptions } from "@/lib/mock-data";
import type { ExceptionSeverity, PolicyException } from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

type ExceptionStatus = PolicyException["status"];
type ExceptionStatusFilter = ExceptionStatus | "All";
type SeverityFilter = ExceptionSeverity | "All";

const statuses: ExceptionStatusFilter[] = ["All", "Draft", "Pending Approval", "Approved", "Rejected", "Expired"];
const severities: SeverityFilter[] = ["All", "Minor", "Major", "Critical"];

function severityTone(severity: ExceptionSeverity) {
  if (severity === "Critical") {
    return "danger";
  }
  if (severity === "Major") {
    return "warning";
  }
  if (severity === "Minor") {
    return "info";
  }
  return "default";
}

function statusTone(status: ExceptionStatus) {
  if (status === "Approved") {
    return "success";
  }
  if (status === "Pending Approval") {
    return "warning";
  }
  if (status === "Rejected" || status === "Expired") {
    return "danger";
  }
  return "default";
}

export function PolicyExceptionRegister() {
  const [status, setStatus] = useState<ExceptionStatusFilter>("All");
  const [severity, setSeverity] = useState<SeverityFilter>("All");

  const filteredExceptions = useMemo(
    () =>
      policyExceptions.filter(
        (item) =>
          (status === "All" || item.status === status) &&
          (severity === "All" || item.severity === severity)
      ),
    [severity, status]
  );

  const pendingApproval = policyExceptions.filter((item) => item.status === "Pending Approval").length;
  const criticalExceptions = policyExceptions.filter((item) => item.severity === "Critical").length;
  const overdueExceptions = policyExceptions.filter((item) => item.agingDays >= 7 && item.status !== "Approved").length;
  const averageAging = Math.round(
    policyExceptions.reduce((total, item) => total + item.agingDays, 0) / policyExceptions.length
  );

  const exportExceptions = () => {
    downloadCsv(
      "policy-exception-register.csv",
      toCsv(
        filteredExceptions.map((item) => ({
          id: item.id,
          type: item.type,
          severity: item.severity,
          facilityType: item.facilityType,
          status: item.status,
          ownerRole: item.ownerRole,
          agingDays: item.agingDays,
          mitigation: item.mitigation,
          approvalTier: item.approvalTier,
          linkedRequirement: item.linkedRequirement,
          linkedTestCase: item.linkedTestCase,
          controlEvidence: item.controlEvidence
        }))
      )
    );

    recordAuditEvent({
      actor: "Risk Control Reviewer",
      action: "Exception register exported",
      module: "Policy Exception",
      referenceId: `${filteredExceptions.length} rows`,
      details: `Exported exception register using status ${status} and severity ${severity} filters.`,
      controlImpact: criticalExceptions > 0 ? "High" : "Medium"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Policy Exceptions" value={policyExceptions.length} helper="Portfolio sample" />
        <StatCard label="Pending Approval" value={pendingApproval} tone={pendingApproval > 0 ? "warning" : "success"} />
        <StatCard label="Critical Severity" value={criticalExceptions} tone={criticalExceptions > 0 ? "danger" : "success"} />
        <StatCard label="Average Aging" value={`${averageAging} days`} helper={`${overdueExceptions} overdue`} tone={overdueExceptions > 0 ? "danger" : "success"} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Exception Governance Filters</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review exceptions by approval status and severity to simulate risk and control oversight.
              </p>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-[180px_180px_auto]">
            <select className="control" value={status} onChange={(event) => setStatus(event.target.value as ExceptionStatusFilter)}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select className="control" value={severity} onChange={(event) => setSeverity(event.target.value as SeverityFilter)}>
              {severities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Button onClick={exportExceptions} variant="secondary">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Exception Register</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each row is linked to BA requirements, UAT coverage, mitigation, approval authority, and evidence.
              </p>
            </div>
            <Badge tone="info">{filteredExceptions.length} shown</Badge>
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1080px] border-collapse text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Exception</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-left">Aging</th>
                  <th className="px-4 py-3 text-left">Approval Tier</th>
                  <th className="px-4 py-3 text-left">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredExceptions.map((item) => (
                  <tr className="border-t align-top" key={item.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.id}: {item.type}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.facilityType} / {item.mitigation}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={severityTone(item.severity)}>{item.severity}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.ownerRole}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.agingDays} days</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.approvalTier}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.controlEvidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 text-warning-foreground dark:text-warning" />
              <div>
                <h2 className="text-lg font-semibold">Control Lens</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Exceptions are not just notes. A strong banking workflow records severity, mitigation,
                  approval authority, aging, evidence, and UAT coverage.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Release Gate</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
                Critical or expired exceptions should be reviewed before production sign-off.
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                Pending approval exceptions should remain visible in dashboard and approval memo.
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                Each exception should map to at least one requirement and UAT test case.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
