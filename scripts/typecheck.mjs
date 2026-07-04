import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", "node_modules", "dist", "build", ".next"]);
const typeScriptFiles = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await walk(absolute);
      }
      continue;
    }

    if (entry.isFile() && [".ts", ".tsx"].includes(path.extname(entry.name))) {
      typeScriptFiles.push(path.relative(root, absolute));
    }
  }
}

await walk(root);

if (typeScriptFiles.length === 0) {
  console.log("No TypeScript files detected; typecheck is not applicable for this static portfolio.");
  process.exit(0);
}

console.error(`TypeScript files exist but no TypeScript compiler is configured: ${typeScriptFiles.join(", ")}`);
process.exit(1);
