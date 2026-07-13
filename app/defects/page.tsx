import { DefectManagementRegister } from "@/components/defect-management-register";
import { PageHeader } from "@/components/ui";

export default function DefectsPage() {
  return (
    <>
      <PageHeader
        description="Triage UAT defects, manage fix and retest evidence, control residual risk acceptance, and feed the release decision from one governed register."
        eyebrow="Testing and Delivery Control"
        title="Defect Management Register"
      />
      <div className="p-5 md:p-8">
        <DefectManagementRegister />
      </div>
    </>
  );
}
