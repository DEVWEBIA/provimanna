import { SITEMAP_SEGMENTS, sitemapIndexXml, xmlResponse } from '@/lib/seo/sitemap';

export const dynamic = 'force-static';

/** Index du sitemap segmenté : /sitemap/pages.xml (puis recettes, villes au lot 8). */
export function GET() {
  return xmlResponse(sitemapIndexXml(SITEMAP_SEGMENTS));
}
