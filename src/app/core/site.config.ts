export type SiteLocale = 'it' | 'en' | 'es' | 'de' | 'fr';

export const SITE_LOCALES: readonly SiteLocale[] = ['it', 'en', 'es', 'de', 'fr'];

const GOOGLE_MAPS_URL = 'https://maps.google.com/?cid=14718629685967255332';
const BOOKING_BASE_URL = 'https://www.booking.com/hotel/it/agriturismo-cascina-ronchi';

const BOOKING_LOCALE_SUFFIX: Record<SiteLocale, string> = {
  it: 'it',
  en: 'en-gb',
  es: 'es',
  de: 'de',
  fr: 'fr',
};

export const SITE_CONFIG = {
  name: 'Agriturismo Cascina Ronchi',
  url: 'https://cascinaronchi.it',
  address: {
    street: 'Via Secchia 57',
    postalCode: '24030',
    city: 'Palazzago',
    province: 'BG',
    region: 'Lombardia',
    country: 'Italia',
    countryCode: 'IT',
  },
  geo: { latitude: 45.7376865, longitude: 9.5495237 },
  googleMapsUrl: GOOGLE_MAPS_URL,
  email: 'info@cascinaronchi.it',
  phone: { display: '+39 035 549 574', tel: '+39035549574' },
  whatsapp: { display: '+39 349 645 3018', number: '393496453018' },
  hours: {
    restaurant: {
      monThu: { dinner: '19:30–22:00' },
      friSun: { lunch: '12:30–16:00', dinner: '19:30–23:00' },
    },
  },
  social: {
    facebook: 'https://www.facebook.com/CascinaRonchi/',
    instagram: 'https://www.instagram.com/cascina_ronchi/',
  },
  /** Review scores shown as plain text with a link to the source. Refresh `asOf` with the numbers. */
  ratings: {
    asOf: '2026-10-01',
    google: { score: '4.6★', count: 273, url: GOOGLE_MAPS_URL },
    /** The Booking.com link depends on the locale, see `bookingUrl()`. */
    booking: { score: '9.3', count: 47 },
    tripadvisor: {
      score: '4.8',
      count: 50,
      url: 'https://www.tripadvisor.it/Hotel_Review-g187830-d1804222-Reviews-or25-Cascina_Ronchi-Bergamo_Province_of_Bergamo_Lombardy.html',
    },
    agriturismoIt: { score: '4.9', count: 127, url: 'https://www.agriturismo.it/' },
  },
  vatNumber: '[[P.IVA]]',
  cin: '[[CIN]]',
} as const;

/** Clean Booking.com property URL with only the locale suffix (no session or tracking parameters). */
export function bookingUrl(locale: SiteLocale): string {
  return `${BOOKING_BASE_URL}.${BOOKING_LOCALE_SUFFIX[locale]}.html`;
}

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${SITE_CONFIG.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
