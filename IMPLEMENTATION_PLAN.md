# Cascina Ronchi — Implementation Plan

> Storytelling website for **Cascina Ronchi**, an *agriturismo*: B&B, restaurant by reservation (every evening, plus lunch Fri–Sun), events & ceremonies, direct sale of farm products, and goats as the main theme.
> Status: **draft v2** (owner answers + audit of the current site) · Owner: Gino Alessandro Milla · Last update: 2026-10-01
> Replaces the current site at **cascinaronchi.it**, which is a 2000s ASP/frameset site (see §9).

---

## 1. Goals and constraints

| # | Requirement | How the architecture covers it |
|---|-------------|--------------------------------|
| R1 | No backend | Static site (HTML/CSS/JS + images) on Vercel's CDN. The contact form builds a WhatsApp deep link or a `mailto:` link, with no third‑party form service. |
| R2 | Single Page Application | Angular 21 SPA: one storytelling page per language, with anchored sections and smooth scrolling. |
| R3 | Sections: Home, Restaurant, Events & Ceremonies, Rooms/B&B, Le nostre capre (with direct sale), History, Meet the Staff, Contact Us | One standalone component per section, lazy‑hydrated below the fold. *(Restaurant, Events, Rooms and Goats were added at the owner's request.)* |
| R4 | Floating booking CTA, visible everywhere | Fixed‑position `FloatingCtaComponent` that links to the property's **Booking.com** page in the visitor's language (§3.1). |
| R5 | Optimized and cached images | Build‑time `sharp` pipeline (AVIF/WebP/JPEG, responsive widths, LQIP placeholders, EXIF stripped), content‑hashed filenames, immutable HTTP caching, and a service worker. |
| R6 | Loading phase for UX | Inline splash screen in `index.html` (goat animation, works before JS loads), then blur‑up placeholders per image. |
| R7 | Multilanguage: IT (main), EN, ES, DE, FR | `@angular/localize` compile‑time i18n, with one prerendered build per locale, `hreflang` links, and a language switcher. |
| R8 | SEO | Static prerendering (SSG), per‑locale meta tags, JSON‑LD (`BedAndBreakfast` + `Restaurant`), sitemap with alternates, Core Web Vitals budgets. |
| R9 | Every step is gated by an **SEO review subagent** and a **code review subagent** | See §4, "Review gates". |
| R10 | No automated testing for now | The default `app.spec.ts` stays as is. The gates use `ng build` plus static analysis and Lighthouse audits, not unit or e2e tests. |

---

## 2. Key architecture decisions (ADR-lite)

### ADR-01 — Angular SPA + **static prerendering (SSG)**, no runtime server
- **Context:** A pure client‑side SPA sends an empty `<app-root>` to crawlers and social previews (WhatsApp/Facebook link cards don't run JS). That is bad for SEO and for sharing.
- **Decision:** Add `@angular/ssr` with `outputMode: "static"`. Every route is rendered to HTML **at build time**. After load, the app hydrates and runs as a normal SPA. No Node server is deployed.
- **Consequences:** Code must be SSR‑safe: no direct `window`/`document`/`localStorage` access outside `afterNextRender()` or `isPlatformBrowser`. Hosting can be any static host.

### ADR-02 — One-page storytelling with anchored sections
- One route per language (`/`, `/en/`, `/es/`, `/de/`, `/fr/`). Sections are `<section id="…">` blocks, and the nav uses fragments (`#storia`, `#famiglia`, …).
- `provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }))` plus a scroll‑spy to highlight the active nav item.
- Extra prerendered routes: `/privacy` (legal requirement) and a `**` → 404 page.
- *Trade-off:* one URL per language ranks for fewer keywords than a multi‑page site. If needed later, split sections into routes (`/storia`) with no redesign, because sections are already self‑contained components.

### ADR-03 — i18n with `@angular/localize` (compile time)
- **Why not runtime i18n (Transloco/ngx-translate):** compile‑time i18n gives zero runtime cost, real translated HTML per locale for crawlers, and translated `lang`/meta per build. Switching language is a full page navigation, which is fine and even preferable for SEO.
- **Config:** `sourceLocale: it` (Italian is the source of truth in the templates), `locales: en, es, de, fr`, translation format **JSON** (`ng extract-i18n --format=json`) because it is easier to edit than XLIFF for long prose.
- **URLs:** Italian at `/` (`subPath: ""`), others at `/en/`, `/es/`, `/de/`, `/fr/`. *Verify the build output layout in Step 1. Fallback: `/it/`, with `/` → 301 → `/it/`.*
- **No automatic redirect** based on `Accept-Language`, because it confuses crawlers. Instead, a dismissible banner says e.g. *"This page is also available in English"*, based on `navigator.language`. The choice is remembered in `localStorage`.
- Long‑form copy (History, staff bios) uses `i18n` blocks with **custom stable IDs** (`i18n="@@history.p1"`) so translations don't break when the Italian text is edited.
- **No native speakers are available (decided)**, so translation quality comes from process instead:
  1. Write the Italian source in short, plain sentences. Avoid idioms and wordplay that don't translate.
  2. Claude translates into EN/ES/DE/FR, keeping a shared **glossary** (`src/locale/glossary.md`): terms that stay Italian (*agriturismo, cascina, salumi, formaggi di capra, animali di bassa corte*) and terms that are always translated the same way.
  3. A **`translation-reviewer` subagent** checks each language separately: it back‑translates to Italian, compares the meaning, and checks tone, register (formal "Sie" in German, "vous" in French, "usted" vs "tú" in Spanish, decided in the glossary), typos, and length (German runs ~30% longer, which affects the buttons).
  4. The site shows no "machine translated" label, but the footer offers *"Notice an error? Write to us"* with a link to the contact section.

### ADR-04 — Image pipeline at build time (sharp), not at runtime
- Originals move **out of `public/`** into `assets-src/images/`. Right now 14 MB of raw JPEGs would be shipped as‑is in `dist/`.
- `scripts/optimize-images.mjs` (Node + `sharp`) does the following:
  - Renames files to SEO‑friendly slugs (`image (25).jpeg` → `capre-al-pascolo.jpg`), driven by `assets-src/images/catalog.json`.
  - Outputs **AVIF + WebP + JPEG** at widths `[480, 800, 1200, 1600, 2000*]` (*hero only), each with a content hash in the filename (`capre-al-pascolo-800.3f9a1c.avif`).
  - **Strips EXIF/GPS metadata.** This is a privacy issue: phone photos can embed the farm's and family's coordinates.
  - Generates a ~20px **LQIP** (base64 blurred) for blur‑up and records `width`/`height` to prevent CLS.
  - Emits the typed manifest `src/app/content/images.generated.ts`.
- The video (`image (1).mp4`) is re‑encoded with `ffmpeg` (H.264 + WebM/AV1, ≤ 1.5 MB, no audio track) and gets a poster frame. It uses `preload="none"`, `muted`, `playsinline`, and is never the LCP element on mobile.
- Runs as `npm run images` and is wired to `prebuild`. It is idempotent (it skips unchanged inputs by hash).

### ADR-05 — Caching strategy
| Resource | Cache-Control | Notes |
|----------|---------------|-------|
| `*.html`, `sitemap.xml`, `ngsw.json` | `no-cache` (revalidate) | Lets new deployments show up immediately. |
| Hashed JS/CSS (`main-XXXX.js`) | `public, max-age=31536000, immutable` | Angular already hashes these (`outputHashing: all`). |
| Hashed images/fonts | `public, max-age=31536000, immutable` | Hash comes from the image pipeline. |
- Headers are declared in **`vercel.json`** (`headers` rules by path pattern).
- **Angular service worker** (`@angular/service-worker`): the app shell uses `prefetch`. Images use a `lazy` asset group, cached on first view, which makes return visits instant and lets the page work offline.

### ADR-06 — Contact without a backend: WhatsApp + mailto (decided)
- One form (name, phone optional, stay/table dates optional, number of guests optional, message). Nothing is sent to us or to any third party by the site itself; the form only **builds a message** and hands it to the visitor's own app. There are **two actions**:
  1. **"Scrivi su WhatsApp"** (primary) → `https://wa.me/<number>?text=<prefilled, url-encoded message>`. Opens the WhatsApp app on mobile, or WhatsApp Web on desktop.
  2. **"Invia email"** → `mailto:<email>?subject=…&body=…` built from the same fields, URL‑encoded, with the body kept under ~1,800 chars because some mail clients truncate long `mailto` URLs.
- **Desktop fallback:** `mailto` silently does nothing when no mail client is configured. Next to the button, show the email address with a **"Copia indirizzo"** (copy to clipboard) button and a hint.
- Message templates are localized, so a German visitor sends a German message, and they include the page language so the family knows which language to reply in.
- Plus direct `tel:` links, and the address with a link to Google Maps directions. Use a **static map image** rather than an iframe embed: no third‑party cookies, so no cookie banner, and better performance.
- **Upside:** no API keys, no spam inbox, no processor to declare in the privacy policy. **Downside:** we can't confirm the message was actually sent, so the success state says "Messaggio pronto in WhatsApp/email" rather than "Inviato".

### ADR-07 — Privacy-first, no cookie banner if possible
- Self‑hosted fonts via `@fontsource/*` (EU courts have fined sites for loading Google Fonts from Google's CDN).
- No tracking cookies. If analytics are wanted, use a cookieless tool (Vercel Web Analytics / Plausible / Umami).
- `/privacy` page in 5 languages. The form sends nothing itself, so no consent checkbox is needed. The privacy page still explains how WhatsApp and email messages are handled.
- Italian legal footer: business name, **P.IVA**, and the **CIN** (*Codice Identificativo Nazionale*, mandatory for tourist accommodation advertised online). *Placeholders for now (decided). They are a go‑live blocker in Step 11.*
- Staff/family photos need written consent from each person shown (especially minors).

### ADR-08 — Modern Angular conventions
- Standalone components, **zoneless** change detection (the Angular 21 default), signals, `ChangeDetectionStrategy.OnPush`, `inject()`, and the new control flow (`@if`/`@for`/`@defer`).
- `provideClientHydration(withEventReplay(), withIncrementalHydration())`. Below‑the‑fold sections use `@defer (on viewport; hydrate on viewport)`.
- Reactive Forms for the contact form. Signal Forms are still experimental in v21, so avoid them for now.

### ADR-09 — Migration from the current site without losing Google ranking
- The current site has been indexed for years under URLs like `/default.asp`, `/descrizione.asp`, `/camere.asp`, `/raggiungerci.asp`, `/foto2.asp`, and `/contatti.asp`, plus frame pages (`/dx_camere.asp`, `/sx_raggiungerci.asp`, `/foto3.asp`, `/pulsanti.asp`…).
- **Every old URL gets a 301** in `vercel.json` to its new equivalent. A `Location` header with a fragment is honoured by browsers.

  | Old | New |
  |-----|-----|
  | `/default.asp`, `/index.asp` | `/` |
  | `/descrizione.asp`, `/*descrizione*` | `/#storia` |
  | `/camere.asp`, `/*_camere.asp` | `/#camere` |
  | `/raggiungerci.asp`, `/*_raggiungerci.asp` | `/#contatti` |
  | `/foto*.asp` | `/#capre` (or the gallery, if it gets built) |
  | `/contatti.asp` | `/#contatti` |
  | `/immagini/*`, `/foto_camere/*`, `/foto_mappe/*` | `/` (old image hotlinks) |
  | any other `/*.asp` | `/` |
- Before the DNS switch, crawl the old site (and check Search Console's "Pages" report, if the property exists) for URLs missing from the table.
- Keep the **same domain** (`cascinaronchi.it`). Pick the canonical host once (`https://cascinaronchi.it` vs `https://www.cascinaronchi.it`) and 301 the other one.
- The old site had **no** `<html lang>`, meta description, structured data, or crawlable links (navigation used POST forms). So the new site should improve rankings quickly, as long as the redirects are in place.
- The old site also has a badge linking to **agriturismo.it** (listing id `5250415`). Keep that listing in the JSON‑LD `sameAs`, and update the listing to point to the new site.

---

## 3. Target project structure

```
CascinaRonchi/
├─ .claude/agents/
│  ├─ seo-reviewer.md          # review gate agent (Step 0)
│  └─ code-reviewer.md         # review gate agent (Step 0)
├─ assets-src/images/          # ORIGINAL photos + catalog.json (not shipped)
├─ docs/
│  ├─ content-brief.md         # owner's notes → source for the copy Claude drafts
│  └─ reviews/step-NN.md       # review reports per step
├─ scripts/optimize-images.mjs
├─ vercel.json                 # cache headers, redirects, trailing-slash rules
├─ public/
│  ├─ img/                     # GENERATED (gitignored) optimized images
│  └─ robots.txt  sitemap.xml  manifest.webmanifest  og/  icons/
├─ src/
│  ├─ index.html               # inline splash + critical CSS
│  ├─ locale/messages.{en,es,de,fr}.json + glossary.md
│  ├─ styles/                  # _tokens.scss _typography.scss _mixins.scss
│  └─ app/
│     ├─ core/                 # seo.service, site.config.ts, scroll-spy.service, language.service
│     ├─ layout/               # header/, footer/, floating-cta/, language-switcher/, language-banner/
│     ├─ sections/             # hero/, restaurant/, events/, rooms/, goats/, history/, staff/, contact/
│     ├─ shared/               # responsive-image/, reveal.directive, section-heading/, goat-divider/
│     ├─ pages/                # home.page (composes sections), privacy.page, not-found.page
│     └─ content/              # staff.ts, goats.ts, rooms.ts, menu.ts, events.ts, products.ts, timeline.ts, images.generated.ts
└─ IMPLEMENTATION_PLAN.md
```

`src/app/core/site.config.ts` is the **single source of truth** for business data: booking URL, WhatsApp number, phone, email, address, geo coordinates, opening hours, menu price, P.IVA, CIN, and social links. The SEO JSON‑LD, the footer, the CTA, and the contact section all read from it.

### 3.1 Known business data (seed for `site.config.ts`)

| Field | Value | Source |
|-------|-------|--------|
| Name | Agriturismo Cascina Ronchi | owner / Booking.com |
| Address | Via Secchia 57, 24030 Palazzago (BG), Lombardia, Italia | owner |
| Geo | `45.7376865, 9.5495237` (Plus Code `PGQX+3R Palazzago`) | Google Business Profile |
| Google Maps | `https://maps.google.com/?cid=14718629685967255332` (place `0x4786ab55ac1d8e5b:0xcc4313b77c98f724`, kg `/g/1tf3y7j9`) | Google Business Profile |
| Reputation | Google 4.6★ (273), Booking.com 9.3 (47), Tripadvisor 4.8 (50, B&B) / 4.6 (121, restaurant), agriturismo.it 4.9 (127), Facebook 5.0 (29) | public listings, 2026‑10‑01 |
| Domain | `https://cascinaronchi.it` (the www/apex choice is made in Step 11) | owner |
| Email | `info@cascinaronchi.it` | owner |
| WhatsApp / mobile | `+39 349 645 3018` → `https://wa.me/393496453018` | owner |
| Landline | `+39 035 549 574` (phone only, the fax no longer exists) | owner. This is the main `telephone` in JSON‑LD; WhatsApp/mobile is secondary. |
| Booking (stay) | `https://www.booking.com/hotel/it/agriturismo-cascina-ronchi.html` | owner (cleaned) |
| Booking (per locale) | `….it.html`, `….en-gb.html`, `….es.html`, `….de.html`, `….fr.html` | Booking.com URL convention |
| Restaurant bookings | WhatsApp / phone (Booking.com does not take table reservations) | — |
| Facebook | `https://www.facebook.com/CascinaRonchi/` (the language‑neutral form of the `it-it.` link) | owner |
| Instagram | `https://www.instagram.com/cascina_ronchi/` | owner |
| Other listings (`sameAs`) | Facebook, Instagram, Booking.com, agriturismo.it (id `5250415`), Tripadvisor, Google Maps (CID link) | owner / public listings |
| Restaurant hours | **Mon–Thu 19:30–22:00 · Fri–Sun 12:30–16:00 and 19:30–23:00 · by reservation only**, open to non‑guests | GBP post of 28 Jun 2026, confirmed by the owner (Q17) |
| Fixed‑price menu | Price and what's included `[[TODO]]`. *Confirm whether it applies to every service or only at weekends.* | owner |
| Events & ceremonies | **All kinds**: baptisms, communions, confirmations, weddings, birthdays, anniversaries, corporate lunches… Capacity `[[TODO]]` (the old site said ~20 indoors) | owner (Q18) |
| Direct sale | Goat cheeses, house cured meats and pastries sold at the farm (*"Vendita"* in the Instagram bio). Products and sale hours `[[TODO]]` | owner (Q18) |
| Farm products | ~30 goats, **various goat cheeses**, house cured meats, homemade pastries/desserts. *Wine is no longer produced.* | owner |
| P.IVA / CIN | `[[P.IVA]]` / `[[CIN]]` placeholders | owner (decided) |

**About the booking URL:** the link you provided carries one search's session data. It includes `aid`/`label`/`sid` tracking IDs, fixed dates (15–17 Jan 2027), 6 adults in 3 rooms, and a `#no_availability_msg` anchor. Used as the CTA, it would send every visitor to someone else's search, often showing "no availability". The CTA uses the **clean property URL** with only the locale suffix, so visitors pick their own dates on Booking.com.
- *Note:* Booking.com can override the language suffix with a visitor's saved preference or location (it served Italian in my test). That's acceptable.
- UTM parameters are pointless here, because the property can't see them in Booking.com's extranet. CTA clicks are measured with cookieless analytics instead (Q10).

---

## 4. Review gates (run at the end of EVERY step)

### 4.1 Workflow per step
1. Create branch `step/NN-short-name` from `main`.
2. Implement the step's deliverables.
3. `npm run build` must succeed with **no budget errors**. This is a build check, not testing.
4. Launch **two subagents in parallel** (read‑only), passing them the step number, its goals from this plan, and `git diff main...HEAD`:
   - `seo-reviewer`
   - `code-reviewer`
5. Save both reports to `docs/reviews/step-NN.md`.
6. Fix every **Blocker** and **Major** finding. Minors can go into the backlog in §7.
7. Commit, then merge into `main`.

### 4.2 `seo-reviewer` agent (created in Step 0 at `.claude/agents/seo-reviewer.md`)
- **Tools:** Read, Grep, Glob, Bash (read‑only commands: `ng build`, a static serve of `dist/`, `npx lighthouse … --only-categories=seo,performance,accessibility`).
- **Base checklist**, applied as far as the step allows:
  - Exactly one `<h1>` per page and a logical h2/h3 hierarchy. Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`).
  - Prerendered HTML in `dist/` contains the real text, not an empty `<app-root>`.
  - `<html lang>` is correct per locale. Each locale has its own `<title>` (≤ 60 chars) and meta description (≤ 155 chars).
  - `canonical` + `hreflang` (it, en, es, de, fr, x-default) are present and reciprocal.
  - Open Graph/Twitter tags with a 1200×630 image.
  - Every `<img>` has a localized, descriptive `alt`, explicit `width`/`height`, `loading="lazy"` except the LCP image (which uses `fetchpriority="high"` + preload).
  - JSON‑LD has **no `aggregateRating`/`review`** for the business itself. Google ignores self‑served review markup on LocalBusiness and may treat it as spam. Ratings are shown as plain text with links to the sources instead.
  - JSON‑LD is valid (Schema.org/Rich Results). NAP (name/address/phone) is **identical** across the footer, JSON‑LD, Facebook, Booking.com, agriturismo.it and (later) the Google Business Profile. The site must not claim wine production or a pool (neither exists anymore).
  - Internal anchor links resolve, and external links use `rel="noopener"`.
  - `robots.txt` and `sitemap.xml` are reachable, with `xhtml:link` alternates in the sitemap.
  - Core Web Vitals targets (§6) are met.
  - Keywords appear naturally: *agriturismo, capre, formaggi di capra, B&B, ristorante, menu fisso, cerimonie, battesimi, comunioni, feste, vendita diretta*, plus the location (*Palazzago, Bergamo, Pontida, colline bergamasche*).
  - Old‑URL 301 redirects (ADR‑09) are still present and correct.
- **Output:** a table of findings with *severity (Blocker/Major/Minor) · file:line · issue · fix*, plus a score from 0 to 10 for the step.

### 4.3 `code-reviewer` agent (created in Step 0 at `.claude/agents/code-reviewer.md`)
- **Tools:** Read, Grep, Glob, Bash (`git diff`, `ng build`, `npx eslint`).
- **Scope:** a *small* review of the step's diff only.
- **Checklist:**
  - Standalone + OnPush + signals; `inject()` instead of constructor injection; `@for` with `track`.
  - **SSR safety:** no unguarded `window`/`document`/`localStorage`; browser‑only APIs go in `afterNextRender`.
  - No hard‑coded user‑facing strings (everything is marked `i18n`).
  - No hard‑coded business data (it lives in `site.config.ts`).
  - Accessibility: focus states, keyboard navigation, `aria-*` where needed, `prefers-reduced-motion`, contrast.
  - No secrets in the repo. Bundle and style budgets respected. No unused dependencies.
  - Naming, folder placement, and dead code checked against §3.
  - No `[[…]]` content markers left in user‑visible text. The legal `[[P.IVA]]`/`[[CIN]]` placeholders are allowed until Step 11.
- **Output:** findings with *severity · file:line · issue · suggested fix*, at most ~15 items, prioritized.

### 4.3b `translation-reviewer` agent (created in Step 0; runs in Step 7 and on any later copy change)
- One run **per language** (EN, ES, DE, FR), in parallel.
- **Checks:** back‑translation vs the Italian meaning, tone and register per the glossary, glossary compliance, grammar and typos, missing or extra placeholders (`{$INTERPOLATION}`), and string length vs the UI (buttons, nav).
- **Output:** findings per message ID, with *severity · id · issue · proposed fix*.

### 4.4 SEO focus per step (so the SEO gate stays meaningful on non-SEO steps)
| Step | What the SEO reviewer focuses on |
|------|---------------------------------|
| 0 | Agent definitions, SEO conventions in `CLAUDE.md` |
| 1 | Prerender output exists per locale, `lang` attribute, URL structure, base href |
| 2 | Font loading (no FOIT, `font-display: swap`), CLS from fonts, contrast |
| 3 | Image filenames, alt‑text plan, sizes/LCP, weight budgets |
| 4 | Splash does not hide content from crawlers, LCP and CLS impact |
| 5 | Nav semantics, crawlable links, CTA link attributes, footer NAP, old‑URL redirects in `vercel.json` |
| 6a–6h | Headings, keyword placement, alt text, content depth per section |
| 7 | Translation completeness, localized meta/alt, hreflang |
| 8 | Full technical SEO audit (JSON‑LD, sitemap, OG) |
| 9 | Lighthouse perf/SEO ≥ 95, caching headers |
| 10–11 | Privacy page indexable, Search Console, final audit |

---

## 5. Implementation steps

> Each step lists **Deliverables** and **Done when** criteria, and ends with the §4 review gate.

### Step 0 — Foundations and governance
- Commit the current scaffold (the `.gitignore` change plus the untracked Angular files) as the baseline.
- Create `CLAUDE.md` with project conventions (from §2/§3 and the code‑review checklist).
- Create `.claude/agents/seo-reviewer.md`, `.claude/agents/code-reviewer.md` and `.claude/agents/translation-reviewer.md` (§4.2, §4.3, §4.3b).
- Add ESLint (`ng add angular-eslint`), keep Prettier, and add `npm run lint`.
- Create **`docs/content-brief.md`**, a fill‑in template for the owner with one block per section: facts, anecdotes, names/roles, goat names, room list, menu and price, dates for the history timeline, contacts, and legal codes. It comes **pre‑filled with the facts recovered from the current site (§9)**, so the owner only corrects them and adds what's new (the goats, the family, the menu, events, the products for sale). Claude drafts all the Italian copy from it (decided), and the owner approves each section in Step 6.
- **Done when:** baseline committed, agents can be invoked, lint runs clean, content brief handed to the owner.

### Step 1 — App configuration: SSG + i18n + routing skeleton
- `ng add @angular/ssr` → set `outputMode: "static"`. Remove any server entry that isn't needed.
- `ng add @angular/localize`, then configure `i18n` in `angular.json` (sourceLocale `it`, locales `en/es/de/fr`, `localize: true`) with placeholder translation files.
- `app.config.ts`: `provideRouter` (in‑memory scrolling), `provideClientHydration(withEventReplay(), withIncrementalHydration())`.
- Routes: `''` → `HomePage`, `privacy` → `PrivacyPage`, `**` → `NotFoundPage`.
- `site.config.ts`, typed and seeded with the §3.1 data. Includes a `bookingUrl(locale)` helper that maps `it|en|es|de|fr` → the Booking.com suffix (`it`, `en-gb`, `es`, `de`, `fr`).
- Fix the `index.html` defaults (`lang="it"`, a proper title, `theme-color`).
- **Done when:** `npm run build` produces `dist/…/browser/{,en,es,de,fr}/index.html` with prerendered text and the correct `lang` in each.

### Step 2 — Design system (goat / agriturismo theme)
- Design tokens in `_tokens.scss` as CSS custom properties: an earthy palette (meadow green, hay/cream, terracotta, slate for text), spacing scale, radii, shadows, breakpoints.
- Typography: a warm serif for headings (e.g. *Fraunces* or *Lora*) and a readable sans for body text (e.g. *Inter* or *Source Sans 3*), both self‑hosted via `@fontsource`. Preload only the woff2 weights actually used, with `font-display: swap`.
- Goat iconography: an SVG sprite (goat silhouette, hoofprints, wheat, plate/fork, bed) and a `goat-divider` component between sections.
- Base layout primitives (container, section spacing), focus‑visible styles, and global `prefers-reduced-motion` handling.
- `RevealDirective`: IntersectionObserver fade/slide‑in for the storytelling scroll (browser‑only, disabled for reduced motion).
- Revisit the `anyComponentStyle` budget (4 kB warning) if needed.
- **Done when:** a style‑guide section (dev only) renders the tokens, fonts, and icons; WCAG AA contrast is verified.

### Step 3 — Image and media pipeline
- Move originals to `assets-src/images/`. **Catalog** every photo in `catalog.json`: `slug`, `category` (hero / goats / rooms / restaurant / history / staff / landscape), `focal point`, and an `alt` i18n key.
- Write `scripts/optimize-images.mjs` (sharp) per ADR‑04. Add `npm run images` and hook it into `prebuild`. Gitignore `public/img/`.
- Re‑encode the video and generate its poster (ffmpeg, documented one‑off script).
- `ResponsiveImageComponent` (`<app-img slug="…" sizes="…" [priority]>`) renders `<picture>` with AVIF/WebP sources, a JPEG fallback, an LQIP background, and a fade‑in on `load`. It wraps `NgOptimizedImage` concepts (priority → `fetchpriority` + preload).
- **Budgets:** hero ≤ 180 KB (AVIF @ 1200w), gallery images ≤ 120 KB @ 800w, total above‑the‑fold ≤ 400 KB.
- **Done when:** `dist/` contains no original JPEGs, every image has width/height/alt, and no EXIF remains (check with `exiftool` or sharp metadata).

### Step 4 — Loading experience
- **Inline splash** in `index.html` (it ships in the prerendered HTML, so it shows before any JS loads): an animated SVG goat (walking or nibbling grass, pure CSS, under 5 KB), the Cascina Ronchi wordmark, and a subtle progress hint.
- `SplashService` dismisses the splash when **both** hydration is done and the hero image is `decode()`d, **or** after a **hard cap of ~2 s**. Then it fades out and removes the node.
- `<noscript><style>#splash{display:none}</style></noscript>` so the content stays visible without JS.
- Reduced motion → static logo, short fade.
- Inside the page: LQIP blur‑up for every image, plus skeleton shapes for staff cards until their images load.
- *SEO/CWV caveat:* the overlay delays the visual LCP, which is why the cap is strict. Measure in Step 9 and shorten it if LCP > 2.5 s.
- **Done when:** with slow 3G throttling the user sees the splash, then a blurred hero, then sharp images, with no layout shift (CLS < 0.05).

### Step 5 — App shell: header, language switcher, footer, floating CTA
- **Header:** sticky, transparent over the hero and solid after scrolling. Logo, nav anchors (the logo acts as Home; then Ristorante · Eventi · Camere · Capre · Storia · Famiglia · Contatti, collapsing to a menu below ~1200 px because 7 items is a lot, and German/French labels are long), scroll‑spy active state. Accessible mobile menu (focus trap, `Esc` to close, `aria-expanded`).
- **Language switcher:** real `<a href="/en/#storia">` links (crawlable) that keep the current fragment, with `hreflang` on each link. Shows IT/EN/ES/DE/FR labels; **no flags**, since flags represent countries, not languages.
- **Language suggestion banner** (ADR‑03).
- **Floating CTA** (`FloatingCtaComponent`):
  - Desktop: a bottom‑right pill, "Prenota il tuo soggiorno", with a goat icon.
  - Mobile: a bottom bar with a primary **Prenota** button and a secondary **WhatsApp** icon. Respects `env(safe-area-inset-bottom)`, and the page gets bottom padding so content is never covered.
  - It's an `<a href="{bookingUrl(locale)}" target="_blank" rel="noopener">`, using the clean Booking.com URL with the locale suffix (§3.1). No session or tracking parameters. It carries a `data-cta` attribute so the click can be measured if analytics are enabled.
  - It appears once the hero's own CTA leaves the viewport, to avoid two CTAs side by side. It stays visible from then on.
- **Footer:** NAP (Via Secchia 57, 24030 Palazzago BG · phone · WhatsApp · email), restaurant hours (from `site.config.ts`), `[[P.IVA]]`, `[[CIN]]`, social links, privacy link, *"Notice a translation error?"* link, and a small "made with 🐐" touch.
- **`vercel.json` redirects** for the old `.asp` URLs (ADR‑09) are added here, as soon as the anchors exist.
- **Done when:** the CTA is visible and clickable on every section, at every breakpoint from 320 px to 1920 px, and the whole shell is keyboard navigable.

### Step 6 — Storytelling sections (one sub-step each, each with its own review gate)

**6a — Home / Hero (`#home`)**
- Full‑bleed hero: the photo (or the muted video loop on desktop, with the photo as LCP on mobile), the `<h1>` (e.g. *"Cascina Ronchi — Agriturismo tra le capre"*), a 2–3 sentence description, and the primary CTA "Prenota".
- Four "pillars" cards: **B&B** · **Ristorante** · **Eventi & Cerimonie** · **Le nostre capre**, each anchored to its section.
- A **trust strip** under the hero, as plain text plus outbound links (no review schema): *Google 4.6★ · Booking.com 9.3 · Tripadvisor 4.8*. The numbers live in `site.config.ts` with an "as of" date, to be refreshed every few months.

**6b — Restaurant (`#ristorante`)**
- **Hours (decided, from GBP):** Mon–Thu 19:30–22:00 · Fri–Sun 12:30–16:00 and 19:30–23:00. **By reservation only, open to everyone, not just B&B guests.** Show this prominently near the top of the section, so nobody turns up without a booking. The hours come from `site.config.ts`, which also feeds the footer and the JSON‑LD.
- The fixed‑price menu: price per person, what's included, and a photo strip.
- The narrative covers the Bergamo tradition, made on the farm: **goat cheeses from our own goats**, house cured meats, farmyard animals, and homemade bread, pasta, pastries and desserts. The warm dining rooms seat up to ~20 guests. *No wine production claims.*
- A **"Prenota un tavolo"** CTA that opens WhatsApp with a prefilled table request (date, lunch/dinner, number of people, dietary needs) plus a `tel:` link to the landline. Booking.com does not handle table reservations.
- The floating CTA stays focused on the stay. Inside `#ristorante`, the mobile bottom bar's secondary action switches from WhatsApp to "Prenota un tavolo" via WhatsApp.
- The menu lives in `content/menu.ts` so the owners can update courses/price with a one‑line change.

**6c — Eventi & Cerimonie (`#eventi`)**
- *"We host everything"*: baptisms, communions, confirmations, weddings, birthdays, anniversaries, and company or group lunches. Show this as a grid of event types (icon + one line each), followed by what makes it special: a private farmhouse setting, a homemade menu built around the occasion, the goats as an attraction for children, and the garden/woods for photos.
- Practical details: capacity (`[[TODO]]`), customizable menus, exclusive use (`[[TODO]]`, if offered), and how far ahead to book.
- CTA **"Richiedi un preventivo"** (request a quote): opens WhatsApp with a prefilled message (event type, date, number of guests), with `mailto` as the alternative. This reuses the contact‑form message builder from 6h, so it's the same component with a different template.
- The data lives in `content/events.ts`. Strong local SEO: *"agriturismo per battesimi/comunioni Bergamo"*, *"location cerimonie Palazzago"*. In the JSON‑LD (Step 8), describe events as `makesOffer` → `Offer` → `Service` ("Eventi e cerimonie"), not as fake `Event` items, which require real dates.

**6d — Rooms / B&B (`#camere`)**
- An intro to the stay experience: the guests have the **oldest part of the farmhouse (late 1600s)**, with exposed stone walls and the old fireplace, surrounded by woods and vineyard (*"the only thing disturbing your sleep will be the crickets and cicadas"*). Then 3 room cards (8 beds in total, each room with a private bathroom): photo, name, capacity, amenities (icons). Every card has a **"Verifica disponibilità"** link to the Booking.com property page, which has no per‑room deep links.
- The data lives in `content/rooms.ts`. Images use `@defer (on viewport)`.

**6e — Le nostre capre (`#capre`)**
- The thematic heart of the site: a herd of **about 30 goats** (breed `[[TODO]]`), their daily life, and "meet the herd" cards for a few of them, with names, photos and a fun trait each.
- **From milk to cheese:** a visual chain, *goats → milking → cheese making → aging → your plate*, showcasing the **various goat cheeses** the farm makes (names and short descriptions `[[TODO]]`). It links to `#ristorante`. The video loop can live here.
- **"Portali a casa" (take them home): direct sale block.** The goat cheeses, house cured meats and pastries are sold at the farm (decided, Q18). Show a product list with photos, sale days/hours (`[[TODO]]`), and a "Prenota il ritiro" (reserve for pick‑up) WhatsApp CTA. No e‑commerce, which would need a backend and payments.
- The data lives in `content/goats.ts` and `content/products.ts`. This is a big SEO opportunity for long‑tail searches like *"agriturismo con capre"* and *"formaggio di capra"*.

**6f — History (`#storia`)**
- Facts already known (current site): a typical farmhouse on the hills between **Pontida and Palazzago**. The oldest core dates to the **late 17th century**. Farmers have **lived there permanently since 1760**, growing vines on the characteristic terraces, which get sun from dawn to dusk. The **last extension dates to 1859**. Recently restored. The timeline would run 1600s → 1760 → 1859 → the restoration → the goats and today (dates to confirm in the brief).
- A scroll‑driven **timeline**: era → photo → short paragraph, revealed progressively (`RevealDirective`), with an alternating left/right layout on desktop and a single column on mobile.
- The data lives in `content/timeline.ts` (year, i18n title/body IDs, image slug).

**6g — Meet the Staff / Family (`#famiglia`)**
- An intro paragraph about the family, then cards with photo, name, role (*"il casaro"*, *"in cucina"*, *"accoglienza"*…), and a 1–2 line personal note.
- The data lives in `content/staff.ts`. Images use `@defer (on viewport)` with skeletons.

**6h — Contact Us (`#contatti`)**
- Reactive form per ADR‑06, with a **request type** selector (*Soggiorno · Tavolo al ristorante · Evento/cerimonia · Prodotti · Altro*) that adapts the optional fields and the message template. i18n validation messages and two actions: **WhatsApp** (primary) and **email (`mailto`)**, plus the copy‑address fallback. The success state reads "Messaggio pronto…".
- Contact details block (`tel:`, WhatsApp, email), a static map image linked to Google Maps directions, and "Come arrivare" (how to get there) notes. From the current site: from Bergamo, take the SS342 towards Lecco; after Mapello turn right towards Palazzago; turn left into Via Secchia and follow it to the end of the road. Also mention walking and mountain‑bike trails nearby, a few km from Bergamo.

**Content workflow for every 6x sub-step:** Claude drafts the Italian copy from `docs/content-brief.md`, then the owner approves or edits it, then it is implemented. Missing facts are marked `[[DA COMPLETARE]]` so nothing invented ships by accident; the code‑reviewer flags any marker left in the build.
- **Done when (6a–6h):** every section is responsive, accessible, uses owner‑approved content, and passes its review gate.

### Step 7 — Translations (EN, ES, DE, FR)
- `ng extract-i18n --format=json --output-path src/locale`, then produce `messages.en.json`, `messages.es.json`, `messages.de.json`, `messages.fr.json`.
- Write `src/locale/glossary.md` first (ADR‑03): the terms kept in Italian with a short gloss, and the register per language.
- Claude drafts the translations, then **four `translation-reviewer` subagents run in parallel**, one per language (§4.3b). Fix every Blocker and Major finding.
- Translate alt texts, meta titles/descriptions, WhatsApp/mailto message templates, form validation messages, and the privacy page.
- Check the layout in German and French, which run longest: the nav, the CTA pill, and the buttons.
- **Done when:** the build has zero missing‑translation warnings (`i18nMissingTranslation: "error"` in production), and the translation reviews for all 4 languages are clean.

### Step 8 — Technical SEO layer
- `SeoService`: sets per‑locale `title`, `description`, `canonical`, `hreflang` alternates (+ `x-default` → IT), OG/Twitter tags, and `og:locale` (`it_IT`, `en_GB`, `es_ES`, `de_DE`, `fr_FR`) / `og:locale:alternate`.
- **JSON‑LD** `@graph`: `BedAndBreakfast` (or `LodgingBusiness`) + `Restaurant` (`servesCuisine`, `hasMenu`, `priceRange`, `openingHoursSpecification` Mo–Th 19:30–22:00 and Fr–Su 12:30–16:00 + 19:30–23:00, `acceptsReservations: "True"`, with the description saying reservation is required, plus `makesOffer` for events/ceremonies and direct sale), with shared `address` (Via Secchia 57, 24030 Palazzago BG, IT), `geo`, `telephone` (+39 035 549 574), `email`, `hasMap` (Google Maps CID link), `sameAs` (Facebook, Instagram, Booking.com, agriturismo.it, Tripadvisor), `image`, and `numberOfRooms: 3`. Built from `site.config.ts`.
- `sitemap.xml` with `xhtml:link` alternates for every locale. `robots.txt` that points to the sitemap.
- An OG image (1200×630) per locale (localized tagline), favicons/apple‑touch icons, and `manifest.webmanifest`.
- A 404 page with `noindex`.
- **Done when:** the Rich Results Test validates, and Lighthouse SEO = 100 on every locale.

### Step 9 — Performance and caching hardening
- `ng add @angular/pwa` → service worker + `ngsw-config.json` (app shell `prefetch`, `img/**` `lazy`, fonts `prefetch`).
- `vercel.json` `headers` rules per ADR‑05 (immutable for `/img/*`, hashed JS/CSS, and fonts; `no-cache` for HTML and `ngsw.json`).
- Preload the LCP hero (`<link rel="preload" as="image" imagesrcset=… fetchpriority="high">`) per locale.
- Verify `@defer` hydration boundaries and check the initial JS budget.
- Tighten the `angular.json` budgets: initial **≤ 250 kB raw / ~80 kB gzip** (warning), anyComponentStyle as decided in Step 2.
- **Done when:** Lighthouse mobile ≥ 95 in Performance, Accessibility, Best Practices, and SEO on all 5 locales; the §6 targets are met.

### Step 10 — Privacy and legal
- `/privacy` page (5 languages): data controller, how messages received via WhatsApp/email are handled, retention, data subject rights, and Vercel as hosting provider (server logs).
- Confirm there are no cookies set, so no banner is needed. If analytics change that, add a minimal consent solution. Vercel Web Analytics is cookieless, so it is OK.
- Footer legal data (P.IVA, CIN), plus photo consents archived offline.
- **Done when:** a legal checklist is ticked off by the owner.

### Step 11 — Deployment and go-live
- Host: **Vercel** (decided). Framework preset "Other" or "Angular". Build command `npm run build` (the `prebuild` image step runs automatically; `sharp` works on Vercel's build image). Output directory `dist/cascina-ronchi/browser`. Every branch/PR gets a preview deployment, which is useful for the owner to approve each step.
- `vercel.json`: `trailingSlash` and `cleanUrls` set consistently with the canonical URLs, `www` → apex redirect (or the reverse), and the 404 page wired via the static `404.html`. **No SPA catch‑all rewrite to `index.html`**, because every real route is prerendered and a catch‑all would turn real 404s into soft‑404s.
- Preview deployments get `X-Robots-Tag: noindex` so `*.vercel.app` URLs don't compete with the real domain. Set it with a header rule conditioned on the host, or by relying on Vercel's default for preview URLs (verify which applies).
- Custom domain `cascinaronchi.it` + HTTPS (automatic on Vercel).
- **Before switching DNS:** finalize the ADR‑09 redirect table from a crawl of the old site, and check where the **email MX records** live. Moving the domain's DNS to Vercel must not break `info@cascinaronchi.it`. Copy the MX/SPF/DKIM records over exactly, or only change the A/CNAME records at the current registrar.
- **Go‑live blockers:** the real P.IVA and CIN replace the placeholders; the photo consents are collected.
- Google Search Console + Bing Webmaster: verify, submit the sitemap, check the hreflang reports, and watch the old `.asp` URLs move to the new pages over the next weeks.
- Link the website from the Google Business Profile (with the GBP UTM, §8), Instagram/Facebook, the Booking.com listing, and **agriturismo.it**.
- Update the Facebook and Instagram bios with the new URL, and the same phone and address as the site.
- A final run of both review agents over the **entire** codebase (not just a diff), with the reports saved to `docs/reviews/final.md`.

---

## 6. Non-functional targets

| Metric | Target (mobile, 4G) |
|--------|---------------------|
| LCP | < 2.5 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| Initial JS (gzip) | ≤ ~80 kB |
| Above-the-fold image weight | ≤ 400 kB |
| Lighthouse (all 4 categories, all 5 locales) | ≥ 95 |
| Accessibility | WCAG 2.1 AA |
| Browsers | Last 2 versions of evergreen browsers + iOS Safari 16+ |

---

## 7. Backlog / later
- Automated tests (unit with Vitest, e2e with Playwright, visual regression), postponed per R10.
- Photo gallery/lightbox section ("La vita in cascina").
- Seasonal events / news (e.g. kidding season 🐐, open farm days), which could justify a lightweight headless CMS later.
- Cookieless analytics plus CTA click tracking.
- Splitting sections into separate prerendered routes if SEO data shows it's needed (ADR‑02).

---

## 8. Open questions for the owner

| # | Question | Why it matters / default if unanswered |
|---|----------|----------------------------------------|
| ~~Q1~~ | Location? | ✅ Via Secchia 57, 24030 Palazzago (BG). *The geo coordinates are still to be taken from Google Maps.* |
| ~~Q2~~ | Extra sections? | ✅ **Decided:** Restaurant, Rooms/B&B, and Le nostre capre are added. |
| ~~Q3~~ | Booking platform? | ✅ Booking.com, clean property URL with a per‑locale suffix (§3.1). Restaurant tables go through WhatsApp/phone. |
| ~~Q4~~ | Contact delivery? | ✅ WhatsApp `+39 349 645 3018` + mailto `info@cascinaronchi.it`. |
| ~~Q5~~ | Domain / hosting? | ✅ `cascinaronchi.it` on Vercel. |
| ~~Q6~~ | Who writes the copy? | ✅ Claude drafts from `docs/content-brief.md`, pre‑filled from the old site. |
| ~~Q7~~ | Native speakers? | ✅ None. Mitigated by the glossary plus a `translation-reviewer` subagent per language (ADR‑03). |
| ~~Q8~~ | Logo / brand colours? | ✅ None. Claude designs a wordmark and goat mark in Step 2. *The old site used a bright green (`#20a020`); keep a nod to it, or start fresh?* |
| Q9 | P.IVA and **CIN** codes, plus consent for the family photos? | ✅ Placeholders for now. **Go‑live blocker** (Step 11). |
| Q10 | Analytics wanted? | *Default: Vercel Web Analytics (cookieless), with booking‑CTA clicks tracked.* |
| ~~Q11~~ | Landline? | ✅ `035 549 574` is still in use; the fax no longer exists. |
| ~~Q12~~ | Goats? | ✅ About 30 goats; the farm makes various goat cheeses. *Details still go in the content brief: breed, a few goat names, the cheese names.* |
| ~~Q13~~ | Restaurant for non‑guests? | ✅ Yes, by reservation only (hours per Q17). *Still needed: the menu price and what's included.* |
| ~~Q14~~ | Wine / cured meats? | ✅ No more wine; cured meats and pastries are still made. The wine stays only as **history** in 6f. |
| ~~Q15~~ | Online profiles? | ✅ Facebook, Instagram, and a **Google Business Profile that already exists and is owner‑managed** (verified‑owner post from 28 Jun 2026). See the GBP section below. |
| ~~Q16~~ | Domain / DNS / email? | ✅ The owner will take over management soon. **Needed before Step 11:** registrar access and the current mail provider. |

| ~~Q17~~ | Restaurant hours? | ✅ Use the GBP hours: Mon–Thu 19:30–22:00 · Fri–Sun 12:30–16:00 + 19:30–23:00, by reservation. |
| ~~Q18~~ | Direct sale / events? | ✅ "We host everything" → new section **6c Eventi & Cerimonie**, plus a **direct sale** block in 6e. *Still needed: event capacity, the product list, and sale hours.* |
| ~~Q19~~ | Pool? | ✅ **No pool anymore.** The site must never mention one, and the GBP amenity must be removed (see below). |

### Google Business Profile (exists, owner‑managed): what to fix
The audit was done on 2026‑10‑01 on the public panel. The profile is strong (4.6★ from 273 reviews), so this is the most valuable channel. Things to clean up, independent of the new site:
1. **Category:** Google shows it as **"Hotel a 3 stelle"**. Set the primary category to *Agriturismo* and add *Ristorante* (or *Ristorante di cucina bergamasca/tipica*) and *Bed & breakfast*. That is what people search for.
2. **Hours:** the restaurant hours exist only as an **image post**, which Google can't parse. Enter *Mon–Thu 19:30–22:00 · Fri–Sun 12:30–16:00, 19:30–23:00* as structured opening hours (use "Altri orari" for the restaurant if the profile stays categorized as lodging), and mention "solo su prenotazione" in the description.
3. **Description:** Google's AI summary currently says *"vini IGT propri"*, built from old listings. Update the GBP description (and agriturismo.it, Terranostra Lombardia, and in‑lombardia.it) to say no wine; goats, goat cheeses, house cured meats and pastries; reservation only.
4. **Amenities:** **remove "Piscina"**. There's no pool anymore, and guests who booked expecting one leave bad reviews. Check the same amenity on Booking.com and agriturismo.it.
5. **Website link:** switch it to the new site at go‑live, with `?utm_source=google&utm_medium=organic&utm_campaign=gbp` so GBP traffic is measurable.
6. **Phone:** `035 549574` is consistent with the site. Add the mobile `349 645 3018` as a secondary number, since Facebook already advertises it for bookings.
7. **Photos:** after Step 3, upload the best optimized photos (goats, cheeses, rooms, dining room). Regularly fresh photos and posts help ranking.
8. **Reviews:** reply to reviews, including old ones. The new site links to the Google reviews ("Leggi le recensioni") so guests are nudged to leave new ones.

---

## 9. Audit of the current site (cascinaronchi.it), 2026‑10‑01

- **Tech:** classic ASP, HTML framesets, table layout, inline styles. Navigation uses JavaScript‑submitted **POST forms**, so crawlers can't follow the menu. The language switch (IT, FR, EN, DE flags) is also POST‑based, so there are no indexable language versions.
- **SEO:** a title only (`Agriturismo "Cascina Ronchi" - Palazzago (Bergamo)`). No `lang`, no meta description, no structured data, no sitemap, and images without meaningful alt text. → The new site starts from a very low bar, and the main risk is **losing old backlinks**, which ADR‑09 redirects handle.
- **Pages:** `descrizione.asp`, `camere.asp`, `raggiungerci.asp`, `foto2.asp`, `contatti.asp` (an email form). The old site already offered **French**, which confirms the 5‑language decision.
- **Reusable content** (becomes the seed of `docs/content-brief.md`):
  - A typical farmhouse on the hills between Pontida and Palazzago. Oldest core: late 17th century. Farmers documented living there permanently since 1760. Last extension: 1859. Recently restored.
  - Vineyards on terraces in full sun from dawn to dusk, which used to produce a red from Merlot + Cabernet and a white from Moscato Giallo. *Wine is no longer produced (owner, Q14), so use this only as history.*
  - Meals in the Bergamo tradition: house cured meats, farmyard animals, homemade bread, pasta and desserts. The dining rooms seat up to 20.
  - Rooms: the oldest part of the house, with 3 rooms, 8 beds, private bathrooms, exposed stone and an old fireplace. Surrounded by woods and vineyards; "only the crickets and cicadas will disturb your sleep".
  - Activities: hiking and mountain biking, a few km from Bergamo. Tagline: *"…un'oasi di pace nella natura incontaminata"*.
  - Directions: from Bergamo, SS342 towards Lecco → after Mapello, right towards Palazzago → left into Via Secchia, to the end of the road.
- **Not on the old site:** goats, the family/staff, the fixed‑price menu, events & ceremonies, direct sale, and the B&B on Booking.com. All of these are new content. The basics are now known (§3.1); the details go in the content brief.
