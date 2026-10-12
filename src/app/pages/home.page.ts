import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Events } from '../sections/events/events';
import { Goats } from '../sections/goats/goats';
import { Hero } from '../sections/hero/hero';
import { Restaurant } from '../sections/restaurant/restaurant';
import { Rooms } from '../sections/rooms/rooms';

/**
 * Section shells so the header anchors resolve. Each one is replaced by its real section component
 * in Step 6 (6f history, ...).
 */
@Component({
  selector: 'app-home-page',
  imports: [Hero, Restaurant, Events, Rooms, Goats],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    section {
      scroll-margin-top: var(--space-8);
    }
  `,
  template: `
    <main id="main" tabindex="-1">
      <app-hero />
      <app-restaurant />
      <app-events />
      <app-rooms />
      <app-goats />
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
