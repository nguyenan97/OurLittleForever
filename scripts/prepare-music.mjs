import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = path.join(root, "local-media/content/music.json");
const exists = file => access(file).then(() => true, () => false);
if (!(await exists(config))) {
  console.log("No local music selection. Keep restored audio.");
  process.exit(0);
}
const track = JSON.parse(await readFile(config, "utf8"));
const original = path.join(root, "local-media/audio", track.filename);
const bytes = await readFile(original);
const hash = createHash("sha256").update(bytes).update("mp3-v1-128k-loudness").digest("hex").slice(0,16);
const destination = path.join(root, "public/media/audio", `${hash}.mp3`);
await mkdir(path.dirname(destination), {recursive:true});
if (!(await exists(destination))) {
  execFileSync("ffmpeg", ["-y","-v","error","-i",original,"-vn","-af","loudnorm=I=-18:TP=-2:LRA=8,afade=t=in:d=0.06","-c:a","libmp3lame","-b:a","128k","-ar","44100","-map_metadata","-1",destination],{stdio:"inherit"});
}
const duration = Number(execFileSync("ffprobe",["-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",destination],{encoding:"utf8"}).trim());
await writeFile(path.join(root,"public/media/music.json"),JSON.stringify({title:track.title,performer:track.performer,src:`media/audio/${hash}.mp3`,duration},null,2)+"\n");
console.log(`Direct audio ready: ${Math.round(duration)} seconds. No third-party player.`);
