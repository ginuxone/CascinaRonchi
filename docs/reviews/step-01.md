# Step 1 review — SSG + i18n + routing skeleton

## seo-reviewer — score 8/10 (before fix)
| Severity | Where | Issue | Status |
|---|---|---|---|
| Major | `src/app/app.config.ts` | `withI18nSupport()` missing, so i18n components were skipped by hydration (`ngskiphydration`) | **Fixed**; no `ngskiphydration` in `dist/**/index.html` |
| Minor | `src/index.html` | Same Italian `<title>`, no meta description, canonical, hreflang, OG in every locale | Backlog: Step 8 (per-locale SEO service) |
| Minor | `not-found.page.ts` | No `404.html` emitted; not-found needs `noindex` | Backlog: Step 5 (`vercel.json`) |
| Minor | `privacy.page.ts` | Stub page; keep out of the sitemap until it has content | Backlog: Step 10 |
| Minor | `angular.json` budgets | Initial budget (500 kB / 1 MB) is looser than the plan's ~80 kB gzip target; baseline is ~80 kB gzip | Backlog: Step 9 |
| Minor | `public/images/` | ~14 MB of raw images copied into `dist/` | Backlog: Step 3 |

## code-reviewer — no Blockers
| Severity | Where | Issue | Status |
|---|---|---|---|
| Major | `app.routes.server.ts` | No prerendered 404 output | Deferred to Step 5 (`vercel.json` 404 handling); see backlog |
| Major | `messages.*.json` | Hand-written placeholder translations with `{$INTERPOLATION}` | Accepted: intentional scaffolding; Step 7 re-extracts and runs `translation-reviewer` |
| Minor | `package.json` | vitest/jsdom/`test` kept | Kept on purpose (R10: default `app.spec.ts` stays). Reviewer was wrong that the spec was deleted |
| Minor | `site.config.ts` | `whatsappUrl`, `SITE_LOCALES` unused | Used from Step 4/5; remove at Step 11 if still unused |
| Minor | pages | Each page has its own `<main>` | Backlog: move to layout shell in Step 4 with a skip link |
| Minor | `index.html` | Title not localized | Backlog: Step 8 |
| Minor | `angular.json` | Formatting churn | Fixed with prettier |
