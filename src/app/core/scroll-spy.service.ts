import { DOCUMENT } from '@angular/common';
import { afterNextRender, DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { HOME_SECTION_ID, NAV_SECTIONS } from './sections';

/**
 * Tracks which page section is under the top of the viewport, for the active nav state.
 * Re-attaches after every navigation, since the sections only exist on the home page.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpy {
  /** Id of the section being read, or null when the current page has none. */
  readonly active = signal<string | null>(null);

  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private observer?: IntersectionObserver;

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => afterNextRender(() => this.attach(), { injector: this.injector }));
    afterNextRender(() => this.attach());
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  private attach(): void {
    this.observer?.disconnect();
    const sections = [HOME_SECTION_ID, ...NAV_SECTIONS.map((s) => s.id)]
      .map((id) => this.document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) {
      this.active.set(null);
      return;
    }

    // A thin band near the top of the viewport: the section crossing it is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.active.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-25% 0px -70% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    this.observer = observer;
  }
}
