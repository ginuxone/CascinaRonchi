import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { HOME_SECTION_ID } from './sections';
import { localeHref } from './locale';
import { ScrollSpy } from './scroll-spy.service';
import { SiteLocale } from './site.config';

/** Real, crawlable links to the current page in another language, keeping the section being read. */
@Injectable({ providedIn: 'root' })
export class LocaleLinks {
  private readonly router = inject(Router);
  private readonly spy = inject(ScrollSpy);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  href(locale: SiteLocale): string {
    const tree = this.router.parseUrl(this.url());
    const path = tree.root.children['primary']?.segments.map((s) => s.path).join('/');
    const fragment = this.spy.active() ?? tree.fragment ?? undefined;
    return localeHref(locale, path === 'privacy' ? 'privacy' : '', fragment === HOME_SECTION_ID ? undefined : fragment);
  }
}
