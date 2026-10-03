import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CURRENT_LOCALE, LOCALE_NAMES } from '../../core/locale';
import { LocaleLinks } from '../../core/locale-links.service';
import { SITE_LOCALES } from '../../core/site.config';

/**
 * Plain `<a href>` links to the same page in every language (crawlable, no JS needed).
 * Labels are the language codes, not flags: flags stand for countries, not languages.
 */
@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './language-switcher.scss',
  template: `
    <nav aria-label="Lingua" i18n-aria-label="@@lang.label">
      <ul>
        @for (l of locales; track l) {
          <li>
            <a
              [href]="links.href(l)"
              [attr.hreflang]="l"
              [attr.lang]="l"
              [attr.aria-current]="l === current ? 'true' : null"
              [attr.aria-label]="l.toUpperCase() + ' – ' + names[l]"
              [title]="names[l]"
              >{{ l.toUpperCase() }}</a
            >
          </li>
        }
      </ul>
    </nav>
  `,
})
export class LanguageSwitcher {
  protected readonly links = inject(LocaleLinks);
  protected readonly locales = SITE_LOCALES;
  protected readonly names = LOCALE_NAMES;
  protected readonly current = inject(CURRENT_LOCALE);
}
