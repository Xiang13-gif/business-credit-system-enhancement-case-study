"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/approval-routing";
import { defaultChecklistInput, generateChecklist } from "@/lib/checklist-rules";
import {
  changeRequests,
  creditPipelineCases,
  policyExceptions,
  traceabilityMatrix,
  uatTestCases
} from "@/lib/mock-data";

const chartColors = ["#0b6e69", "#c99a2e", "#dc2626", "#2563eb", "#7c3aed", "#64748b"];

function countBy<T extends string>(items: T[]) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item] = (accumulator[item] ?? 0) + 1;
    return accumulator;
  }, {});
}

function toChartRows(counts: Record<string, number>) {
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function averageAgingByOwner() {
  const grouped = creditPipelineCases.reduce<Record<string, { aging: number; count: number }>>(
    (accumulator, item) => {
      const current = accumulator[item.ownerRole] ?? { aging: 0, count: 0 };
      accumulator[item.ownerRole] = {
        aging: current.aging + item.agingDays,
        count: current.count + 1
      };
      return accumulator;
    },
    {}
  );

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value: Math.round(value.aging / value.count)
  }));
}

export function PortfolioDashboard() {
  const checklist = generateChecklist(defaultChecklistInput);
  const uatByStatus = toChartRows(countBy(uatTestCases.map((item) => item.status)));
  const crByPriority = toChartRows(countBy(changeRequests.map((item) => item.implementationPriority)));
  const docsByCategory = toChartRows(countBy(checklist.documents.map((item) => item.category)));
  const traceabilityByStatus = toChartRows(countBy(traceabilityMatrix.map((item) => item.status)));
  const pipelineByStage = toChartRows(countBy(creditPipelineCases.map((item) => item.stage)));
  const exceptionsBySeverity = toChartRows(countBy(policyExceptions.map((item) => item.severity)));
  const agingByOwner = averageAgingByOwner();

  const totalCases = uatTestCases.length;
  const passedCases = uatTestCases.filter((item) => item.status === "Passed").length;
  const failedOrBlocked = uatTestCases.filter((item) => ["Failed", "Blocked"].includes(item.status)).length;
  const passRate = Math.round((passedCases / totalCases) * 100);
  const highControlCr = changeRequests.filter((item) => item.implementationPriority === "High").length;
  const totalExposure = creditPipelineCases.reduce((total, item) => total + item.exposure, 0);
  const overdueCases = creditPipelineCases.filter((item) => item.agingDays >= 7).length;
  const averageReadiness = Math.round(
    creditPipelineCases.reduce((total, item) => total + item.documentReadiness, 0) / creditPipelineCases.length
  );
  const openExceptions = policyExceptions.filter((item) => item.status !== "Approved").length;
  const topBottlenecks = [...creditPipelineCases]
    .sort((first, second) => second.agingDays - first.agingDays)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Pipeline Exposure" value={formatCurrency(totalExposure)} helper={`${creditPipelineCases.length} cases`} />
        <StatCard label="Overdue Cases" value={overdueCases} tone={overdueCases > 0 ? "danger" : "success"} helper="7+ aging days" />
        <StatCard label="Doc Readiness" value={`${averageReadiness}%`} tone={averageReadiness >= 85 ? "success" : "warning"} />
        <StatCard label="Open Exceptions" value={openExceptions} tone={openExceptions > 0 ? "warning" : "success"} />
        <StatCard label="UAT Pass Rate" value={`${passRate}%`} tone={passRate >= 80 ? "success" : "warning"} />
        <StatCard label="Failed / Blocked" value={failedOrBlocked} tone={failedOrBlocked > 0 ? "danger" : "success"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Pipeline Stage Volume" description="Shows where commercial credit cases are sitting in the workflow.">
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={pipelineByStage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis angle={-12} dataKey="name" height={66} interval={0} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {pipelineByStage.map((entry, index) => (
                  <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Aging By Owner" description="Highlights which role owns the longest-running bottlenecks.">
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={agingByOwner}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#dc2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="UAT Status Mix" description="Shows delivery health across UAT execution statuses.">
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={uatByStatus}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {uatByStatus.map((entry, index) => (
                  <Cell fill={entry.name === "Failed" ? "#dc2626" : chartColors[index % chartColors.length]} key={entry.name} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Policy Exception Severity" description="Shows the control risk profile across open exception types.">
          <ResponsiveContainer height={280} width="100%">
            <PieChart>
              <Pie cx="50%" cy="50%" data={exceptionsBySeverity} dataKey="value" innerRadius={60} nameKey="name" outerRadius={100} paddingAngle={2}>
                {exceptionsBySeverity.map((entry, index) => (
                  <Cell fill={entry.name === "Critical" ? "#dc2626" : chartColors[index % chartColors.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Document Category Distribution" description="Generated from the checklist rule engine.">
          <ResponsiveContainer height={280} width="100%">
            <PieChart>
              <Pie cx="50%" cy="50%" data={docsByCategory} dataKey="value" innerRadius={60} nameKey="name" outerRadius={100} paddingAngle={2}>
                {docsByCategory.map((entry, index) => (
                  <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Change Request Priority" description="Highlights CR implementation priority and control attention.">
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={crByPriority}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#c99a2e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Traceability Status" description="Shows whether BA linkage items are active, updated, or pending review.">
          <ResponsiveContainer height={280} width="100%">
            <PieChart>
              <Pie cx="50%" cy="50%" data={traceabilityByStatus} dataKey="value" nameKey="name" outerRadius={96}>
                {traceabilityByStatus.map((entry, index) => (
                  <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Pipeline Bottleneck Review</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left">Case</th>
                <th className="px-4 py-3 text-left">Stage</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Exposure</th>
                <th className="px-4 py-3 text-left">Risk</th>
                <th className="px-4 py-3 text-left">Aging</th>
                <th className="px-4 py-3 text-left">Doc Readiness</th>
                <th className="px-4 py-3 text-left">Exceptions</th>
              </tr>
            </thead>
            <tbody>
              {topBottlenecks.map((item) => (
                <tr className="border-t align-top" key={item.id}>
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.stage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.ownerRole}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatCurrency(item.exposure)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.riskLevel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.agingDays} days</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.documentReadiness}%</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.exceptionCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Executive Interpretation</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            `${overdueCases} aged pipeline cases need owner follow-up before weekly credit governance review.`,
            `${openExceptions} non-approved exceptions require mitigation, approval tier, evidence, and UAT coverage.`,
            `${highControlCr} high-priority change requests should include control impact, test scope, and BA recommendation.`
          ].map((item) => (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground" key={item}>
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
