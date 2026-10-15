import { ChangeDetectionStrategy, Component } from '@angular/core';

import { directionsUrl, SITE_CONFIG, whatsappUrl } from '../../core/site.config';
import { RevealDirective } from '../../shared/reveal.directive';
import { ContactForm } from './contact-form';

/**
 * Contact: the message form (loaded when it scrolls into view, but prerendered), the contact details,
 * directions and how to get here.
 */
@Component({
  selector: 'app-contact',
  imports: [ContactForm, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contact.scss',
  template: `
    <section id="contatti" class="container section" aria-labelledby="contact-title">
      <h2 id="contact-title" i18n="@@section.contact.title">Contatti</h2>
      <p class="lead" i18n="@@contact.lead">
        Scrivici su WhatsApp o per email. Il modulo prepara il messaggio, poi lo invii tu.
      </p>

      <div class="layout">
        @defer (hydrate on viewport) {
          <app-contact-form />
        } @placeholder {
          <div class="form-placeholder skeleton"></div>
        }

        <div class="info" appReveal>
          <h3 i18n="@@contact.info.title">Dove siamo</h3>
          <address>
            <strong>{{ site.name }}</strong
            ><br />
            {{ site.address.street }}<br />
            {{ site.address.postalCode }} {{ site.address.city }} ({{ site.address.province }})
          </address>
          <ul class="links">
            <li>
              <span i18n="@@contact.info.phone">Telefono</span>:
              <a [href]="'tel:' + site.phone.tel">{{ site.phone.display }}</a>
            </li>
            <li>
              WhatsApp:
              <a [href]="whatsappHref" target="_blank" rel="noopener">{{ site.whatsapp.display }}</a>
            </li>
            <li>
              <span i18n="@@contact.info.email">Email</span>:
              <a [href]="'mailto:' + site.email">{{ site.email }}</a>
            </li>
          </ul>
          <a class="button button--outline" data-cta="contact-directions" [href]="directionsHref" target="_blank" rel="noopener">
            <span i18n="@@contact.info.directions">Indicazioni su Google Maps</span>
            <span class="visually-hidden" i18n="@@cta.newTab">(si apre in una nuova scheda)</span>
          </a>

          <h3 i18n="@@contact.how.title">Come arrivare</h3>
          <p i18n="@@contact.how.car">
            In auto da Bergamo: prendi la SS342 verso Lecco. Dopo Mapello gira a destra verso Palazzago.
            Poi gira a sinistra in Via Secchia e seguila fino alla fine della strada.
          </p>
          <p i18n="@@contact.how.trails">
            Qui vicino ci sono sentieri per camminare e per la mountain bike, a pochi chilometri da
            Bergamo.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class Contact {
  protected readonly site = SITE_CONFIG;
  protected readonly whatsappHref = whatsappUrl();
  protected readonly directionsHref = directionsUrl();
}
