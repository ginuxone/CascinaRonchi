# Step 6h review — Contatti

Scope: commit 8a3cb82 (`sections/contact`, `content/contact-request.ts`, `directionsUrl()`, home page now uses every section). The form is its own component, loaded with `@defer (hydrate on viewport)`: it stays in the prerendered HTML and `@angular/forms` loads lazily (initial bundle 458 kB -> 414 kB, lazy chunk 49 kB). Deliberately not built: the static map image (no asset; a Google Maps directions link is used).

## code-reviewer — 2 Majors (fixed), 6 Minors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Major | `contact-form.ts` | A hidden field (guests/date) kept an invalid value after switching request type, so both buttons silently did nothing | Fixed: hidden fields are reset when the type changes. Checked in the browser (bad guests value, switch to "Prodotti", WhatsApp opens) |
| Major | `contact-form.ts` | ADR-06's ~1,800-character mailto limit was not enforced | Fixed: the free text is shortened until the encoded body fits 1,800 characters |
| Minor | `copyEmail` | "Indirizzo copiato" never reset | Fixed: resets after 3 seconds |
| Minor | date input | Free text, no hint | Added `autocomplete="off"`; placeholder hint in Step 7 copy |
| Minor | `event-request.ts`, `table-request.ts`, `pickup-request.ts` | Separate message builders duplicate the 6h builder | Backlog: make them thin wrappers over `buildContactMessage` |
| Minor | `.form-placeholder` | Fixed min-height may not match the real form | Step 12: measure CLS |
| Minor | plan 6h | Static map image not built | Backlog (§7) |
| Minor | `.error` | AA contrast of `--color-accent` | Checked: dark terracotta on white, about 7:1 |

## seo-reviewer — score 9/10, no Blockers or Majors

| Sev | Where | Finding | Outcome |
|-----|-------|---------|---------|
| Minor | `contact.scss` | Placeholder height is a guess | Step 12 |
| Minor | `contact-form.ts` | `mailto` does nothing without a mail client | Covered by the copy-address fallback |
| Minor | build | Initial JS ~130 kB gzip vs ~80 kB target | Not caused by this step; track for Step 12 |

Not checked here: per-locale metadata, JSON-LD parity, Lighthouse, deep links on a real device, translations (Step 7).
