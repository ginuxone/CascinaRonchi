import { DOCUMENT } from '@angular/common';
import { ApplicationRef, inject, Injectable } from '@angular/core';

/** Upper bound on how long the splash may stay after bootstrap (keeps LCP in check, plan Step 4). */
const MAX_WAIT_MS = 2000;
/** Fade-out length in index.html (0.4 s) plus a little slack before the node is removed. */
const FADE_OUT_MS = 500;

/**
 * Dismisses the inline `#splash` from index.html once hydration is done and the hero image is decoded,
 * or after MAX_WAIT_MS, whichever comes first. Browser only: call it from `afterNextRender()`.
 * If this never runs, a CSS animation in index.html hides the splash by itself.
 */
@Injectable({ providedIn: 'root' })
export class SplashService {
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);

  dismissWhenReady(): void {
    const splash = this.document.getElementById('splash');
    if (!splash) {
      return;
    }

    let cap: ReturnType<typeof setTimeout> | undefined;
    const capped = new Promise<void>((resolve) => {
      cap = setTimeout(resolve, MAX_WAIT_MS);
    });
    const ready = this.appRef.whenStable().then(() => this.heroDecoded());

    void Promise.race([ready, capped]).then(() => {
      clearTimeout(cap);
      splash.classList.add('is-leaving');
      setTimeout(() => splash.remove(), FADE_OUT_MS);
    });
  }

  /** Resolves once the LCP image (the one with fetchpriority="high") can be painted without a flash. */
  private async heroDecoded(): Promise<void> {
    const hero = this.document.querySelector<HTMLImageElement>('img[fetchpriority="high"]');
    try {
      await hero?.decode();
    } catch {
      // A broken hero must not keep the splash up.
    }
  }
}
