// Build-time image pipeline (ADR-04). Run with `npm run images` (also wired to prebuild/prestart).
//
//   assets-src/images/catalog.json + originals
//     -> public/img/<slug>-<width>.<hash>.{avif,webp,jpg}   (gitignored, shipped in dist)
//     -> src/app/content/images.generated.ts                 (typed manifest + i18n alts)
//
// Metadata (EXIF, GPS, ICC) is stripped: sharp drops it unless withMetadata() is called.
// Idempotent: a source is only re-encoded when its bytes, its catalog entry or this script change.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'assets-src', 'images');
const outDir = join(root, 'public', 'img');
const cacheFile = join(root, '.angular', 'image-cache.json');
const manifestFile = join(root, 'src', 'app', 'content', 'images.generated.ts');

const CATEGORIES = ['hero', 'goats', 'rooms', 'restaurant', 'history', 'staff', 'landscape', 'events'];
const WIDTHS = [480, 800, 1200, 1600];
const HERO_WIDTHS = [...WIDTHS, 2000];
const FORMATS = {
  avif: (img) => img.avif({ quality: 50, effort: 4 }),
  webp: (img) => img.webp({ quality: 72, effort: 4 }),
  jpg: (img) => img.jpeg({ quality: 78, mozjpeg: true, progressive: true }),
};
const LQIP_WIDTH = 16;
// The JPEG is only a fallback for browsers without AVIF/WebP, so it stops at this width.
const JPEG_MAX_WIDTH = 800;

/** Widths generated for one format. Always at least the smallest width. */
function formatWidths(widths, format) {
  if (format !== 'jpg') return widths;
  const capped = widths.filter((w) => w <= JPEG_MAX_WIDTH);
  return capped.length ? capped : [widths[0]];
}

// Budgets from plan Step 3 (AVIF, bytes).
const BUDGETS = [
  { name: 'hero @1200w', limit: 180 * 1024, applies: (e, w) => e.category === 'hero' && w === 1200 },
  { name: 'gallery @800w', limit: 120 * 1024, applies: (e, w) => e.category !== 'hero' && w === 800 },
];

// Bump to force a full re-encode when encoder settings change.
const PIPELINE_VERSION = '2';

const catalog = JSON.parse(readFileSync(join(srcDir, 'catalog.json'), 'utf8'));
const cache = existsSync(cacheFile) ? JSON.parse(readFileSync(cacheFile, 'utf8')) : {};
mkdirSync(outDir, { recursive: true });
mkdirSync(dirname(manifestFile), { recursive: true });

/** Widths to produce: the standard steps below the source width, plus the source width itself. */
function widthsFor(entry, sourceWidth) {
  const steps = entry.category === 'hero' ? HERO_WIDTHS : WIDTHS;
  const below = steps.filter((w) => w < sourceWidth * 0.95);
  const largest = steps.filter((w) => w <= sourceWidth).at(-1);
  const top = below.at(-1) === largest ? [] : [largest ?? sourceWidth];
  return [...new Set([...below, ...top])];
}

function validate(entry) {
  const problems = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug)) problems.push('slug must be kebab-case');
  if (!CATEGORIES.includes(entry.category)) problems.push(`unknown category "${entry.category}"`);
  if (!entry.alt?.trim()) problems.push('missing alt');
  const { x, y } = entry.focal ?? {};
  if (!(x >= 0 && x <= 1 && y >= 0 && y <= 1)) problems.push('focal must be {x,y} within 0..1');
  if (!existsSync(join(srcDir, entry.source))) problems.push(`source "${entry.source}" not found`);
  return problems.map((p) => `${entry.slug}: ${p}`);
}

const errors = catalog.flatMap(validate);
const slugs = catalog.map((e) => e.slug);
for (const dup of slugs.filter((s, i) => slugs.indexOf(s) !== i)) errors.push(`duplicate slug "${dup}"`);
if (catalog.filter((e) => e.category === 'hero').length !== 1) errors.push('exactly one hero image is expected');
if (errors.length) fail(errors);

const manifest = {};
const expectedFiles = new Set();
const overBudget = [];
let encoded = 0;

