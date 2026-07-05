import { DocumentChecklistGenerator } from "@/components/document-checklist-generator";
import { PageHeader } from "@/components/ui";

export default function ChecklistPage() {
  return (
    <>
      <PageHeader
        description="Generate document requirements from application type, facility type, collateral type, customer type, risk level, and financial statement availability."
        eyebrow="Module 1"
        title="Document Checklist Generator"
      />
      <div className="p-5 md:p-8">
        <DocumentChecklistGenerator />
      </div>
    </>
  );
}
