"use client";

import { BriefcaseBusiness, CheckCircle2, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Card, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { changeRequests, uatTestCases } from "@/lib/mock-data";
import type { UatRole } from "@/lib/types";

const roles: UatRole[] = ["RM", "Credit Analyst", "Approver", "Credit Admin", "System Admin"];

const roleSummary: Record<UatRole, { focus: string; controls: string[] }> = {
  RM: {
    focus: "Prepare complete application package and resolve missing document actions.",
    controls: ["Mandatory document completeness", "Waiver justification", "Customer communication"]
  },
  "Credit Analyst": {
    focus: "Assess credit quality, exception rationale, financial evidence, and approval package readiness.",
    controls: ["Financial statement waiver", "Credit exception memo", "Risk rating evidence"]
  },
  Approver: {
    focus: "Review high-risk decisions, missing document exceptions, and approval recommendation quality.",
    controls: ["Approval authority", "High risk EDD", "Exception visibility"]
  },
  "Credit Admin": {
    focus: "Confirm documentation readiness, collateral evidence, and conditions before downstream setup.",
    controls: ["Security enforceability", "Document verification", "Facility setup readiness"]
  },
  "System Admin": {
    focus: "Maintain system configuration, UAT workflow visibility, and release readiness controls.",
    controls: ["Status workflow", "Defect linkage", "Access and configuration control"]
  }
};

export function RoleBasedView() {
  const [selectedRole, setSelectedRole] = useState<UatRole>("RM");

  const roleCases = useMemo(
    () => uatTestCases.filter((item) => item.role === selectedRole),
    [selectedRole]
  );
  const impactedCrs = useMemo(
    () => changeRequests.filter((item) => item.impactedRoles.includes(selectedRole)),
    [selectedRole]
  );
  const openCases = roleCases.filter((item) => item.status !== "Passed");
  const failedOrBlocked = roleCases.filter((item) => item.status === "Failed" || item.status === "Blocked");
  const roleInfo = roleSummary[selectedRole];

  const handleRoleChange = (role: UatRole) => {
    setSelectedRole(role);
    recordAuditEvent({
      actor: "Portfolio Reviewer",
      action: "Role view switched",
      module: "Role-Based View",
      referenceId: role,
      details: `Reviewer switched to ${role} view to inspect role-specific UAT and CR impact.`,
      controlImpact: role === "Approver" || role === "Credit Analyst" ? "High" : "Medium"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Role Lens</h2>
            <p className="mt-1 text-sm text-muted-foreground">Switch role to see different delivery focus and open work.</p>
          </div>
          <select className="control min-w-64" value={selectedRole} onChange={(event) => handleRoleChange(event.target.value as UatRole)}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Role UAT Cases" value={roleCases.length} />
        <StatCard label="Open Items" value={openCases.length} tone={openCases.length > 0 ? "warning" : "success"} />
        <StatCard label="Failed / Blocked" value={failedOrBlocked.length} tone={failedOrBlocked.length > 0 ? "danger" : "success"} />
        <StatCard label="Impacted CRs" value={impactedCrs.length} helper={impactedCrs.map((item) => item.id).join(", ") || "None"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{selectedRole} Focus</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{roleInfo.focus}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {roleInfo.controls.map((control) => (
              <div className="rounded-lg border bg-muted/30 p-4" key={control}>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-warning-foreground dark:text-warning" />
                  <p className="text-sm font-semibold">{control}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Sign-off Guidance</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Open high-priority UAT items should be resolved before release sign-off.</li>
            <li>Change requests impacting this role should be reflected in UAT regression scope.</li>
            <li>Failed cases require defect ID and retest evidence.</li>
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Role UAT Queue</h2>
          <div className="mt-4 space-y-3">
            {roleCases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No UAT cases assigned to this role.</p>
            ) : (
              roleCases.map((item) => (
                <div className="rounded-lg border p-4" key={item.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="info">{item.id}</Badge>
                    <Badge tone={item.status === "Passed" ? "success" : item.status === "Failed" ? "danger" : "warning"}>{item.status}</Badge>
                    <Badge tone={item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "default"}>{item.priority}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-medium">{item.scenario}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.remarks}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Impacted Change Requests</h2>
          <div className="mt-4 space-y-3">
            {impactedCrs.map((item) => (
              <div className="rounded-lg border p-4" key={item.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="info">{item.id}</Badge>
                  <Badge tone={item.implementationPriority === "High" ? "danger" : "warning"}>{item.implementationPriority}</Badge>
                </div>
                <p className="mt-3 text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.baRecommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
          <div>
            <h2 className="text-lg font-semibold">Why This Adds Value</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This view shows that the same system enhancement affects each banking role differently. That is the kind of stakeholder thinking hiring managers expect from a strong Banking BA.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
