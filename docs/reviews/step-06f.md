# Step 6f review — La nostra storia (timeline)

Scope: commit e3e5665 (`content/timeline.ts`, `sections/history`). Confirmed facts: oldest core late 1600s, permanent residents from 1760 (vines on terraces), last extension 1859, recently restored, wine only as history. The restoration and goats entries have no year on purpose.

## code-reviewer — 1 Major (fixed), 3 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Major | `timeline.ts` restoration | "Dentro si vedono ancora la pietra a vista e il vecchio camino" is not confirmed to have survived the restoration | Fixed: sentence removed. (Stone walls and fireplace are in brief §4 for the rooms, but not as a restoration fact) |
| Minor | `timeline.ts` first entry | "Oggi è qui che dormono gli ospiti" | Confirmed by the brief §4 (guests sleep in the oldest part) |
| Minor | `history.scss` | Vertical line could show through the gutter | Backlog (visual polish) |
| Minor | `history.ts` | Lead hard-codes "tra Pontida e Palazzago", "più di tre secoli" | Accepted, copy not business data |

## seo-reviewer — score 8/10, 1 Major (same as above, fixed), 3 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Major | `timeline.ts` | Same unconfirmed stone/fireplace sentence | Fixed |
| Minor | `timeline.ts` 1760 | Wine-as-history paired with a vineyard photo | Accepted: wording is clearly historical |
| Minor | `history.ts` | `when` text not tied to the h3 for screen readers | Backlog: wrap in `<time>` |
| Minor | `timeline.ts` | Years are plain strings | Fine, numerals are universal |

Not checked here: prerendered HTML, Lighthouse, translations (Step 7).
