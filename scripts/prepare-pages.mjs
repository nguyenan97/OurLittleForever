import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist/our-little-forever/browser");
const html = await readFile(path.join(output, "index.html"), "utf8");
const routes = ["20-11", "chuyen-minh", "khoanh-khac", "loi-thuong"];
for (const route of routes) {
  const directory = path.join(output, route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}
await writeFile(path.join(output, "404.html"), html);
await writeFile(path.join(output, ".nojekyll"), "");
console.log(
  `GitHub Pages: ${routes.length} direct routes emitted with the build base URL.`,
);
