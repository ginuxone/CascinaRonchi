# Step 6a review — Home / Hero

Scope: `git diff main...HEAD` (hero, trust strip, pillars). Build and lint pass.

## code-reviewer — no Blockers, 1 Major (fixed), 5 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Major | `trust-strip.ts` | No space between "Valutazioni aggiornate a" and the `<time>` (whitespace dropped) | Fixed with `&ngsp;`, checked in the browser |
| Minor | `hero.ts` | "vigne" in the lead hints at a vineyard, wine production is gone | Kept, copy approved by the owner. Revisit if they prefer "colline" |
| Minor | `pillars.ts` content | `wheat` icon is a weak fit for events | Backlog |
| Minor | `pillars.ts` | Whole card is one long link name for screen readers | Backlog |
| Minor | `site.config.ts` | `★` baked into the Google score string | Backlog |
| Minor | `hero.scss` | Contrast of white on the CTA hover colour | Checked: ~5:1, passes AA |

## seo-reviewer — score 8.5/10, no Blockers or Majors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `pillars.ts` | Pillar cards use `<h2>` before the real section `<h2>`s | Backlog (outline is still logical) |
| Minor | `site.config.ts` | agriturismo.it link is a placeholder (homepage) | Owner to replace before launch |
| Minor | `hero.ts`, `trust-strip.ts` | `@@cta.newTab` declared twice | Fine while the text stays identical |
| Minor | main bundle | ~112 kB gzip, above the ~80 kB target in §6 | Recheck at Step 12 |
| Minor | `hero.scss` | Crop of the 4:3 photo on wide screens | Checked at 1920 px, building stays in frame |

Not checked at this step: per-locale meta/hreflang/JSON-LD (Step 10), Lighthouse/CWV (once more sections exist), translations (Step 7).
