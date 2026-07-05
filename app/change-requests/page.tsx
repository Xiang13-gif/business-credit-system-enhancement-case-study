import { ChangeRequestAnalyzer } from "@/components/change-request-analyzer";
import { PageHeader } from "@/components/ui";

export default function ChangeRequestsPage() {
  return (
    <>
      <PageHeader
        description="Analyze how a change request affects requirements, UAT scope, user roles, business rules, operational risk, control risk, and BA recommendation."
        eyebrow="Module 3"
        title="Change Request Impact Analyzer"
      />
      <div className="p-5 md:p-8">
        <ChangeRequestAnalyzer />
      </div>
    </>
  );
}
