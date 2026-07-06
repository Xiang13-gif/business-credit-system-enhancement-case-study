import type {
  BusinessRule,
  ChecklistDocument,
  ChecklistInput,
  ChecklistResult,
  RequirementLevel
} from "@/lib/types";

export const defaultChecklistInput: ChecklistInput = {
  applicationType: "New",
  facilityType: "Term Loan",
  collateralType: "Property",
  customerType: "SME Company",
  riskLevel: "Medium",
  financialStatementStatus: "Available"
};

export const businessRules: BusinessRule[] = [
  {
    id: "BR001",
    title: "New application onboarding",
    description: "New credit applications require full customer onboarding and declaration documents.",
    controlPoint: "Pre-submission validation"
  },
  {
    id: "BR002",
    title: "Renewal financial refresh",
    description: "Renewal applications may reuse existing profile documents but must refresh financial and conduct evidence.",
    controlPoint: "Credit review completeness"
  },
  {
    id: "BR003",
    title: "Enhancement approval package",
    description: "Enhancement applications require revised approval memo and updated facility documentation.",
    controlPoint: "Approval package version control"
  },
  {
    id: "BR004",
    title: "Property collateral evidence",
    description: "Property-secured facilities require title, valuation, insurance, and charge documentation.",
    controlPoint: "Security documentation readiness"
  },
  {
    id: "BR005",
    title: "Financial statement waiver",
    description: "Missing latest financial statements require waiver approval and exception tracking.",
    controlPoint: "Maker-checker waiver control"
  },
  {
    id: "BR006",
    title: "High risk enhanced due diligence",
    description: "High risk customers require enhanced due diligence before submission can proceed.",
    controlPoint: "Compliance gate"
  },
  {
    id: "BR007",
    title: "Unsecured credit justification",
    description: "Unsecured exposure requires additional credit justification and repayment source evidence.",
    controlPoint: "Credit risk review"
  },
  {
    id: "BR008",
    title: "Trade facility documents",
    description: "Trade facilities require trade purpose, facility agreement, and supporting trade documents.",
    controlPoint: "Product documentation"
  },
  {
    id: "BR009",
    title: "Bank guarantee documents",
    description: "Bank Guarantee applications require BG application form and counter indemnity.",
    controlPoint: "Guarantee obligation control"
  },
  {
    id: "BR010",
    title: "Company authorization",
    description: "Company and corporate applicants require board approval and authorized signatory verification.",
    controlPoint: "Borrower authority validation"
  },
  {
    id: "BR011",
    title: "Cash or fixed deposit security",
    description: "Cash-secured or fixed deposit-secured facilities require deposit evidence and set-off documentation.",
    controlPoint: "Security enforceability"
  },
  {
    id: "BR012",
    title: "Guarantee enforceability",
    description: "Corporate or personal guarantee collateral requires guarantee agreement and guarantor verification.",
    controlPoint: "Legal enforceability"
  },
  {
    id: "BR013",
    title: "Risk-based approval authority",
    description: "Approval route should consider total exposure, risk level, customer segment, collateral coverage, and application type.",
    controlPoint: "Delegated authority control"
  },
  {
    id: "BR014",
    title: "Controlled route override",
    description: "Approval route overrides require authorized role, reason code, maker-checker validation, and audit trail.",
    controlPoint: "Approval override governance"
  },
  {
    id: "BR015",
    title: "Exception and pipeline visibility",
    description: "Policy exceptions and pipeline owner changes should refresh dashboards and remain linked to requirements and UAT evidence.",
    controlPoint: "Management reporting and traceability"
  }
];

