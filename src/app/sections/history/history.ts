import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TIMELINE } from '../../content/timeline';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';
import { RevealDirective } from '../../shared/reveal.directive';

/** History: a timeline of the farmhouse, alternating image and text on desktop, one column on mobile. */
@Component({
  selector: 'app-history',
  imports: [ResponsiveImage, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './history.scss',
  template: `
    <section id="storia" class="section section--alt" aria-labelledby="history-title">
      <div class="container">
        <h2 id="history-title" i18n="@@section.history.title">La nostra storia</h2>
        <p class="lead" i18n="@@history.lead">
          Una cascina tipica sulle colline tra Pontida e Palazzago, con più di tre secoli di storia.
        </p>

        <ol class="timeline">
          @for (entry of timeline; track entry.id) {
            <li appReveal>
              <div class="timeline__text">
                <p class="timeline__when">{{ entry.when }}</p>
                <h3>{{ entry.title }}</h3>
                <p>{{ entry.text }}</p>
              </div>
              <app-img
                class="timeline__image"
                [slug]="entry.image"
                ratio="4 / 3"
                sizes="(min-width: 48rem) 40vw, 100vw"
              />
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class History {
  protected readonly timeline = TIMELINE;
}
