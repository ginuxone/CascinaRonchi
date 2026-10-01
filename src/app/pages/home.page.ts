import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SITE_CONFIG } from '../core/site.config';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main">
      <h1 i18n="@@home.title">Agriturismo Cascina Ronchi</h1>
      <p i18n="@@home.tagline">
        Capre, cucina di casa e ospitalità a {{ city }}, sulle colline bergamasche.
      </p>
    </main>
  `,
})
export class HomePage {
  protected readonly city = SITE_CONFIG.address.city;
}
