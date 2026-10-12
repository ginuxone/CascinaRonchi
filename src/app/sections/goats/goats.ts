import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { pickupRequestUrl } from '../../content/pickup-request';
import { SITE_CONFIG } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';
import { RevealDirective } from '../../shared/reveal.directive';

/** Goats: the herd, from milk to cheese to the restaurant, and the direct sale of farm products. */
@Component({
  selector: 'app-goats',
  imports: [RouterLink, Icon, ResponsiveImage, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './goats.scss',
  template: `
    <section id="capre" class="section section--alt" aria-labelledby="goats-title">
      <div class="container">
        <h2 id="goats-title" i18n="@@section.goats.title">Le nostre capre</h2>
        <div class="intro" appReveal>
          <p class="lead" i18n="@@goats.lead">
            Da noi vivono circa {{ site.goats.count }} capre. Sono il cuore della cascina.
          </p>
          <p i18n="@@goats.story">
            Pascolano sulle colline attorno a noi. Con il loro latte facciamo il nostro formaggio di
            capra.
          </p>
        </div>

        <ul class="photos">
          @for (slug of photos; track slug) {
            <li appReveal>
              <app-img
                [slug]="slug"
                ratio="4 / 3"
                sizes="(min-width: 64rem) 25vw, 50vw"
              />
            </li>
          }
        </ul>

        <div class="chain">
          <h3 i18n="@@goats.chain.title">Dal latte al piatto</h3>
          <ol>
            <li appReveal>
              <strong i18n="@@goats.chain.goats.title">Le capre</strong>
              <span i18n="@@goats.chain.goats.text">Vivono e pascolano qui, sulle nostre colline.</span>
            </li>
            <li appReveal>
              <strong i18n="@@goats.chain.milking.title">La mungitura</strong>
              <span i18n="@@goats.chain.milking.text">Il latte viene dalle nostre capre.</span>
            </li>
            <li appReveal>
              <strong i18n="@@goats.chain.cheese.title">Il formaggio</strong>
              <span i18n="@@goats.chain.cheese.text">Lo facciamo in cascina, con quel latte.</span>
            </li>
            <li appReveal>
              <strong i18n="@@goats.chain.plate.title">Il tuo piatto</strong>
              <span i18n="@@goats.chain.plate.text">Lo trovi in tavola, al ristorante.</span>
              <a routerLink="/" fragment="ristorante" i18n="@@goats.chain.plate.link">Vai al ristorante</a>
            </li>
          </ol>
        </div>

        <div class="sale" appReveal>
          <h3 i18n="@@goats.sale.title">Portali a casa</h3>
          <p i18n="@@goats.sale.text">
            Alla cascina puoi comprare anche i nostri prodotti. Scrivici su WhatsApp per prenotare il
            ritiro.
          </p>
          <ul>
            <li i18n="@@goats.sale.cheese">Formaggi di capra</li>
            <li i18n="@@goats.sale.meats">Salumi di casa</li>
            <li i18n="@@goats.sale.sweets">Pasticcini e dolci</li>
          </ul>
          <a
            class="button button--primary"
            data-cta="goats-pickup"
            [href]="pickupHref"
            target="_blank"
            rel="noopener"
          >
            <app-icon name="whatsapp" />
            <span i18n="@@goats.sale.cta">Prenota il ritiro</span>
            <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class Goats {
  protected readonly site = SITE_CONFIG;
  protected readonly pickupHref = pickupRequestUrl();
  protected readonly photos = [
    'capre-al-pascolo',
    'capretto-nel-fieno',
    'capre-prato-cascina-primavera',
    'capre-pascolo-prato-inverno',
  ] as const;
}
