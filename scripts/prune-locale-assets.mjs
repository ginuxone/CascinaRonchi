// Angular copies everything in public/ into every locale folder. The optimized images are shared and
// referenced as /img/..., so the per-locale copies (about 25 MB each) are dead weight. Run after `ng build`.

import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const browserDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'cascina-ronchi', 'browser');

if (!existsSync(join(browserDir, 'img'))) {
  console.error(`prune-locale-assets: ${join(browserDir, 'img')} is missing, nothing to share.`);
  process.exit(1);
}

let pruned = 0;
for (const name of readdirSync(browserDir)) {
  const localeImg = join(browserDir, name, 'img');
  if (statSync(join(browserDir, name)).isDirectory() && existsSync(localeImg)) {
    rmSync(localeImg, { recursive: true });
    pruned++;
  }
}
console.log(`prune-locale-assets: removed ${pruned} duplicated img folders`);
