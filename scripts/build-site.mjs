import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");

const css = await readFile(path.join(root, "src", "site.css"), "utf8");

const artifacts = [
  {
    title: "Business Problem",
    href: "docs/01-business-problem.md",
    text: "Problem statement, business impact, success measures, and assumptions."
  },
  {
    title: "As-Is / To-Be Process",
    href: "docs/02-as-is-to-be-process.md",
    text: "End-to-end workflow diagrams for the existing and proposed credit process."
  },
  {
    title: "Stakeholders and RACI",
    href: "docs/03-stakeholders-and-raci.md",
    text: "Role responsibilities across RM, Credit, Approver, Credit Admin, Compliance, and Technology."
  },
  {
    title: "Business Requirements",
    href: "docs/04-business-requirements.md",
    text: "Functional, non-functional, and reporting requirements with business rationale."
  },
  {
    title: "User Stories",
    href: "docs/05-user-stories.md",
    text: "Epics, user stories, and acceptance criteria for Agile delivery."
  },
  {
    title: "Business Rules and Approval Matrix",
    href: "docs/06-business-rules-and-approval-matrix.md",
    text: "Synthetic routing logic, exception handling, checklist rules, and approval thresholds."
  },
  {
    title: "Data Dictionary",
    href: "docs/07-data-dictionary.md",
    text: "Field definitions, ownership, validation rules, and data quality controls."
  },
  {
    title: "UAT Test Cases",
    href: "docs/08-uat-test-cases.md",
    text: "Business-led UAT scenarios covering intake, routing, exceptions, decisions, and readiness."
  },
  {
    title: "Change Request Log",
    href: "docs/09-change-request-log.md",
    text: "Example delivery change requests and BA impact assessment."
  },
  {
    title: "Dashboard Mockup",
    href: "docs/10-dashboard-mockup.md",
    text: "Operational KPI layout for pipeline, aging, exceptions, and drilldown."
  },
  {
    title: "SQL Analysis",
    href: "sql/credit_pipeline_analysis.sql",
    text: "Sample queries for pipeline, aging, turnaround time, exceptions, and readiness."
  },
  {
    title: "API Contract",
    href: "api/business-credit-application.yaml",
    text: "Illustrative OpenAPI contract for BA and technology discussion."
  }
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function artifactCards() {
  return artifacts
    .map(
      (item) => `
        <article class="card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
          <a href="${escapeHtml(item.href)}">Open artifact</a>
        </article>`
    )
    .join("\n");
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Business Credit System Enhancement Case Study</title>
    <meta name="description" content="An anonymized Business Analyst portfolio project for a commercial banking credit platform.">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    <style>${css}</style>
  </head>
  <body>
    <header class="hero">
      <div class="hero-inner">
        <p class="eyebrow">Banking Business Analyst Portfolio</p>
        <h1>Business Credit System Enhancement Case Study</h1>
        <p class="intro">
          A practical BA delivery pack for a commercial banking credit platform, covering process redesign,
          approval routing, document controls, exception handling, UAT, SQL analysis, and a lightweight API contract.
        </p>
        <div class="meta" aria-label="Project highlights">
          <span class="pill">Commercial Credit</span>
          <span class="pill">SME Lending</span>
          <span class="pill">Approval Matrix</span>
          <span class="pill">UAT Ready</span>
          <span class="pill">Synthetic Data Only</span>
        </div>
      </div>
    </header>

    <main>
      <section class="section">
        <div class="section-title">
          <h2>Case Objective</h2>
          <p class="section-note">Structured like a real BA project pack, with confidentiality boundaries.</p>
        </div>
        <div class="matrix">
          <table>
            <thead>
              <tr>
                <th>Problem</th>
                <th>Enhancement Focus</th>
                <th>Expected Business Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Credit applications move across teams with manual checklist tracking and unclear ownership.</td>
                <td>Introduce validation, dynamic checklist rules, approval routing, exception capture, and status visibility.</td>
                <td>Reduce rework, improve auditability, and make bottlenecks easier to manage.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <h2>Project Artifacts</h2>
          <p class="section-note">All examples are anonymized and synthetic.</p>
        </div>
        <div class="grid">
          ${artifactCards()}
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <h2>Confidentiality Boundary</h2>
          <p class="section-note">Prepared for portfolio use.</p>
        </div>
        <div class="matrix">
          <table>
            <tbody>
              <tr>
                <th>Included</th>
                <td>Public-risk-reference framing, synthetic workflow, sample data, business rules, UAT, dashboard requirements, and API discussion contract.</td>
              </tr>
              <tr>
                <th>Excluded</th>
                <td>Bank names, real customers, production data, internal screens, internal policy wording, vendor details, and confidential delivery records.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="section">
        Built as a static portfolio page. See README.md for source references and repository guide.
      </div>
    </footer>
  </body>
</html>`;

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await writeFile(path.join(distDir, "index.html"), html);

for (const directory of ["docs", "samples", "sql", "api"]) {
  await cp(path.join(root, directory), path.join(distDir, directory), { recursive: true });
}

await cp(path.join(root, "public"), distDir, { recursive: true });

console.log(`Built static site at ${path.relative(root, distDir)}/index.html`);
