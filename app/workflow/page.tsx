import { UnifiedCaseWorkflow } from "@/components/unified-case-workflow";
import { PageHeader } from "@/components/ui";

export default function WorkflowPage() {
  return (
    <>
      <PageHeader
        description="Create and manage a commercial credit application through document readiness, credit review, approval decision, role-based tasks, and controlled stage transitions."
        eyebrow="Operational Credit Journey"
        title="Unified Case Workflow"
      />
      <div className="p-5 md:p-8">
        <UnifiedCaseWorkflow />
      </div>
    </>
  );
}
