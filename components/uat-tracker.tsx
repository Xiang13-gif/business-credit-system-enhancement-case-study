"use client";

import { Bug, Download, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import {
  assessUatSignOff,
  createDefectFromTestCase,
  readDefects,
  retestStatusFromDefect,
  seedDefects
} from "@/lib/defect-management";
import { uatTestCases } from "@/lib/mock-data";
import type { DefectRecord, RetestStatus, UatPriority, UatRole, UatStatus, UatTestCase } from "@/lib/types";
import {
  readUatRetestMap,
  readUatStatusMap,
  writeUatRetestMap,
  writeUatStatusMap
} from "@/lib/uat-state";
import { downloadCsv, toCsv } from "@/lib/utils";

const statuses: Array<UatStatus | "All"> = ["All", "Not Started", "In Progress", "Passed", "Failed", "Blocked"];
const priorities: Array<UatPriority | "All"> = ["All", "High", "Medium", "Low"];
const roles: Array<UatRole | "All"> = ["All", "RM", "Credit Analyst", "Approver", "Credit Admin", "System Admin"];
const retestStatuses: RetestStatus[] = ["Not Required", "Pending Retest", "Retest Passed", "Retest Failed"];

function statusTone(status: UatStatus) {
  if (status === "Passed") {
    return "success";
  }
  if (status === "Failed") {
    return "danger";
  }
  if (status === "Blocked") {
    return "warning";
  }
  if (status === "In Progress") {
    return "info";
  }
  return "default";
}

function priorityTone(priority: UatPriority) {
  if (priority === "High") {
    return "danger";
  }
  if (priority === "Medium") {
    return "warning";
  }
  return "default";
}

function retestTone(status: RetestStatus) {
  if (status === "Retest Passed") {
    return "success";
  }
  if (status === "Retest Failed") {
    return "danger";
  }
  if (status === "Pending Retest") {
    return "warning";
  }
  return "default";
}

export function UatTracker() {
  const [cases, setCases] = useState<UatTestCase[]>(uatTestCases);
  const [defects, setDefects] = useState<DefectRecord[]>(seedDefects);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedStatuses = readUatStatusMap();
      const storedRetests = readUatRetestMap();
      const storedDefects = readDefects();

      setCases(
        uatTestCases.map((item) => {
          const linkedDefect = storedDefects.find((defect) => defect.linkedTestCaseId === item.id);
          return {
            ...item,
            status: storedStatuses[item.id] ?? item.status,
            retestStatus: linkedDefect ? retestStatusFromDefect(linkedDefect) : storedRetests[item.id] ?? item.retestStatus
          };
        })
      );
      setDefects(storedDefects);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);
  const [status, setStatus] = useState<UatStatus | "All">("All");
  const [priority, setPriority] = useState<UatPriority | "All">("All");
  const [role, setRole] = useState<UatRole | "All">("All");
  const [search, setSearch] = useState("");
  const linkedDefectByCase = useMemo(
    () => new Map(defects.map((defect) => [defect.linkedTestCaseId, defect])),
    [defects]
  );

  const persistStatus = (updated: UatTestCase[]) => {
    const storedStatuses = Object.fromEntries(updated.map((item) => [item.id, item.status]));
    writeUatStatusMap(storedStatuses);
  };

  const persistRetest = (updated: UatTestCase[]) => {
    const storedRetests = Object.fromEntries(updated.map((item) => [item.id, item.retestStatus]));
    writeUatRetestMap(storedRetests);
  };

  const updateStatus = (id: string, nextStatus: UatStatus) => {
    setCases((current) => {
      const previous = current.find((item) => item.id === id);
      const updated = current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item));
      persistStatus(updated);

      if (previous && previous.status !== nextStatus) {
        recordAuditEvent({
          actor: "UAT Coordinator",
          action: "UAT status updated",
          module: "UAT Tracker",
          referenceId: id,
          details: `${id} status changed from ${previous.status} to ${nextStatus}.`,
          controlImpact: nextStatus === "Failed" || nextStatus === "Blocked" ? "High" : "Medium"
        });
      }

      return updated;
    });
  };

  const updateRetestStatus = (id: string, nextStatus: RetestStatus) => {
    setCases((current) => {
      const previous = current.find((item) => item.id === id);
      const updated = current.map((item) => (item.id === id ? { ...item, retestStatus: nextStatus } : item));
      persistRetest(updated);

      if (previous && previous.retestStatus !== nextStatus) {
        recordAuditEvent({
          actor: "UAT Coordinator",
          action: "Retest status updated",
          module: "UAT Tracker",
          referenceId: id,
          details: `${id} retest status changed from ${previous.retestStatus} to ${nextStatus}.`,
          controlImpact: nextStatus === "Retest Failed" ? "High" : "Medium"
        });
      }

      return updated;
    });
  };

  const raiseDefect = (testCase: UatTestCase) => {
    const existing = defects.find((defect) => defect.linkedTestCaseId === testCase.id);
    if (existing) {
      return;
    }
    const { defect, updated } = createDefectFromTestCase(testCase, defects);
    setDefects(updated);
    setCases((current) => current.map((item) => item.id === testCase.id ? {
      ...item,
      defectId: defect.id,
      defectSeverity: defect.severity,
      retestStatus: "Pending Retest"
    } : item));
    recordAuditEvent({
      actor: "UAT Coordinator",
      action: "Defect raised from UAT",
      module: "UAT Tracker",
      referenceId: defect.id,
      details: `${defect.id} raised from ${testCase.id} and linked to ${testCase.requirementId}.`,
      controlImpact: defect.severity === "High" || defect.severity === "Critical" ? "High" : "Medium"
    });
  };

  const filteredCases = useMemo(() => {
    const term = search.trim().toLowerCase();
    return cases.filter((item) => {
      const linkedDefect = linkedDefectByCase.get(item.id);
      const matchesStatus = status === "All" || item.status === status;
      const matchesPriority = priority === "All" || item.priority === priority;
      const matchesRole = role === "All" || item.role === role;
      const matchesSearch =
        term.length === 0 ||
        item.id.toLowerCase().includes(term) ||
        item.requirementId.toLowerCase().includes(term) ||
        item.scenario.toLowerCase().includes(term) ||
        item.defectId?.toLowerCase().includes(term) ||
        linkedDefect?.id.toLowerCase().includes(term) ||
        linkedDefect?.rootCause.toLowerCase().includes(term);

      return matchesStatus && matchesPriority && matchesRole && matchesSearch;
    });
  }, [cases, linkedDefectByCase, priority, role, search, status]);

  const total = cases.length;
  const passed = cases.filter((item) => item.status === "Passed").length;
  const failed = cases.filter((item) => item.status === "Failed").length;
  const blocked = cases.filter((item) => item.status === "Blocked").length;
  const notStarted = cases.filter((item) => item.status === "Not Started").length;
  const passRate = total === 0 ? 0 : Math.round((passed / total) * 100);
  const uatAssessment = assessUatSignOff(cases, {}, defects);
  const { defectAssessment } = uatAssessment;
  const highPriorityOpen = uatAssessment.highPriorityOpen.length;
  const defectsLinked = defects.length;
  const pendingRetest = defectAssessment.pendingRetest.length;
  const signOffPosition = uatAssessment.position === "Pass" ? "Ready" : uatAssessment.position === "Watch" ? "Conditional" : "Not Ready";

  const exportReport = () => {
    downloadCsv(
      "gccm-uat-report.csv",
      toCsv(
        filteredCases.map((item) => {
          const linkedDefect = linkedDefectByCase.get(item.id);
          return {
          id: item.id,
          module: item.module,
          requirementId: item.requirementId,
          scenario: item.scenario,
          priority: item.priority,
          status: item.status,
          role: item.role,
          assignedTester: item.assignedTester,
          executionDate: item.executionDate,
          defectId: linkedDefect?.id ?? item.defectId,
          defectSeverity: linkedDefect?.severity ?? item.defectSeverity,
          rootCause: linkedDefect?.rootCause ?? item.rootCause,
          retestStatus: linkedDefect ? retestStatusFromDefect(linkedDefect) : item.retestStatus,
          riskAcceptanceStatus: linkedDefect?.riskAcceptanceStatus ?? "Not Required",
          remarks: item.remarks
          };
        })
      )
    );
    recordAuditEvent({
      actor: "UAT Coordinator",
      action: "UAT report exported",
      module: "UAT Tracker",
      referenceId: "UAT-REPORT",
      details: `Exported ${filteredCases.length} filtered UAT rows.`,
      controlImpact: "Low"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Test Cases" value={total} />
        <StatCard label="Pass Rate" value={`${passRate}%`} tone={passRate >= 80 ? "success" : "warning"} helper={`${passed} passed`} />
        <StatCard label="Failed / Blocked" value={failed + blocked} tone={failed + blocked > 0 ? "danger" : "success"} helper={`${failed} failed, ${blocked} blocked`} />
        <StatCard label="Pending Retest" value={pendingRetest} tone={pendingRetest > 0 ? "warning" : "success"} helper={`${defectsLinked} defects managed`} />
        <StatCard label="Sign-off Position" value={signOffPosition} tone={uatAssessment.position === "Pass" ? "success" : uatAssessment.position === "Watch" ? "warning" : "danger"} helper={`${highPriorityOpen} high priority blockers`} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">UAT Progress</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {passed} of {total} cases passed. {notStarted} not started. Release sign-off is {signOffPosition.toLowerCase()}.
            </p>
          </div>
          <div className="w-full lg:max-w-md">
            <ProgressBar value={passRate} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_160px_160px_170px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              className="control w-full pl-9"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search test case, requirement, scenario or defect"
              value={search}
            />
          </label>
          <select className="control" value={status} onChange={(event) => setStatus(event.target.value as UatStatus | "All")}>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="control" value={priority} onChange={(event) => setPriority(event.target.value as UatPriority | "All")}>
            {priorities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="control" value={role} onChange={(event) => setRole(event.target.value as UatRole | "All")}>
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Button onClick={exportReport} variant="secondary">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[1360px] border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left">Test Case</th>
                <th className="px-4 py-3 text-left">Requirement</th>
                <th className="px-4 py-3 text-left">Scenario</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Defect</th>
                <th className="px-4 py-3 text-left">Retest</th>
                <th className="px-4 py-3 text-left">Root Cause / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item) => {
                const linkedDefect = linkedDefectByCase.get(item.id);
                const displayedRetestStatus = linkedDefect ? retestStatusFromDefect(linkedDefect) : item.retestStatus;
                return (
                <tr className={item.status === "Failed" ? "border-t bg-danger/5 align-top" : "border-t align-top"} key={item.id}>
                  <td className="px-4 py-3 font-semibold">{item.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.requirementId}</td>
                  <td className="max-w-md px-4 py-3">
                    <p className="font-medium">{item.scenario}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.expectedResult}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={priorityTone(item.priority)}>{item.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                      <select className="control h-9" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value as UatStatus)}>
                        {statuses.filter((statusOption) => statusOption !== "All").map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      {linkedDefect ? <Badge tone="danger">{linkedDefect.id}</Badge> : item.defectId ? <Badge tone="danger">{item.defectId}</Badge> : <span className="text-muted-foreground">None</span>}
                      {linkedDefect ? <Badge tone={linkedDefect.severity === "Critical" || linkedDefect.severity === "High" ? "danger" : "warning"}>{linkedDefect.severity}</Badge> : item.defectSeverity ? <Badge tone={item.defectSeverity === "Critical" || item.defectSeverity === "High" ? "danger" : "warning"}>{item.defectSeverity}</Badge> : null}
                      {!linkedDefect && (item.status === "Failed" || item.status === "Blocked") ? (
                        <Button onClick={() => raiseDefect(item)} variant="secondary"><Bug className="h-4 w-4" />Raise Defect</Button>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <Badge tone={retestTone(displayedRetestStatus)}>{displayedRetestStatus}</Badge>
                      {linkedDefect ? (
                        <Button href="/defects" variant="ghost">Manage Defect</Button>
                      ) : (
                        <select className="control h-9" value={item.retestStatus} onChange={(event) => updateRetestStatus(item.id, event.target.value as RetestStatus)}>
                          {retestStatuses.map((retestStatus) => (
                            <option key={retestStatus} value={retestStatus}>
                              {retestStatus}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="max-w-sm px-4 py-3 text-muted-foreground">
                    {linkedDefect?.rootCause || item.rootCause ? <p className="font-medium text-foreground">{linkedDefect?.rootCause ?? item.rootCause}</p> : null}
                    <p className={linkedDefect?.rootCause || item.rootCause ? "mt-2" : ""}>{item.remarks}</p>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
