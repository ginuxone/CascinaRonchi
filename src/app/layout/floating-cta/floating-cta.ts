import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { tableRequestUrl } from '../../content/table-request';
import { CURRENT_LOCALE } from '../../core/locale';
import { ScrollSpy } from '../../core/scroll-spy.service';
import { bookingUrl, whatsappUrl } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';

/** Marks the hero's own booking button; the floating CTA waits until it has scrolled out of view. */
const HERO_CTA_SELECTOR = '[data-hero-cta]';

/**
 * Booking CTA that follows the visitor: a bottom-right pill on desktop, a bottom bar with a WhatsApp
 * shortcut on mobile (a table request inside the restaurant section). Hidden until the hero CTA leaves the viewport, then it stays. Pages without a
 * hero CTA show it straight away. Hidden on the server, so it never flashes before hydration.
 */
@Component({
  selector: 'app-floating-cta',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './floating-cta.scss',
  template: `
    <div class="cta" [class.is-visible]="visible()" [class.is-table]="inRestaurant()">
      <a class="cta__book" data-cta="floating-book" [href]="bookingHref" target="_blank" rel="noopener">
        <app-icon name="goat" />
        <span class="cta__long" i18n="@@cta.book.long">Prenota il tuo soggiorno</span>
        <span class="cta__short" i18n="@@cta.book.short">Prenota</span>
        <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
      </a>
      <a
        class="cta__whatsapp"
        [class.cta__whatsapp--table]="inRestaurant()"
        [attr.data-cta]="inRestaurant() ? 'floating-table' : 'floating-whatsapp'"
        [href]="inRestaurant() ? tableHref : whatsappHref"
        target="_blank"
        rel="noopener"
      >
        @if (inRestaurant()) {
          <app-icon name="whatsapp" />
          <span i18n="@@restaurant.cta.table">Prenota un tavolo</span>
        } @else {
          <app-icon name="whatsapp" label="WhatsApp" />
        }
        <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
      </a>
    </div>
  `,
})
export class FloatingCta {
  protected readonly bookingHref = bookingUrl(inject(CURRENT_LOCALE));
  protected readonly whatsappHref = whatsappUrl();
  protected readonly tableHref = tableRequestUrl();
  /** On mobile the secondary action becomes a table request while the restaurant section is being read. */
  protected readonly inRestaurant = computed(() => this.spy.active() === 'ristorante');
  protected readonly visible = signal(false);

  private readonly spy = inject(ScrollSpy);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private observer?: IntersectionObserver;

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => afterNextRender(() => this.watch(), { injector: this.injector }));
    afterNextRender(() => this.watch());
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  private watch(): void {
    this.observer?.disconnect();
    const heroCta = this.document.querySelector(HERO_CTA_SELECTOR);
    if (!heroCta) {
      this.visible.set(true);
      return;
    }

    this.visible.set(false);
    this.observer = new IntersectionObserver(([entry]) => {
      // Scrolled past it (not merely below the fold).
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        this.visible.set(true);
        this.observer?.disconnect();
      }
    });
    this.observer.observe(heroCta);
  }
}
