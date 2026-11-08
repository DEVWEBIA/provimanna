import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatEuro, percentVsAverage, productPriceGaps, type StoreId } from '@repas/core';
import { cx, Reveal, StoreChip } from '@repas/ui';
import { CtaTicket, DemoBadge, H2, Panel, SeoHero } from '@/components/seo/blocks';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Faq } from '@/components/site/faq';
import { SitePage } from '@/components/site/site-page';
import { longDate } from '@/lib/dates';
import { MONTH_YEAR, referenceBasket, REFERENCE_SERVINGS, storeName } from '@/lib/observatory';
import { loadObservations, planLines, STORES } from '@/lib/plan';
import { publicCatalogue, recipeTags } from '@/lib/recipes';
import { breadcrumbLd, faqPageLd, JsonLd } from '@/lib/seo/json-ld';
import { href, ROUTES } from '@/lib/site';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => STORES.map((id) => ({ id }));

type Params = Promise<{ id: string }>;
const NAMES: Record<StoreId, string> = {
  lidl: 'Lidl',
  aldi: 'Aldi',
  leclerc: 'E.Leclerc',
  intermarche: 'Intermarché',
  carrefour: 'Carrefour',
  auchan: 'Auchan',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const n = NAMES[id as StoreId];
  if (!n) return {};
  return {
    title: `${n} est-il vraiment le moins cher ? Prix comparés`,
    description: `Panier type de 14 repas pour 4 personnes chez ${n} face aux 5 autres enseignes : classement, écart à la moyenne, rayon par rayon.`,
    alternates: { canonical: `/enseignes/${id}` },
  };
}

