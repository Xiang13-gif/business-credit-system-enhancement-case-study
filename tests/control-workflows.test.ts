import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  assessDefectRelease,
  assessDefectSla,
  assessUatSignOff,
  seedDefects
} from "@/lib/defect-management";
import {
  readReleaseDecisionState,
  resetReleaseDecisionState,
  writeReleaseDecisionState
} from "@/lib/release-state";
import type { DefectRecord, UatTestCase } from "@/lib/types";
import { readUatStatusMap, resetUatState, writeUatStatusMap } from "@/lib/uat-state";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const failedHighCase: UatTestCase = {
  id: "TC-RISK-001",
  module: "Credit Workflow",
  requirementId: "REQ-RISK-001",
  scenario: "Validate a high-priority release control",
  testSteps: "Execute the release control scenario.",
  expectedResult: "The control blocks an invalid submission.",
  priority: "High",
  status: "Failed",
  role: "Approver",
  assignedTester: "UAT Lead",
  executionDate: "2026-07-13",
  retestStatus: "Pending Retest",
  remarks: "Control failed."
};

function linkedDefect(overrides: Partial<DefectRecord> = {}): DefectRecord {
  return {
    ...seedDefects[0],
    id: "DEF-RISK-001",
    linkedTestCaseId: failedHighCase.id,
    requirementId: failedHighCase.requirementId,
    status: "Open",
    riskAcceptanceStatus: "Not Required",
    ...overrides
  };
}

describe("UAT and defect release controls", () => {
  it("blocks sign-off for an unresolved high-priority failed case", () => {
    const result = assessUatSignOff([failedHighCase], {}, [linkedDefect()]);

    expect(result.position).toBe("Block");
    expect(result.highPriorityOpen).toHaveLength(1);
  });

  it("moves approved residual risk to Watch consistently", () => {
    const accepted = linkedDefect({
      status: "Risk Accepted",
      riskAcceptanceStatus: "Approved"
    });
    const result = assessUatSignOff([failedHighCase], {}, [accepted]);

    expect(result.position).toBe("Watch");
    expect(result.highPriorityOpen).toHaveLength(0);
    expect(result.acceptedCaseIds.has(failedHighCase.id)).toBe(true);
  });

  it("does not treat an unapproved risk acceptance as resolved", () => {
    const pending = linkedDefect({
      status: "Risk Accepted",
      riskAcceptanceStatus: "Pending"
    });

    expect(assessDefectRelease([pending]).status).toBe("Block");
  });
});

describe("defect SLA", () => {
  it("identifies an overdue unresolved defect", () => {
    const result = assessDefectSla(
      linkedDefect({ targetFixDate: "2026-07-10" }),
      new Date("2026-07-13T12:00:00.000Z")
    );

    expect(result.status).toBe("Breach");
    expect(result.label).toContain("overdue");
  });

  it("does not report a closed defect as overdue", () => {
    const result = assessDefectSla(
      linkedDefect({ status: "Closed", targetFixDate: "2026-01-01" }),
      new Date("2026-07-13T12:00:00.000Z")
    );

    expect(result.status).toBe("Closed");
  });
});

describe("browser state persistence", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: new MemoryStorage() }
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
  });

  it("persists and clears a release decision snapshot", () => {
    writeReleaseDecisionState({
      statusOverrides: { "REL-001": "Watch" },
      decision: {
        actor: "Release Steering Committee",
        posture: "Conditional Go",
        blockerCount: 0,
        watchCount: 1,
        recordedAt: "2026-07-13T10:00:00.000Z"
      }
    });

    expect(readReleaseDecisionState().decision?.posture).toBe("Conditional Go");
    expect(resetReleaseDecisionState()).toEqual({ statusOverrides: {}, decision: null });
    expect(readReleaseDecisionState()).toEqual({ statusOverrides: {}, decision: null });
  });

  it("fully resets UAT maps and removes orphaned demo overrides", () => {
    writeUatStatusMap({ "TC-ORPHAN": "Failed" });
    resetUatState([failedHighCase]);

    expect(readUatStatusMap()).toEqual({ [failedHighCase.id]: "Failed" });
    expect(readUatStatusMap()).not.toHaveProperty("TC-ORPHAN");
  });
});
