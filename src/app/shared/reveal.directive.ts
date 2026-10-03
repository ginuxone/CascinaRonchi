import { afterNextRender, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

/**
 * Fades and slides the element in when it scrolls into view.
 * Content stays visible on the server and without JS: the hidden state is only
 * applied in the browser, and never to elements already on screen.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements OnDestroy {
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const onScreen = this.el.getBoundingClientRect().top < window.innerHeight;
      if (reduceMotion || onScreen || !('IntersectionObserver' in window)) {
        return;
      }

      this.el.classList.add('reveal');
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.el.classList.add('is-revealed');
            this.observer?.disconnect();
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      this.observer.observe(this.el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
