"use client";

import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { uatTestCases } from "@/lib/mock-data";
import type { UatPriority, UatRole, UatStatus, UatTestCase } from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

const statuses: Array<UatStatus | "All"> = ["All", "Not Started", "In Progress", "Passed", "Failed", "Blocked"];
const priorities: Array<UatPriority | "All"> = ["All", "High", "Medium", "Low"];
const roles: Array<UatRole | "All"> = ["All", "RM", "Credit Analyst", "Approver", "Credit Admin", "System Admin"];

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

export function UatTracker() {
  const [cases, setCases] = useState<UatTestCase[]>(() => {
    if (typeof window === "undefined") {
      return uatTestCases;
    }

    const stored = window.localStorage.getItem("creditflow-uat-status");
    if (!stored) {
      return uatTestCases;
    }

    const storedStatuses = JSON.parse(stored) as Record<string, UatStatus>;
    return uatTestCases.map((item) => ({
      ...item,
      status: storedStatuses[item.id] ?? item.status
    }));
  });
  const [status, setStatus] = useState<UatStatus | "All">("All");
  const [priority, setPriority] = useState<UatPriority | "All">("All");
  const [role, setRole] = useState<UatRole | "All">("All");
  const [search, setSearch] = useState("");

  const updateStatus = (id: string, nextStatus: UatStatus) => {
    setCases((current) => {
      const updated = current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item));
      const storedStatuses = Object.fromEntries(updated.map((item) => [item.id, item.status]));
      window.localStorage.setItem("creditflow-uat-status", JSON.stringify(storedStatuses));
      return updated;
    });
  };

  const filteredCases = useMemo(() => {
    const term = search.trim().toLowerCase();
    return cases.filter((item) => {
      const matchesStatus = status === "All" || item.status === status;
      const matchesPriority = priority === "All" || item.priority === priority;
      const matchesRole = role === "All" || item.role === role;
      const matchesSearch =
        term.length === 0 ||
        item.id.toLowerCase().includes(term) ||
        item.requirementId.toLowerCase().includes(term) ||
        item.scenario.toLowerCase().includes(term);

      return matchesStatus && matchesPriority && matchesRole && matchesSearch;
    });
  }, [cases, priority, role, search, status]);

  const total = cases.length;
  const passed = cases.filter((item) => item.status === "Passed").length;
  const failed = cases.filter((item) => item.status === "Failed").length;
  const blocked = cases.filter((item) => item.status === "Blocked").length;
  const notStarted = cases.filter((item) => item.status === "Not Started").length;
  const passRate = total === 0 ? 0 : Math.round((passed / total) * 100);
  const highPriorityOpen = cases.filter((item) => item.priority === "High" && item.status !== "Passed").length;
  const defectsLinked = cases.filter((item) => Boolean(item.defectId)).length;

  const exportReport = () => {
    downloadCsv(
      "creditflow-uat-report.csv",
      toCsv(
        filteredCases.map((item) => ({
          id: item.id,
          module: item.module,
          requirementId: item.requirementId,
          scenario: item.scenario,
          priority: item.priority,
          status: item.status,
          role: item.role,
          assignedTester: item.assignedTester,
          executionDate: item.executionDate,
          defectId: item.defectId,
          remarks: item.remarks
        }))
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Test Cases" value={total} />
        <StatCard label="Pass Rate" value={`${passRate}%`} tone={passRate >= 80 ? "success" : "warning"} helper={`${passed} passed`} />
        <StatCard label="Failed / Blocked" value={failed + blocked} tone={failed + blocked > 0 ? "danger" : "success"} helper={`${failed} failed, ${blocked} blocked`} />
        <StatCard label="High Priority Open" value={highPriorityOpen} tone={highPriorityOpen > 0 ? "warning" : "success"} helper={`${defectsLinked} defects linked`} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">UAT Progress</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {passed} of {total} cases passed. {notStarted} not started.
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
              placeholder="Search test case or requirement"
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
          <table className="w-full min-w-[1120px] border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left">Test Case</th>
                <th className="px-4 py-3 text-left">Requirement</th>
                <th className="px-4 py-3 text-left">Scenario</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Defect</th>
                <th className="px-4 py-3 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item) => (
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
                  <td className="px-4 py-3">{item.defectId ? <Badge tone="danger">{item.defectId}</Badge> : <span className="text-muted-foreground">None</span>}</td>
                  <td className="max-w-xs px-4 py-3 text-muted-foreground">{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
