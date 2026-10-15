import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../shared/reveal.directive';

/**
 * Family: a short introduction. The cards with photo, name and role come later, once the family has
 * given the details and written consent for every person shown.
 */
@Component({
  selector: 'app-family',
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './family.scss',
  template: `
    <section id="famiglia" class="container section" aria-labelledby="family-title">
      <div class="family" appReveal>
        <h2 id="family-title" i18n="@@section.family.title">La famiglia</h2>
        <p class="lead" i18n="@@family.lead">
          Cascina Ronchi è una cascina di famiglia. Qui lavoriamo, cuciniamo e accogliamo ogni giorno.
        </p>
        <a
          class="button button--outline"
          routerLink="/"
          fragment="contatti"
          i18n="@@family.cta"
          >Scrivici</a
        >
      </div>
    </section>
  `,
})
export class Family {}
