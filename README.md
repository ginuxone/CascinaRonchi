# CascinaRonchi
A website for the Cascina Ronchi that will allow users to book and view their restaurant 

## Images

Originals live in `assets-src/images/` and are described in `catalog.json` (slug, category, focal point, Italian alt text).
`npm run images` (run automatically before `start` and `build`) writes AVIF/WebP/JPEG variants to `public/img/` (gitignored)
and the typed manifest `src/app/content/images.generated.ts`. Use them with `<app-img slug="…" sizes="…" />`.
`"people": true` in the catalog marks photos of identifiable people; each needs written consent before launch (Step 11).
To add a photo: drop it in `assets-src/images/`, add a catalog entry, run `npm run images`.
The video is re-encoded once with `node scripts/encode-video.mjs` (needs ffmpeg).
