# Step 6b review — Restaurant

Scope: `git diff main...HEAD` (restaurant section, table-request message, floating CTA table action). Build and lint pass. The menu block is deliberately not part of this step (price and courses still unknown).

## code-reviewer — no Blockers, 1 Major (fixed), 3 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Major | `floating-cta.scss` | `.is-table .cta__book` was not limited to mobile, so it changed the desktop pill (no icon, less padding) | Fixed: wrapped in `@media (max-width: 47.99rem)` |
| Minor | `floating-cta.ts` | Doc comment too long and badly wrapped | Fixed |
| Minor | `floating-cta.ts` | WhatsApp icon repeated in both `@if` branches | Fixed: icon hoisted, label toggled with `[label]` |
| Minor | `restaurant.ts` | "fino a 20 persone" not re-confirmed by the owner | Backlog: confirm before Step 11 |

## seo-reviewer — score 8.5/10, no Blockers or Majors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `restaurant.ts` | "fino a 20 persone" unconfirmed (plan says ~20) | Backlog, same as above |
| Minor | `restaurant.ts` | Thin keyword/location coverage ("formaggi di capra", "agriturismo", Palazzago) | Backlog: rework the copy with the owner when the menu block is added |
| Minor | `floating-cta.ts` | Accessible name of the secondary link changes silently inside `#ristorante` | Accepted |
| Minor | `restaurant.ts` | "Chiama" label and number formatting | No action |

Checked visually by the author: mobile bar at 375 px and 320 px (fits), desktop layout (two columns, 4 photos), no horizontal overflow.
