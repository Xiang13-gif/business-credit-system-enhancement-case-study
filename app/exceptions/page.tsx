import { PolicyExceptionRegister } from "@/components/policy-exception-register";
import { PageHeader } from "@/components/ui";

export default function ExceptionsPage() {
  return (
    <>
      <PageHeader
        description="Track policy exceptions by severity, owner, mitigation, approval tier, aging, evidence, linked requirements, and UAT coverage."
        eyebrow="Risk And Control"
        title="Policy Exception Register"
      />
      <div className="p-5 md:p-8">
        <PolicyExceptionRegister />
      </div>
    </>
  );
}
