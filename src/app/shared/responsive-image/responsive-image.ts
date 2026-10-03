import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { IMAGE_ALTS, IMAGES, ImageSlug, JPEG_MAX_WIDTH } from '../../content/images.generated';

type Format = 'avif' | 'webp' | 'jpg';

/**
 * Renders a catalogued image (see assets-src/images/catalog.json) as `<picture>` with AVIF, WebP and
 * JPEG sources, a blurred placeholder behind it and a fade-in once loaded.
 *
 * `priority` is for the LCP image only: eager loading, `fetchpriority="high"` and a `<link rel="preload">`.
 * `ratio` crops to a fixed aspect ratio (e.g. "16 / 9") around the catalog focal point.
 * `decorative` renders an empty alt for images that repeat nearby text.
 *
 * URLs are absolute (`/img/…`): one shared copy at the site root, see scripts/prune-locale-assets.mjs.
 */
@Component({
  selector: 'app-img',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      background-color: var(--color-surface-alt, transparent);
      background-position: center;
      background-size: cover;
    }

    picture,
    img {
      display: block;
      width: 100%;
    }

    img {
      height: 100%;
      object-fit: cover;
      transition: opacity var(--duration-reveal) var(--ease-out);
    }

    img.is-pending {
      opacity: 0;
    }
  `,
  template: `
    <picture>
      <source type="image/avif" [attr.srcset]="srcset('avif')" [attr.sizes]="sizes()" />
      <source type="image/webp" [attr.srcset]="srcset('webp')" [attr.sizes]="sizes()" />
      <img
        #img
        [src]="fallbackSrc()"
        [attr.srcset]="srcset('jpg')"
        [attr.sizes]="sizes()"
        [attr.width]="entry().width"
        [attr.height]="entry().height"
        [alt]="alt()"
        [attr.loading]="priority() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null"
        decoding="async"
        [class.is-pending]="pending()"
        [style.object-position]="objectPosition()"
        (load)="pending.set(false)"
        (error)="pending.set(false)"
      />
    </picture>
  `,
  host: {
    '[style.aspect-ratio]': 'aspectRatio()',
    '[style.background-image]': 'placeholder()',
  },
})
export class ResponsiveImage implements OnInit {
  readonly slug = input.required<ImageSlug>();
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  readonly sizes = input.required<string>();
  readonly priority = input(false);
  readonly ratio = input<string>();
  readonly decorative = input(false);

  private readonly document = inject(DOCUMENT);
  private readonly img = viewChild.required<ElementRef<HTMLImageElement>>('img');

  protected readonly entry = computed(() => IMAGES[this.slug()]);
  protected readonly alt = computed(() => (this.decorative() ? '' : IMAGE_ALTS[this.slug()]));
  protected readonly aspectRatio = computed(() => {
    const { width, height } = this.entry();
    return this.ratio() ?? `${width} / ${height}`;
  });
  protected readonly placeholder = computed(() => `url(${this.entry().lqip})`);
  protected readonly objectPosition = computed(() => {
    const { x, y } = this.entry().focal;
    return `${x * 100}% ${y * 100}%`;
  });
  protected readonly fallbackSrc = computed(() => {
    const widths = this.formatWidths('jpg');
    return this.url(widths[widths.length - 1], 'jpg');
  });

  /** The fade-in only starts in the browser, so the prerendered image is never hidden without JS. */
  protected readonly pending = signal(false);

  constructor() {
    afterNextRender(() => {
      // Never hide the LCP image: Chrome ignores opacity:0 elements as LCP candidates.
      if (!this.priority() && !this.img().nativeElement.complete) {
        this.pending.set(true);
      }
    });
  }

  ngOnInit(): void {
    if (this.priority()) {
      this.preload();
    }
  }

  protected srcset(format: Format): string {
    return this.formatWidths(format)
      .map((w) => `${this.url(w, format)} ${w}w`)
      .join(', ');
  }

  private formatWidths(format: Format): readonly number[] {
    const { widths } = this.entry();
    if (format !== 'jpg') {
      return widths;
    }
    const capped = widths.filter((w) => w <= JPEG_MAX_WIDTH);
    return capped.length ? capped : [widths[0]];
  }

  private url(width: number, format: Format): string {
    return `/img/${this.slug()}-${width}.${this.entry().hash}.${format}`;
  }

  private preload(): void {
    const id = `preload-${this.slug()}`;
    if (this.document.getElementById(id)) {
      return;
    }
    const link = this.document.createElement('link');
    link.id = id;
    link.setAttribute('rel', 'preload');
    link.setAttribute('as', 'image');
    link.setAttribute('type', 'image/avif');
    link.setAttribute('imagesrcset', this.srcset('avif'));
    link.setAttribute('imagesizes', this.sizes());
    link.setAttribute('fetchpriority', 'high');
    this.document.head.appendChild(link);
  }
}
