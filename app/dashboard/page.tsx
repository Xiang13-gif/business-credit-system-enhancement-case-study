import { PortfolioDashboard } from "@/components/portfolio-dashboard";
import { PageHeader } from "@/components/ui";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        description="Management-style dashboard showing credit pipeline aging, owner bottlenecks, exception severity, document readiness, UAT health, change request priority, and traceability status."
        eyebrow="Executive View"
        title="Credit Operations Control Room"
      />
      <div className="p-5 md:p-8">
        <PortfolioDashboard />
      </div>
    </>
  );
}
