import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Icon } from '../icon/icon';

@Component({
  selector: 'app-goat-divider',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      padding-block: var(--space-6);
      color: var(--color-accent);
    }

    .line {
      flex: 0 1 8rem;
      height: 2px;
      background: currentcolor;
      opacity: 0.35;
    }

    .prints {
      --icon-size: 1rem;
      display: inline-flex;
      gap: var(--space-2);
      opacity: 0.6;
    }

    .goat {
      --icon-size: 2.5rem;
    }
  `,
  template: `
    <span class="line"></span>
    <span class="prints"><app-icon name="hoofprint" /></span>
    <app-icon class="goat" name="goat" />
    <span class="prints"><app-icon name="hoofprint" /></span>
    <span class="line"></span>
  `,
})
export class GoatDivider {}
