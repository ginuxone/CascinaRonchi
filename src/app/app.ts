import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SplashService } from './core/splash.service';
import { FloatingCta } from './layout/floating-cta/floating-cta';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { LanguageBanner } from './layout/language-banner/language-banner';
import { IconSprite } from './shared/icon/icon-sprite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IconSprite, Header, Footer, FloatingCta, LanguageBanner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main" (click)="skipToContent($event)" i18n="@@a11y.skip">Vai al contenuto</a>
    <app-icon-sprite />
    <app-header />
    <router-outlet />
    <app-footer />
    <app-floating-cta />
    <app-language-banner />
  `,
})
export class App {
  private readonly document = inject(DOCUMENT);

  constructor() {
    const splash = inject(SplashService);
    afterNextRender(() => splash.dismissWhenReady());
  }

  /** A plain `#main` link would resolve against the locale `<base href>` and leave the current page. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main')?.focus();
  }
}
