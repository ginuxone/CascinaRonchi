# Step 6d review — Camere / B&B (intro and gallery)

Scope: `git diff HEAD~1..HEAD` (rooms section: intro, facts line, 6-photo gallery, availability link; `SITE_CONFIG.rooms`). Build and lint pass.

Deliberately not in this step: the three room cards (names, beds and amenities still unknown, owner to supply) and `@defer (on viewport)`, which was skipped on purpose: the image component is already natively lazy and in the main bundle, and deferring would keep the room photos and their alts out of the prerendered HTML. Both reviewers agreed with the second point.

## code-reviewer — no Blockers or Majors, 2 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `rooms.ts` gallery | Portrait photo `camera-letto-ferro-verticale` forced into a 4/3 crop | Checked visually: the bed stays in frame. Revisit when the room cards arrive |
| Minor | `rooms.scss` | `list-style: none` drops list semantics in Safari/VoiceOver | Accepted (same pattern as the other sections) |

## seo-reviewer — score 8.5/10, no Blockers or Majors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `rooms.ts` | h2 is only "Camere", no keyword. `@@section.rooms.title` is shared with the nav label | Backlog: consider "Camere e B&B a Palazzago" with its own ID |
| Minor | `rooms.ts` intro | Never says "agriturismo" or "colline bergamasche" | Backlog, rework with the room cards |
| Minor | `rooms.ts` gallery | Portrait photo cropped hard | See above |
| Minor | `site.config.ts` | `bookingUrl` is a placeholder; plan §6d still says Booking.com | Owner to supply the listing URL; plan wording to update |

Not checked at this step: prerendered HTML in `dist/` by the SEO reviewer (the author's browser check confirmed 6 images with alts), Core Web Vitals and bundle size (initial bundle ~43 kB over the 350 kB warning budget, to handle before Step 12), per-locale meta and JSON-LD (Steps 8–10), translations (Step 7).
