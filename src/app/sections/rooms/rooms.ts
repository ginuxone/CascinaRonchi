import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SITE_CONFIG } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';
import { RevealDirective } from '../../shared/reveal.directive';

/** Rooms / B&B: the stay experience in the oldest part of the farmhouse, a photo gallery and the booking link. */
@Component({
  selector: 'app-rooms',
  imports: [Icon, ResponsiveImage, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './rooms.scss',
  template: `
    <section id="camere" class="container section" aria-labelledby="rooms-title">
      <h2 id="rooms-title" i18n="@@section.rooms.title">Camere</h2>

      <div class="intro" appReveal>
        <p class="lead" i18n="@@rooms.lead">
          Il nostro B&amp;B a Palazzago, vicino a Bergamo. Dormi nella parte più antica della
          cascina, della fine del Seicento.
        </p>
        <p i18n="@@rooms.story">
          Muri di pietra a vista, il vecchio camino, i boschi intorno. Di notte disturbano solo i
          grilli e le cicale.
        </p>
        <p class="facts">
          <app-icon name="bed" />
          <span i18n="@@rooms.facts">
            {{ site.rooms.count }} camere, {{ site.rooms.beds }} posti letto in tutto, ognuna con
            bagno privato.
          </span>
        </p>
      </div>

      <ul class="gallery">
        @for (slug of photos; track slug) {
          <li appReveal>
            <app-img
              [slug]="slug"
              ratio="4 / 3"
              sizes="(min-width: 64rem) 33vw, 50vw"
            />
          </li>
        }
      </ul>

      <a
        class="button button--primary"
        data-cta="rooms-availability"
        [href]="site.bookingUrl"
        target="_blank"
        rel="noopener"
      >
        <span i18n="@@rooms.cta">Verifica disponibilità</span>
        <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
      </a>
    </section>
  `,
})
export class Rooms {
  protected readonly site = SITE_CONFIG;
  protected readonly photos = [
    'camera-pietra-letto-ferro',
    'camera-scala-ferro',
    'camera-copriletto-fiori',
    'camera-pietra-lampada',
    'camera-copriletto-fiori-scala',
    'camera-letto-ferro-verticale',
  ] as const;
}
