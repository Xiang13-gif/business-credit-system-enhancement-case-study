"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { clearAuditEvents, defaultAuditEvents, readAuditEvents } from "@/lib/audit-log";
import type { AuditEvent } from "@/lib/types";

function impactTone(impact: AuditEvent["controlImpact"]) {
  if (impact === "High") {
    return "danger";
  }
  if (impact === "Medium") {
    return "warning";
  }
  return "default";
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(
    date.getUTCHours()
  )}:${pad(date.getUTCMinutes())} UTC`;
}

export function ActivityLog() {
  const [events, setEvents] = useState<AuditEvent[]>(defaultAuditEvents);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEvents(readAuditEvents());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const reset = () => {
    setEvents(clearAuditEvents());
  };

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Audit Trail / Activity Log</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Local activity log for portfolio demo actions. This simulates the audit thinking expected in banking systems.
          </p>
        </div>
        <Button onClick={reset} variant="secondary">
          <RotateCcw className="h-4 w-4" />
          Reset Log
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {events.map((event) => (
          <div className="rounded-lg border p-4" key={event.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info">{event.module}</Badge>
              <Badge tone={impactTone(event.controlImpact)}>{event.controlImpact} Control Impact</Badge>
              <span className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
            </div>
            <div className="mt-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <p className="font-semibold">{event.action}</p>
              <p className="text-sm text-muted-foreground">{event.referenceId}</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{event.details}</p>
            <p className="mt-2 text-xs text-muted-foreground">Actor: {event.actor}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
