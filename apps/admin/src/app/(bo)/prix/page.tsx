import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { addDays, formatEuro, medianCents, weekStartOf } from '@repas/core';
import { animDelay, cx, glassClasses, PageHeader } from '@repas/ui';
import { coverageByStore, recentObservations, STORES } from '@/lib/coverage';
import { requireRole } from '@/lib/staff';
import { PriceQueue, type AlertRow } from './price-queue';

export const metadata: Metadata = { title: 'Prix' };
export const dynamic = 'force-dynamic';

const STORE_NAME: Record<string, string> = {
  lidl: 'Lidl',
  aldi: 'Aldi',
  leclerc: 'E.Leclerc',
  intermarche: 'Intermarché',
  carrefour: 'Carrefour',
  auchan: 'Auchan',
};
const SOURCE: Record<string, string> = { open_prices: 'Open Prices', ticket: 'Ticket', manual: 'Saisie' };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function hint(cents: number, median: number | null) {
  if (median === null) return 'aucun relevé de référence récent pour comparer.';
  if (cents < median) return 'promotion probable, ou erreur de lecture du prix (chiffre manquant).';
  return 'format ou produit différent sous le même code, ou erreur de saisie ?';
}

/** Prix (maquette BOPrix) : file des aberrants, tous les relevés récents. */
export default async function PrixPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const tab = sp.onglet === 'tous' ? 'tous' : 'alertes';
  const { supabase } = await requireRole(['moderateur_prix']);
  const now = new Date();
  const since7 = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const since56 = new Date(now.getTime() - 56 * 86_400_000).toISOString();

  const [{ count: count7 }, obs, { data: alerts }, { data: ingredients }, { data: recent }] =
    await Promise.all([
      supabase.from('prices').select('id', { count: 'exact', head: true }).gte('observed_at', since7),
      recentObservations(supabase, now),
      supabase
        .from('prices')
        .select('id, product_id, store_id, cents, observed_at, source, products(name, ean)')
        .eq('flagged_aberrant', true)
        .is('moderated_by', null)
        .order('observed_at', { ascending: false })
        .limit(100),
      supabase.from('recipe_ingredients').select('product_id').not('product_id', 'is', null),
      tab === 'tous'
        ? supabase
            .from('prices')
            .select(
              'id, cents, observed_at, source, store_id, flagged_aberrant, moderated_by, products(name)',
            )
            .order('observed_at', { ascending: false })
            .limit(60)
        : Promise.resolve({ data: null }),
    ]);
  const productIds = [...new Set((ingredients ?? []).map((i) => i.product_id!))];
  const coverage = coverageByStore(productIds, obs, now);
  const avgCoverage = coverage.reduce((s, c) => s + c.ratio, 0) / coverage.length;

  // Historique des 8 dernières semaines (tous relevés, aberrants compris) pour les produits en alerte.
  const alertProducts = [...new Set((alerts ?? []).map((a) => a.product_id))];
  const { data: history } = alertProducts.length
    ? await supabase
        .from('prices')
        .select('product_id, store_id, cents, observed_at')
        .in('product_id', alertProducts)
        .gte('observed_at', since56)
    : { data: [] };
  const week0 = weekStartOf(now);
  const weeks = Array.from({ length: 8 }, (_, i) => addDays(week0, (i - 7) * 7));

  const rows: AlertRow[] = (alerts ?? []).map((a) => {
    const ref = obs
      .filter((o) => o.productId === a.product_id && o.storeId === a.store_id)
      .map((o) => o.cents);
    const median = ref.length ? medianCents(ref) : null;
    return {
      id: a.id,
      product: a.products?.name ?? 'Produit',
      ean: a.products?.ean ?? null,
      store: STORE_NAME[a.store_id] ?? a.store_id,
      storeId: a.store_id,
      source: SOURCE[a.source] ?? a.source,
      observedAt: a.observed_at,
      cents: a.cents,
      medianCents: median,
      gapPercent: median ? Math.round(((a.cents - median) / median) * 100) : null,
      history: weeks.map((w) => {
        const inWeek = (history ?? [])
          .filter(
            (h) =>
              h.product_id === a.product_id &&
              h.store_id === a.store_id &&
              weekStartOf(new Date(h.observed_at)) === w,
          )
          .map((h) => h.cents);
        return { week: w, cents: inWeek.length ? medianCents(inWeek) : null };
      }),
      hint: hint(a.cents, median),
    };
  });

  const kpis = [
    ['RELEVÉS · 7 JOURS', new Intl.NumberFormat('fr-FR').format(count7 ?? 0), 'toutes sources'],
    ['COUVERTURE < 7 J', `${Math.round(avgCoverage * 100)} %`, `${productIds.length} produits des recettes`],
    ['ALERTES ABERRANTES', String(rows.length), 'écart > 40 % de la médiane'],
    ['DERNIER IMPORT', '—', 'imports Open Prices au lot 10'],
  ];

  return (
    <>
      <PageHeader eyebrow={`France · ${STORES.length} enseignes`} title="Prix" />
      <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map(([l, v, d], i) => (
          <div key={l} className={cx(glassClasses, 'anim-rise p-4')} style={animDelay(100 + i * 60)}>
            <dt className="text-ink-muted text-[12px] font-black tracking-[1px]">{l}</dt>
            <dd className="font-display mt-1 text-[30px] font-extrabold tabular-nums">{v}</dd>
            <dd className="text-ink-muted text-[13px] font-bold">{d}</dd>
          </div>
        ))}
      </dl>
      <nav
        aria-label="Vues"
        className="bg-surface-0 rounded-pill border-line inline-flex self-start border p-1"
      >
        {(
          [
            ['alertes', 'Alertes'],
            ['tous', 'Tous les prix'],
          ] as const
        ).map(([id, label]) => (
          <Link
            key={id}
            href={(id === 'alertes' ? '/prix' : '/prix?onglet=tous') as Route}
            aria-current={tab === id ? 'page' : undefined}
            className={cx(
              'rounded-pill min-h-[40px] px-4 py-2 text-[14px] font-black no-underline',
              tab === id ? 'bg-brand text-brand-on' : 'text-ink',
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
      {tab === 'alertes' ? (
        <PriceQueue rows={rows} />
      ) : (
        <div className={cx(glassClasses, 'overflow-x-auto p-2')}>
          <table className="w-full min-w-[640px] text-[14px] tabular-nums">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                {['PRODUIT', 'ENSEIGNE', 'PRIX', 'DATE', 'SOURCE', 'ÉTAT'].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recent ?? []).map((p) => (
                <tr key={p.id} className="border-line border-t">
                  <td className="px-3 py-2 font-extrabold">{p.products?.name}</td>
                  <td className="px-3 py-2 font-bold">{STORE_NAME[p.store_id]}</td>
                  <td className="px-3 py-2 font-black">{formatEuro(p.cents)}</td>
                  <td className="text-ink-muted px-3 py-2">
                    {new Date(p.observed_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="text-ink-muted px-3 py-2">{SOURCE[p.source]}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cx(
                        'rounded-pill px-2 py-0.5 text-[12px] font-black',
                        !p.flagged_aberrant
                          ? 'bg-success-soft text-success'
                          : p.moderated_by
                            ? 'bg-site-track text-ink-muted'
                            : 'bg-danger-soft text-danger-ink',
                      )}
                    >
                      {!p.flagged_aberrant ? 'Retenu' : p.moderated_by ? 'Écarté' : 'À vérifier'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
