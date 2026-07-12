import { RuleGovernanceCenter } from "@/components/rule-governance-center";
import { PageHeader } from "@/components/ui";

export default function RulesPage() {
  return (
    <>
      <PageHeader
        description="Govern high-impact business rules through controlled ownership, version comparison, maker-checker approval, impact analysis, regression scenarios, and activation evidence."
        eyebrow="Decision Governance"
        title="Business Rule Governance Center"
      />
      <div className="p-5 md:p-8">
        <RuleGovernanceCenter />
      </div>
    </>
  );
}