for (const entry of catalog) {
  const bytes = readFileSync(join(srcDir, entry.source));
  const hash = createHash('sha1')
    .update(PIPELINE_VERSION)
    .update(bytes)
    .update(JSON.stringify([entry.category, WIDTHS, HERO_WIDTHS, LQIP_WIDTH]))
    .digest('hex')
    .slice(0, 8);

  let record = cache[entry.slug];
  const files = (widths) =>
    Object.keys(FORMATS).flatMap((f) => formatWidths(widths, f).map((w) => fileName(entry.slug, w, hash, f)));

  if (!record || record.hash !== hash || !files(record.widths).every((f) => existsSync(join(outDir, f)))) {
    record = await encode(entry, bytes, hash);
    cache[entry.slug] = record;
    encoded++;
  }

  files(record.widths).forEach((f) => expectedFiles.add(f));
  for (const [w, size] of Object.entries(record.avifBytes)) {
    const budget = BUDGETS.find((b) => b.applies(entry, Number(w)));
    if (budget && size > budget.limit) overBudget.push(`${entry.slug} ${budget.name}: ${kb(size)} > ${kb(budget.limit)}`);
  }

  manifest[entry.slug] = {
    category: entry.category,
    width: record.width,
    height: record.height,
    widths: record.widths,
    hash,
    focal: entry.focal,
    lqip: record.lqip,
  };
}

// Drop outputs of removed or re-encoded images.
for (const f of readdirSync(outDir)) {
  if (!expectedFiles.has(f)) rmSync(join(outDir, f));
}
mkdirSync(dirname(cacheFile), { recursive: true });
writeFileSync(cacheFile, JSON.stringify(cache));
writeFileSync(manifestFile, renderManifest(manifest, catalog));

console.log(`images: ${catalog.length} in catalog, ${encoded} encoded, ${catalog.length - encoded} unchanged`);
if (overBudget.length) fail(['AVIF budget exceeded:', ...overBudget]);

async function encode(entry, bytes, hash) {
  const base = sharp(bytes).rotate(); // apply EXIF orientation; metadata is dropped on output
  const meta = await sharp(bytes).metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const [width, height] = swap ? [meta.height, meta.width] : [meta.width, meta.height];
  const widths = widthsFor(entry, width);
  const avifBytes = {};

  for (const [format, apply] of Object.entries(FORMATS)) {
    for (const w of formatWidths(widths, format)) {
      const resized = base.clone().resize({ width: w, withoutEnlargement: true });
      const file = join(outDir, fileName(entry.slug, w, hash, format));
      const info = await apply(resized.clone()).toFile(file);
      if (format === 'avif') avifBytes[w] = info.size;
      const out = await sharp(file).metadata();
      if (out.exif || out.icc || out.xmp || out.iptc) fail([`${file}: metadata was not stripped`]);
    }
  }

  const lqipBuffer = await base
    .clone()
    .resize({ width: LQIP_WIDTH })
    .blur(1)
    .webp({ quality: 40 })
    .toBuffer();

  return { hash, width, height, widths, avifBytes, lqip: `data:image/webp;base64,${lqipBuffer.toString('base64')}` };
}

function fileName(slug, width, hash, format) {
  return `${slug}-${width}.${hash}.${format}`;
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function renderManifest(images, entries) {
  const q = (s) => JSON.stringify(s);
  const body = Object.entries(images)
    .map(([slug, e]) => `  ${q(slug)}: ${JSON.stringify(e)},`)
    .join('\n');
  const alts = entries
    .map((e) => `  ${q(e.slug)}: $localize\`:@@img.${e.slug}.alt:${e.alt.replaceAll('`', '\\`').replaceAll('${', '\\${')}\`,`)
    .join('\n');

  return `// GENERATED by scripts/optimize-images.mjs from assets-src/images/catalog.json. Do not edit.
// Regenerate with \`npm run images\`.

export type ImageCategory = ${CATEGORIES.map(q).join(' | ')};

export interface ImageEntry {
  readonly category: ImageCategory;
  /** Intrinsic size of the original (the aspect ratio of every variant). */
  readonly width: number;
  readonly height: number;
  /** Generated widths, ascending. */
  readonly widths: readonly number[];
  /** Content hash used in the file names. */
  readonly hash: string;
  /** Focal point as 0..1 fractions, used for object-position when cropping. */
  readonly focal: { readonly x: number; readonly y: number };
  /** Tiny blurred placeholder as a data URI. */
  readonly lqip: string;
}

/** JPEG fallbacks are only generated up to this width. */
export const JPEG_MAX_WIDTH = ${JPEG_MAX_WIDTH};

export const IMAGES = {
${body}
} as const satisfies Record<string, ImageEntry>;

export type ImageSlug = keyof typeof IMAGES;

/** Localized alt text. IDs are \`img.<slug>.alt\`. */
export const IMAGE_ALTS: Record<ImageSlug, string> = {
${alts}
};
`;
}

function fail(lines) {
  console.error(['images: failed', ...lines.map((l) => `  ${l}`)].join('\n'));
  process.exit(1);
}
