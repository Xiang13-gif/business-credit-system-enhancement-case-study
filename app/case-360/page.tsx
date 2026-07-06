import { Case360View } from "@/components/case-360-view";
import { PageHeader } from "@/components/ui";

export default function Case360Page() {
  return (
    <>
      <PageHeader
        description="Inspect one commercial credit case from RM intake to credit analysis, approval routing, policy exception governance, UAT evidence, audit controls, and facility readiness."
        eyebrow="End-To-End Workflow"
        title="Credit Case 360"
      />
      <div className="p-5 md:p-8">
        <Case360View />
      </div>
    </>
  );
}
