import { ActivityLog } from "@/components/activity-log";
import { PageHeader } from "@/components/ui";

export default function AuditPage() {
  return (
    <>
      <PageHeader
        description="A local audit trail that records portfolio demo actions such as UAT status changes, retest updates, CR review, and role view switching."
        eyebrow="Control Evidence"
        title="Audit Trail"
      />
      <div className="p-5 md:p-8">
        <ActivityLog />
      </div>
    </>
  );
}
