import { STORE_IDS } from '@repas/core';
import { absoluteUrl } from '../site';

export interface SitemapEntry {
  path: string;
  /** Date ISO de dernière modification (pour les pages de prix : date du dernier relevé). */
  lastmod: string;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
}

/** Segments du sitemap (docs/06). */
export const SITEMAP_SEGMENTS = ['pages', 'recettes'] as const;

const BUILD_DATE = new Date().toISOString().slice(0, 10);

/** Pages éditoriales publiques existantes. Ajouter chaque nouvelle page publique ici. */
export const PUBLIC_PAGES: SitemapEntry[] = [
  { path: '/', lastmod: BUILD_DATE, changefreq: 'weekly', priority: 1 },
  { path: '/recettes', lastmod: BUILD_DATE, changefreq: 'weekly', priority: 0.9 },
  { path: '/comparatif-prix-supermarches', lastmod: BUILD_DATE, changefreq: 'weekly', priority: 0.9 },
  {
    path: '/menus/menu-semaine-60-euros-4-personnes',
    lastmod: BUILD_DATE,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/menus/menu-vegetarien-semaine-4-personnes',
    lastmod: BUILD_DATE,
    changefreq: 'weekly',
    priority: 0.7,
  },
  ...STORE_IDS.map((id) => ({
    path: `/enseignes/${id}`,
    lastmod: BUILD_DATE,
    changefreq: 'weekly' as const,
    priority: 0.7,
  })),
  { path: '/guide/batch-cooking', lastmod: BUILD_DATE, changefreq: 'monthly', priority: 0.6 },
  { path: '/comment-ca-marche', lastmod: BUILD_DATE, changefreq: 'monthly', priority: 0.6 },
  { path: '/methodologie', lastmod: BUILD_DATE, changefreq: 'monthly', priority: 0.6 },
  { path: '/mentions-legales', lastmod: BUILD_DATE, changefreq: 'yearly', priority: 0.2 },
  { path: '/confidentialite', lastmod: BUILD_DATE, changefreq: 'yearly', priority: 0.2 },
  { path: '/cgu', lastmod: BUILD_DATE, changefreq: 'yearly', priority: 0.2 },
];

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function urlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url><loc>${escapeXml(absoluteUrl(e.path))}</loc><lastmod>${e.lastmod}</lastmod>` +
        (e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '') +
        (e.priority !== undefined ? `<priority>${e.priority.toFixed(1)}</priority>` : '') +
        '</url>',
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function sitemapIndexXml(segments: readonly string[]): string {
  const items = segments
    .map(
      (s) =>
        `  <sitemap><loc>${escapeXml(absoluteUrl(`/sitemap/${s}.xml`))}</loc><lastmod>${BUILD_DATE}</lastmod></sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export const xmlResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
