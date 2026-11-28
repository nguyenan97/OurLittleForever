import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = path.join(root, "local-media/content/curation.json");
const selected = JSON.parse(await readFile(config, "utf8"));
const melt = process.env.KDENLIVE_MELT || path.join(process.env.LOCALAPPDATA, "Programs/Kdenlive/bin/melt.exe");
await access(melt);
const exports = path.join(root, "local-media/photos/developed");
const projects = path.join(root, "local-media/kdenlive");
await mkdir(exports, { recursive: true });
await mkdir(projects, { recursive: true });
const exists = file => access(file).then(() => true, () => false);
const xml = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

// Individual scene grades: brightness, contrast, gamma, saturation, red/green/blue midtones.
// Keep exposure neutral for her skin; lift only his face with a feathered mask.
const grades = {
  "first-meeting": [0, 1.005, 1, 0.99, 0, -0.002, 0.002],
  "private-date": [0, 1.01, 1, 0.98, -0.006, 0, 0.008],
  "date-smile": [0, 1.005, 1, 0.99, -0.006, 0, 0.008],
  "date-flowers": [0, 1.005, 1, 0.99, -0.006, 0, 0.008],
  "roses": [0, 1.025, 1.025, 0.97, 0.004, 0, -0.006],
  "bracelet": [0, 1.02, 1.035, 0.96, -0.004, 0, 0.006],
  "our-kiss": [0, 1.005, 1, 0.99, 0, 0.002, -0.005],
  "couple-close": [0, 1.005, 1, 0.99, 0, 0.002, -0.005],
  "bouquet-evening": [0, 1.005, 1, 0.99, 0, 0.002, -0.005],
  "hands": [0, 1.005, 1, 0.99, 0.002, -0.002, 0],
  "heart-hands": [0, 1.005, 1, 0.99, 0.002, -0.002, 0],
  "first-laughter": [0, 1.005, 1, 0.99, 0, -0.004, 0.002],
  "booth-strip": [0, 1.01, 1.015, 0.99, 0, 0, 0],
  "booth-smile": [0, 1, 1, 1, 0, 0, 0],
  "sunny-together": [0, 1.005, 1, 0.99, 0, -0.003, 0.002],
};
// [centerX, centerY, horizontalRadius, verticalRadius, luminanceLift] in normalized image coordinates.
const faceLights = {
  "first-meeting": [.27,.18,.10,.10,4],
  "private-date": [.31,.51,.08,.065,4],
  "our-kiss": [.56,.37,.085,.08,5],
  "couple-close": [.66,.39,.085,.085,5],
  "first-laughter": [.72,.49,.09,.08,5],
  "sunny-together": [.23,.49,.14,.11,5],
};

for (const item of selected.filter(photo => photo.category === "memory")) {
  const original = path.join(root, "local-media/photos/originals", item.filename);
  if (!(await exists(original))) { console.warn(`Original unavailable, retained existing export: ${item.id}`); continue; }
  const grade = grades[item.id];
  if (!grade) throw new Error(`Choose an individual grade for ${item.id}`);
  const bytes = await readFile(original);
  const face = faceLights[item.id];
  const hash = createHash("sha256").update(bytes).update(JSON.stringify({grade,face})).update("mlt-grade-v2-neutral-skin").digest("hex").slice(0, 16);
  const output = path.join(exports, `${hash}.png`);
  if (!(await exists(output))) {
    const meta = await sharp(bytes).rotate().metadata();
    const rotated = [5, 6, 7, 8].includes(meta.orientation);
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;
    const scale = Math.min(1, 2400 / Math.max(width, height));
    const w = Math.round(width * scale / 2) * 2, h = Math.round(height * scale / 2) * 2;
    const [brightness, contrast, gamma, saturation, rm, gm, bm] = grade;
    const project = path.join(projects, `${item.id}.mlt`);
    const properties = values => Object.entries(values).map(([key, value]) => `<property name="${key}">${xml(value)}</property>`).join("\n");
    const faceFilter = face ? `<filter>${properties({mlt_service:"avfilter.geq", "av.lum_expr":`lum(X,Y)+${face[4]}*exp(-pow((X/W-${face[0]})/${face[2]},2)-pow((Y/H-${face[1]})/${face[3]},2))`, "av.cb_expr":"cb(X,Y)", "av.cr_expr":"cr(X,Y)"})}</filter>` : "";
    await writeFile(project, `<?xml version="1.0" encoding="utf-8"?>
<mlt producer="scene">
<profile description="A &amp; T photo grade" width="${w}" height="${h}" frame_rate_num="25" frame_rate_den="1" progressive="1" sample_aspect_num="1" sample_aspect_den="1" display_aspect_num="${w}" display_aspect_den="${h}" colorspace="709"/>
<producer id="photo" in="0" out="0">${properties({ mlt_service: "qimage", resource: original.replaceAll("\\", "/"), length: 1 })}
<filter>${properties({mlt_service:"avfilter.eq", "av.brightness":brightness,"av.contrast":contrast,"av.gamma":gamma,"av.gamma_weight":0.65,"av.saturation":saturation})}</filter>
<filter>${properties({mlt_service:"avfilter.colorbalance","av.rm":rm,"av.gm":gm,"av.bm":bm,"av.pl":1})}</filter>
${faceFilter}
</producer><playlist id="scene"><entry producer="photo" in="0" out="0"/></playlist></mlt>`);
    execFileSync(melt, [project, "in=0", "out=0", "-consumer", `avformat:${output.replaceAll("\\", "/")}`, "f=image2", "vcodec=png", "pix_fmt=rgb24", "an=1", "real_time=-1", "threads=2"], {
      cwd: path.dirname(melt), env: {...process.env, QT_QPA_PLATFORM:"offscreen"}, stdio: "pipe", timeout: 90000,
    });
    const rendered = await sharp(output).metadata();
    if (rendered.width !== w || rendered.height !== h) throw new Error(`Unexpected render dimensions: ${item.id}`);
  }
  item.developed = path.relative(root, output).replaceAll("\\", "/");
  item.edited = true;
  console.log(`Kdenlive MLT grade ready: ${item.id}`);
}
await writeFile(config, JSON.stringify(selected, null, 2) + "\n");
