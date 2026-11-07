import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Les robots des moteurs génératifs (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) sont autorisés :
// c'est l'objectif GEO (docs/06). Décision révocable par le propriétaire.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/app/', '/api/', '/liste/', '/auth/', '/dev/'] }],
    sitemap: [`${SITE_URL}/sitemap.xml`],
    host: SITE_URL,
  };
}
