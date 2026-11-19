import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist/our-little-forever/browser",
);
const base = "/OurLittleForever/";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
http
  .createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      if (!url.pathname.startsWith(base)) {
        response.writeHead(404).end();
        return;
      }
      const relative = decodeURIComponent(url.pathname.slice(base.length));
      let file = path.resolve(root, relative);
      if (file !== root && !file.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          response
            .writeHead(301, { Location: url.pathname + "/" + url.search })
            .end();
          return;
        }
        file = path.join(file, "index.html");
      }
      const bytes = await readFile(file);
      const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) {
        const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
        if (start > end || start >= bytes.length) { response.writeHead(416, { "Content-Range": `bytes */${bytes.length}` }).end(); return; }
        response.writeHead(206, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Content-Range": `bytes ${start}-${end}/${bytes.length}`, "Content-Length": end-start+1, "Accept-Ranges": "bytes", "Cache-Control": "no-store" });
        response.end(bytes.subarray(start,end+1)); return;
      }
      response
        .writeHead(200, {
          "Content-Type":
            types[path.extname(file)] || "application/octet-stream",
          "Cache-Control": "no-store",
          "Accept-Ranges": "bytes",
        })
        .end(bytes);
    } catch {
      response.writeHead(404).end("Not found");
    }
  })
  .listen(4200, "127.0.0.1", () =>
    console.log("Pages preview: http://127.0.0.1:4200/OurLittleForever/"),
  );
