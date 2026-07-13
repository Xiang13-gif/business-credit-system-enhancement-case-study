import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/defects");
  await page.getByRole("button", { name: "Reset Demo" }).click();
});

test("raises a linked defect from a blocked UAT case", async ({ page }) => {
  await page.goto("/uat");
  const testCaseRow = page.getByRole("row").filter({ hasText: "TC017" });

  await testCaseRow.getByRole("button", { name: "Raise Defect" }).click();
  await expect(testCaseRow).toContainText("DEF-041");

  await page.goto("/defects");
  await expect(page.getByText("DEF-041", { exact: true })).toBeVisible();
});

test("persists a release decision and manual gate status after refresh", async ({ page }) => {
  await page.goto("/release");
  const releaseGateRow = page.getByRole("row").filter({ hasText: "REL-001" });
  const status = releaseGateRow.getByRole("combobox");

  await status.selectOption("Block");
  await page.getByRole("button", { name: "Record Decision" }).click();
  await expect(page.getByRole("button", { name: "Decision Recorded" })).toBeVisible();

  await page.reload();
  await expect(releaseGateRow.getByRole("combobox")).toHaveValue("Block");
  await expect(page.getByRole("button", { name: "Decision Recorded" })).toBeVisible();
});
