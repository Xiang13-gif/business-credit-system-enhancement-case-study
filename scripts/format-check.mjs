import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", "node_modules", "dist", "build", ".next"]);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".sql", ".svg", ".yaml", ".yml"]);
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

    if (!entry.isFile() || !textExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const content = await readFile(absolute, "utf8");
    if (!content.endsWith("\n")) {
      failures.push(`${relative}: missing final newline`);
    }

    const lines = content.split("\n");
    lines.forEach((line, index) => {
      if (/[ \t]+$/.test(line)) {
        failures.push(`${relative}:${index + 1}: trailing whitespace`);
      }
      if (line.includes("\t")) {
        failures.push(`${relative}:${index + 1}: tab character`);
      }
    });
  }
}

await walk(root);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Formatting checks passed.");
