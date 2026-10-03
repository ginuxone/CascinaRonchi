# Step 2 review — Design system

Reviewers: `code-reviewer` (no Blockers), `seo-reviewer` (6/10 before fixes).

## Major
| Finding | Resolution |
|---|---|
| Dev-only style-guide chunk shipped in production (`isDevMode()` is not tree-shaken). | Fixed. Routes moved to `dev.routes.ts`, swapped for an empty `dev.routes.prod.ts` via `fileReplacements`. `grep -r style-guide dist` is empty. |
| Fonts have no preload and no metric-matched fallback (CLS risk). | Fallback fixed: `Inter Fallback` and `Fraunces Fallback` `@font-face` rules added (Fraunces values approximate, re-measure in Step 9). Preload **deferred** to the backlog (§7): font filenames are hashed by the build. |

## Minor
- Fixed: `RevealDirective` uses `DestroyRef`; `_mixins.scss` uses `sass:map`; duplicate `<h1>` in the style guide replaced with `.h1`.
- Backlog: unused `.woff` files in `dist/media`; `.reveal` is applied after first paint (below-the-fold only); initial JS slightly over the ~80 kB gzip target (Step 9 budgets).
- Accepted: unused `up()` mixin and utility classes are planned primitives for Steps 5–6. `.claude/launch.json` is committed for the preview tooling.
- Contrast ratios recomputed by both reviewers: all AA.
