'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { STORE_IDS, STORES_INFO, type StoreId } from '@repas/core';
import { getAccount } from '@/lib/household';
import { syncShoppingList, validatePlan } from '@/lib/list';
import { getWeekPlan, loadPlanData } from '@/lib/plan';
import { createAdminClient } from '@/lib/supabase/admin';

export type ListActionResult = { ok: true } | { ok: false; error: string };

const storeSchema = z.enum(STORE_IDS);
const SWITCH_PREMIUM =
  'Faire ta liste dans une autre enseigne que la tienne fait partie de Premium. Ton enseigne habituelle reste disponible.';
const FAILED = 'Ça n’a pas marché. Réessaie dans un instant.';

/**
 * « Garder mon enseigne » / « Basculer ma liste chez … » : valide la semaine dans l'enseigne choisie
 * (totaux figés côté serveur) et prépare la liste. La bascule vers une autre enseigne est réservée à Premium.
 */
export async function chooseStoreAction(planId: unknown, store: unknown): Promise<ListActionResult> {
  const id = z.guid().safeParse(planId);
  const s = storeSchema.safeParse(store);
  if (!id.success || !s.success) return { ok: false, error: FAILED };
  if (STORES_INFO[s.data].partialAssortment) {
    return {
      ok: false,
      error: `${STORES_INFO[s.data].name} ne propose pas tous les produits de ta liste. Choisis une enseigne où tu trouveras tout.`,
    };
  }
  const { supabase, household } = await getAccount();

  // Appartenance vérifiée avec la session de l'utilisateur (RLS) avant toute écriture serveur.
  const { data: owned } = await supabase
    .from('meal_plans')
    .select('week_start')
    .eq('id', id.data)
    .eq('household_id', household.id)
    .maybeSingle();
  if (!owned) return { ok: false, error: FAILED };
  if (s.data !== household.preferred_store_id) {
    const { data: premium } = await supabase.rpc('is_premium', { h: household.id });
    if (premium !== true) return { ok: false, error: SWITCH_PREMIUM };
  }

  const plan = await getWeekPlan(supabase, household.id, owned.week_start);
  if (!plan) return { ok: false, error: FAILED };
  const admin = createAdminClient();
  const data = await loadPlanData(supabase);
  await validatePlan(admin, plan, household, s.data as StoreId, data);
  await syncShoppingList(admin, { ...plan, store_id: s.data }, s.data as StoreId, data);
  revalidatePath('/app', 'layout');
  return { ok: true };
}
