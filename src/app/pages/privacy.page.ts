import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-privacy-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main" tabindex="-1">
      <h1 i18n="@@privacy.title">Privacy</h1>
    </main>
  `,
})
export class PrivacyPage {}
