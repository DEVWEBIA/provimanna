import { shortDate, type StoreId } from '@repas/core';
import type { PlanView } from '@/lib/plan';
import type { StoreTotalView } from './store-totals';

type StoreInfo = { id: StoreId; name: string; initials: string };

/** Totaux par enseigne, du moins cher au plus cher (calculés par core dans planView). */
export function storeTotals(view: PlanView, stores: StoreInfo[]): StoreTotalView[] {
  return view.comparison.totals.flatMap((t) => {
    const s = stores.find((x) => x.id === t.storeId);
    return s
      ? [
          {
            id: s.id,
            name: s.name,
            initials: s.initials,
            cents: t.cents,
            reliability: t.reliability,
            estimate: t.freshRatio < 1,
            partial: t.partial,
            pricedCount: view.lineCount - t.missing.length,
          },
        ]
      : [];
  });
}

export const pricesAtLabel = (view: PlanView) => (view.pricesAt ? shortDate(view.pricesAt) : null);
