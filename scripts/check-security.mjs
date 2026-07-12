import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
  "tmp",
  ".next",
  ".cache",
  ".turbo",
  ".vercel",
  ".netlify"
]);

const forbiddenFileNames = new Set([
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  "id_rsa",
  "id_dsa"
]);

const sensitivePatterns = [
  { label: "OpenAI-style secret", pattern: /sk-[A-Za-z0-9_-]{20,}/ },
  { label: "GitHub classic token", pattern: /ghp_[A-Za-z0-9_]{20,}/ },
  { label: "GitHub fine-grained token", pattern: /github_pat_[A-Za-z0-9_]{20,}/ },
  { label: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/ },
  { label: "Private key block", pattern: /-----BEGIN (RSA |OPENSSH |EC |DSA |)?PRIVATE KEY-----/ },
  { label: "Inline password assignment", pattern: /password\s*=\s*["'][^"']+["']/i },
  { label: "Inline access token assignment", pattern: /access_token\s*=\s*["'][^"']+["']/i }
];

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sql",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await walk(absolute);
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (forbiddenFileNames.has(entry.name)) {
      failures.push(`Forbidden local secret file detected: ${relative}`);
      continue;
    }

    const extension = path.extname(entry.name);
    if (!textExtensions.has(extension)) {
      continue;
    }

    const fileStat = await stat(absolute);
    if (fileStat.size > 1_000_000) {
      continue;
    }

    const content = await readFile(absolute, "utf8");
    for (const check of sensitivePatterns) {
      if (check.pattern.test(content)) {
        failures.push(`${check.label} pattern found in ${relative}`);
      }
    }
  }
}

await walk(root);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Sensitive file and token scan passed.");
