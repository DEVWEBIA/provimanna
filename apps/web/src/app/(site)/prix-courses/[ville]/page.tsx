import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  compareStores,
  formatEuro,
  type PriceObservation,
  type StoreId,
  completeTotals,
  STORE_COUNT,
} from '@repas/core';
import { Reveal, StoreChip } from '@repas/ui';
import { CtaTicket, DemoBadge, H2, Panel, SeoHero } from '@/components/seo/blocks';
import { SitePage } from '@/components/site/site-page';
import { MONTH_YEAR, referenceBasket, REFERENCE_SERVINGS, storeName } from '@/lib/observatory';
import { planLines, STORES } from '@/lib/plan';
import { breadcrumbLd, JsonLd } from '@/lib/seo/json-ld';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 86400;

/** Seuil de publication (docs/06) : une page ville n'existe qu'avec assez de relevés récents dans la zone. */
const MIN_RECENT = 30;
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

type Params = Promise<{ ville: string }>;

async function load(ville: string) {
  const supabase = createPublicClient();
  const { data: locations } = await supabase.from('store_locations').select('id, city');
  const local = (locations ?? []).filter((l) => slugify(l.city) === ville);
  if (!local.length) return null;
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { data: prices } = await supabase
    .from('prices')
    .select('product_id, store_id, cents, observed_at, source')
    .in(
      'location_id',
      local.map((l) => l.id),
    )
    .gte('observed_at', since);
  if (!prices || prices.length < MIN_RECENT) return null;
  return { city: local[0]!.city, stores: new Set(local.map((l) => l.id)).size, prices };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const d = await load((await params).ville);
  if (!d) return {};
  return {
    title: `Combien coûtent les courses à ${d.city} ?`,
    description: `Panier type de 14 repas pour 4 personnes à ${d.city} dans ${STORE_COUNT} enseignes, comparé à la moyenne nationale.`,
    alternates: { canonical: `/prix-courses/${(await params).ville}` },
  };
}

export default async function VillePage({ params }: { params: Params }) {
  const { ville } = await params;
  const d = await load(ville);
  if (!d) notFound();
  const b = await referenceBasket();
  if (!b) notFound();
  const now = new Date();
  const local: PriceObservation[] = d.prices.map((p) => ({
    productId: p.product_id,
    storeId: p.store_id as StoreId,
    cents: p.cents,
    observedAt: p.observed_at,
    source: p.source,
  }));
  const lines = planLines(
    {
      id: '',
      week_start: b.weekStart,
      store_id: 'lidl',
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
    { catalogue: b.meals.map((m) => m.recipe), observations: local, now },
  );
  const cmp = compareStores(lines, STORES, 'lidl', local, now);
  const national = new Map(b.comparison.totals.map((t) => [t.storeId, t.cents]));
  const full = completeTotals(cmp.totals);
  const first = full[0]!;
  const last = full.at(-1)!;
  const name = (id: StoreId) => storeName(b, id);

  return (
    <SitePage crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Prix des courses' }, { label: d.city }]}>
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: d.city, path: `/prix-courses/${ville}` },
        ])}
      />
      <SeoHero
        eyebrow={`${d.city} · ${MONTH_YEAR(now)}`}
        badge={b.demo ? <DemoBadge /> : null}
        title={`Combien coûtent les courses à ${d.city} ?`}
        answer={`À ${d.city}, notre panier type de 14 repas pour 4 personnes coûte de ${formatEuro(first.cents)} chez ${name(first.storeId)} à ${formatEuro(last.cents)} chez ${name(last.storeId)}.`}
        meta={`${d.stores} magasins relevés · ${d.prices.length} relevés de moins de 7 jours`}
      />
      <Reveal>
        <Panel>
          <H2>{d.city} face à la moyenne nationale</H2>
          <table className="mt-5 w-full text-[15px] tabular-nums">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                <th scope="col" className="pb-2">
                  ENSEIGNE
                </th>
                <th scope="col" className="pb-2 text-right">
                  À {d.city.toUpperCase()}
                </th>
                <th scope="col" className="pb-2 text-right">
                  FRANCE
                </th>
              </tr>
            </thead>
            <tbody>
              {full.map((t) => (
                <tr key={t.storeId} className="border-line border-t">
                  <th scope="row" className="py-2.5 text-left">
                    <StoreChip
                      storeId={t.storeId}
                      name={name(t.storeId)}
                      initials={b.stores.find((s) => s.id === t.storeId)?.initials ?? '··'}
                      size="sm"
                    />
                  </th>
                  <td className="py-2.5 text-right font-black">{formatEuro(t.cents)}</td>
                  <td className="text-ink-muted py-2.5 text-right font-bold">
                    {formatEuro(national.get(t.storeId) ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </Reveal>
      <Reveal>
        <CtaTicket
          title="Ton plan, aux prix de ton quartier."
          text="Saisis ton code postal : on utilise les relevés des magasins proches de chez toi."
        />
      </Reveal>
    </SitePage>
  );
}
