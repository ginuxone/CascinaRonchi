import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PILLARS } from '../../content/pillars';
import { Icon } from '../../shared/icon/icon';
import { RevealDirective } from '../../shared/reveal.directive';

/** Four cards that lead to the main sections of the page. */
@Component({
  selector: 'app-pillars',
  imports: [RouterLink, Icon, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pillars.scss',
  template: `
    <div class="container section">
      <ul>
        @for (p of pillars; track p.sectionId) {
          <li appReveal>
            <a routerLink="/" [fragment]="p.sectionId">
              <app-icon [name]="p.icon" />
              <h2>{{ p.title }}</h2>
              <p>{{ p.text }}</p>
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class Pillars {
  protected readonly pillars = PILLARS;
}
