import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Contact } from '../sections/contact/contact';
import { Events } from '../sections/events/events';
import { Family } from '../sections/family/family';
import { Goats } from '../sections/goats/goats';
import { Hero } from '../sections/hero/hero';
import { History } from '../sections/history/history';
import { Restaurant } from '../sections/restaurant/restaurant';
import { Rooms } from '../sections/rooms/rooms';

/** The one-page story: every section in scroll order, matching the header nav. */
@Component({
  selector: 'app-home-page',
  imports: [Hero, Restaurant, Events, Rooms, Goats, History, Family, Contact],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main" tabindex="-1">
      <app-hero />
      <app-restaurant />
      <app-events />
      <app-rooms />
      <app-goats />
      <app-history />
      <app-family />
      <app-contact />
    </main>
  `,
})
export class HomePage {}
