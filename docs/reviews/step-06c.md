# Step 6c review — Eventi & Cerimonie

Scope: `git diff main...HEAD` (events section, quote request, capacity in `site.config.ts`, restaurant seating now from config, shared `.button` styles). Build and lint pass.

## code-reviewer — no Blockers or Majors, 3 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `events.ts` details | The "Camere" line could read as an offer of rooms for the event | Fixed: now "Uso esclusivo: No: la cascina non si può prenotare per intero. Le camere sì, una per una." |
| Minor | `events.ts` | Decorative `hoofprint` icon repeated on all cards; check `aria-hidden` | Checked: `Icon` sets `aria-hidden` when it has no label |
| Minor | `docs/reviews/step-06b.md` | Backlog item "fino a 20 persone" is resolved | Closed: seating now ~30 from `SITE_CONFIG.capacity` |

## seo-reviewer — score 9/10, no Blockers or Majors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `events.ts` lead | Long-tail phrase is present; "feste"/"cerimonie"/local place names thin | Backlog |
| Minor | `events.ts` | "tra i boschi" / "il bosco" should match what the owner stated | Matches the brief (woods around the farmhouse, section 4) |
| Minor | build | Missing-translation warnings for EN/ES/DE/FR | Expected until Step 7 |

Not checked at this step: per-locale meta/hreflang/JSON-LD (Steps 8–10), Lighthouse and CWV, translations (Step 7). Initial bundle is ~40 kB over the 350 kB warning budget, to be handled before Step 12.
