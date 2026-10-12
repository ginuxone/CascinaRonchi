# Step 6e review — Le nostre capre

Scope: `git diff HEAD~1..HEAD` (goats section: herd intro, 4 goat photos, "Dal latte al piatto" chain, "Portali a casa" direct-sale block with a pick-up request on WhatsApp; `SITE_CONFIG.goats`). Build and lint pass.

Deliberately not in this step, because the owner has not supplied the facts: breed, named goat cards, cheese names and descriptions, product list with prices, sale days and hours, video loop. The chain omits "aging" (unconfirmed). Photos are goat-only (no people without consent).

## code-reviewer — no Blockers or Majors, 3 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `goats.ts` chain | Step 4 had no heading and the whole text was a link, unlike steps 1–3 | Fixed: heading, text and a separate "Vai al ristorante" link |
| Minor | `goats.ts` | Product list hard-coded in the template; the plan puts it in `content/products.ts` | Backlog: move it when the owner supplies product facts |
| Minor | `goats.ts` | Some copy claims are not in the brief ("pascolano sulle colline", "il latte è fresco", "lo facciamo in cascina") | "fresco" removed; the rest for the owner to confirm when approving the copy |

## seo-reviewer — score 8.5/10, no Blockers or Majors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `goats.ts` | Link in the chain card relies on global link styles; check contrast and focus on the card | Link is now the standard primary colour on a white card; global focus ring applies |
| Minor | `goats.ts` | Thin keyword and location coverage ("agriturismo con capre", Palazzago, colline bergamasche) | Backlog, together with the owner's facts |
| Minor | `goats.ts` | "Il latte è fresco" unconfirmed | Fixed: "fresco" removed |
| Minor | `pickup-request.ts` | Possible CRLF in the WhatsApp text | Not an issue: JavaScript normalizes line breaks in template literals; the generated link contains plain `\n` |

Not checked at this step: Core Web Vitals, per-locale metadata (Steps 8–10), translations (Step 7). Initial bundle is ~48 kB over the 350 kB warning budget, to handle before Step 12.
