"use client";

import {
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  Download,
  Gauge,
  LineChart,
  Target
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/approval-routing";
import { recordAuditEvent } from "@/lib/audit-log";
import { benefitMetrics, productRoadmap } from "@/lib/transformation-data";
import type { BenefitMetric, ProductRoadmapItem } from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

type HorizonFilter = "All" | ProductRoadmapItem["horizon"];

function metricProgress(metric: BenefitMetric) {
  const targetDelta = metric.direction === "Increase"
    ? metric.target - metric.baseline
    : metric.baseline - metric.target;
  const achievedDelta = metric.direction === "Increase"
    ? metric.current - metric.baseline
    : metric.baseline - metric.current;
  if (targetDelta <= 0) {
    return 100;
  }
  return Math.round(Math.min(100, Math.max(0, (achievedDelta / targetDelta) * 100)));
}

function progressTone(progress: number) {
  if (progress >= 80) {
    return "success" as const;
  }
  if (progress >= 55) {
    return "warning" as const;
  }
  return "danger" as const;
}

function compactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
    style: "currency"
  }).format(value);
}

export function ValueRealizationDashboard() {
  const [annualCases, setAnnualCases] = useState(2400);
  const [manualHours, setManualHours] = useState(3.8);
  const [futureHours, setFutureHours] = useState(2.1);
  const [hourlyCost, setHourlyCost] = useState(45);
  const [implementationCost, setImplementationCost] = useState(185000);
  const [horizon, setHorizon] = useState<HorizonFilter>("All");

  const valueCase = useMemo(() => {
    const annualHoursSaved = Math.max(0, manualHours - futureHours) * annualCases;
    const productivityBenefit = annualHoursSaved * hourlyCost;
    const firstTimeRightGain = annualCases * (0.79 - 0.61);
    const reworkAvoidanceBenefit = firstTimeRightGain * 1.25 * hourlyCost;
    const controlRiskBenefit = 35000;
    const grossAnnualBenefit = productivityBenefit + reworkAvoidanceBenefit + controlRiskBenefit;
    const riskAdjustedBenefit = grossAnnualBenefit * 0.8;
    const paybackMonths = riskAdjustedBenefit > 0 ? (implementationCost / riskAdjustedBenefit) * 12 : 0;
    const threeYearNetBenefit = riskAdjustedBenefit * 3 - implementationCost;
    const threeYearRoi = implementationCost > 0 ? (threeYearNetBenefit / implementationCost) * 100 : 0;
    return {
      annualHoursSaved,
      productivityBenefit,
      reworkAvoidanceBenefit,
      controlRiskBenefit,
      grossAnnualBenefit,
      riskAdjustedBenefit,
      paybackMonths,
      threeYearNetBenefit,
      threeYearRoi
    };
  }, [annualCases, futureHours, hourlyCost, implementationCost, manualHours]);

  const filteredRoadmap = productRoadmap.filter((item) => horizon === "All" || item.horizon === horizon);
  const averageOutcomeProgress = Math.round(
    benefitMetrics.reduce((sum, item) => sum + metricProgress(item), 0) / benefitMetrics.length
  );
  const decision = valueCase.paybackMonths <= 18 && valueCase.threeYearNetBenefit > 0 ? "Proceed" : "Rework Case";

  const exportBusinessCase = () => {
    downloadCsv(
      "credit-transformation-benefits-case.csv",
      toCsv([
        { metric: "Annual case volume", value: annualCases, unit: "cases" },
        { metric: "Annual hours saved", value: Math.round(valueCase.annualHoursSaved), unit: "hours" },
        { metric: "Productivity benefit", value: Math.round(valueCase.productivityBenefit), unit: "USD" },
        { metric: "Rework avoidance benefit", value: Math.round(valueCase.reworkAvoidanceBenefit), unit: "USD" },
        { metric: "Control risk benefit assumption", value: valueCase.controlRiskBenefit, unit: "USD" },
        { metric: "Risk-adjusted annual benefit", value: Math.round(valueCase.riskAdjustedBenefit), unit: "USD" },
        { metric: "Implementation cost", value: implementationCost, unit: "USD" },
        { metric: "Payback", value: valueCase.paybackMonths.toFixed(1), unit: "months" },
        { metric: "Three-year net benefit", value: Math.round(valueCase.threeYearNetBenefit), unit: "USD" }
      ])
    );
    recordAuditEvent({
      actor: "Product Owner",
      action: "Benefits case exported",
      module: "Value Realization",
      referenceId: "VALUE-CASE-01",
      details: `Exported risk-adjusted annual benefit ${formatCurrency(valueCase.riskAdjustedBenefit)} with ${valueCase.paybackMonths.toFixed(1)} month payback.`,
      controlImpact: "Medium"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Risk-Adjusted Benefit" value={compactCurrency(valueCase.riskAdjustedBenefit)} helper="Annual mock estimate" tone="success" />
        <StatCard label="Hours Released" value={Math.round(valueCase.annualHoursSaved).toLocaleString("en-US")} helper="Annual capacity" />
        <StatCard label="Payback" value={`${valueCase.paybackMonths.toFixed(1)} mo`} tone={valueCase.paybackMonths <= 18 ? "success" : "warning"} />
        <StatCard label="3-Year Net Benefit" value={compactCurrency(valueCase.threeYearNetBenefit)} tone={valueCase.threeYearNetBenefit > 0 ? "success" : "danger"} />
        <StatCard label="Outcome Progress" value={`${averageOutcomeProgress}%`} tone={progressTone(averageOutcomeProgress)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <div className="flex items-start gap-3">
            <Calculator className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Value Case Assumptions</h2>
              <p className="mt-1 text-sm text-muted-foreground">Adjust portfolio assumptions to test financial viability.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <NumberField label="Annual applications" min={100} onChange={setAnnualCases} step={100} value={annualCases} />
            <NumberField label="Current manual hours / case" min={0} onChange={setManualHours} step={0.1} value={manualHours} />
            <NumberField label="Target hours / case" min={0} onChange={setFutureHours} step={0.1} value={futureHours} />
            <NumberField label="Loaded hourly cost (USD)" min={1} onChange={setHourlyCost} step={1} value={hourlyCost} />
            <NumberField label="Implementation cost (USD)" min={0} onChange={setImplementationCost} step={5000} value={implementationCost} />
          </div>

          <div className="mt-5 rounded-md border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Investment Decision</p>
              <Badge tone={decision === "Proceed" ? "success" : "warning"}>{decision}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {decision === "Proceed"
                ? "The mock case remains financially viable after a 20% realization haircut and clears the 18-month payback threshold."
                : "The current assumptions do not clear the payback threshold. Re-scope delivery or validate stronger measurable benefits."}
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <LineChart className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Annual Benefit Composition</h2>
                <p className="mt-1 text-sm text-muted-foreground">Gross assumptions with a separate risk-adjusted investment view.</p>
              </div>
            </div>
            <Button onClick={exportBusinessCase} variant="secondary">
              <Download className="h-4 w-4" />
              Export Case
            </Button>
          </div>

          <div className="mt-6 space-y-5">
            {[
              { label: "Productivity capacity", value: valueCase.productivityBenefit, color: "bg-primary" },
              { label: "Rework avoidance", value: valueCase.reworkAvoidanceBenefit, color: "bg-success" },
              { label: "Control risk assumption", value: valueCase.controlRiskBenefit, color: "bg-warning" }
            ].map((item) => {
              const width = valueCase.grossAnnualBenefit > 0 ? (item.value / valueCase.grossAnnualBenefit) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
            {[
              ["Gross annual", formatCurrency(valueCase.grossAnnualBenefit)],
              ["Risk adjusted", formatCurrency(valueCase.riskAdjustedBenefit)],
              ["3-year ROI", `${valueCase.threeYearRoi.toFixed(0)}%`]
            ].map(([label, value]) => (
              <div className="bg-card p-4" key={label}>
                <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{label}</p>
                <p className="mt-2 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
            BA recommendation: validate assumptions with a measured pilot, agree metric ownership before release, and separate capacity released from cashable savings in steering-committee reporting.
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Benefits Realization Scorecard</h2>
            <p className="mt-1 text-sm text-muted-foreground">Baseline, target, current position, accountable owner, and evidence source.</p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left">Outcome</th>
                <th className="px-4 py-3 text-left">Baseline</th>
                <th className="px-4 py-3 text-left">Current</th>
                <th className="px-4 py-3 text-left">Target</th>
                <th className="px-4 py-3 text-left">Progress</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {benefitMetrics.map((item) => {
                const progress = metricProgress(item);
                return (
                  <tr className="border-t align-top" key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.measurement}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.baseline}{item.unit}</td>
                    <td className="px-4 py-3 font-semibold">{item.current}{item.unit}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.target}{item.unit}</td>
                    <td className="px-4 py-3">
                      <div className="w-32"><ProgressBar value={progress} /></div>
                      <Badge tone={progressTone(progress)}>{progress}% realized</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.owner}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Gauge className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Outcome-Led Product Roadmap</h2>
              <p className="mt-1 text-sm text-muted-foreground">Priority combines customer value, control risk reduction, and implementation effort.</p>
            </div>
          </div>
          <div className="grid grid-cols-4 rounded-md border bg-muted/40 p-1">
            {(["All", "Now", "Next", "Later"] as HorizonFilter[]).map((item) => (
              <button
                className={`h-9 rounded px-3 text-xs font-semibold transition ${horizon === item ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                key={item}
                onClick={() => setHorizon(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {filteredRoadmap.map((item) => (
            <div className="rounded-md border p-4" key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge tone={item.horizon === "Now" ? "success" : item.horizon === "Next" ? "info" : "default"}>{item.horizon}</Badge>
                  <Badge tone="default">{item.status}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  {item.priorityScore.toFixed(1)} <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <h3 className="mt-4 font-semibold">{item.feature}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.outcome}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <Score label="Value" value={item.valueScore} />
                <Score label="Risk" value={item.riskReductionScore} />
                <Score label="Effort" value={item.effortScore} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Product Ownership Signal</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
              The roadmap does not prioritize features by visibility alone. It connects each investment to measurable outcomes, control risk, evidence ownership, and financial viability so the product owner can make an explicit trade-off decision.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function NumberField({
  label,
  min,
  onChange,
  step,
  value
}: {
  label: string;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        className="control w-full"
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="number"
        value={value}
      />
    </label>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/50 px-2 py-3">
      <p className="font-semibold text-foreground">{value}/10</p>
      <p className="mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}