function rule(id: string) {
  const found = businessRules.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Missing business rule ${id}`);
  }
  return found;
}

function doc(
  id: string,
  name: string,
  category: ChecklistDocument["category"],
  requirementLevel: RequirementLevel,
  reason: string,
  businessRuleId: string
): ChecklistDocument {
  return { id, name, category, requirementLevel, reason, businessRuleId };
}

function priority(level: RequirementLevel) {
  return { Optional: 1, Conditional: 2, Required: 3 }[level];
}

function addDocument(map: Map<string, ChecklistDocument>, document: ChecklistDocument) {
  const existing = map.get(document.id);
  if (!existing) {
    map.set(document.id, document);
    return;
  }

  map.set(document.id, {
    ...existing,
    requirementLevel:
      priority(document.requirementLevel) > priority(existing.requirementLevel)
        ? document.requirementLevel
        : existing.requirementLevel,
    reason: existing.reason.includes(document.reason)
      ? existing.reason
      : `${existing.reason} ${document.reason}`,
    businessRuleId: existing.businessRuleId.includes(document.businessRuleId)
      ? existing.businessRuleId
      : `${existing.businessRuleId}, ${document.businessRuleId}`
  });
}

export function generateChecklist(input: ChecklistInput): ChecklistResult {
  const documents = new Map<string, ChecklistDocument>();
  const triggeredRules = new Map<string, BusinessRule>();
  const warnings: string[] = [];

  const addRule = (id: string) => triggeredRules.set(id, rule(id));
  const add = (document: ChecklistDocument) => {
    addDocument(documents, document);
    document.businessRuleId.split(",").map((id) => id.trim()).forEach(addRule);
  };

  add(doc("DOC001", "Application Form", "General", "Required", "Core case intake document for all applications.", "BR001"));
  add(doc("DOC002", "Customer Declaration Form", "General", "Required", "Declaration is required to support customer attestation and audit trail.", "BR001"));
  add(doc("DOC003", "CCRIS / Credit Report", "Compliance / Control", "Required", "Credit conduct evidence is required for credit assessment.", "BR002"));
  add(doc("DOC004", "AML / KYC Screening Result", "Compliance / Control", "Required", "Screening result is required before credit approval package is completed.", "BR001"));
  add(doc("DOC005", "Approval Memo", "Compliance / Control", "Required", "Credit recommendation must be documented for approver review.", "BR003"));

  if (input.applicationType === "New") {
    add(doc("DOC006", "NRIC / Passport / Company Registration Documents", "General", "Required", "New application requires full customer onboarding evidence.", "BR001"));
    add(doc("DOC007", "Business Profile / Company Search", "General", "Required", "New borrower profile must be established before credit review.", "BR001"));
  }

  if (input.applicationType === "Renewal") {
    add(doc("DOC008", "Existing Facility Review", "Facility", "Required", "Renewal requires review of existing conduct and facility performance.", "BR002"));
    add(doc("DOC009", "Updated Bank Statement", "Financial", "Required", "Latest account conduct is required for renewal credit assessment.", "BR002"));
  }

  if (input.applicationType === "Enhancement") {
    add(doc("DOC010", "Revised Approval Memo", "Compliance / Control", "Required", "Enhancement changes exposure and requires revised approval package.", "BR003"));
    add(doc("DOC011", "Updated Facility Documentation", "Facility", "Required", "Facility terms must match the enhanced approval scope.", "BR003"));
  }

  if (["SME Company", "Corporate", "Partnership"].includes(input.customerType)) {
    add(doc("DOC012", "Board Resolution", "Facility", "Required", "Business borrower must evidence authority to borrow.", "BR010"));
    add(doc("DOC013", "Authorized Signatory Verification", "Compliance / Control", "Required", "System must confirm authorized execution authority.", "BR010"));
  }

  if (input.financialStatementStatus === "Available") {
    add(doc("DOC014", "Latest Audited Financial Statement", "Financial", "Required", "Financial statements are available and required for credit assessment.", "BR002"));
    add(doc("DOC015", "Management Account", "Financial", "Conditional", "Management accounts support latest performance review where available.", "BR002"));
    add(doc("DOC016", "Income Tax Return", "Financial", "Conditional", "Tax return supports financial assessment and income consistency review.", "BR002"));
  }

  if (input.financialStatementStatus === "Not Available") {
    add(doc("DOC017", "Waiver Approval Form", "Compliance / Control", "Required", "Latest financial statement is missing and must be waived by authorized approver.", "BR005"));
    add(doc("DOC018", "Financial Statement Exception Memo", "Compliance / Control", "Required", "Credit exception must explain missing financial documents and mitigation.", "BR005"));
    add(doc("DOC015", "Management Account", "Financial", "Required", "Alternative financial evidence is required when audited statements are missing.", "BR005"));
    warnings.push("Financial statement is not available. Waiver approval and exception tracking must be evidenced.");
  }

  if (input.financialStatementStatus === "Waiver Requested") {
    add(doc("DOC017", "Waiver Approval Form", "Compliance / Control", "Required", "Waiver request must be approved before mandatory financial validation can be bypassed.", "BR005"));
    add(doc("DOC019", "Supporting Remarks for Waiver", "Compliance / Control", "Required", "BA control requires clear justification and audit trail for waiver cases.", "BR005"));
    warnings.push("Waiver requested. Case should be highlighted in the approval memo and exception report.");
  }

  if (input.facilityType === "Term Loan") {
    add(doc("DOC020", "Letter of Offer", "Facility", "Required", "Term loan terms must be formally offered and accepted.", "BR003"));
    add(doc("DOC021", "Facility Agreement", "Facility", "Required", "Term loan requires executed facility documentation.", "BR003"));
    add(doc("DOC022", "Repayment Source Evidence", "Financial", "Required", "Repayment source supports term loan serviceability assessment.", "BR007"));
  }

  if (input.facilityType === "Overdraft") {
    add(doc("DOC023", "Overdraft Facility Letter", "Facility", "Required", "Overdraft limit terms must be documented.", "BR003"));
    add(doc("DOC024", "Account Conduct Review", "Financial", "Required", "Overdraft assessment relies on account conduct and utilization behavior.", "BR002"));
  }

  if (input.facilityType === "Trade Line") {
    add(doc("DOC025", "Trade Facility Agreement", "Facility", "Required", "Trade line requires product-specific facility agreement.", "BR008"));
    add(doc("DOC026", "Supporting Trade Documents", "Facility", "Required", "Trade purpose and supporting documents are needed for facility assessment.", "BR008"));
    add(doc("DOC027", "Buyer / Supplier Information", "General", "Conditional", "Counterparty profile supports trade facility risk review.", "BR008"));
  }

  if (input.facilityType === "Bank Guarantee") {
    add(doc("DOC028", "BG Application Form", "Facility", "Required", "Bank Guarantee applications require product-specific intake form.", "BR009"));
    add(doc("DOC029", "Counter Indemnity", "Facility", "Required", "Counter indemnity supports bank guarantee obligation recovery.", "BR009"));
    add(doc("DOC030", "Beneficiary Details", "General", "Required", "Beneficiary information is required for guarantee issuance and review.", "BR009"));
  }

  if (input.collateralType === "Property") {
    add(doc("DOC031", "Title Deed", "Collateral", "Required", "Property collateral requires ownership evidence.", "BR004"));
    add(doc("DOC032", "Valuation Report", "Collateral", "Required", "Collateral value must be evidenced before approval package is finalized.", "BR004"));
    add(doc("DOC033", "Fire Insurance Policy", "Collateral", "Required", "Insurance supports protection of property security.", "BR004"));
    add(doc("DOC034", "Charge Document", "Collateral", "Required", "Charge document supports security perfection.", "BR004"));
  }

  if (input.collateralType === "Cash Deposit" || input.collateralType === "Fixed Deposit") {
    add(doc("DOC035", "Fixed Deposit Receipt", "Collateral", "Required", "Deposit evidence is required for cash-secured facility.", "BR011"));
    add(doc("DOC036", "Set-off Letter", "Collateral", "Required", "Set-off rights must be documented for enforceability.", "BR011"));
  }

  if (input.collateralType === "Corporate Guarantee") {
    add(doc("DOC037", "Corporate Guarantee Agreement", "Collateral", "Required", "Corporate guarantee must be documented for enforceability.", "BR012"));
    add(doc("DOC012", "Board Resolution", "Facility", "Required", "Corporate guarantor must evidence authority to provide guarantee.", "BR012"));
    add(doc("DOC013", "Authorized Signatory Verification", "Compliance / Control", "Required", "Guarantee execution authority must be verified.", "BR012"));
  }

  if (input.collateralType === "Personal Guarantee") {
    add(doc("DOC038", "Personal Guarantee Agreement", "Collateral", "Required", "Personal guarantee must be executed and retained.", "BR012"));
    add(doc("DOC039", "Guarantor Identity Verification", "Compliance / Control", "Required", "Guarantor identity and signing authority must be verified.", "BR012"));
  }

  if (input.collateralType === "Debenture") {
    add(doc("DOC040", "Debenture Document", "Collateral", "Required", "Debenture security must be documented for collateral tracking.", "BR004"));
    add(doc("DOC041", "Security Perfection Checklist", "Collateral", "Required", "Security perfection status must be tracked before facility setup.", "BR004"));
  }

  if (input.collateralType === "Unsecured") {
    add(doc("DOC042", "Additional Credit Justification Memo", "Compliance / Control", "Required", "Unsecured exposure requires stronger credit rationale.", "BR007"));
    add(doc("DOC043", "Repayment Capacity Analysis", "Financial", "Required", "Repayment capacity is a key control for unsecured exposure.", "BR007"));
    warnings.push("Unsecured exposure selected. Additional credit justification should be reviewed by Credit Approver.");
  }

  if (input.riskLevel === "High") {
    add(doc("DOC044", "Enhanced Due Diligence Checklist", "Compliance / Control", "Required", "High risk customers require enhanced due diligence before submission.", "BR006"));
    add(doc("DOC045", "High Risk Approval Note", "Compliance / Control", "Required", "High risk decision should be highlighted for approver review.", "BR006"));
    warnings.push("High risk customer selected. EDD checklist should be a submission blocking item.");
  }

  return {
    documents: Array.from(documents.values()).sort((a, b) =>
      a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category)
    ),
    warnings,
    triggeredRules: Array.from(triggeredRules.values()).sort((a, b) => a.id.localeCompare(b.id))
  };
}
