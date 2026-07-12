import { ValueRealizationDashboard } from "@/components/value-realization-dashboard";
import { PageHeader } from "@/components/ui";

export default function ValuePage() {
  return (
    <>
      <PageHeader
        description="Quantify operational value, control improvement, financial viability, measurable outcomes, and roadmap trade-offs for the credit transformation product."
        eyebrow="Strategy and Solution Evaluation"
        title="Benefits Realization and Product Value"
      />
      <div className="p-5 md:p-8">
        <ValueRealizationDashboard />
      </div>
    </>
  );
}
