# Step 3 review: image and media pipeline

## seo-reviewer (7/10)
- Major: the generated manifest (~17 KB raw, ~5.4 KB gzip) lands in the initial JS. **Deferred**: re-measure after Step 6 / Step 9, split if needed.
- Major: the fade-in could hide the LCP image. **Fixed**: `priority` images are never set to pending.
- Minor: verify the preload link in prerendered HTML in Step 6; add immutable cache headers for `/img/*` in Step 5; alt text counts as SEO copy in Step 7.

## code-reviewer (no Blockers or Majors)
- Minor: `people` flag unused. **Fixed**: documented in README as a consent marker (Step 11).
- Minor: AVIF-only preload. Accepted; one priority image per page.
- Minor: `object-fit` only on cropped images. **Fixed**: now unconditional.
- Minor: video re-encode and poster not run (no ffmpeg). **Open**: run `node scripts/encode-video.mjs`, then add `video-poster` to the catalog.
