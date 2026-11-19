import { mkdir, readFile, writeFile, access, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "local-media/photos/originals");
const target = path.join(root, "public/media/videos");
const exists = file => access(file).then(() => true, () => false);
if (!(await exists(source))) process.exit(0);
await mkdir(target, { recursive: true });
const selected = [
  { id: "photobooth", filename: "video.mp4", caption: "Bốn khung hình, thật nhiều dễ thương.", width: 480 },
  { id: "first-memory", filename: "video_thumbnail_fixed.mp4", caption: "Từ lần đầu gặp, anh đã muốn giữ lại.", width: 512 },
];
const manifest = [];
for (const item of selected) {
  const file = path.join(source, item.filename);
  if (!(await exists(file))) continue;
  const bytes = await readFile(file);
  const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type", "-of", "json", file], { encoding: "utf8" }));
  const hasAudio = probe.streams.some(stream => stream.codec_type === "audio");
  const key = createHash("sha256").update(bytes).update("video-v2-audio").digest("hex").slice(0, 16);
  const dest = path.join(target, key + ".mp4"), poster = path.join(target, key + ".webp");
  if (!(await exists(dest))) execFileSync("ffmpeg", ["-y", "-v", "error", "-i", file, "-map", "0:v:0", "-map", "0:a?", "-vf", `scale=${item.width}:-2,eq=brightness=0.005:saturation=1.01`, "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", dest], { stdio: "inherit" });
  if (!(await exists(poster))) execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "2", "-i", dest, "-frames:v", "1", "-quality", "80", poster], { stdio: "inherit" });
  manifest.push({ id: item.id, caption: item.caption, hasAudio, src: `media/videos/${key}.mp4`, poster: `media/videos/${key}.webp`, originalBytes: bytes.length, bytes: (await stat(dest)).size });
}
await writeFile(path.join(root, "public/media/videos.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify(manifest.map(({id, originalBytes, bytes}) => ({id, originalBytes, bytes}))));
