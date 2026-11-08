import { latest } from '@/lib/dates';
import { publicCatalogue } from '@/lib/recipes';
import { urlsetXml, xmlResponse } from '@/lib/seo/sitemap';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 86400;

/** Une entrée par recette publiée ; lastmod = date du dernier relevé de prix utilisé (docs/06). */
export async function GET() {
  const { recipes } = await publicCatalogue(createPublicClient());
  return xmlResponse(
    urlsetXml(
      recipes.map((r) => ({
        path: `/recettes/${r.slug}`,
        lastmod: (latest(r.totals.map((t) => t.latestObservedAt)) ?? new Date().toISOString()).slice(0, 10),
        changefreq: 'weekly' as const,
        priority: 0.8,
      })),
    ),
  );
}
