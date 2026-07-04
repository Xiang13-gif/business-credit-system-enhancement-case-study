import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);

try {
  await access(path.join(distDir, "index.html"));
} catch {
  console.error("dist/index.html not found. Run npm run build first.");
  process.exit(1);
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".sql": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".yaml": "application/yaml; charset=utf-8",
  ".yml": "application/yaml; charset=utf-8"
};

function resolveRequest(url) {
  const requestPath = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const target = path.join(distDir, safePath === "/" ? "index.html" : safePath);

  if (!target.startsWith(distDir)) {
    return null;
  }

  return target;
}

const server = createServer(async (request, response) => {
  const target = resolveRequest(request.url || "/");
  if (!target) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(target);
    const filePath = fileStat.isDirectory() ? path.join(target, "index.html") : target;
    const extension = path.extname(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Serving dist at http://localhost:${port}`);
});
