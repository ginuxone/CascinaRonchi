import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EVENT_TYPES } from '../../content/events';
import { eventRequestMailtoUrl, eventRequestWhatsappUrl } from '../../content/event-request';
import { SITE_CONFIG } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';
import { RevealDirective } from '../../shared/reveal.directive';

/** Events and ceremonies: the occasions we host, what makes it special, practical details, quote request. */
@Component({
  selector: 'app-events',
  imports: [Icon, ResponsiveImage, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './events.scss',
  template: `
    <section id="eventi" class="section section--alt" aria-labelledby="events-title">
      <div class="container">
        <h2 id="events-title" i18n="@@section.events.title">Eventi e cerimonie</h2>
        <p class="lead" i18n="@@events.lead">
          Cerchi un agriturismo per battesimi, comunioni o matrimoni vicino a Bergamo? A Cascina
          Ronchi, a Palazzago, si festeggia tutto.
        </p>

        <ul class="types">
          @for (t of types; track t.id) {
            <li appReveal>
              <app-icon name="hoofprint" />
              <h3>{{ t.title }}</h3>
              <p>{{ t.text }}</p>
            </li>
          }
        </ul>

        <div class="special">
          <h3 i18n="@@events.special.title">Perché da noi</h3>
          <ul>
            <li i18n="@@events.special.place">
              In campagna, tra i boschi: un posto tranquillo, lontano dal traffico.
            </li>
            <li i18n="@@events.special.menu">Un menù di casa, che possiamo concordare prima.</li>
            <li i18n="@@events.special.goats">Le capre: i bambini si divertono, i grandi anche.</li>
            <li i18n="@@events.special.photos">Il giardino e il bosco: sfondi bellissimi per le foto.</li>
          </ul>
        </div>

        <ul class="photos">
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

        <div class="details">
          <h3 i18n="@@events.details.title">Cose da sapere</h3>
          <dl>
            <dt i18n="@@events.details.seats.label">Posti</dt>
            <dd i18n="@@events.details.seats.text">
              Circa {{ site.capacity.indoor }} persone dentro e circa {{ site.capacity.outdoor }} fuori.
            </dd>
            <dt i18n="@@events.details.menu.label">Menù</dt>
            <dd i18n="@@events.details.menu.text">
              Si può concordare prima. Altrimenti si mangia quello che c'è in pentola.
            </dd>
            <dt i18n="@@events.details.when.label">Quando prenotare</dt>
            <dd i18n="@@events.details.when.text">
              Almeno un paio di giorni prima, così possiamo preparare ogni richiesta.
            </dd>
            <dt i18n="@@events.details.exclusive.label">Uso esclusivo</dt>
            <dd i18n="@@events.details.exclusive.text">
              No: la cascina non si può prenotare per intero. Le camere sì, una per una.
            </dd>
          </dl>
        </div>

        <div class="actions">
          <a
            class="button button--primary"
            data-cta="events-quote"
            [href]="whatsappHref"
            target="_blank"
            rel="noopener"
          >
            <app-icon name="whatsapp" />
            <span i18n="@@events.cta.quote">Richiedi un preventivo</span>
            <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
          </a>
          <a class="button button--outline" data-cta="events-email" [href]="mailtoHref">
            <span i18n="@@events.cta.email">Oppure scrivici una email</span>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class Events {
  protected readonly site = SITE_CONFIG;
  protected readonly types = EVENT_TYPES;
  protected readonly whatsappHref = eventRequestWhatsappUrl();
  protected readonly mailtoHref = eventRequestMailtoUrl();
  protected readonly photos = [
    'cena-giardino-sera',
    'tavoli-giardino-rosa',
    'cena-luci-sera',
    'cascina-illuminata-sera',
  ] as const;
}
