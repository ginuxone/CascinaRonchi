import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SplashService } from './core/splash.service';
import { IconSprite } from './shared/icon/icon-sprite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IconSprite],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-icon-sprite />
    <router-outlet />
  `,
})
export class App {
  constructor() {
    const splash = inject(SplashService);
    afterNextRender(() => splash.dismissWhenReady());
  }
}
