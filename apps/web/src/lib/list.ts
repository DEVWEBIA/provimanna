import 'server-only';
import { compareStores, listItems, nextStreak, sumCents, type StoreId, DEFAULTS } from '@repas/core';
import type { Household } from './household';
import { planLines, STORES, type PlanData, type PlanRow } from './plan';
import type { AdminClient } from './supabase/admin';
import type { createClient } from './supabase/server';

type Client = Awaited<ReturnType<typeof createClient>>;

export interface ProductInfo {
  id: string;
  name: string;
  quantity: string | null;
  aisleId: string | null;
}

export interface ListRow {
  id: string;
  store_id: string;
  share_token: string | null;
}

export interface ListItemRow {
  id: string;
  product_id: string | null;
  label: string;
  quantity_label: string | null;
  aisle_id: string | null;
  est_cents: number | null;
  checked: boolean;
  checked_by: string | null;
  added_by: string | null;
  manual: boolean;
}

const ITEM_COLUMNS =
  'id, product_id, label, quantity_label, aisle_id, est_cents, checked, checked_by, added_by, manual';

export async function loadProducts(
  supabase: Client | AdminClient,
  ids: string[],
): Promise<Map<string, ProductInfo>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabase.from('products').select('id, name, quantity_label, aisle_id').in('id', ids);
  return new Map(
    (data ?? []).map((p) => [
      p.id,
      { id: p.id, name: p.name, quantity: p.quantity_label, aisleId: p.aisle_id },
    ]),
  );
}

/**
 * Valide la semaine dans l'enseigne choisie : fige le total, le total de référence (enseigne habituelle,
 * base des économies) et l'enseigne la moins chère. Écrit avec le client serveur (droits retirés à l'utilisateur).
 */
export async function validatePlan(
  admin: AdminClient,
  plan: PlanRow,
  household: Household,
  store: StoreId,
  data: PlanData,
) {
  const reference = (household.preferred_store_id ?? store) as StoreId;
  const cmp = compareStores(planLines(plan, data), STORES, reference, data.observations, data.now);
  const chosen = cmp.totals.find((t) => t.storeId === store)!;
  const { error } = await admin
    .from('meal_plans')
    .update({
      store_id: store,
      total_cents: chosen.cents,
      reference_cents: cmp.reference.cents,
      cheapest_store_id: cmp.cheapest,
      cheapest_cents: cmp.totals[0]!.cents,
      validated_at: plan.validated_at ?? new Date().toISOString(),
    })
    .eq('id', plan.id);
  if (error) throw new Error(`Validation impossible : ${error.message}`);

  // Série de semaines validées (écrite par le serveur uniquement).
  const { data: streak } = await admin
    .from('streaks')
    .select('current_weeks, best_weeks, last_validated_week')
    .eq('household_id', household.id)
    .maybeSingle();
  const next = nextStreak(
    streak ?? { current_weeks: 0, best_weeks: 0, last_validated_week: null },
    plan.week_start,
  );
  await admin.from('streaks').upsert({ household_id: household.id, ...next });
}

const quantityLabel = (packs: number, quantity: string | null) =>
  packs > 1 ? `${packs} × ${quantity ?? 'unité'}` : (quantity ?? '1');

/**
 * Met la liste de courses en accord avec le plan (création, enseigne, articles, prix estimés).
 * Les cases déjà cochées et les articles ajoutés à la main sont conservés.
 * Renvoie l'état final sans relire la base avec la même requête (mémorisation des GET pendant un rendu).
 */
export async function syncShoppingList(
  admin: AdminClient,
  plan: PlanRow,
  store: StoreId,
  data: PlanData,
): Promise<{ list: ListRow; items: ListItemRow[] }> {
  const { data: found } = await admin
    .from('shopping_lists')
    .select('id, store_id, share_token')
    .eq('meal_plan_id', plan.id)
    .maybeSingle();
  let list: ListRow | null = found;
  if (!list) {
    const { data: created, error } = await admin
      .from('shopping_lists')
      .insert({ meal_plan_id: plan.id, store_id: store })
      .select('id, store_id, share_token')
      .single();
    if (error) throw new Error(`Liste non créée : ${error.message}`);
    list = created;
  } else if (list.store_id !== store) {
    await admin.from('shopping_lists').update({ store_id: store }).eq('id', list.id);
    list = { ...list, store_id: store };
  }

  const wanted = listItems(planLines(plan, data), store, data.observations, data.now);
  const products = await loadProducts(
    admin,
    wanted.map((w) => w.productId),
  );
  const { data: existing } = await admin
    .from('shopping_list_items')
    .select(ITEM_COLUMNS)
    .eq('list_id', list.id);
  const current = existing ?? [];
  const byProduct = new Map(current.filter((i) => !i.manual && i.product_id).map((i) => [i.product_id!, i]));

  const final: ListItemRow[] = current.filter((i) => i.manual);
  const inserts = [];
  for (const w of wanted) {
    const p = products.get(w.productId);
    if (!p) continue;
    const next = {
      label: p.name,
      quantity_label: quantityLabel(w.packs, p.quantity),
      aisle_id: p.aisleId,
      est_cents: w.cents,
    };
    const prev = byProduct.get(w.productId);
    byProduct.delete(w.productId);
    if (!prev) {
      inserts.push({ list_id: list.id, product_id: w.productId, ...next });
    } else if (
      prev.label !== next.label ||
      prev.quantity_label !== next.quantity_label ||
      prev.aisle_id !== next.aisle_id ||
      prev.est_cents !== next.est_cents
    ) {
      const { data: updated } = await admin
        .from('shopping_list_items')
        .update(next)
        .eq('id', prev.id)
        .select(ITEM_COLUMNS)
        .single();
      final.push(updated ?? { ...prev, ...next });
    } else {
      final.push(prev);
    }
  }
  if (inserts.length) {
    const { data: inserted, error } = await admin
      .from('shopping_list_items')
      .insert(inserts)
      .select(ITEM_COLUMNS);
    if (error) throw new Error(`Liste non enregistrée : ${error.message}`);
    final.push(...inserted);
  }
  // Produits qui ne sont plus dans le plan (repas remplacé…).
  const obsolete = [...byProduct.values()].map((i) => i.id);
  if (obsolete.length) await admin.from('shopping_list_items').delete().in('id', obsolete);

  return { list, items: final };
}

/** Total de la liste (paquets entiers) dans chaque enseigne, via core. */
export function listTotals(plan: PlanRow, data: PlanData) {
  const lines = planLines(plan, data);
  // Une enseigne qui ne vend pas toute la liste (Picard, Grand Frais…) n'a pas de total comparable.
  return STORES.flatMap((store) => {
    const items = listItems(lines, store, data.observations, data.now);
    const priced = items.filter((i) => i.cents !== null).length;
    if (items.length && priced / items.length < DEFAULTS.minCoverage) return [];
    return [{ store, cents: sumCents(items.map((i) => i.cents)) }];
  }).sort((a, b) => a.cents - b.cents);
}
