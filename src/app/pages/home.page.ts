import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Hero } from '../sections/hero/hero';

/**
 * Section shells so the header anchors resolve. Each one is replaced by its real section component
 * in Step 6 (6b restaurant, ...).
 */
@Component({
  selector: 'app-home-page',
  imports: [Hero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    section {
      scroll-margin-top: var(--space-8);
    }
  `,
  template: `
    <main id="main" tabindex="-1">
      <app-hero />
      <section id="ristorante" class="container section">
        <h2 i18n="@@section.restaurant.title">Ristorante</h2>
      </section>
      <section id="eventi" class="container section">
        <h2 i18n="@@section.events.title">Eventi e cerimonie</h2>
      </section>
      <section id="camere" class="container section">
        <h2 i18n="@@section.rooms.title">Camere</h2>
      </section>
      <section id="capre" class="container section">
        <h2 i18n="@@section.goats.title">Le nostre capre</h2>
      </section>
      <section id="storia" class="container section">
        <h2 i18n="@@section.history.title">La nostra storia</h2>
      </section>
      <section id="famiglia" class="container section">
        <h2 i18n="@@section.family.title">La famiglia</h2>
      </section>
      <section id="contatti" class="container section">
        <h2 i18n="@@section.contact.title">Contatti</h2>
      </section>
    </main>
  `,
})
export class HomePage {}
