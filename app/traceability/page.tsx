import { TraceabilityTable } from "@/components/traceability-table";
import { PageHeader } from "@/components/ui";

export default function TraceabilityPage() {
  return (
    <>
      <PageHeader
        description="A mini requirement traceability matrix showing how requirements connect to business rules, UAT cases, change requests, and current status."
        eyebrow="BA Deliverable"
        title="Traceability Matrix"
      />
      <div className="p-5 md:p-8">
        <TraceabilityTable />
      </div>
    </>
  );
}
