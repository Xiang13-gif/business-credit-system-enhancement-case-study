"use client";

import { Download, Route, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, StatCard } from "@/components/ui";
import {
  defaultApprovalInput,
  formatCurrency,
  generateApprovalRoute
} from "@/lib/approval-routing";
import { recordAuditEvent } from "@/lib/audit-log";
import type {
  ApplicationType,
  ApprovalRoutingInput,
  CollateralCoverage,
  CustomerSegment,
  ExceptionSeverity,
  FacilityType,
  RiskLevel
} from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

const applicationTypes: ApplicationType[] = ["New", "Renewal", "Enhancement"];
const facilityTypes: FacilityType[] = ["Term Loan", "Overdraft", "Trade Line", "Bank Guarantee"];
const customerSegments: CustomerSegment[] = ["SME", "Mid-Market", "Large Corporate"];
const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];
const collateralCoverage: CollateralCoverage[] = ["Fully Secured", "Partially Secured", "Unsecured"];
const exceptionSeverities: ExceptionSeverity[] = ["None", "Minor", "Major", "Critical"];

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select className="control" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function tierTone(tier: string) {
  if (tier === "Group Credit Committee") {
    return "danger";
  }
  if (tier === "Country Credit Committee") {
    return "warning";
  }
  if (tier === "Regional Credit Manager") {
    return "info";
  }
  return "default";
}

function tierStatTone(tier: string) {
  if (tier === "Group Credit Committee") {
    return "danger";
  }
  if (tier === "Country Credit Committee") {
    return "warning";
  }
  return "default";
}

export function ApprovalRoutingSimulator() {
  const [input, setInput] = useState<ApprovalRoutingInput>(defaultApprovalInput);
  const route = useMemo(() => generateApprovalRoute(input), [input]);

  const updateInput = <K extends keyof ApprovalRoutingInput>(key: K, value: ApprovalRoutingInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const exportRoute = () => {
    downloadCsv(
      "approval-routing-analysis.csv",
      toCsv([
        { area: "Application Type", value: input.applicationType },
        { area: "Facility Type", value: input.facilityType },
        { area: "Customer Segment", value: input.customerSegment },
        { area: "Total Exposure", value: formatCurrency(input.totalExposure) },
        { area: "Risk Level", value: input.riskLevel },
        { area: "Collateral Coverage", value: input.collateralCoverage },
        { area: "Exception Severity", value: input.exceptionSeverity },
        { area: "Recommended Tier", value: route.tier },
        { area: "Routing Score", value: route.score },
        { area: "SLA Days", value: route.slaDays },
        { area: "Maker Checker Required", value: route.makerCheckerRequired ? "Yes" : "No" },
        { area: "Rationale", value: route.rationale.join("; ") },
        { area: "Required Controls", value: route.requiredControls.join("; ") }
      ])
    );

    recordAuditEvent({
      actor: "Credit BA Reviewer",
      action: "Approval route exported",
      module: "Approval Routing",
      referenceId: route.tier,
      details: `Exported ${route.tier} route for ${formatCurrency(input.totalExposure)} ${input.facilityType} case.`,
      controlImpact: route.makerCheckerRequired ? "High" : "Medium"
    });
  };

  const simulateCommitteeCase = () => {
    const nextInput: ApprovalRoutingInput = {
      applicationType: "New",
      facilityType: "Overdraft",
      customerSegment: "Large Corporate",
      totalExposure: 12_000_000,
      riskLevel: "High",
      collateralCoverage: "Unsecured",
      exceptionSeverity: "Critical"
    };
    setInput(nextInput);
    recordAuditEvent({
      actor: "Credit BA Reviewer",
      action: "High-risk route simulated",
      module: "Approval Routing",
      referenceId: "Group Credit Committee",
      details: "Loaded high-risk unsecured case to validate committee escalation and maker-checker controls.",
      controlImpact: "High"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Recommended Tier" value={route.tier} tone={tierStatTone(route.tier)} />
        <StatCard label="Routing Score" value={route.score} helper="Weighted business rule score" />
        <StatCard label="Target SLA" value={`${route.slaDays} days`} helper="Portfolio assumption" />
        <StatCard
          label="Maker Checker"
          value={route.makerCheckerRequired ? "Required" : "Standard"}
          tone={route.makerCheckerRequired ? "danger" : "success"}
        />
        <StatCard label="Exposure" value={formatCurrency(input.totalExposure)} helper={input.customerSegment} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Credit Case Inputs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Route changes when authority, risk, collateral, or exception context changes.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Route className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <SelectField
              label="Application Type"
              value={input.applicationType}
              options={applicationTypes}
              onChange={(value) => updateInput("applicationType", value)}
            />
            <SelectField
              label="Facility Type"
              value={input.facilityType}
              options={facilityTypes}
              onChange={(value) => updateInput("facilityType", value)}
            />
            <SelectField
              label="Customer Segment"
              value={input.customerSegment}
              options={customerSegments}
              onChange={(value) => updateInput("customerSegment", value)}
            />
            <label className="grid gap-2 text-sm font-medium">
              Total Exposure
              <input
                className="control"
                min={50_000}
                onChange={(event) => updateInput("totalExposure", Number(event.target.value))}
                step={50_000}
                type="number"
                value={input.totalExposure}
              />
            </label>
            <SelectField
              label="Risk Level"
              value={input.riskLevel}
              options={riskLevels}
              onChange={(value) => updateInput("riskLevel", value)}
            />
            <SelectField
              label="Collateral Coverage"
              value={input.collateralCoverage}
              options={collateralCoverage}
              onChange={(value) => updateInput("collateralCoverage", value)}
            />
            <SelectField
              label="Exception Severity"
              value={input.exceptionSeverity}
              options={exceptionSeverities}
              onChange={(value) => updateInput("exceptionSeverity", value)}
            />
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <Button onClick={simulateCommitteeCase} variant="secondary">
              <ShieldCheck className="h-4 w-4" />
              Stress Route
            </Button>
            <Button onClick={exportRoute} variant="secondary">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={tierTone(route.tier)}>{route.tier}</Badge>
              <Badge tone={route.makerCheckerRequired ? "danger" : "success"}>
                {route.makerCheckerRequired ? "Maker-checker required" : "Standard approval controls"}
              </Badge>
              <Badge tone="info">REQ017 / REQ018</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Approval Route Recommendation</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The route is generated from transparent business rules so a BA can explain the approval outcome to RM,
              Credit, Risk, Technology, and UAT stakeholders.
            </p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold">Routing Rationale</h2>
              <div className="mt-4 space-y-3">
                {route.rationale.map((item) => (
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">Required Controls</h2>
              <div className="mt-4 space-y-3">
                {route.requiredControls.map((item) => (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h2 className="text-lg font-semibold">Escalation Triggers</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {route.escalationTriggers.map((item) => (
                <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-muted-foreground" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
