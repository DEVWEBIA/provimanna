import { getRequestConfig } from 'next-intl/server';

// fr-FR seul au départ (BE/CH/CA plus tard) : pas de segment de locale dans les URL pour l'instant.
export const DEFAULT_LOCALE = 'fr';

export default getRequestConfig(async () => ({
  locale: DEFAULT_LOCALE,
  timeZone: 'Europe/Paris',
  messages: (await import(`../../messages/${DEFAULT_LOCALE}.json`)).default,
}));
