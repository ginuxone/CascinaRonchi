# Step 5 review — App shell

Static review plus build inspection; no Lighthouse, no Vercel deploy test.

## seo-reviewer (8/10)
| Severity | Issue | Status |
|---|---|---|
| Major | Initial JS above the §6 target and no budget catches it | Initial budget tightened to 350 kB warn / 500 kB error (raw). Main grew ~10 kB gzip in this step (79 → 89); measure and trim in Step 9/10 |
| Minor | Language links: accessible name lacked the visible text (WCAG 2.5.3) | Fixed: `aria-label="IT – Italiano"` |
| Minor | `.asp` redirects are case-sensitive; fragment in `destination` untested on Vercel | Backlog: verify with a preview deploy and `curl -I` (Step 10/11) |
| Minor | Focus trap does not close on outside click | Not changed; page behind is now inert |
| Minor | `scroll-margin-top` close to header height | Re-check in 6a |
| Info | Titles, descriptions, canonical, hreflang, JSON-LD; EN/ES/DE/FR strings | Steps 8 and 7 |

## code-reviewer (no Blockers, 2 Majors)
| Severity | Issue | Status |
|---|---|---|
| Major | Page behind the open menu stays reachable | Fixed: `main`, footer and floating CTA are `inert` while the menu is open |
| Major | Language links only reachable after opening the menu on mobile | Accepted as intended (Minor) |
| Minor | Banner only checked `navigator.language` | Fixed: iterates `navigator.languages` |
| Minor | Hard-coded `80rem` must match `up(xl)` | Accepted, commented |
| Minor | Footer year fixed at prerender time | Accepted, rebuild yearly |
| Minor | `data-hero-cta` does not exist yet | Backlog: 6a must add it |
| Minor | Banner offset by `--cta-bar-h` while the bar is hidden | Cosmetic, accepted |
