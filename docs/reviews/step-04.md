# Step 4 review — Loading experience

Static review only (no Lighthouse, no throttled-3G run). Real LCP/CLS measurement is Step 9.

## seo-reviewer (7/10 before fixes)
| Severity | Issue | Status |
|---|---|---|
| Major | Page behind the splash is focusable | Fixed: `app-root` is `inert` via an inline script in `index.html`; `SplashService` lifts it, with a 4 s failsafe |
| Major | 2 s cap counted from bootstrap, 6 s CSS failsafe | Fixed: cap counted from navigation start (min 300 ms after bootstrap); CSS failsafe now 4 s |
| Minor | Splash text near top of body | Fixed: `data-nosnippet` |
| Minor | Fraunces in wordmark not preloaded | Deferred to Step 10 (font preload, needs post-build step) |
| Minor | `angular.json` stray edit | Not part of the step; left uncommitted |
| Minor | Skeleton for staff cards | Generic `.skeleton` utility now; apply to staff cards in 6 |

## code-reviewer (no Blockers, no Majors)
| Severity | Issue | Status |
|---|---|---|
| Minor | `angular.json` stray edit | Left uncommitted |
| Minor | `inert` while splash is up | Fixed (see above) |
| Minor | Hard-coded splash colours | Comment added saying they mirror the tokens |
| Minor | Removal timeout not cleared | No action (root service, runs once) |
| Minor | `heroDecoded()` is a no-op until the hero exists | Backlog: re-verify in 6a and Step 9 |
| Minor | `.skeleton` only used in style guide | Backlog: apply to staff cards in 6 |
