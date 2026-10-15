import { LOCALE_NAMES } from '../core/locale';
import { SiteLocale } from '../core/site.config';

export type ContactTypeId = 'stay' | 'table' | 'event' | 'products' | 'other';

export interface ContactType {
  readonly id: ContactTypeId;
  readonly label: string;
  /** First line of the message and, shortened, the email subject. */
  readonly intro: string;
  readonly subject: string;
  /** Label of the optional date field, or null when the type has none. */
  readonly dateLabel: string | null;
  /** Label of the optional guests field, or null when the type has none. */
  readonly guestsLabel: string | null;
}

export interface ContactValues {
  readonly type: ContactTypeId;
  readonly name: string;
  readonly phone: string;
  readonly date: string;
  readonly guests: string;
  readonly message: string;
}

/** What the visitor can ask about. The type picks the optional fields and the message template. */
export const CONTACT_TYPES: readonly ContactType[] = [
  {
    id: 'stay',
    label: $localize`:@@contact.type.stay:Soggiorno`,
    intro: $localize`:@@contact.intro.stay:Buongiorno, vorrei informazioni su un soggiorno.`,
    subject: $localize`:@@contact.subject.stay:Richiesta di soggiorno`,
    dateLabel: $localize`:@@contact.date.stay:Date del soggiorno`,
    guestsLabel: $localize`:@@contact.guests.stay:Numero di ospiti`,
  },
  {
    id: 'table',
    label: $localize`:@@contact.type.table:Tavolo al ristorante`,
    intro: $localize`:@@contact.intro.table:Buongiorno, vorrei prenotare un tavolo.`,
    subject: $localize`:@@contact.subject.table:Richiesta di tavolo`,
    dateLabel: $localize`:@@contact.date.table:Data, pranzo o cena`,
    guestsLabel: $localize`:@@contact.guests.table:Numero di persone`,
  },
  {
    id: 'event',
    label: $localize`:@@contact.type.event:Evento o cerimonia`,
    intro: $localize`:@@contact.intro.event:Buongiorno, vorrei un preventivo per un evento.`,
    subject: $localize`:@@contact.subject.event:Richiesta di preventivo per un evento`,
    dateLabel: $localize`:@@contact.date.event:Data dell'evento`,
    guestsLabel: $localize`:@@contact.guests.event:Numero di ospiti`,
  },
  {
    id: 'products',
    label: $localize`:@@contact.type.products:Prodotti`,
    intro: $localize`:@@contact.intro.products:Buongiorno, vorrei prenotare il ritiro di alcuni prodotti.`,
    subject: $localize`:@@contact.subject.products:Richiesta di ritiro prodotti`,
    dateLabel: $localize`:@@contact.date.products:Giorno di ritiro`,
    guestsLabel: null,
  },
  {
    id: 'other',
    label: $localize`:@@contact.type.other:Altro`,
    intro: $localize`:@@contact.intro.other:Buongiorno, vorrei avere delle informazioni.`,
    subject: $localize`:@@contact.subject.other:Richiesta di informazioni`,
    dateLabel: null,
    guestsLabel: null,
  },
];

export function contactType(id: ContactTypeId): ContactType {
  return CONTACT_TYPES.find((t) => t.id === id) ?? CONTACT_TYPES[0];
}

/** Builds the message text from the form, in the visitor's language, with the reply language on the last line. */
export function buildContactMessage(values: ContactValues, locale: SiteLocale): string {
  const type = contactType(values.type);
  const lines = [type.intro];
  lines.push($localize`:@@contact.line.name:Nome: ${values.name.trim()}:name:`);
  if (values.phone.trim()) {
    lines.push($localize`:@@contact.line.phone:Telefono: ${values.phone.trim()}:phone:`);
  }
  if (type.dateLabel && values.date.trim()) {
    lines.push(`${type.dateLabel}: ${values.date.trim()}`);
  }
  if (type.guestsLabel && values.guests.trim()) {
    lines.push(`${type.guestsLabel}: ${values.guests.trim()}`);
  }
  if (values.message.trim()) {
    lines.push('', values.message.trim());
  }
  lines.push('', $localize`:@@contact.line.language:Lingua per la risposta: ${LOCALE_NAMES[locale]}:language:`);
  return lines.join('\n');
}
