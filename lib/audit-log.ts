import type { AuditEvent } from "@/lib/types";

const STORAGE_KEY = "creditflow-audit-events";

export const defaultAuditEvents: AuditEvent[] = [
  {
    id: "AUD-SEED-001",
    timestamp: "2026-02-03T09:30:00.000Z",
    actor: "BA Lead",
    action: "Checklist rule validated",
    module: "Document Checklist",
    referenceId: "REQ001",
    details: "Verified new term loan with property collateral generates onboarding, financial, facility and collateral documents.",
    controlImpact: "Medium"
  },
  {
    id: "AUD-SEED-002",
    timestamp: "2026-02-04T14:15:00.000Z",
    actor: "UAT Coordinator",
    action: "Defect linked",
    module: "UAT Tracker",
    referenceId: "TC002",
    details: "Linked DEF-014 to missing financial statement exception memo scenario.",
    controlImpact: "High"
  },
  {
    id: "AUD-SEED-003",
    timestamp: "2026-02-05T11:20:00.000Z",
    actor: "Credit Risk Reviewer",
    action: "CR impact assessed",
    module: "Change Request",
    referenceId: "CR003",
    details: "Confirmed High Risk customers require Enhanced Due Diligence checklist as a blocking control.",
    controlImpact: "High"
  }
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readAuditEvents(): AuditEvent[] {
  if (!canUseStorage()) {
    return defaultAuditEvents;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAuditEvents));
    return defaultAuditEvents;
  }

  try {
    return JSON.parse(stored) as AuditEvent[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAuditEvents));
    return defaultAuditEvents;
  }
}

export function recordAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">) {
  if (!canUseStorage()) {
    return;
  }

  const nextEvent: AuditEvent = {
    ...event,
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString()
  };

  const current = readAuditEvents();
  const updated = [nextEvent, ...current].slice(0, 50);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAuditEvents() {
  if (!canUseStorage()) {
    return defaultAuditEvents;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAuditEvents));
  return defaultAuditEvents;
}
