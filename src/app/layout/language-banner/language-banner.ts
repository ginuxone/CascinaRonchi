import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { CURRENT_LOCALE } from '../../core/locale';
import { LocaleLinks } from '../../core/locale-links.service';
import { SITE_LOCALES, SiteLocale } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';

interface Offer {
  readonly text: string;
  readonly link: string;
  readonly close: string;
}

/**
 * The offer is written in the language it proposes, not in the language of this build, so it is not
 * part of the Angular i18n files. Review it with the translation-reviewer like any other copy.
 */
const OFFERS: Readonly<Record<SiteLocale, Offer>> = {
  it: { text: 'Questa pagina è disponibile anche in italiano.', link: 'Vai alla versione italiana', close: 'Chiudi' },
  en: { text: 'This page is also available in English.', link: 'Switch to English', close: 'Close' },
  es: { text: 'Esta página también está disponible en español.', link: 'Cambiar a español', close: 'Cerrar' },
  de: { text: 'Diese Seite gibt es auch auf Deutsch.', link: 'Auf Deutsch ansehen', close: 'Schließen' },
  fr: { text: 'Cette page est aussi disponible en français.', link: 'Voir en français', close: 'Fermer' },
};

const STORAGE_KEY = 'cr-lang-banner';

/**
 * Suggests the visitor's browser language (ADR-03). It never redirects on its own, and the choice is
 * remembered. Only shown in the browser, as an overlay, so it causes no layout shift.
 */
@Component({
  selector: 'app-language-banner',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './language-banner.scss',
  template: `
    @if (offer(); as o) {
      <aside class="banner" [attr.lang]="o.locale" aria-labelledby="lang-banner-text">
        <p id="lang-banner-text">
          {{ o.text }}
          <a [href]="links.href(o.locale)" [attr.hreflang]="o.locale" (click)="remember()">{{ o.link }}</a>
        </p>
        <button type="button" [attr.aria-label]="o.close" (click)="dismiss()">
          <app-icon name="close" />
        </button>
      </aside>
    }
  `,
})
export class LanguageBanner {
  protected readonly links = inject(LocaleLinks);
  protected readonly offer = signal<(Offer & { locale: SiteLocale }) | null>(null);

  constructor() {
    const current = inject(CURRENT_LOCALE);
    afterNextRender(() => {
      const preferred = SITE_LOCALES.find((l) => l === navigator.language.slice(0, 2).toLowerCase());
      if (preferred && preferred !== current && !this.wasHandled()) {
        this.offer.set({ ...OFFERS[preferred], locale: preferred });
      }
    });
  }

  protected dismiss(): void {
    this.remember();
    this.offer.set(null);
  }

  protected remember(): void {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Storage can be blocked; the banner then simply comes back next visit.
    }
  }

  private wasHandled(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }
}
