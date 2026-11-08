import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { formatEuro, zonedDate, STORE_COUNT } from '@repas/core';
import { animDelay, cx, Reveal } from '@repas/ui';
import { DemoNotice } from '@/components/plan/demo-notice';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Faq } from '@/components/site/faq';
import { SitePage } from '@/components/site/site-page';
import { latest, longDate } from '@/lib/dates';
import { MONTHS, publicCatalogue, recipeTags } from '@/lib/recipes';
import { breadcrumbLd, faqPageLd, JsonLd } from '@/lib/seo/json-ld';
import { href, ROUTES } from '@/lib/site';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 86400;

const FILTERS = {
  saison: { label: 'De saison', title: 'Recettes de saison' },
  vege: { label: 'Végétariennes', title: 'Recettes végétariennes pas chères' },
  rapide: { label: 'Moins de 30 min', title: 'Recettes de moins de 30 minutes' },
  enfants: { label: 'Pour les enfants', title: 'Recettes pour les enfants' },
  batch: { label: 'Batch cooking', title: 'Recettes pour le batch cooking' },
  eco: { label: 'Moins de 1 € la part', title: 'Recettes à moins de 1 € la part' },
} as const;
type FilterId = keyof typeof FILTERS;
const PAGE_SIZE = 24;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const parse = (sp: Record<string, string | string[] | undefined>) => {
  const f = one(sp.filtre);
  const filter = f && f in FILTERS ? (f as FilterId) : null;
  const sort = one(sp.tri) === 'temps' ? 'temps' : 'prix';
  const page = Math.max(1, Number.parseInt(one(sp.page) ?? '1', 10) || 1);
  const q = (one(sp.q) ?? '').trim().slice(0, 60);
  return { filter, sort, page, q } as const;
};
const query = (p: { filter: FilterId | null; sort: string; page: number; q?: string }) => {
  const q = new URLSearchParams();
  if (p.q) q.set('q', p.q);
  if (p.filter) q.set('filtre', p.filter);
  if (p.sort !== 'prix') q.set('tri', p.sort);
  if (p.page > 1) q.set('page', String(p.page));
  const s = q.toString();
  return `${ROUTES.recettes}${s ? `?${s}` : ''}`;
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const p = parse(await searchParams);
  const title = p.filter ? FILTERS[p.filter].title : 'Recettes pas chères, prix compris';
  return {
    title,
    description: `Recettes de saison avec leur coût par part dans ${STORE_COUNT} enseignes (Lidl, Aldi, E.Leclerc, Super U, Carrefour, Auchan…), prix datés.`,
    // Filtres indexables ; le tri et la pagination pointent vers la version canonique du filtre.
    alternates: { canonical: query({ filter: p.filter, sort: 'prix', page: 1 }) },
  };
}

