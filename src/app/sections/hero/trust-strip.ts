import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CURRENT_LOCALE } from '../../core/locale';
import { bookingUrl, SITE_CONFIG } from '../../core/site.config';

const { ratings } = SITE_CONFIG;

/**
 * Review scores as plain text, each linking to its source. Deliberately no `aggregateRating` in the
 * JSON-LD. The numbers and their "as of" date live in `site.config.ts`.
 */
@Component({
  selector: 'app-trust-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './trust-strip.scss',
  template: `
    <div class="strip">
      <div class="strip__inner container">
        <ul>
          @for (r of items; track r.name) {
            <li>
              <a [href]="r.url" target="_blank" rel="noopener">
                <strong>{{ r.name }}</strong> {{ r.score }}
                <span class="strip__count">({{ r.count }})</span>
                <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
              </a>
            </li>
          }
        </ul>
        <p class="strip__date">
          <ng-container i18n="@@trust.asOf">Valutazioni aggiornate a</ng-container
          >&ngsp;<time [attr.datetime]="asOf">{{ asOfLabel }}</time>
        </p>
      </div>
    </div>
  `,
})
export class TrustStrip {
  private readonly locale = inject(CURRENT_LOCALE);

  protected readonly asOf = ratings.asOf;
  protected readonly asOfLabel = new Intl.DateTimeFormat(this.locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(ratings.asOf));

  protected readonly items = [
    { name: 'Google', ...ratings.google },
    { name: 'Booking.com', ...ratings.booking, url: bookingUrl(this.locale) },
    { name: 'Tripadvisor', ...ratings.tripadvisor },
    { name: 'agriturismo.it', ...ratings.agriturismoIt },
  ];
}
