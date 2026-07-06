import { ApprovalRoutingSimulator } from "@/components/approval-routing-simulator";
import { PageHeader } from "@/components/ui";

export default function ApprovalRoutingPage() {
  return (
    <>
      <PageHeader
        description="Simulate risk-based approval authority using exposure, risk grade, collateral coverage, customer segment, facility type, and policy exception severity."
        eyebrow="Delegated Authority"
        title="Approval Routing Simulator"
      />
      <div className="p-5 md:p-8">
        <ApprovalRoutingSimulator />
      </div>
    </>
  );
}
