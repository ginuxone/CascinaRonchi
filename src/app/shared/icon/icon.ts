import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'goat' | 'hoofprint' | 'wheat' | 'plate' | 'bed';

/** Decorative by default. Pass `label` when the icon carries meaning on its own. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
  styles: `
    :host {
      display: inline-flex;
      width: var(--icon-size, 1.5em);
      height: var(--icon-size, 1.5em);
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `,
  template: `<svg focusable="false"><use [attr.href]="'#icon-' + name()" /></svg>`,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly label = input<string>();
}
