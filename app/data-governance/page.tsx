import { DataLineageHub } from "@/components/data-lineage-hub";
import { PageHeader } from "@/components/ui";

export default function DataGovernancePage() {
  return (
    <>
      <PageHeader
        description="Trace critical credit data from source systems through transformations and business rules into approval decisions, generated documents, and management reporting."
        eyebrow="Risk Data Governance"
        title="Data Lineage and Quality Hub"
      />
      <div className="p-5 md:p-8">
        <DataLineageHub />
      </div>
    </>
  );
}
