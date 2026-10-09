import { whatsappUrl } from '../core/site.config';

/** Prefilled WhatsApp message for a restaurant table request; the guest completes the blanks. */
export function tableRequestMessage(): string {
  return $localize`:@@restaurant.whatsapp.message:Buongiorno, vorrei prenotare un tavolo.
Data:
Pranzo o cena:
Numero di persone:
Intolleranze o esigenze alimentari:`;
}

export function tableRequestUrl(): string {
  return whatsappUrl(tableRequestMessage());
}
