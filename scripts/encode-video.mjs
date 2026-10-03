// One-off: re-encode the farm video and extract its poster. Not part of the build (needs ffmpeg).
//
//   node scripts/encode-video.mjs [path/to/ffmpeg]
//
// assets-src/video/cascina-ronchi.mp4
//   -> public/video/cascina-ronchi.mp4     H.264, no audio, faststart, <= 1280px wide
//   -> public/video/cascina-ronchi.webm    AV1 (needs an ffmpeg built with libsvtav1)
//   -> assets-src/images/video-poster.jpg  first useful frame; add it to catalog.json, then `npm run images`
//
// Commit public/video/ (it is excluded from .gitignore on purpose). Each output must stay <= 1.5 MB.

import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ffmpeg = process.argv[2] ?? 'ffmpeg';
const input = join(root, 'assets-src', 'video', 'cascina-ronchi.mp4');
const outDir = join(root, 'public', 'video');
const scale = 'scale=min(1280\,iw):-2';
const MAX_BYTES = 1.5 * 1024 * 1024;

mkdirSync(outDir, { recursive: true });

const jobs = [
  [['-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'], join(outDir, 'cascina-ronchi.mp4')],
  [['-c:v', 'libsvtav1', '-crf', '38', '-preset', '6', '-pix_fmt', 'yuv420p'], join(outDir, 'cascina-ronchi.webm')],
];

for (const [codec, out] of jobs) {
  run(['-y', '-i', input, '-an', '-vf', scale, ...codec, out]);
  const size = statSync(out).size;
  console.log(`${out}: ${(size / 1024).toFixed(0)} KB`);
  if (size > MAX_BYTES) {
    console.error('  over the 1.5 MB budget: raise -crf and run again');
    process.exitCode = 1;
  }
}

run(['-y', '-ss', '0.5', '-i', input, '-frames:v', '1', '-q:v', '2', join(root, 'assets-src', 'images', 'video-poster.jpg')]);

function run(args) {
  const result = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`ffmpeg failed (${result.error?.message ?? `exit ${result.status}`}). Is ffmpeg installed and on PATH?`);
    process.exit(1);
  }
}
