import { IconName } from '../shared/icon/icon';

export interface Pillar {
  readonly sectionId: string;
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

/** The four things Cascina Ronchi offers, each linking to its section on the home page. */
export const PILLARS: readonly Pillar[] = [
  {
    sectionId: 'camere',
    icon: 'bed',
    title: $localize`:@@pillar.rooms.title:B&B`,
    text: $localize`:@@pillar.rooms.text:Tre camere nella parte più antica della cascina.`,
  },
  {
    sectionId: 'ristorante',
    icon: 'plate',
    title: $localize`:@@pillar.restaurant.title:Ristorante`,
    text: $localize`:@@pillar.restaurant.text:Cucina di casa, solo su prenotazione.`,
  },
  {
    sectionId: 'eventi',
    icon: 'wheat',
    title: $localize`:@@pillar.events.title:Eventi e cerimonie`,
    text: $localize`:@@pillar.events.text:Battesimi, comunioni, matrimoni e feste.`,
  },
  {
    sectionId: 'capre',
    icon: 'goat',
    title: $localize`:@@pillar.goats.title:Le nostre capre`,
    text: $localize`:@@pillar.goats.text:Una trentina di capre e i loro formaggi.`,
  },
];
