import { UatTracker } from "@/components/uat-tracker";
import { PageHeader } from "@/components/ui";

export default function UatPage() {
  return (
    <>
      <PageHeader
        description="Track UAT scenarios, priority, status, tester ownership, linked defects, and pass rate for a banking credit enhancement release."
        eyebrow="Module 2"
        title="UAT Test Case Tracker"
      />
      <div className="p-5 md:p-8">
        <UatTracker />
      </div>
    </>
  );
}
