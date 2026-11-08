import type { Metadata } from 'next';
import { formatEuro, weekRangeLabel, weekStartOf, zonedDate } from '@repas/core';
import { animDelay, EmptyState, PageHeader, Plat } from '@repas/ui';
import { DemoNotice } from '@/components/plan/demo-notice';
import { PlanBoard } from '@/components/plan/plan-board';
import { PlanControls } from '@/components/plan/plan-controls';
import { StoreTotals } from '@/components/plan/store-totals';
import { pricesAtLabel, storeTotals } from '@/components/plan/totals';
import { currentPlan } from '@/lib/plan';

export const metadata: Metadata = { title: 'Mon plan', robots: { index: false } };

export default async function PlanPage() {
  const { view, stores, data } = await currentPlan();
  if (!view) {
    return (
      <EmptyState
        title="Aucune recette ne correspond encore à tes préférences."
        description="Assouplis un choix dans ton profil : on compose ta semaine dès qu’il y a assez de recettes."
        illustration={<Plat variant="soupe" size={96} decorative />}
      />
    );
  }
  const today = weekStartOf(data.now) === view.weekStart ? zonedDate(data.now).weekday : null;
  const name = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const cheapest = view.comparison.totals[0]!;
  return (
    <>
      <PageHeader
        eyebrow={`${weekRangeLabel(view.weekStart)} · ${view.people} ${view.people > 1 ? 'personnes' : 'personne'} · ${view.meals.length} repas`}
        title={`Semaine ${view.weekNumber}`}
      />
      <div className="anim-rise" style={animDelay(200)}>
        <PlanControls planId={view.id} />
      </div>
      {view.demoPrices ? <DemoNotice /> : null}
      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <PlanBoard planId={view.id} weekStart={view.weekStart} today={today} meals={view.meals} />
        <div className="anim-rise max-2xl:max-w-[560px] 2xl:sticky 2xl:top-8" style={animDelay(400)}>
          <StoreTotals
            planId={view.id}
            totals={storeTotals(view, stores)}
            myStore={view.myStore}
            cheapest={view.comparison.cheapest}
            pricesAt={pricesAtLabel(view)}
            cheaperProducts={view.cheaperProducts}
          />
        </div>
      </div>

      {/* Mobile : total de la semaine toujours visible au-dessus de la barre d'onglets (maquette MPlan). */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <a
        href="#comparateur"
        className="bg-raw-encre fixed inset-x-4 bottom-[96px] z-20 flex items-center gap-3 rounded-[20px] px-4 py-3 text-white no-underline shadow-[0_16px_40px_rgba(42,26,40,0.35)] lg:hidden"
      >
        <span className="flex-1">
          <span className="text-site-on-ink-faint block text-[11px] font-black tracking-[1px]">
            CHEZ {name(view.myStore).toUpperCase()}
          </span>
          <span className="font-display block text-[24px] font-extrabold tabular-nums leading-tight">
            {formatEuro(view.comparison.reference.cents)}
          </span>
        </span>
        {cheapest.storeId !== view.myStore ? (
          <span className="bg-saving text-raw-encre rounded-pill px-3 py-1 text-[13px] font-black tabular-nums">
            dès {formatEuro(cheapest.cents)} chez {name(cheapest.storeId)}
          </span>
        ) : null}
        <span aria-hidden="true" className="text-[22px]">
          ›
        </span>
      </a>
    </>
  );
}
