import type { Metadata } from 'next';
import { STORE_IDS } from '@repas/core';
import Link from 'next/link';
import type { Route } from 'next';
import { cx, glassClasses, PageHeader } from '@repas/ui';
import { Badge, Kpi, Later, Panel } from '@/components/bo-ui';
import { requireRole } from '@/lib/staff';

export const metadata: Metadata = { title: 'Contenu SEO' };
export const dynamic = 'force-dynamic';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const STATIC_PAGES = [
  ['/', 'Accueil'],
  ['/recettes', 'Catalogue'],
  ['/comparatif-prix-supermarches', 'Observatoire'],
  ['/menus/menu-semaine-60-euros-4-personnes', 'Menu'],
  ['/menus/menu-vegetarien-semaine-4-personnes', 'Menu'],
  ['/guide/batch-cooking', 'Guide'],
  ['/methodologie', 'Pilier'],
  ['/comment-ca-marche', 'Pilier'],
  ...STORE_IDS.map((id) => [`/enseignes/${id}`, 'Enseigne']),
] as const;

/** Contenu SEO (maquette BOSeo) : pages publiques et checklist GEO des recettes. */
export default async function SeoPage() {
  const { supabase } = await requireRole(['editeur']);
  const { data: recipes } = await supabase
    .from('recipes')
    .select(
      'id, slug, title, published, seo_title, seo_description, steps, updated_at, recipe_ingredients(product_id, pantry)',
    )
    .order('title');
  const rows = (recipes ?? []).map((r) => {
    const checks = [
      !r.seo_title || r.seo_title.length <= 60,
      !r.seo_description || r.seo_description.length <= 155,
      Array.isArray(r.steps) && r.steps.length >= 2,
      r.recipe_ingredients.every((i) => i.product_id || i.pantry),
      Boolean(r.published),
    ];
    return { ...r, score: checks.filter(Boolean).length, total: checks.length };
  });
  const toFix = rows.filter((r) => r.score < r.total);
  return (
    <>
      <PageHeader eyebrow="Pages publiques, référencement Google et moteurs IA" title="Contenu SEO" />
      <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          index={0}
          label="PAGES PUBLIQUES"
          value={STATIC_PAGES.length + rows.filter((r) => r.published).length}
          hint="dans le sitemap"
        />
        <Kpi index={1} label="RECETTES À CORRIGER" value={toFix.length} hint="critères de la checklist" />
        <Kpi index={2} label="PAGES VILLE" value={0} hint="sous le seuil de 30 relevés récents" />
        <Kpi index={3} label="CLICS GOOGLE · IA" value="—" hint="Search Console et PostHog au lot 13" />
      </dl>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className={cx(glassClasses, 'overflow-x-auto p-2')}>
          <table className="w-full min-w-[640px] text-[14px]">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                {['PAGE', 'TYPE', 'STATUT', 'SCORE', 'MIS À JOUR'].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATIC_PAGES.map(([path, type]) => (
                <tr key={path} className="border-line border-t">
                  <td className="px-3 py-2">
                    <a
                      href={`${SITE_URL}${path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink font-extrabold"
                    >
                      {path}
                    </a>
                  </td>
                  <td className="text-ink-muted px-3 py-2 font-bold">{type}</td>
                  <td className="px-3 py-2">
                    <Badge tone="ok">Publiée</Badge>
                  </td>
                  <td className="text-ink-muted px-3 py-2">—</td>
                  <td className="text-ink-muted px-3 py-2">chaque jour (ISR)</td>
                </tr>
              ))}
              {rows.map((r) => (
                <tr key={r.id} className="border-line border-t">
                  <td className="px-3 py-2">
                    <Link href={`/recettes/${r.id}` as Route} className="text-ink font-extrabold">
                      /recettes/{r.slug}
                    </Link>
                  </td>
                  <td className="text-ink-muted px-3 py-2 font-bold">Recette</td>
                  <td className="px-3 py-2">
                    {r.published ? <Badge tone="ok">Publiée</Badge> : <Badge tone="warn">Brouillon</Badge>}
                  </td>
                  <td className="px-3 py-2">
                    <Badge tone={r.score === r.total ? 'ok' : r.score >= r.total - 1 ? 'warn' : 'bad'}>
                      {r.score} / {r.total}
                    </Badge>
                  </td>
                  <td className="text-ink-muted px-3 py-2">
                    {new Date(r.updated_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 xl:sticky xl:top-8">
          <Panel title="Checklist GEO des recettes">
            <ul className="flex flex-col gap-1.5 text-[14px] font-bold">
              <li>Titre SEO de 60 caractères au plus</li>
              <li>Méta-description de 155 caractères au plus</li>
              <li>Au moins 2 étapes</li>
              <li>Tous les ingrédients reliés à un produit (coût complet)</li>
              <li>Recette publiée</li>
            </ul>
            <p className="text-ink-muted mt-3 text-[13px]">
              Réponse directe chiffrée, JSON-LD Recipe et liens internes sont générés automatiquement par le
              site.
            </p>
          </Panel>
          <Panel title="Fichiers pour les robots">
            <ul className="flex flex-col gap-1 text-[14px] font-bold">
              {['/sitemap.xml', '/llms.txt', '/robots.txt'].map((f) => (
                <li key={f}>
                  <a
                    href={`${SITE_URL}${f}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand"
                  >
                    {f}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-ink-muted mt-2 text-[13px]">
              Autorisés : Googlebot, Bingbot, GPTBot, PerplexityBot, ClaudeBot.
            </p>
          </Panel>
          <Later>Statut d’indexation par page : à brancher sur Search Console (lot 13).</Later>
        </div>
      </div>
    </>
  );
}
