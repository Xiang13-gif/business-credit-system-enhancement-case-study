import { CreditMemoStudio } from "@/components/credit-memo-studio";
import { PageHeader } from "@/components/ui";

export default function MemoPage() {
  return (
    <>
      <PageHeader
        description="Generate an evidence-grounded commercial credit memorandum with source lineage, governed rules, confidence controls, human review, version comparison, and approval gating."
        eyebrow="Evidence-Grounded Document Automation"
        title="Smart Credit Memo Studio"
      />
      <div className="p-5 md:p-8">
        <CreditMemoStudio />
      </div>
    </>
  );
}
