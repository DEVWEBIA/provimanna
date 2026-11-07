import { absoluteUrl, SITE_NAME } from '../site';

type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue };

/** Injecte un bloc JSON-LD (Server Component). `<` est échappé pour éviter toute fermeture de balise. */
export function JsonLd({ data }: { data: { [key: string]: JsonLdValue } }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/icon.svg'),
});

export const webSiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  inLanguage: 'fr-FR',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl('/recettes')}?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

// Pas d'aggregateRating tant qu'il n'y a pas de vrais avis vérifiables (docs/06).
export const softwareApplicationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web, iOS, Android',
  url: absoluteUrl('/'),
  offers: [
    { '@type': 'Offer', price: '0', priceCurrency: 'EUR', name: 'Gratuit' },
    { '@type': 'Offer', price: '4.99', priceCurrency: 'EUR', name: 'Premium mensuel' },
    { '@type': 'Offer', price: '39.99', priceCurrency: 'EUR', name: 'Premium annuel' },
  ],
});

export const faqPageLd = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
});