export default async function RecettesPage({ searchParams }: { searchParams: SearchParams }) {
  const p = parse(await searchParams);
  const now = new Date();
  const month = zonedDate(now).iso.slice(5, 7);
  const m = Number(month);
  const { recipes, observations } = await publicCatalogue(createPublicClient(), now);
  const matches = (id: FilterId, r: (typeof recipes)[number]) =>
    id === 'saison'
      ? r.seasonMonths.length < 12 && r.seasonMonths.includes(m)
      : id === 'vege'
        ? r.diets.includes('vegetarien')
        : id === 'rapide'
          ? r.minutes <= 30
          : id === 'enfants'
            ? r.tags.includes('enfants')
            : id === 'batch'
              ? r.tags.includes('batch')
              : r.perServing < 100;
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  const terms = norm(p.q).split(/\s+/).filter(Boolean);
  const list = recipes
    .filter((r) => !p.filter || matches(p.filter, r))
    .filter((r) => terms.every((t) => norm(r.title).includes(t)))
    .sort((a, b) => (p.sort === 'temps' ? a.minutes - b.minutes : a.perServing - b.perServing));
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const shown = list.slice((p.page - 1) * PAGE_SIZE, p.page * PAGE_SIZE);
  const under1 = recipes.filter((r) => r.perServing < 100).length;
  const cheapestRecipe = [...recipes].sort((a, b) => a.perServing - b.perServing)[0];
  const pricesAt = latest(recipes.map((r) => r.cheapest.latestObservedAt));
  const demo = observations.some((o) => o.source === 'manual');
  const faq = [
    {
      q: 'Quelle est la recette la moins chère cette semaine ?',
      a: cheapestRecipe
        ? `${cheapestRecipe.title}, à ${formatEuro(cheapestRecipe.perServing)} la part pour 4 personnes, dans l’enseigne la moins chère.`
        : 'Le catalogue est en cours de mise à jour.',
    },
    {
      q: 'Comment est calculé le prix par part ?',
      a: 'Total des ingrédients au prix médian relevé dans l’enseigne, divisé par le nombre de parts. Les produits de placard sont comptés au prorata.',
    },
    {
      q: 'Les prix sont-ils à jour ?',
      a: `Oui : chaque prix est la médiane des relevés de moins de 7 jours (Open Prices et tickets de la communauté). Dernier relevé : ${pricesAt ? longDate(pricesAt) : '—'}.`,
    },
  ];

  return (
    <SitePage crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Recettes' }]}>
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: 'Recettes', path: ROUTES.recettes },
        ])}
      />
      <JsonLd data={faqPageLd(faq)} />

      <section className="max-w-[760px]">
        <h1 className="anim-rise font-display text-[clamp(40px,5.4vw,64px)] font-extrabold leading-[1.02] tracking-[-1.8px]">
          {p.filter ? FILTERS[p.filter].title : 'Recettes pas chères, prix compris.'}
        </h1>
        <p className="anim-rise text-ink-muted mt-5 text-[19px] leading-[29px]" style={animDelay(120)}>
          <strong className="text-ink">
            {recipes.length} recettes, dont {under1} à moins de 1 € la part.
          </strong>{' '}
          Chaque recette affiche son coût dans {STORE_COUNT} enseignes, mis à jour chaque semaine.
        </p>
        {pricesAt ? (
          <p className="anim-rise text-ink-muted mt-3 text-[14px] font-bold" style={animDelay(200)}>
            Prix relevés le {longDate(pricesAt)} ·{' '}
            <Link href={href(ROUTES.methodologie)} className="text-brand">
              méthodologie
            </Link>
          </p>
        ) : null}
      </section>
      {demo ? <DemoNotice /> : null}

      <section aria-label="Catégories" className="-mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(FILTERS) as FilterId[]).map((id, i) => {
          const on = p.filter === id;
          const count = recipes.filter((r) => matches(id, r)).length;
          return (
            <Link
              key={id}
              href={(on ? ROUTES.recettes : query({ filter: id, sort: p.sort, page: 1 })) as Route}
              aria-current={on ? 'page' : undefined}
              className={cx(
                'anim-rise rounded-[20px] border px-4 py-3.5 no-underline transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transition-none',
                on
                  ? 'border-brand bg-brand text-brand-on'
                  : 'border-line text-ink hover:border-brand bg-white/70 backdrop-blur',
              )}
              style={animDelay(240 + i * 50)}
            >
              <span className="block text-[15px] font-black">{FILTERS[id].label}</span>
              <span
                className={cx('text-[13px] font-bold', on ? 'text-site-on-brand-muted' : 'text-ink-muted')}
              >
                {count} recettes{id === 'saison' ? ` · ${MONTHS[m - 1]}` : ''}
              </span>
            </Link>
          );
        })}
      </section>

      <section aria-labelledby="liste-titre" className="-mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="liste-titre" className="text-ink-muted text-[15px] font-black">
            {list.length} recettes affichées{p.q ? ` pour « ${p.q} »` : ''}
          </h2>
          <p className="flex items-center gap-2 text-[14px] font-bold">
            <span className="text-ink-muted">Trier par</span>
            {(['prix', 'temps'] as const).map((t) => (
              <Link
                key={t}
                href={query({ filter: p.filter, sort: t, page: 1, q: p.q }) as Route}
                aria-current={p.sort === t ? 'true' : undefined}
                className={cx(
                  'rounded-pill min-h-[40px] border px-3.5 py-2 no-underline',
                  p.sort === t ? 'border-ink bg-ink text-white' : 'border-line text-ink bg-white',
                )}
              >
                {t === 'prix' ? 'Prix par part' : 'Temps de préparation'}
              </Link>
            ))}
          </p>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((r, i) => (
            <Reveal as="li" key={r.id} delay={(i % 4) * 80}>
              <RecipeCard
                href={`/recettes/${r.slug}`}
                title={r.title}
                illustration={r.illustration}
                minutes={r.minutes}
                perServingCents={r.perServing}
                tags={recipeTags(r, m)}
              />
            </Reveal>
          ))}
        </ul>
        {pages > 1 ? (
          <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={query({ filter: p.filter, sort: p.sort, page: n, q: p.q }) as Route}
                aria-current={n === p.page ? 'page' : undefined}
                className={cx(
                  'rounded-pill grid h-11 w-11 place-items-center font-black no-underline',
                  n === p.page ? 'bg-ink text-white' : 'border-line text-ink border bg-white',
                )}
              >
                {n}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>

      <Reveal>
        <Faq items={faq} eyebrow="Questions fréquentes" className="" />
      </Reveal>
      <Reveal className="border-line flex flex-wrap items-center justify-between gap-5 rounded-[28px] border bg-white/70 p-7 backdrop-blur">
        <p className="font-display text-[26px] font-extrabold tracking-[-0.6px]">
          Ces recettes, assemblées en une semaine pour ton foyer.
        </p>
        <Link
          href={href(ROUTES.commencer)}
          className="rounded-pill bg-brand text-brand-on inline-flex min-h-14 items-center gap-3 px-7 text-[17px] font-black no-underline shadow-[0_10px_30px_rgba(107,56,104,0.30)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
        >
          Créer mon plan gratuit <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </SitePage>
  );
}
