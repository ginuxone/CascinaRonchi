import { inject, InjectionToken, LOCALE_ID } from '@angular/core';

import { SITE_LOCALES, SiteLocale } from './site.config';

/** The locale this build was compiled for (`@angular/localize` sets LOCALE_ID per build). */
export const CURRENT_LOCALE = new InjectionToken<SiteLocale>('CURRENT_LOCALE', {
  providedIn: 'root',
  factory: () => {
    const id = inject(LOCALE_ID);
    return SITE_LOCALES.find((l) => id === l || id.startsWith(`${l}-`)) ?? 'it';
  },
});

/** Each language names itself, so these are not translated. */
export const LOCALE_NAMES: Readonly<Record<SiteLocale, string>> = {
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

/** Absolute path of a route in another locale build. Italian lives at `/`, the others under `/xx/`. */
export function localeHref(locale: SiteLocale, route: '' | 'privacy' = '', fragment?: string): string {
  const base = locale === 'it' ? '/' : `/${locale}/`;
  return `${base}${route}${fragment ? `#${fragment}` : ''}`;
}
