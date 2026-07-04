import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredPaths = [
  "package.json",
  "README.md",
  ".gitignore",
  ".env.example",
  "docs",
  "samples",
  "sql",
  "api",
  "src",
  "public",
  "scripts",
  "docs/01-business-problem.md",
  "docs/02-as-is-to-be-process.md",
  "docs/04-business-requirements.md",
  "docs/06-business-rules-and-approval-matrix.md",
  "docs/08-uat-test-cases.md",
  "sql/credit_pipeline_analysis.sql",
  "api/business-credit-application.yaml"
];

const requiredScripts = [
  "build",
  "check",
  "check:security",
  "check:structure",
  "dev",
  "format:check",
  "lint",
  "start",
  "typecheck"
];

const failures = [];

for (const item of requiredPaths) {
  try {
    await access(path.join(root, item));
  } catch {
    failures.push(`Missing required path: ${item}`);
  }
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    failures.push(`Missing package.json script: ${script}`);
  }
}

if (!packageJson.dependencies || !packageJson.devDependencies) {
  failures.push("package.json should declare dependencies and devDependencies, even when empty.");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Project structure passed.");
