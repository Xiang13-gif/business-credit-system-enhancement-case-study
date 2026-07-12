import { DocumentChecklistGenerator } from "@/components/document-checklist-generator";
import { PageHeader } from "@/components/ui";

export default function ChecklistPage() {
  return (
    <>
      <PageHeader
        description="Generate document requirements, mark document status, route waiver approvals, monitor SLA aging, and evaluate whether the credit submission package is ready."
        eyebrow="Module 1"
        title="Document Checklist Generator"
      />
      <div className="p-5 md:p-8">
        <DocumentChecklistGenerator />
      </div>
    </>
  );
}
