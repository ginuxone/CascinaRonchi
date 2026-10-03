export interface NavSection {
  readonly id: string;
  readonly label: string;
}

/** Page sections in scroll order. The header nav, the scroll-spy and the footer links read this list. */
export const NAV_SECTIONS: readonly NavSection[] = [
  { id: 'ristorante', label: $localize`:@@nav.restaurant:Ristorante` },
  { id: 'eventi', label: $localize`:@@nav.events:Eventi` },
  { id: 'camere', label: $localize`:@@nav.rooms:Camere` },
  { id: 'capre', label: $localize`:@@nav.goats:Capre` },
  { id: 'storia', label: $localize`:@@nav.history:Storia` },
  { id: 'famiglia', label: $localize`:@@nav.family:Famiglia` },
  { id: 'contatti', label: $localize`:@@nav.contact:Contatti` },
];

/** Id of the hero section, which the logo (Home) points to. */
export const HOME_SECTION_ID = 'home';
