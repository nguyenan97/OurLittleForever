import { mkdir, readFile, writeFile, stat, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const originals = path.join(root, "local-media/photos/originals");
const target = path.join(root, "public/media");
const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );
await mkdir(path.join(target, "photos"), { recursive: true });
const config = path.join(root, "local-media/content/curation.json");
if (!(await exists(config))) {
  if (!(await exists(path.join(target, "manifest.json"))))
    await writeFile(path.join(target, "manifest.json"), "[]\n");
  console.log("No local curation. Keep the manifest for CI restoration.");
  process.exit(0);
}
sharp.concurrency(2);
sharp.cache({ memory: 96, files: 20, items: 50 });
const selected = JSON.parse(await readFile(config, "utf8"));
const previous = JSON.parse(await readFile(path.join(target, "manifest.json"), "utf8").catch(() => "[]"));
const manifest = [];
let originalBytes = 0,
  outputBytes = 0;
for (const item of selected) {
  const source = item.developed ? path.join(root, item.developed) : path.join(originals, item.filename);
  if (!(await exists(source))) {
    const preserved = previous.find(photo => photo.id === item.id);
    if (!preserved) throw new Error(`Missing original: ${item.filename}`);
    for (const variant of preserved.variants) {
      for (const file of [variant.webp, variant.avif]) {
        if (!(await exists(path.join(root, "public", file)))) throw new Error(`Missing preserved asset: ${file}`);
      }
    }
    manifest.push({ ...preserved, caption: item.caption, date: item.date || "" });
    console.warn(`Preserved existing export (original unavailable): ${item.id}`);
    continue;
  }
  const bytes = await readFile(source);
  originalBytes += bytes.length;
  const key = createHash("sha256")
    .update(bytes)
    .update("romantic-v4-edited")
    .update(JSON.stringify({ crop: item.crop, tone: item.tone, edited: item.edited, category: item.category }))
    .digest("hex")
    .slice(0, 16);
  const meta = await sharp(bytes).metadata();
  const rotated = [5, 6, 7, 8].includes(meta.orientation);
  const sourceWidth = rotated ? meta.height : meta.width,
    sourceHeight = rotated ? meta.width : meta.height;
  const crop = item.crop && {
    left: Math.round(item.crop[0] * sourceWidth),
    top: Math.round(item.crop[1] * sourceHeight),
    width: Math.round(item.crop[2] * sourceWidth),
    height: Math.round(item.crop[3] * sourceHeight),
  };
  const width = crop?.width || sourceWidth,
    height = crop?.height || sourceHeight;
  // Small photographic corrections only. No face retouching or generated pixels.
  const pipeline = () => {
    let photo = sharp(bytes).rotate();
    if (crop) photo = photo.extract(crop);
    if (item.edited || item.category === "letter") return photo;
    return photo.modulate({
      brightness: item.tone?.brightness ?? (item.category === "portrait" ? 1.008 : 1.025),
      saturation: item.category === "letter" ? 1 : item.category === "portrait" ? 1.008 : 1.018,
    }).linear(1.012, -1.2);
  };
  const widths = [
    ...new Set(
      [480, 960, item.category === "letter" ? 2200 : 1600].map((w) =>
        Math.min(w, width),
      ),
    ),
  ].sort((a, b) => a - b);
  const variants = [];
  for (const size of widths) {
    const webp = `photos/${key}-${size}.webp`,
      avif = `photos/${key}-${size}.avif`;
    const webpPath = path.join(target, webp),
      avifPath = path.join(target, avif);
    if (!(await exists(webpPath)))
      await pipeline()
        .resize({ width: size, withoutEnlargement: true })
        .sharpen({ sigma: 0.4, m1: 0.25, m2: 0.5 })
        .webp({ quality: item.category === "letter" ? 91 : 81, effort: 4 })
        .toFile(webpPath);
    if (!(await exists(avifPath)))
      await pipeline()
        .resize({ width: size, withoutEnlargement: true })
        .sharpen({ sigma: 0.4, m1: 0.25, m2: 0.5 })
        .avif({ quality: item.category === "letter" ? 67 : 53, effort: 3 })
        .toFile(avifPath);
    outputBytes += (await stat(webpPath)).size + (await stat(avifPath)).size;
    variants.push({
      width: size,
      webp: `media/${webp}`,
      avif: `media/${avif}`,
    });
  }
  manifest.push({
    id: item.id,
    category: item.category,
    caption: item.caption,
    date: item.date || "",
    position: item.position || "50% 50%",
    width,
    height,
    src: variants.at(-1).webp,
    thumbnail: variants[0].webp,
    variants,
  });
  console.log(`Ready: ${item.id}`);
}
await writeFile(
  path.join(target, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
const report = {
  count: manifest.length,
  originalBytes,
  outputBytes,
  reductionPercent: Math.round((1 - outputBytes / originalBytes) * 100),
  generatedAt: new Date().toISOString(),
};
await mkdir(path.join(root, "output"), { recursive: true });
await writeFile(
  path.join(root, "output/media-optimization.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report));
