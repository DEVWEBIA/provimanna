import type { Metadata } from 'next';
import Link from 'next/link';
import { averagePriceAgeDays, compareProducts, type StoreId } from '@repas/core';
import { EmptyState, PageHeader, Plat } from '@repas/ui';
import { ComparatorView, type StoreDetail } from '@/components/plan/comparator-view';
import { DemoNotice } from '@/components/plan/demo-notice';
import { storeTotals } from '@/components/plan/totals';
import { loadProducts } from '@/lib/list';
import { currentPlan, planLines, STORES } from '@/lib/plan';
import { href } from '@/lib/site';

export const metadata: Metadata = { title: 'Comparateur', robots: { index: false } };

const FREE_ROWS = 2;
const PREMIUM_ROWS = 12;

export default async function ComparateurPage() {
  const { supabase, household, plan, view, stores, data } = await currentPlan();
  if (!plan || !view) {
    return (
      <EmptyState
        title="Ta semaine n’est pas encore planifiée."
        illustration={<Plat variant="soupe" size={96} decorative />}
      />
    );
  }
  const { data: premium } = await supabase.rpc('is_premium', { h: household.id });
  const lines = planLines(plan, data);
  const products = await loadProducts(
    supabase,
    lines.map((l) => l.productId),
  );
  const shown = premium ? PREMIUM_ROWS : FREE_ROWS;
  // Détail calculé côté serveur ; en gratuit, seules les 2 premières lignes quittent le serveur.
  const details: Partial<Record<StoreId, StoreDetail>> = {};
  for (const other of STORES.filter((s) => s !== view.myStore)) {
    const cmp = compareProducts(lines, view.myStore, other, data.observations, data.now);
    details[other] = {
      rows: cmp.rows.slice(0, shown).map((r) => ({
        name: products.get(r.productId)?.name ?? 'Produit',
        quantity: products.get(r.productId)?.quantity ?? null,
        mineCents: r.aCents,
        otherCents: r.bCents,
        diffCents: r.diffCents,
      })),
      hidden: Math.max(0, cmp.rows.length - shown),
      cheaper: cmp.cheaper,
      pricier: cmp.pricier,
      equal: cmp.equal,
    };
  }
  const age = averagePriceAgeDays(lines, view.myStore, data.observations, data.now);
  const count = lines.filter((l) => !l.pantry).length;

  return (
    <>
      <Link href={href('/app/plan')} className="anim-rise text-brand self-start text-[15px] font-black">
        ← Semaine {view.weekNumber}
      </Link>
      <PageHeader
        title="Où ta semaine coûte le moins"
        lead={`${view.meals.length} repas · ${view.people} ${view.people > 1 ? 'personnes' : 'personne'} · ${count} produits · prix médians relevés ${
          age === null ? '' : age <= 0 ? 'aujourd’hui' : `il y a ${age} jour${age > 1 ? 's' : ''} en moyenne`
        }${household.postal_code ? `, autour de ${household.postal_code}` : ''}`}
        className="-mt-4"
      />
      {view.demoPrices ? <DemoNotice /> : null}
      <ComparatorView
        planId={view.id}
        totals={storeTotals(view, stores)}
        myStore={view.myStore}
        cheapest={view.comparison.cheapest}
        premium={premium === true}
        details={details}
      />
    </>
  );
}
