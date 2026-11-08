import { STORE_IDS, STORES_INFO, type StoreId } from '@repas/core';
import type { createClient } from './supabase/server';

/** Enseignes actives, dans l'ordre d'affichage de core (Lidl → Monoprix). */
export async function listStores(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from('stores').select('id, name, initials').eq('active', true);
  const order: readonly string[] = STORE_IDS;
  return (data ?? [])
    .filter((s) => order.includes(s.id))
    .map((s) => ({
      id: s.id as StoreId,
      name: s.name,
      initials: s.initials,
      partialAssortment: STORES_INFO[s.id as StoreId].partialAssortment,
    }))
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}
