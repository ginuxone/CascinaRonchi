import { SITE_CONFIG, whatsappUrl } from '../core/site.config';

/** Prefilled quote request; the guest completes the blanks. */
export function eventRequestMessage(): string {
  return $localize`:@@event.request.message:Buongiorno, vorrei un preventivo per un evento.
Tipo di evento:
Data:
Numero di ospiti:`;
}

export function eventRequestWhatsappUrl(): string {
  return whatsappUrl(eventRequestMessage());
}

export function eventRequestMailtoUrl(): string {
  const subject = $localize`:@@event.request.subject:Richiesta di preventivo per un evento`;
  return `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(eventRequestMessage())}`;
}
