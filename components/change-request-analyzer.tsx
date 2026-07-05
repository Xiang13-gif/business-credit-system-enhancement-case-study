"use client";

import { Download, GitPullRequestArrow } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { changeRequests } from "@/lib/mock-data";
import { downloadCsv, toCsv } from "@/lib/utils";

function priorityTone(priority: "High" | "Medium" | "Low") {
  if (priority === "High") {
    return "danger";
  }
  if (priority === "Medium") {
    return "warning";
  }
  return "default";
}

export function ChangeRequestAnalyzer() {
  const [selectedId, setSelectedId] = useState(changeRequests[0].id);
  const selected = useMemo(
    () => changeRequests.find((item) => item.id === selectedId) ?? changeRequests[0],
    [selectedId]
  );

  const exportImpact = () => {
    downloadCsv(
      `${selected.id.toLowerCase()}-impact-analysis.csv`,
      toCsv([
        { area: "Description", value: selected.description },
        { area: "Impacted Requirements", value: selected.impactedRequirements.join("; ") },
        { area: "Impacted UAT Cases", value: selected.impactedUatCases.join("; ") },
        { area: "Impacted Roles", value: selected.impactedRoles.join("; ") },
        { area: "Business Rules", value: selected.impactedBusinessRules.join("; ") },
        { area: "Control Risk", value: selected.controlRisk.join("; ") },
        { area: "Operational Risk", value: selected.operationalRisk.join("; ") },
        { area: "BA Recommendation", value: selected.baRecommendation }
      ])
    );
    recordAuditEvent({
      actor: "BA Reviewer",
      action: "CR impact exported",
      module: "Change Request",
      referenceId: selected.id,
      details: `Exported impact analysis for ${selected.id}: ${selected.title}.`,
      controlImpact: selected.implementationPriority === "High" ? "High" : "Medium"
    });
  };

  const selectChangeRequest = (id: string) => {
    const next = changeRequests.find((item) => item.id === id);
    setSelectedId(id);
    if (next) {
      recordAuditEvent({
        actor: "BA Reviewer",
        action: "CR impact reviewed",
        module: "Change Request",
        referenceId: next.id,
        details: `Reviewed ${next.title} with ${next.impactedUatCases.length} impacted UAT cases and ${next.impactedBusinessRules.length} impacted rules.`,
        controlImpact: next.implementationPriority === "High" ? "High" : "Medium"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Change Requests" value={changeRequests.length} />
        <StatCard label="Selected Priority" value={selected.implementationPriority} tone={priorityTone(selected.implementationPriority)} />
        <StatCard label="Impacted UAT Cases" value={selected.impactedUatCases.length} helper={selected.impactedUatCases.join(", ")} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GitPullRequestArrow className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Change Request Selector</h2>
              <p className="mt-1 text-sm text-muted-foreground">Impact analysis updates from mock CR metadata.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <select className="control min-w-72" value={selectedId} onChange={(event) => selectChangeRequest(event.target.value)}>
              {changeRequests.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}: {item.title}
                </option>
              ))}
            </select>
            <Button onClick={exportImpact} variant="secondary">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info">{selected.id}</Badge>
              <Badge tone={priorityTone(selected.implementationPriority)}>{selected.implementationPriority} Priority</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">{selected.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{selected.description}</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Impact Summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ImpactList title="Impacted Requirements" items={selected.impactedRequirements} />
              <ImpactList title="Impacted UAT Cases" items={selected.impactedUatCases} />
              <ImpactList title="Impacted User Roles" items={selected.impactedRoles} />
              <ImpactList title="Impacted Business Rules" items={selected.impactedBusinessRules} />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">BA Recommendation</h2>
            <p className="mt-3 rounded-lg border-l-4 border-primary bg-primary/10 p-4 text-sm leading-6">
              {selected.baRecommendation}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold">Control Risk</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {selected.controlRisk.map((item) => (
                <li className="rounded-md border border-danger/20 bg-danger/5 p-3" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Operational Risk</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {selected.operationalRisk.map((item) => (
                <li className="rounded-md border bg-muted/40 p-3" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Suggested Test Scope</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {selected.suggestedTestScope.map((item) => (
                <li className="rounded-md border bg-card p-3" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ImpactList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
