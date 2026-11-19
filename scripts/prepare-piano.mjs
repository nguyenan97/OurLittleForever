import { mkdir, writeFile, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exists = file => access(file).then(() => true, () => false);
if (!(await exists(path.join(root, "local-media/content/curation.json")))) process.exit(0);
const destination = path.join(root, "public/media/audio/piano-v1.mp3");
if (await exists(destination)) process.exit(0);
await mkdir(path.dirname(destination), { recursive: true });
await mkdir(path.join(root, "output"), { recursive: true });
// Original Cmaj7 / Am7 / Fmaj7 / G arpeggio. No sampled recordings.
const chords = [[48,55,60,64,67,64,60,55],[45,52,57,60,64,60,57,52],[41,48,53,57,60,57,53,48],[43,50,55,59,62,59,55,50]];
const rate = 44100, interval = 0.64, duration = 64 * interval;
const frames = Math.round(rate * duration), samples = new Float32Array(frames);
for (let step = 0; step < 64; step++) {
  const note = chords[Math.floor(step/8)%4][step%8];
  const frequency = 440 * 2 ** ((note-69)/12);
  const offset = Math.round(step*interval*rate);
  for (let j=0;j<rate*3.3;j++) {
    const t=j/rate, attack=Math.min(1,t/.008), decay=Math.exp(-t*2.2);
    let sound=0;
    for (let partial=1;partial<=5;partial++) sound += Math.sin(2*Math.PI*frequency*partial*t) * [0,.75,.18,.06,.018,.006][partial] * Math.exp(-t*(partial-1)*1.1);
    const v=sound*attack*decay;
    samples[(offset+j)%frames] += v;
    samples[(offset+j+Math.round(rate*.31))%frames] += v*.12;
    samples[(offset+j+Math.round(rate*.67))%frames] += v*.055;
  }
}
let peak=0; for (const v of samples) peak=Math.max(peak,Math.abs(v));
const pcm=Buffer.alloc(frames*2);
for (let i=0;i<frames;i++) pcm.writeInt16LE(Math.round(samples[i]/peak*10500),i*2);
const raw=path.join(root,"output/piano-original.s16le");
await writeFile(raw,pcm);
execFileSync("ffmpeg",["-y","-v","error","-f","s16le","-ar",String(rate),"-ac","1","-i",raw,"-c:a","libmp3lame","-b:a","96k","-map_metadata","-1",destination],{stdio:"inherit"});
console.log("Original piano loop ready: 41 seconds, MP3 96 kbps.");
