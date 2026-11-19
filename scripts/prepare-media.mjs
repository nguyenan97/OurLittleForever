import { mkdir, readdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "local-media/photos/selected");
const target = path.join(root, "public/media/photos");
await mkdir(source, { recursive: true });
await mkdir(target, { recursive: true });
const supported = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const exists = async (file) =>
  access(file).then(
    () => true,
    () => false,
  );
const manifest = [];
const metadataFile = path.join(root, "local-media/content/photos.json");
const metadata = (await exists(metadataFile))
  ? JSON.parse(await readFile(metadataFile, "utf8"))
  : {};
const generated = new Set();

for (const filename of (await readdir(source))
  .filter((name) => supported.test(name))
  .sort()) {
  const bytes = await readFile(path.join(source, filename));
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
  const mainName = `${hash}.webp`,
    thumbName = `${hash}-thumb.webp`;
  if (!(await exists(path.join(target, mainName)))) {
    await sharp(bytes)
      .rotate()
      .resize({
        width: 1600,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 86 })
      .toFile(path.join(target, mainName));
  }
  if (!(await exists(path.join(target, thumbName)))) {
    await sharp(bytes)
      .rotate()
      .resize({
        width: 640,
        height: 800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(path.join(target, thumbName));
  }
  const info = await sharp(path.join(target, mainName)).metadata();
  generated.add(mainName);
  generated.add(thumbName);
  manifest.push({
    src: `media/photos/${mainName}`,
    thumbnail: `media/photos/${thumbName}`,
    width: info.width,
    height: info.height,
    alt: metadata[filename]?.alt || "Kỷ niệm của Bình An và Thanh Tuyền",
    caption: metadata[filename]?.caption || "",
  });
}

// Include files copied directly to public, without modifying or deleting them.
for (const filename of (await readdir(target))
  .filter(
    (name) =>
      supported.test(name) &&
      !/^[a-f0-9]{16}(-thumb)?\.webp$/.test(name) &&
      !generated.has(name),
  )
  .sort()) {
  const info = await sharp(path.join(target, filename)).metadata();
  manifest.push({
    src: `media/photos/${encodeURIComponent(filename)}`,
    thumbnail: `media/photos/${encodeURIComponent(filename)}`,
    width: info.width,
    height: info.height,
    alt: metadata[filename]?.alt || "Kỷ niệm của Bình An và Thanh Tuyền",
    caption: metadata[filename]?.caption || "",
  });
}
await writeFile(
  path.join(root, "public/media/manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`Media ready: ${manifest.length} photo(s). Originals unchanged.`);
