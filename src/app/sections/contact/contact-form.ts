import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  buildContactMessage,
  CONTACT_TYPES,
  contactType,
  ContactTypeId,
} from '../../content/contact-request';
import { CURRENT_LOCALE } from '../../core/locale';
import { SITE_CONFIG, whatsappUrl } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';

type Status = 'whatsapp' | 'email' | null;

const MAX_MESSAGE_LENGTH = 800;

/**
 * The contact form: it only builds a message and hands it to the visitor's own WhatsApp or email app
 * (ADR-06). Nothing is sent by the site, so the success state says the message is ready, not sent.
 * Loaded lazily by the contact section, because the forms module is a large part of the bundle.
 */
@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contact-form.scss',
  template: `
    <form class="form" [formGroup]="form" novalidate>
      <div class="field">
        <label for="contact-type" i18n="@@contact.field.type">Cosa ti serve?</label>
        <select id="contact-type" formControlName="type">
          @for (t of types; track t.id) {
            <option [value]="t.id">{{ t.label }}</option>
          }
        </select>
      </div>

      <div class="field">
        <label for="contact-name" i18n="@@contact.field.name">Il tuo nome</label>
        <input
          id="contact-name"
          type="text"
          autocomplete="name"
          formControlName="name"
          [attr.aria-invalid]="invalid('name')"
          [attr.aria-describedby]="invalid('name') ? 'contact-name-error' : null"
        />
        @if (invalid('name')) {
          <p id="contact-name-error" class="error" i18n="@@contact.error.name">Scrivi il tuo nome.</p>
        }
      </div>

      <div class="field">
        <label for="contact-phone" i18n="@@contact.field.phone">Telefono (se vuoi)</label>
        <input
          id="contact-phone"
          type="tel"
          autocomplete="tel"
          formControlName="phone"
          [attr.aria-invalid]="invalid('phone')"
          [attr.aria-describedby]="invalid('phone') ? 'contact-phone-error' : null"
        />
        @if (invalid('phone')) {
          <p id="contact-phone-error" class="error" i18n="@@contact.error.phone">
            Scrivi un numero di telefono valido.
          </p>
        }
      </div>

      @if (selected().dateLabel; as dateLabel) {
        <div class="field">
          <label for="contact-date">{{ dateLabel }}</label>
          <input id="contact-date" type="text" formControlName="date" />
        </div>
      }

      @if (selected().guestsLabel; as guestsLabel) {
        <div class="field">
          <label for="contact-guests">{{ guestsLabel }}</label>
          <input
            id="contact-guests"
            type="text"
            inputmode="numeric"
            formControlName="guests"
            [attr.aria-invalid]="invalid('guests')"
            [attr.aria-describedby]="invalid('guests') ? 'contact-guests-error' : null"
          />
          @if (invalid('guests')) {
            <p id="contact-guests-error" class="error" i18n="@@contact.error.guests">
              Scrivi un numero, per esempio 4.
            </p>
          }
        </div>
      }

      <div class="field">
        <label for="contact-message" i18n="@@contact.field.message">Messaggio</label>
        <textarea
          id="contact-message"
          rows="4"
          formControlName="message"
          [attr.aria-invalid]="invalid('message')"
          [attr.aria-describedby]="invalid('message') ? 'contact-message-error' : null"
        ></textarea>
        @if (form.controls.message.hasError('required') && invalid('message')) {
          <p id="contact-message-error" class="error" i18n="@@contact.error.messageRequired">
            Scrivi un breve messaggio.
          </p>
        } @else if (invalid('message')) {
          <p id="contact-message-error" class="error" i18n="@@contact.error.messageLong">
            Il messaggio è troppo lungo.
          </p>
        }
      </div>

      <div class="actions">
        <button class="button button--primary" type="button" data-cta="contact-whatsapp" (click)="sendWhatsapp()">
          <app-icon name="whatsapp" />
          <span i18n="@@contact.action.whatsapp">Scrivi su WhatsApp</span>
        </button>
        <button class="button button--outline" type="button" data-cta="contact-email" (click)="sendEmail()">
          <span i18n="@@contact.action.email">Invia email</span>
        </button>
      </div>

      <p class="status" role="status">
        @switch (status()) {
          @case ('whatsapp') {
            <span i18n="@@contact.status.whatsapp">
              Messaggio pronto in WhatsApp. Controlla il testo e premi invio.
            </span>
          }
          @case ('email') {
            <span i18n="@@contact.status.email">
              Messaggio pronto nella tua email. Controlla il testo e premi invio.
            </span>
          }
        }
      </p>

      <div class="copy">
        <p>
          <span i18n="@@contact.copy.hint">Non si apre l'email? Copia l'indirizzo e scrivici da lì:</span>
          <strong>{{ site.email }}</strong>
        </p>
        <button class="button button--outline" type="button" (click)="copyEmail()">
          @if (copied()) {
            <span i18n="@@contact.copy.done">Indirizzo copiato</span>
          } @else {
            <span i18n="@@contact.copy.action">Copia indirizzo</span>
          }
        </button>
        <span class="visually-hidden" role="status">
          @if (copied()) {
            <ng-container i18n="@@contact.copy.announce">Indirizzo email copiato.</ng-container>
          }
        </span>
      </div>
    </form>
  `,
})
export class ContactForm {
  protected readonly site = SITE_CONFIG;
  protected readonly types = CONTACT_TYPES;
  protected readonly status = signal<Status>(null);
  protected readonly copied = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly locale = inject(CURRENT_LOCALE);
  private readonly injector = inject(Injector);

