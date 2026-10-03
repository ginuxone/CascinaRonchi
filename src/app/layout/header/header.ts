import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { HOME_SECTION_ID, NAV_SECTIONS } from '../../core/sections';
import { ScrollSpy } from '../../core/scroll-spy.service';
import { Icon } from '../../shared/icon/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

/**
 * Sticky header: transparent at the top of the page, solid once scrolled or while the menu is open.
 * Below the `xl` breakpoint the nav collapses into a menu (focus trapped, Esc closes).
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon, LanguageSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './header.scss',
  host: { '(keydown)': 'onKeydown($event)', '(click)': 'onClick($event)' },
  template: `
    <div class="bar" [class.is-solid]="scrolled() || menuOpen()">
      <div class="bar__inner container">
        <a class="brand" routerLink="/" [fragment]="home" (click)="menuOpen.set(false)">
          <app-icon name="goat" />
          <span class="brand__name">Cascina Ronchi</span>
        </a>

        <button
          class="menu-button"
          type="button"
          aria-controls="site-menu"
          [attr.aria-expanded]="menuOpen()"
          (click)="toggleMenu()"
        >
          <app-icon [name]="menuOpen() ? 'close' : 'menu'" />
          <span i18n="@@nav.menu">Menu</span>
        </button>

        <div id="site-menu" class="menu" [class.is-open]="menuOpen()">
          <nav aria-label="Principale" i18n-aria-label="@@nav.label">
            <ul>
              @for (s of sections; track s.id) {
                <li>
                  <a
                    routerLink="/"
                    [fragment]="s.id"
                    [attr.aria-current]="spy.active() === s.id ? 'location' : null"
                    >{{ s.label }}</a
                  >
                </li>
              }
            </ul>
          </nav>
          <app-language-switcher />
        </div>
      </div>
    </div>
  `,
})
export class Header {
  protected readonly sections = NAV_SECTIONS;
  protected readonly home = HOME_SECTION_ID;
  protected readonly spy = inject(ScrollSpy);
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      // The menu is always expanded from `xl` up (keep in sync with `up(xl)` in _mixins.scss).
      const wide = window.matchMedia('(min-width: 80rem)');
      const onWide = () => wide.matches && this.menuOpen.set(false);
      wide.addEventListener('change', onWide);

      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        wide.removeEventListener('change', onWide);
      });
    });
  }

  protected toggleMenu(): void {
    const open = !this.menuOpen();
    this.menuOpen.set(open);
    if (open) {
      afterNextRender(() => this.host.querySelector<HTMLElement>('.menu a')?.focus(), { injector: this.injector });
    }
  }

  /** Following a link inside the menu closes it. */
  protected onClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.menu a')) {
      this.menuOpen.set(false);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.menuOpen()) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.menuOpen.set(false);
      this.host.querySelector<HTMLElement>('.menu-button')?.focus();
    } else if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const items = Array.from(this.host.querySelectorAll<HTMLElement>('a[href], button')).filter(
      (el) => el.offsetParent !== null,
    );
    const first = items[0];
    const last = items[items.length - 1];
    const active = this.host.ownerDocument.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
