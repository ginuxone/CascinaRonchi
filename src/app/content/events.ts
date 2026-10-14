export interface EventType {
  readonly id: string;
  readonly title: string;
  readonly text: string;
}

/** The occasions the farm hosts, in the order they appear in the grid. */
export const EVENT_TYPES: readonly EventType[] = [
  {
    id: 'battesimi',
    title: $localize`:@@event.baptism.title:Battesimi`,
    text: $localize`:@@event.baptism.text:Un pranzo di famiglia nel verde.`,
  },
  {
    id: 'comunioni',
    title: $localize`:@@event.communion.title:Comunioni`,
    text: $localize`:@@event.communion.text:Una festa semplice, dove i bambini stanno bene.`,
  },
  {
    id: 'cresime',
    title: $localize`:@@event.confirmation.title:Cresime`,
    text: $localize`:@@event.confirmation.text:Il pranzo dopo la cerimonia, tutti insieme.`,
  },
  {
    id: 'matrimoni',
    title: $localize`:@@event.wedding.title:Matrimoni`,
    text: $localize`:@@event.wedding.text:Un ricevimento raccolto, in campagna.`,
  },
  {
    id: 'compleanni',
    title: $localize`:@@event.birthday.title:Compleanni`,
    text: $localize`:@@event.birthday.text:Per grandi e piccoli.`,
  },
  {
    id: 'anniversari',
    title: $localize`:@@event.anniversary.title:Anniversari`,
    text: $localize`:@@event.anniversary.text:Una cena speciale, solo per voi due o con tutti gli amici.`,
  },
  {
    id: 'aziendali',
    title: $localize`:@@event.group.title:Pranzi aziendali e di gruppo`,
    text: $localize`:@@event.group.text:Per colleghi, amici e associazioni.`,
  },
];