  protected readonly form = inject(NonNullableFormBuilder).group({
    type: 'stay' as ContactTypeId,
    name: ['', Validators.required],
    phone: ['', Validators.pattern(/^[+\d\s().-]{6,20}$/)],
    date: '',
    guests: ['', Validators.pattern(/^[1-9]\d{0,2}$/)],
    message: ['', Validators.maxLength(MAX_MESSAGE_LENGTH)],
  });

  private readonly type = toSignal(this.form.controls.type.valueChanges, { initialValue: 'stay' });
  protected readonly selected = computed(() => contactType(this.type()));

  constructor() {
    // "Altro" has no other fields, so the message itself is required.
    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((type) => {
      const message = this.form.controls.message;
      message.setValidators(
        type === 'other'
          ? [Validators.required, Validators.maxLength(MAX_MESSAGE_LENGTH)]
          : [Validators.maxLength(MAX_MESSAGE_LENGTH)],
      );
      message.updateValueAndValidity();
    });
  }

  protected invalid(name: 'name' | 'phone' | 'guests' | 'message'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected sendWhatsapp(): void {
    if (!this.validate()) {
      return;
    }
    this.document.defaultView?.open(whatsappUrl(this.message()), '_blank', 'noopener');
    this.status.set('whatsapp');
  }

  protected sendEmail(): void {
    if (!this.validate()) {
      return;
    }
    const subject = encodeURIComponent(this.selected().subject);
    const body = encodeURIComponent(this.message());
    this.document.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
    this.status.set('email');
  }

  protected async copyEmail(): Promise<void> {
    try {
      await this.document.defaultView?.navigator.clipboard.writeText(SITE_CONFIG.email);
      this.copied.set(true);
    } catch {
      // Clipboard blocked: the address is on screen and in the links, so nothing else to do.
      this.copied.set(false);
    }
  }

  private message(): string {
    return buildContactMessage(this.form.getRawValue(), this.locale);
  }

  /** Marks every field as touched so the errors show, and moves focus to the first invalid one. */
  private validate(): boolean {
    this.status.set(null);
    if (this.form.valid) {
      return true;
    }
    this.form.markAllAsTouched();
    // The errors render on the next change detection; focus the first invalid field after that.
    afterNextRender(() => this.host.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), {
      injector: this.injector,
    });
    return false;
  }
}
