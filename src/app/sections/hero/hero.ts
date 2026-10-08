import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CURRENT_LOCALE } from '../../core/locale';
import { HOME_SECTION_ID } from '../../core/sections';
import { bookingUrl } from '../../core/site.config';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';
import { Pillars } from './pillars';
import { TrustStrip } from './trust-strip';

/** Home section: full-bleed photo with the h1 and the booking CTA, then the trust strip and the four pillars. */
@Component({
  selector: 'app-hero',
  imports: [ResponsiveImage, TrustStrip, Pillars],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './hero.scss',
  template: `
    <section [id]="homeId" class="hero">
      <div class="hero__banner">
        <app-img
          class="hero__image"
          slug="cascina-prato-estate"
          ratio="auto"
          sizes="100vw"
          [priority]="true"
        />
        <div class="hero__content container">
          <h1 i18n="@@hero.title">Cascina Ronchi — Agriturismo tra le capre</h1>
          <p class="hero__lead" i18n="@@hero.lead">
            Una cascina in pietra sulle colline tra Pontida e Palazzago. Dormi tra boschi e vigne,
            mangia piatti di casa e conosci le nostre capre. A pochi chilometri da Bergamo.
          </p>
          <a
            class="hero__cta"
            data-hero-cta
            data-cta="hero-book"
            [href]="bookingHref"
            target="_blank"
            rel="noopener"
          >
            <span i18n="@@hero.cta">Prenota</span>
            <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
          </a>
        </div>
      </div>
      <app-trust-strip />
      <app-pillars />
    </section>
  `,
})
export class Hero {
  protected readonly homeId = HOME_SECTION_ID;
  protected readonly bookingHref = bookingUrl(inject(CURRENT_LOCALE));
}
