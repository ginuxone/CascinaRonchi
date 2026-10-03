import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CURRENT_LOCALE } from '../../core/locale';
import { SITE_CONFIG, whatsappUrl } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './footer.scss',
  template: `
    <footer class="footer">
      <div class="container footer__grid">
        <section aria-labelledby="footer-find">
          <h2 id="footer-find" class="footer__title" i18n="@@footer.find">Dove siamo</h2>
          <address>
            <strong>{{ site.name }}</strong><br />
            {{ site.address.street }}<br />
            {{ site.address.postalCode }} {{ site.address.city }} ({{ site.address.province }})
          </address>
          <ul class="footer__list">
            <li>
              <span i18n="@@footer.phone">Telefono</span>:
              <a [href]="'tel:' + site.phone.tel">{{ site.phone.display }}</a>
            </li>
            <li>
              WhatsApp: <a [href]="whatsapp" target="_blank" rel="noopener">{{ site.whatsapp.display }}</a>
            </li>
            <li>
              <span i18n="@@footer.email">Email</span>:
              <a [href]="'mailto:' + site.email">{{ site.email }}</a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-hours">
          <h2 id="footer-hours" class="footer__title" i18n="@@footer.hours">Ristorante</h2>
          <p i18n="@@footer.reservation">Solo su prenotazione. Aperto anche a chi non soggiorna.</p>
          <dl class="hours">
            <dt i18n="@@footer.monThu">Lun–Gio</dt>
            <dd i18n="@@footer.dinnerOnly">Cena {{ hours.monThu.dinner }}</dd>
            <dt i18n="@@footer.friSun">Ven–Dom</dt>
            <dd i18n="@@footer.lunchDinner">
              Pranzo {{ hours.friSun.lunch }} · Cena {{ hours.friSun.dinner }}
            </dd>
          </dl>
        </section>

        <section aria-labelledby="footer-follow">
          <h2 id="footer-follow" class="footer__title" i18n="@@footer.follow">Seguici</h2>
          <ul class="footer__list">
            <li><a [href]="site.social.instagram" target="_blank" rel="noopener">Instagram</a></li>
            <li><a [href]="site.social.facebook" target="_blank" rel="noopener">Facebook</a></li>
            <li><a routerLink="/privacy" i18n="@@footer.privacy">Privacy</a></li>
            @if (locale !== 'it') {
              <li>
                <a routerLink="/" fragment="contatti" i18n="@@footer.translationError">
                  Hai notato un errore di traduzione?
                </a>
              </li>
            }
          </ul>
        </section>
      </div>

      <div class="container footer__legal">
        <p>
          © {{ year }} {{ site.name }} · P.IVA {{ site.vatNumber }} · CIN {{ site.cin }}
        </p>
        <p class="footer__made">
          <span i18n="@@footer.madeWith">Fatto con cura, tra le capre</span>
          <app-icon name="goat" />
        </p>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly site = SITE_CONFIG;
  protected readonly hours = SITE_CONFIG.hours.restaurant;
  protected readonly whatsapp = whatsappUrl();
  protected readonly locale = inject(CURRENT_LOCALE);
  protected readonly year = new Date().getFullYear();
}
