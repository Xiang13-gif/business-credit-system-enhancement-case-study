import type { DefectStatus, RetestStatus, UatStatus, UatTestCase } from "@/lib/types";

export const UAT_STATUS_STORAGE_KEY = "gccm-uat-status";
export const UAT_RETEST_STORAGE_KEY = "gccm-uat-retest";

function readStoredMap<T extends string>(key: string) {
  if (typeof window === "undefined") {
    return {};
  }
  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return {};
  }
  try {
    return JSON.parse(stored) as Record<string, T>;
  } catch {
    return {};
  }
}

export function readUatStatusMap() {
  return readStoredMap<UatStatus>(UAT_STATUS_STORAGE_KEY);
}

export function readUatRetestMap() {
  return readStoredMap<RetestStatus>(UAT_RETEST_STORAGE_KEY);
}

export function writeUatStatusMap(statuses: Record<string, UatStatus>) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(UAT_STATUS_STORAGE_KEY, JSON.stringify(statuses));
  }
}

export function writeUatRetestMap(statuses: Record<string, RetestStatus>) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(UAT_RETEST_STORAGE_KEY, JSON.stringify(statuses));
  }
}

export function syncUatFromDefect(testCaseId: string, defectStatus: DefectStatus) {
  const statuses = readUatStatusMap();
  const retests = readUatRetestMap();

  if (defectStatus === "Closed") {
    statuses[testCaseId] = "Passed";
    retests[testCaseId] = "Retest Passed";
  } else if (defectStatus === "Retest Failed") {
    statuses[testCaseId] = "Failed";
    retests[testCaseId] = "Retest Failed";
  } else if (defectStatus === "Ready for Retest") {
    statuses[testCaseId] = "In Progress";
    retests[testCaseId] = "Pending Retest";
  }

  writeUatStatusMap(statuses);
  writeUatRetestMap(retests);
}

export function resetLinkedUatState(testCases: UatTestCase[], linkedTestCaseIds: string[]) {
  const statuses = readUatStatusMap();
  const retests = readUatRetestMap();
  testCases.filter((testCase) => linkedTestCaseIds.includes(testCase.id)).forEach((testCase) => {
    statuses[testCase.id] = testCase.status;
    retests[testCase.id] = testCase.retestStatus;
  });
  writeUatStatusMap(statuses);
  writeUatRetestMap(retests);
}
