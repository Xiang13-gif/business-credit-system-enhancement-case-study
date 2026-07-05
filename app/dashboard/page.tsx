import { PortfolioDashboard } from "@/components/portfolio-dashboard";
import { PageHeader } from "@/components/ui";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        description="Management-style portfolio dashboard showing UAT health, change request priority, checklist distribution, and traceability status."
        eyebrow="Executive View"
        title="Dashboard Charts"
      />
      <div className="p-5 md:p-8">
        <PortfolioDashboard />
      </div>
    </>
  );
}
