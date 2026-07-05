import { RoleBasedView } from "@/components/role-based-view";
import { PageHeader } from "@/components/ui";

export default function RolesPage() {
  return (
    <>
      <PageHeader
        description="Switch between RM, Credit Analyst, Approver, Credit Admin, and System Admin views to see role-specific UAT queues, CR impact, and control focus."
        eyebrow="Stakeholder View"
        title="Role-Based View"
      />
      <div className="p-5 md:p-8">
        <RoleBasedView />
      </div>
    </>
  );
}
