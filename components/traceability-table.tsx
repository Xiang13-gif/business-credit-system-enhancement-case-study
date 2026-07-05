"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Card } from "@/components/ui";
import { traceabilityMatrix } from "@/lib/mock-data";

export function TraceabilityTable() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return traceabilityMatrix;
    }

    return traceabilityMatrix.filter((item) =>
      [
        item.requirementId,
        item.requirementDescription,
        item.relatedBusinessRule,
        item.relatedTestCaseId,
        item.relatedChangeRequest,
        item.status
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search]);

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Requirement Traceability Matrix</h2>
          <p className="mt-1 text-sm text-muted-foreground">Requirement-to-rule-to-test-to-change linkage.</p>
        </div>
        <label className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input className="control w-full pl-9" onChange={(event) => setSearch(event.target.value)} placeholder="Search matrix" value={search} />
        </label>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3 text-left">Requirement ID</th>
              <th className="px-4 py-3 text-left">Requirement Description</th>
              <th className="px-4 py-3 text-left">Business Rule</th>
              <th className="px-4 py-3 text-left">Test Case</th>
              <th className="px-4 py-3 text-left">Change Request</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr className="border-t align-top" key={item.requirementId}>
                <td className="px-4 py-3 font-semibold">{item.requirementId}</td>
                <td className="px-4 py-3">{item.requirementDescription}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.relatedBusinessRule}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.relatedTestCaseId}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.relatedChangeRequest}</td>
                <td className="px-4 py-3">
                  <Badge tone={item.status === "Updated" ? "warning" : item.status === "Pending Review" ? "danger" : "success"}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
