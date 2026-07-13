import { describe, expect, it } from "vitest";
import { generateApprovalRoute } from "@/lib/approval-routing";
import { generateChecklist } from "@/lib/checklist-rules";

describe("document checklist rules", () => {
  it("requires financial waiver, EDD, and unsecured justification controls", () => {
    const result = generateChecklist({
      applicationType: "New",
      facilityType: "Term Loan",
      collateralType: "Unsecured",
      customerType: "SME Company",
      riskLevel: "High",
      financialStatementStatus: "Not Available"
    });
    const requiredIds = result.documents
      .filter((document) => document.requirementLevel === "Required")
      .map((document) => document.id);

    expect(requiredIds).toEqual(expect.arrayContaining(["DOC017", "DOC018", "DOC042", "DOC043", "DOC044", "DOC045"]));
    expect(result.triggeredRules.map((rule) => rule.id)).toEqual(expect.arrayContaining(["BR005", "BR006", "BR007"]));
    expect(result.warnings).toHaveLength(3);
  });

  it("generates enforceability documents for a corporate guarantee", () => {
    const result = generateChecklist({
      applicationType: "Renewal",
      facilityType: "Overdraft",
      collateralType: "Corporate Guarantee",
      customerType: "Corporate",
      riskLevel: "Medium",
      financialStatementStatus: "Available"
    });
    const documentNames = result.documents.map((document) => document.name);

    expect(documentNames).toEqual(expect.arrayContaining([
      "Corporate Guarantee Agreement",
      "Board Resolution",
      "Authorized Signatory Verification"
    ]));
  });
});

describe("approval routing rules", () => {
  it("escalates high-risk unsecured critical exceptions to Group Credit Committee", () => {
    const result = generateApprovalRoute({
      applicationType: "New",
      facilityType: "Term Loan",
      customerSegment: "Large Corporate",
      totalExposure: 12_000_000,
      riskLevel: "High",
      collateralCoverage: "Unsecured",
      exceptionSeverity: "Critical"
    });

    expect(result.tier).toBe("Group Credit Committee");
    expect(result.makerCheckerRequired).toBe(true);
    expect(result.requiredControls).toContain("Enhanced due diligence status must be visible to Credit Analyst and Approver.");
  });
});
