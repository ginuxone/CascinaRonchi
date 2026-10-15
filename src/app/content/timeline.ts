import { SITE_CONFIG } from '../core/site.config';
import { ImageSlug } from './images.generated';

export interface TimelineEntry {
  readonly id: string;
  /** Shown above the title: a year, or a period when the exact year is not known. */
  readonly when: string;
  readonly title: string;
  readonly text: string;
  readonly image: ImageSlug;
}

/**
 * The history of the farmhouse, oldest first. Only dates the family has confirmed appear as years;
 * the restoration and the goats have no year yet.
 */
export const TIMELINE: readonly TimelineEntry[] = [
  {
    id: 'seicento',
    when: $localize`:@@timeline.old.when:Fine del Seicento`,
    title: $localize`:@@timeline.old.title:Il nucleo più antico`,
    text: $localize`:@@timeline.old.text:La parte più antica della cascina risale alla fine del Seicento. Oggi è qui che dormono gli ospiti.`,
    image: 'cascina-facciata-pietra',
  },
  {
    id: '1760',
    when: '1760',
    title: $localize`:@@timeline.1760.title:Una casa per tutto l'anno`,
    text: $localize`:@@timeline.1760.text:Da questo anno ci vivono stabilmente dei contadini. Coltivano la vigna sui terrazzi, al sole dall'alba al tramonto. Un tempo qui si faceva anche il vino. Oggi non più.`,
    image: 'vigneti-sotto-la-neve',
  },
  {
    id: '1859',
    when: '1859',
    title: $localize`:@@timeline.1859.title:L'ultimo ampliamento`,
    text: $localize`:@@timeline.1859.text:Nel 1859 la cascina viene ampliata per l'ultima volta e prende la forma che vedi oggi.`,
    image: 'cascina-magnolia',
  },
  {
    id: 'restauro',
    when: $localize`:@@timeline.restoration.when:Negli ultimi anni`,
    title: $localize`:@@timeline.restoration.title:Il restauro`,
    text: $localize`:@@timeline.restoration.text:La cascina è stata restaurata da poco. Dentro si vedono ancora la pietra a vista e il vecchio camino.`,
    image: 'cortile-gerani',
  },
  {
    id: 'oggi',
    when: $localize`:@@timeline.today.when:Oggi`,
    title: $localize`:@@timeline.today.title:Le capre e l'accoglienza`,
    text: $localize`:@@timeline.today.text:Oggi qui vivono circa ${SITE_CONFIG.goats.count}:goats: capre. Facciamo i formaggi, cuciniamo e accogliamo chi dorme e chi mangia da noi.`,
    image: 'capre-al-pascolo',
  },
];
