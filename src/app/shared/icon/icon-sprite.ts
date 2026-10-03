import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Renders the SVG symbols once; `<app-icon>` references them with `<use>`. */
@Component({
  selector: 'app-icon-sprite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: ':host { position: absolute; width: 0; height: 0; overflow: hidden; }',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs>
        <symbol id="icon-goat" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 15C11 12 10 6 15 3M31 15c6-3 7-9 2-12" />
            <path d="M15.5 19 4 16l5 8 7-1M32.5 19 44 16l-5 8-7-1" />
            <path d="M16 16q8-4 16 0l-2 16q-2 6-6 6t-6-6z" />
            <path d="M22 40l2 5 2-5" />
          </g>
          <circle cx="20" cy="23" r="1.6" fill="currentColor" />
          <circle cx="28" cy="23" r="1.6" fill="currentColor" />
        </symbol>
        <symbol id="icon-hoofprint" viewBox="0 0 48 48">
          <path
            fill="currentColor"
            d="M21 6C13 8 9 20 11 36c.4 3 3 4 6 3l4-1Zm6 0c8 2 12 14 10 30-.4 3-3 4-6 3l-4-1Z"
          />
        </symbol>
        <symbol id="icon-wheat" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M24 46V16" />
            <path d="M24 14c-4-2-5-6-4-10 4 2 5 6 4 10Zm0 0c4-2 5-6 4-10-4 2-5 6-4 10Z" />
            <path d="M24 24c-5-1-8-4-8-9 5 1 8 4 8 9Zm0 0c5-1 8-4 8-9-5 1-8 4-8 9Z" />
            <path d="M24 34c-5-1-8-4-8-9 5 1 8 4 8 9Zm0 0c5-1 8-4 8-9-5 1-8 4-8 9Z" />
          </g>
        </symbol>
        <symbol id="icon-plate" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="24" cy="24" r="11" />
            <circle cx="24" cy="24" r="6.5" />
            <path d="M6 6v14c0 2 1 3 3 3v19M9 6v10M12 6v14c0 2-1 3-3 3" />
            <path d="M42 42V6c-4 2-5 8-5 14 0 2 1 3 3 3" />
          </g>
        </symbol>
        <symbol id="icon-bed" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 38V12M5 31h38v7M43 31v-7a5 5 0 0 0-5-5H21v12" />
            <rect x="9" y="22" width="9" height="6" rx="3" />
          </g>
        </symbol>
      </defs>
    </svg>
  `,
})
export class IconSprite {}