export default async function EnseignePage({ params }: { params: Params }) {
  const { id } = await params;
  if (!(STORES as string[]).includes(id)) notFound();
  const store = id as StoreId;
  const b = await referenceBasket();
  if (!b) throw new Error('Panier type indisponible');
  const supabase = createPublicClient();
  const now = new Date();
  const [observations, { recipes }] = await Promise.all([
    loadObservations(supabase, now),
    publicCatalogue(supabase, now),
  ]);
  const name = (s: StoreId) => storeName(b, s);
  const t = b.comparison.totals;
  const rank = t.findIndex((x) => x.storeId === store) + 1;
  const mine = t[rank - 1]!;
  const all = t.map((x) => x.cents);
  const vsAvg = percentVsAverage(mine.cents, all);
  const priciest = t.at(-1)!;
  const cheapest = t[0]!;
  const aisleWins = b.aisles.filter(
    (a) => Math.min(...a.totals.map((x) => x.cents)) === a.totals.find((x) => x.storeId === store)!.cents,
  );
  const lines = planLines(
    {
      id: '',
      week_start: b.weekStart,
      store_id: store,
      validated_at: null,
      meal_plan_items: b.meals.map((m, k) => ({
        id: String(k),
        day: m.day,
        slot: m.slot,
        recipe_id: m.recipeId,
        servings: REFERENCE_SERVINGS,
        locked: false,
      })),
    },
    { catalogue: b.meals.map((m) => m.recipe), observations, now },
  );
  // Plus gros écarts avec le prix moyen des 6 enseignes (avantages si l'enseigne est bien classée, sinon surcoûts).
  const allGaps = productPriceGaps(lines, store, STORES, observations, now);
  const gaps = (rank <= 3 ? allGaps : [...allGaps].reverse()).slice(0, 5).map((g) => {
    const p = b.products.find((x) => x.id === g.productId);
    return {
      id: g.productId,
      name: p?.name ?? 'Produit',
      quantity: p?.quantity ?? null,
      mine: g.cents,
      avg: g.averageCents,
    };
  });
  const cheapRecipes = [...recipes]
    .map((r) => ({ r, per: Math.round((r.totals.find((x) => x.storeId === store)?.cents ?? 9e9) / 4) }))
    .sort((a, c) => a.per - c.per)
    .slice(0, 3);
  const n = name(store);
  const answer =
    rank === 1
      ? `Oui, sur notre panier type : ${formatEuro(mine.cents)} pour 14 repas, 1re enseigne sur 6, soit ${Math.round(((priciest.cents - mine.cents) / priciest.cents) * 100)} % de moins que ${name(priciest.storeId)}.`
      : `Pas sur notre panier type : ${formatEuro(mine.cents)} pour 14 repas, ${rank}e enseigne sur 6, ${formatEuro(mine.cents - cheapest.cents)} de plus que ${name(cheapest.storeId)} par semaine.`;
  const faq = [
    { q: `${n} est-il le supermarché le moins cher ?`, a: answer },
    {
      q: `Les prix ${n} sont-ils les mêmes partout en France ?`,
      a: 'Pas tout à fait : les prix varient d’un magasin à l’autre et selon les promotions locales. Ton plan utilise les prix des magasins proches de ton code postal.',
    },
    {
      q: `Êtes-vous partenaire de ${n} ?`,
      a: 'Non. Nous n’avons aucune affiliation avec les enseignes comparées : les prix viennent de relevés publics et de tickets de la communauté.',
    },
  ];
  const initials = b.stores.find((s) => s.id === store)?.initials ?? '··';

  return (
    <SitePage
      crumbs={[
        { label: 'Accueil', href: '/' },
        { label: 'Enseignes', href: ROUTES.comparatif },
        { label: n },
      ]}
    >
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: 'Enseignes', path: ROUTES.comparatif },
          { label: n, path: `/enseignes/${store}` },
        ])}
      />
      <JsonLd data={faqPageLd(faq)} />
      <div className="flex flex-wrap items-start gap-6">
        <span className="anim-ticket">
          <StoreChip
            storeId={store}
            name={n}
            initials={initials}
            hideName
            className="[&>span]:h-20 [&>span]:w-20 [&>span]:rounded-[24px] [&>span]:text-[26px]"
          />
        </span>
        <div className="min-w-0 flex-1">
          <SeoHero
            eyebrow={`Enseigne · prix de ${MONTH_YEAR(b.weekStart)}`}
            badge={b.demo ? <DemoBadge /> : null}
            title={`${n} est-il vraiment le moins cher ?`}
            answer={
              <>
                <strong className="text-ink">{answer}</strong>
                {aisleWins.length
                  ? ` ${n} est le moins cher sur ${aisleWins.length} rayon${aisleWins.length > 1 ? 's' : ''} sur ${b.aisles.length}.`
                  : ''}
              </>
            }
            meta={b.pricesAt ? `Prix relevés le ${longDate(b.pricesAt)}` : undefined}
          />
        </div>
      </div>

      <dl className="-mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['CLASSEMENT', `${rank}${rank === 1 ? 're' : 'e'} / 6`],
          ['PANIER TYPE', formatEuro(mine.cents)],
          ['VS LA MOYENNE', `${vsAvg > 0 ? '+' : vsAvg < 0 ? '−' : ''}${Math.abs(vsAvg)} %`],
          ['FIABILITÉ DES PRIX', `${Math.round(mine.freshRatio * 100)} %`],
        ].map(([k, v], i) => (
          <div
            key={k}
            className="anim-rise border-line rounded-[22px] border bg-white/80 p-4 backdrop-blur"
            style={{ animationDelay: `${300 + i * 60}ms` }}
          >
            <dt className="text-ink-muted text-[12px] font-black tracking-[1px]">{k}</dt>
            <dd className="font-display mt-1 text-[30px] font-extrabold tabular-nums">{v}</dd>
            {k === 'FIABILITÉ DES PRIX' ? (
              <dd className="text-ink-muted text-[13px] font-bold">relevés de moins de 7 jours</dd>
            ) : null}
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Panel className="h-full">
            <H2>Rayon par rayon</H2>
            <p className="text-ink-muted mt-1 text-[14px] font-bold">Écart avec la moyenne des 6 enseignes</p>
            <ul className="mt-4 flex flex-col">
              {b.aisles.map((a) => {
                const p = percentVsAverage(
                  a.totals.find((x) => x.storeId === store)!.cents,
                  a.totals.map((x) => x.cents),
                );
                return (
                  <li
                    key={a.id}
                    className="border-line flex items-center justify-between border-t py-3 font-bold"
                  >
                    <span>{a.label}</span>
                    <span
                      className={cx(
                        'rounded-pill px-2.5 py-0.5 font-black tabular-nums',
                        p < 0 ? 'bg-saving-soft text-saving-ink' : 'bg-site-track text-ink-muted',
                      )}
                    >
                      {p > 0 ? '+' : p < 0 ? '−' : ''}
                      {Math.abs(p)} %
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={100}>
          <Panel className="h-full">
            <H2>Les plus gros écarts</H2>
            <table className="mt-4 w-full text-[15px] tabular-nums">
              <thead>
                <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                  <th scope="col" className="pb-2">
                    PRODUIT
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    {n.toUpperCase()}
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    MOYENNE
                  </th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g) => (
                  <tr key={g.id} className="border-line border-t">
                    <th scope="row" className="py-2.5 text-left font-extrabold">
                      {g.name}{' '}
                      {g.quantity ? <span className="text-ink-muted font-bold">· {g.quantity}</span> : null}
                    </th>
                    <td className="py-2.5 text-right font-black">{formatEuro(g.mine)}</td>
                    <td className="text-ink-muted py-2.5 text-right font-bold">{formatEuro(g.avg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </Reveal>
      </div>

      <Reveal>
        <H2>{n} face aux autres</H2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {t
            .filter((x) => x.storeId !== store)
            .map((x) => {
              const d = mine.cents - x.cents;
              return (
                <li key={x.storeId}>
                  <Link
                    href={href(`/enseignes/${x.storeId}`)}
                    className="border-line text-ink hover:border-brand block rounded-[20px] border bg-white/75 p-4 no-underline backdrop-blur transition-colors"
                  >
                    <span className="block font-black">
                      {n} ou {name(x.storeId)} ?
                    </span>
                    <span
                      className={cx(
                        'text-[14px] font-bold tabular-nums',
                        d < 0 ? 'text-saving-ink' : 'text-ink-muted',
                      )}
                    >
                      {n} {d < 0 ? '−' : '+'}
                      {formatEuro(Math.abs(d))} par semaine
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </Reveal>

      <Reveal>
        <H2>Les recettes les moins chères chez {n}</H2>
        <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
          {cheapRecipes.map(({ r, per }) => (
            <li key={r.id}>
              <RecipeCard
                href={`/recettes/${r.slug}`}
                title={r.title}
                illustration={r.illustration}
                minutes={r.minutes}
                perServingCents={per}
                tags={recipeTags(r, 0)}
              />
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <Faq items={faq} eyebrow="Questions fréquentes" className="" />
      </Reveal>
      <Reveal>
        <CtaTicket
          title={`Ton plan de la semaine, aux prix ${n}.`}
          text="Tu gardes ton enseigne : on te montre l’écart, sans insister."
        />
      </Reveal>
    </SitePage>
  );
}
