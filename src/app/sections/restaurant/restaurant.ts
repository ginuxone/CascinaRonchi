import { ChangeDetectionStrategy, Component } from '@angular/core';

import { tableRequestUrl } from '../../content/table-request';
import { SITE_CONFIG } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';
import { RevealDirective } from '../../shared/reveal.directive';

/** Restaurant: reservation-only notice and hours first, then the story, the CTAs and a photo strip. */
@Component({
  selector: 'app-restaurant',
  imports: [Icon, ResponsiveImage, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './restaurant.scss',
  template: `
    <section id="ristorante" class="container section" aria-labelledby="restaurant-title">
      <h2 id="restaurant-title" i18n="@@section.restaurant.title">Ristorante</h2>

      <div class="notice" appReveal>
        <app-icon name="plate" />
        <div>
          <p class="notice__title" i18n="@@restaurant.notice.title">Si mangia solo su prenotazione.</p>
          <p i18n="@@restaurant.notice.text">
            Il ristorante è aperto a tutti, non solo a chi dorme da noi.
          </p>
        </div>
      </div>

      <div class="intro">
        <div class="intro__text" appReveal>
          <h3 i18n="@@restaurant.story.title">Cucina bergamasca, fatta qui in cascina</h3>
          <p i18n="@@restaurant.story.cheese">
            I formaggi vengono dalle nostre capre. I salumi sono di casa. Anche il pane, la pasta, i
            pasticcini e i dolci li facciamo noi.
          </p>
          <p i18n="@@restaurant.story.rooms">
            Le sale sono calde e accolgono fino a 20 persone.
          </p>

          <div class="actions">
            <a
              class="button button--primary"
              data-cta="restaurant-table"
              [href]="tableHref"
              target="_blank"
              rel="noopener"
            >
              <app-icon name="whatsapp" />
              <span i18n="@@restaurant.cta.table">Prenota un tavolo</span>
              <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
            </a>
            <a class="button button--outline" data-cta="restaurant-call" [href]="'tel:' + site.phone.tel">
              <span i18n="@@restaurant.cta.call">Chiama</span>&nbsp;{{ site.phone.display }}
            </a>
          </div>
        </div>

        <div class="hours" appReveal>
          <h3 i18n="@@restaurant.hours.title">Orari</h3>
          <dl>
            <dt i18n="@@restaurant.monThu">Lunedì–Giovedì</dt>
            <dd i18n="@@restaurant.dinnerOnly">Cena {{ hours.monThu.dinner }}</dd>
            <dt i18n="@@restaurant.friSun">Venerdì–Domenica</dt>
            <dd i18n="@@restaurant.lunchDinner">
              Pranzo {{ hours.friSun.lunch }}<br />Cena {{ hours.friSun.dinner }}
            </dd>
          </dl>
        </div>
      </div>

      <ul class="strip">
        @for (slug of photos; track slug) {
          <li appReveal>
            <app-img
              [slug]="slug"
              ratio="4 / 3"
              sizes="(min-width: 64rem) 25vw, (min-width: 36rem) 50vw, 100vw"
            />
          </li>
        }
      </ul>
    </section>
  `,
})
export class Restaurant {
  protected readonly site = SITE_CONFIG;
  protected readonly hours = SITE_CONFIG.hours.restaurant;
  protected readonly tableHref = tableRequestUrl();
  protected readonly photos = [
    'sala-ristorante-camino',
    'tavolata-pergolato',
    'tavola-margherite',
    'sala-ristorante-tavolata',
  ] as const;
}
