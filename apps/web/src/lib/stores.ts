import type { StoreId } from '@repas/core';
import type { createClient } from './supabase/server';
import { EXAMPLE_STORES } from './landing-data';

/** Enseignes actives, dans l'ordre d'affichage habituel (Lidl → Auchan). */
export async function listStores(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from('stores').select('id, name, initials').eq('active', true);
  const order = EXAMPLE_STORES.map((s) => s.id);
  return (data ?? [])
    .map((s) => ({ id: s.id as StoreId, name: s.name, initials: s.initials }))
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}
