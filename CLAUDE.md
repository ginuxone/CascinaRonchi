# Cascina Ronchi — project conventions

Storytelling website for the agriturismo **Cascina Ronchi** (Palazzago, BG). The source of truth for scope, decisions and steps is [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Read the relevant ADR and step before changing anything.

## Stack
- Angular 21 SPA, standalone components, **zoneless**, signals, `OnPush`, `inject()`, new control flow (`@if`/`@for`/`@defer`).
- Static prerendering (`@angular/ssr`, `outputMode: "static"`), **no runtime server and no backend**.
- Compile-time i18n (`@angular/localize`): source locale **Italian**, plus EN, ES, DE, FR. Use `i18n="@@section.key"` with stable custom IDs.
- Hosting on Vercel (`vercel.json` for headers and the old `.asp` redirects).
- No automated tests for now (R10). The gates are `npm run build`, `npm run lint`, and the review agents.

## Commands
- `npm start` — dev server
- `npm run build` — production build; must finish with **no budget errors**
- `npm run lint` — ESLint (angular-eslint); must be clean

## Code rules
- **SSR safety:** never touch `window`, `document`, `localStorage` or `navigator` outside `afterNextRender()` or an `isPlatformBrowser` guard.
- **No hard-coded user-facing strings:** everything is marked `i18n`. Write Italian in short, plain sentences (they get translated by Claude, with no native-speaker review).
- **No hard-coded business data:** name, address, phone, WhatsApp, email, hours, booking URL, P.IVA, CIN and social links live in `src/app/core/site.config.ts` only.
- Use `@for` with `track`. Prefer signals over RxJS unless streams are needed.
- Accessibility is a requirement: visible focus, keyboard navigation, `aria-*` where needed, `prefers-reduced-motion`, WCAG AA contrast.
- Folder layout follows §3 of the plan (`core/`, `layout/`, `sections/`, `shared/`, `pages/`, `content/`).
- No secrets in the repo. No unused dependencies. No dead code.

## Content rules
- **Never claim wine production or a pool.** Neither exists anymore. Wine only appears as history (6f).
- Restaurant is **by reservation only** and open to non-guests.
- Missing facts are marked `[[DA COMPLETARE]]` (or `[[TODO]]` in plan/brief text). They must never reach a build. The legal `[[P.IVA]]` and `[[CIN]]` placeholders are allowed until Step 11.
- Ratings are shown as plain text with links. **No `aggregateRating`/`review` in JSON-LD.**
- Booking CTA (hero and floating) opens the agriturismo.it listing, `SITE_CONFIG.bookingUrl`. Clean URL, no session or tracking parameters. The Booking.com link (with its locale suffix) stays only in the trust strip.
- NAP (name, address, phone) must be identical everywhere.

## SEO conventions
- One `<h1>` per page, logical h2/h3, semantic landmarks.
- Each locale: `<html lang>`, own `<title>` (≤ 60 chars) and meta description (≤ 155 chars), canonical + reciprocal `hreflang` (with `x-default` → IT).
- Every `<img>`: descriptive localized `alt`, explicit `width`/`height`, `loading="lazy"` except the LCP image (`fetchpriority="high"`).
- External links carry `rel="noopener"`. Internal anchors must resolve.
- Core Web Vitals targets are in §6 of the plan.

## Workflow per step (plan §4.1)
1. Branch `step/NN-short-name` from `main`.
2. Implement the step's deliverables.
3. `npm run build` and `npm run lint` pass.
4. Run the **`seo-reviewer`** and **`code-reviewer`** agents in parallel on `git diff main...HEAD` (plus `translation-reviewer` per language in Step 7 and on any later copy change).
5. Save the reports to `docs/reviews/step-NN.md`.
6. Fix every Blocker and Major finding. Minors go to the backlog (§7).
7. Commit and merge into `main`.

Review agents live in `.claude/agents/`. Content is drafted by Claude from `docs/content-brief.md` and approved by the owner before it ships.
