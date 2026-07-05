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
import { defaultChecklistInput, generateChecklist } from "@/lib/checklist-rules";
import { changeRequests, traceabilityMatrix, uatTestCases } from "@/lib/mock-data";

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

export function PortfolioDashboard() {
  const checklist = generateChecklist(defaultChecklistInput);
  const uatByStatus = toChartRows(countBy(uatTestCases.map((item) => item.status)));
  const crByPriority = toChartRows(countBy(changeRequests.map((item) => item.implementationPriority)));
  const docsByCategory = toChartRows(countBy(checklist.documents.map((item) => item.category)));
  const traceabilityByStatus = toChartRows(countBy(traceabilityMatrix.map((item) => item.status)));

  const totalCases = uatTestCases.length;
  const passedCases = uatTestCases.filter((item) => item.status === "Passed").length;
  const failedOrBlocked = uatTestCases.filter((item) => ["Failed", "Blocked"].includes(item.status)).length;
  const pendingRetest = uatTestCases.filter((item) => item.retestStatus === "Pending Retest" || item.retestStatus === "Retest Failed").length;
  const passRate = Math.round((passedCases / totalCases) * 100);
  const highControlCr = changeRequests.filter((item) => item.implementationPriority === "High").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="UAT Pass Rate" value={`${passRate}%`} tone={passRate >= 80 ? "success" : "warning"} />
        <StatCard label="Failed / Blocked" value={failedOrBlocked} tone={failedOrBlocked > 0 ? "danger" : "success"} />
        <StatCard label="Pending Retest" value={pendingRetest} tone={pendingRetest > 0 ? "warning" : "success"} />
        <StatCard label="High Priority CR" value={highControlCr} tone={highControlCr > 0 ? "danger" : "success"} />
        <StatCard label="Checklist Documents" value={checklist.documents.length} helper="Default scenario" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
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
        <h2 className="text-lg font-semibold">Dashboard Interpretation</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "Failed or blocked UAT cases should be reviewed before sign-off.",
            "High priority CRs should include control impact, UAT scope, and BA recommendation.",
            "Checklist document distribution helps explain why some credit scenarios require more control evidence."
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
