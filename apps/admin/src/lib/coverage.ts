import 'server-only';
import { resolvePrice, type PriceObservation, type PriceSource, type StoreId, STORE_IDS } from '@repas/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@repas/core/database.types';

export const STORES: StoreId[] = [...STORE_IDS];

/** Relevés des 30 derniers jours, non aberrants (base des médianes). */
export async function recentObservations(
  admin: SupabaseClient<Database>,
  now: Date,
): Promise<PriceObservation[]> {
  const since = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const rows: PriceObservation[] = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await admin
      .from('prices')
      .select('product_id, store_id, cents, observed_at, source')
      .gte('observed_at', since)
      .eq('flagged_aberrant', false)
      .order('id')
      .range(from, from + 999);
    for (const p of data ?? [])
      rows.push({
        productId: p.product_id,
        storeId: p.store_id as StoreId,
        cents: p.cents,
        observedAt: p.observed_at,
        source: p.source as PriceSource,
      });
    if (!data || data.length < 1000) break;
  }
  return rows;
}

/** Part des produits utilisés par les recettes qui ont un prix frais (< 7 jours) dans chaque enseigne. */
export function coverageByStore(productIds: string[], obs: PriceObservation[], now: Date) {
  return STORES.map((store) => {
    const fresh = productIds.filter((id) => resolvePrice(obs, id, store, now)?.fresh).length;
    return { store, ratio: productIds.length ? fresh / productIds.length : 0 };
  });
}
