import { ReleaseReadinessCenter } from "@/components/release-readiness-center";
import { PageHeader } from "@/components/ui";

export default function ReleasePage() {
  return (
    <>
      <PageHeader
        description="Make an evidence-led Go, Conditional Go, or No-Go decision using business, UAT, data, technology, control, operations, training, cutover, and hypercare readiness."
        eyebrow="Implementation and Operational Readiness"
        title="Release and Cutover Command Center"
      />
      <div className="p-5 md:p-8">
        <ReleaseReadinessCenter />
      </div>
    </>
  );
}
