import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
export class App {}
