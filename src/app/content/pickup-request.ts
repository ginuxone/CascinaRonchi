import { whatsappUrl } from '../core/site.config';

/** Prefilled WhatsApp message to reserve a pick-up of farm products; the guest completes the blanks. */
export function pickupRequestMessage(): string {
  return $localize`:@@goats.pickup.message:Buongiorno, vorrei prenotare il ritiro di alcuni prodotti.
Prodotti:
Giorno di ritiro:`;
}

export function pickupRequestUrl(): string {
  return whatsappUrl(pickupRequestMessage());
}
