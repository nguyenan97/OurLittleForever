import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = "nguyenan97/OurLittleForever",
  tag = "website-media";
const photos = JSON.parse(
  await readFile(path.join(root, "public/media/manifest.json"), "utf8"),
);
if (!photos.length)
  throw new Error("Refusing to replace published media with an empty album.");
const files = new Set(["media/manifest.json"]);
files.add("media/audio/piano-v1.mp3");
for (const photo of photos)
  for (const variant of photo.variants) {
    files.add(variant.webp);
    files.add(variant.avif);
  }
const videos = JSON.parse(await readFile(path.join(root, "public/media/videos.json"), "utf8").catch(() => "[]"));
if (videos.length) {
  files.add("media/videos.json");
  for (const video of videos) { files.add(video.src); files.add(video.poster); }
}
for (const name of files)
  if (
    !/^media\/((manifest|videos)\.json|photos\/[a-f0-9]+-\d+\.(webp|avif)|videos\/[a-f0-9]+\.(mp4|webp)|audio\/piano-v1\.mp3)$/.test(name)
  )
    throw new Error("Unexpected public asset path.");
await mkdir(path.join(root, "output"), { recursive: true });
const list = path.join(root, "output/media-file-list.txt"),
  archive = path.join(root, "output/media.tar.gz");
await writeFile(list, [...files].join("\n") + "\n");
execFileSync(
  "tar",
  ["-czf", archive, "-C", path.join(root, "public"), "-T", list],
  { cwd: root, stdio: "inherit" },
);
const existing = spawnSync("gh", ["release", "view", tag, "--repo", repo], {
  cwd: root,
  stdio: "ignore",
});
if (existing.status === 0)
  execFileSync(
    "gh",
    ["release", "upload", tag, archive, "--clobber", "--repo", repo],
    { cwd: root, stdio: "inherit" },
  );
else
  execFileSync(
    "gh",
    [
      "release",
      "create",
      tag,
      archive,
      "--repo",
      repo,
      "--target",
      "main",
      "--title",
      "Website media",
      "--notes",
      "Optimized public assets for GitHub Pages. Original photographs stay local.",
      "--prerelease",
      "--latest=false",
    ],
    { cwd: root, stdio: "inherit" },
  );
console.log(
  `Published ${photos.length} photographs, ${videos.length} videos and the piano loop as a release asset. No media files committed.`,
);
