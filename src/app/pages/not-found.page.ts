import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main" tabindex="-1">
      <h1 i18n="@@notFound.title">Pagina non trovata</h1>
      <p><a routerLink="/" i18n="@@notFound.home">Torna alla home</a></p>
    </main>
  `,
})
export class NotFoundPage {}
