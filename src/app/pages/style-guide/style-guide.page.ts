import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GoatDivider } from '../../shared/goat-divider/goat-divider';
import { Icon, IconName } from '../../shared/icon/icon';
import { ResponsiveImage } from '../../shared/responsive-image/responsive-image';
import { RevealDirective } from '../../shared/reveal.directive';

interface Swatch {
  name: string;
  token: string;
}

/** Dev-only (see app.routes.ts). Not translated and not shipped to production. */
@Component({
  selector: 'app-style-guide-page',
  imports: [GoatDivider, Icon, ResponsiveImage, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './style-guide.page.scss',
  template: `
    <main id="main" class="container section">
      <h1>Style guide</h1>
      <p class="lead">Design tokens, fonts and icons. Development only.</p>

      <h2>Palette</h2>
      <ul class="swatches">
        @for (s of swatches; track s.token) {
          <li>
            <span class="chip" [style.background]="'var(' + s.token + ')'"></span>
            <code>{{ s.token }}</code>
          </li>
        }
      </ul>

      <h2>Typography</h2>
      <h1>Heading 1 — Fraunces 600</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <p>Body text in Inter 400. Capre, cucina di casa e ospitalità sulle colline bergamasche.</p>
      <p><strong>Inter 600</strong> · <span class="medium">Inter 500</span> · <a href="#">Link</a></p>
      <p class="lead">Lead paragraph in muted slate.</p>

      <h2>Contrast (WCAG AA)</h2>
      <ul class="contrast">
        <li class="c1">Text on cream — 13.8:1</li>
        <li class="c2">Muted on cream — 6.6:1</li>
        <li class="c3">Primary on cream — 7.0:1</li>
        <li class="c4">White on primary — 7.5:1</li>
        <li class="c5">Accent on cream — 6.2:1</li>
        <li class="c6">Accent on terracotta tint — 5.4:1</li>
      </ul>

      <h2>Icons</h2>
      <ul class="icons">
        @for (i of icons; track i) {
          <li><app-icon [name]="i" /> <code>{{ i }}</code></li>
        }
      </ul>

      <h2>Goat divider</h2>
      <app-goat-divider />

      <h2>Spacing and radii</h2>
      <ul class="spacing">
        @for (n of spaces; track n) {
          <li><span class="bar" [style.width]="'var(--space-' + n + ')'"></span> <code>--space-{{ n }}</code></li>
        }
      </ul>
      <div class="radii">
        <span class="r-sm">sm</span><span class="r-md">md</span><span class="r-lg">lg</span>
      </div>

      <h2>Images</h2>
      <app-img slug="cascina-prato-estate" sizes="(min-width: 75rem) 1100px, 100vw" [priority]="true" ratio="21 / 9" />
      <div class="gallery">
        <app-img slug="capre-al-pascolo" sizes="(min-width: 48rem) 33vw, 100vw" ratio="4 / 3" />
        <app-img slug="sala-ristorante-camino" sizes="(min-width: 48rem) 33vw, 100vw" ratio="4 / 3" />
        <app-img slug="camera-pietra-letto-ferro" sizes="(min-width: 48rem) 33vw, 100vw" ratio="4 / 3" />
      </div>

      <h2>Skeleton</h2>
      <div class="skeleton skeleton-demo" aria-hidden="true"></div>

      <h2>Reveal</h2>
      <p appReveal>This paragraph fades in on scroll (disabled with reduced motion).</p>
      <button type="button" class="focus-demo">Tab here to see the focus ring</button>
    </main>
  `,
})
export class StyleGuidePage {
  protected readonly swatches: Swatch[] = [
    'meadow-100',
    'meadow-500',
    'meadow-600',
    'meadow-700',
    'meadow-900',
    'cream-50',
    'cream-100',
    'cream-200',
    'terracotta-100',
    'terracotta-600',
    'terracotta-700',
    'slate-600',
    'slate-700',
    'slate-900',
  ].map((n) => ({ name: n, token: `--c-${n}` }));
  protected readonly icons: IconName[] = ['goat', 'hoofprint', 'wheat', 'plate', 'bed'];
  protected readonly spaces = [1, 2, 3, 4, 5, 6, 7, 8];
}
