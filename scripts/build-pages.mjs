import { mkdir, copyFile, rm, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "assets"), { recursive: true });

await Promise.all([
  copyFile(join(root, "index.html"), join(dist, "index.html")),
  copyFile(join(root, "app.js"), join(dist, "app.js")),
  copyFile(join(root, "styles.css"), join(dist, "styles.css")),
  copyFile(join(root, "_headers"), join(dist, "_headers")),
  cp(join(root, "assets"), join(dist, "assets"), { recursive: true })
]);

console.log("Cloudflare Pages static files written to dist/");
