# Step 6g review — La famiglia

Scope: commit 81eefc9 (`sections/family`). Deliberately not built: the family/staff cards (photo, name, role), photos of people and `content/staff.ts`, because there are no names, roles or written consent yet. The section is a short introduction and a "Scrivici" link to `#contatti`.

## code-reviewer — no Blockers or Majors, 2 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `family.ts` | i18n ID prefix `section.family.title` vs `family.*` | Fine: every section uses `section.<name>.title` |
| Minor | `family.scss` | Section is very sparse | Backlog: add the cards once consent is in |

## seo-reviewer — score 8/10, no Blockers or Majors, 2 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `family.ts` | Almost no keyword or location signal | Backlog: expand with the cards ("agriturismo di famiglia a Palazzago") |
| Minor | `family.ts` | "Scrivici" link text is short | Optional, revisit in Step 7 |

Needed from the owner: names, roles, a line each and written consent for every person shown (especially minors).
