import type { ReleaseGateStatus } from "@/lib/types";

const STORAGE_KEY = "gccm-release-decision-state";

export interface ReleaseDecisionSnapshot {
  actor: string;
  posture: "Go" | "Conditional Go" | "No-Go";
  blockerCount: number;
  watchCount: number;
  recordedAt: string;
}

export interface ReleaseDecisionState {
  statusOverrides: Record<string, ReleaseGateStatus>;
  decision: ReleaseDecisionSnapshot | null;
}

const initialState: ReleaseDecisionState = {
  statusOverrides: {},
  decision: null
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readReleaseDecisionState(): ReleaseDecisionState {
  if (!canUseStorage()) {
    return initialState;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ReleaseDecisionState>;
    return {
      statusOverrides: parsed.statusOverrides ?? {},
      decision: parsed.decision ?? null
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return initialState;
  }
}

export function writeReleaseDecisionState(state: ReleaseDecisionState) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function resetReleaseDecisionState() {
  writeReleaseDecisionState(initialState);
  return initialState;
}
