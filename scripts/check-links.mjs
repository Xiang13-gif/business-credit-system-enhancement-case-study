import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const markdownFiles = [
  "README.md",
  "docs/01-business-problem.md",
  "docs/02-as-is-to-be-process.md",
  "docs/03-stakeholders-and-raci.md",
  "docs/04-business-requirements.md",
  "docs/05-user-stories.md",
  "docs/06-business-rules-and-approval-matrix.md",
  "docs/07-data-dictionary.md",
  "docs/08-uat-test-cases.md",
  "docs/09-change-request-log.md",
  "docs/10-dashboard-mockup.md",
  "docs/11-references-and-boundaries.md",
  "samples/sample-credit-applications.md"
];

const failures = [];
const markdownLinkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const absoluteFile = path.join(root, file);
  const content = await readFile(absoluteFile, "utf8");
  const fileDir = path.dirname(absoluteFile);

  for (const match of content.matchAll(markdownLinkPattern)) {
    const href = match[1].trim();
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      href.startsWith("mailto:")
    ) {
      continue;
    }

    const cleanHref = href.split("#")[0];
    if (!cleanHref) {
      continue;
    }

    const target = path.resolve(fileDir, cleanHref);
    try {
      await access(target);
    } catch {
      failures.push(`${file} links to missing file: ${href}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Local markdown links passed.");
