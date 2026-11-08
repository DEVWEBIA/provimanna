import 'server-only';
import { cache } from 'react';
import {
  buildShoppingLines,
  compareStores,
  generatePlan,
  isoWeek,
  mealServings,
  monthOf,
  seededRandom,
  totalsByGroup,
  weekStartOf,
  type PlanFilters,
  type PlannedMeal,
  type PlannerHousehold,
  type StoreId,
} from '@repas/core';
import { latest } from './dates';
import { loadPlanData, plannerRecipes, STORES, toRecipe, type CatalogueRecipe } from './plan';
import { listStores } from './stores';
import { createPublicClient } from './supabase/public';

/** Foyer du panier type des pages publiques : 2 adultes + 2 enfants, sans contrainte (docs/06). */
export const REFERENCE_HOUSEHOLD: PlannerHousehold = {
  diet: 'omnivore',
  exclusions: [],
  cookingTime: 'peu_importe',
};
export const REFERENCE_SERVINGS = mealServings(2, 2);
/** Enseigne utilisée pour classer les recettes par coût lors de la composition (enseigne « médiane »). */
const COMPOSE_STORE: StoreId = 'leclerc';

export interface Basket {
  weekStart: string;
  meals: (PlannedMeal & { recipe: CatalogueRecipe })[];
  comparison: ReturnType<typeof compareStores>;
  /** Totaux par rayon : libellé → totaux dans l'ordre de STORES. */
  aisles: {
    id: string;
    label: string;
    position: number;
    count: number;
    /** `partial` : l'enseigne ne vend pas tout le rayon (exclue des moyennes et des classements du rayon). */
    totals: { storeId: StoreId; cents: number; partial: boolean }[];
  }[];
  productCount: number;
  pricesAt: string | null;
  demo: boolean;
  stores: { id: StoreId; name: string; initials: string }[];
  /** Prix unitaires par produit et par enseigne (pour « les plus gros écarts »). */
  products: { id: string; name: string; quantity: string | null }[];
}

/**
 * Panier type de la semaine : 14 repas composés par le moteur avec une graine fixe (numéro de semaine),
 * donc identiques pour tous les visiteurs et reproductibles. Totaux et rayons calculés par core.
 */
export const referenceBasket = cache(
  async (filters?: PlanFilters, household = REFERENCE_HOUSEHOLD): Promise<Basket | null> => {
    const supabase = createPublicClient();
    const data = await loadPlanData(supabase);
    const weekStart = weekStartOf(data.now);
    let meals: PlannedMeal[];
    try {
      meals = generatePlan(
        household,
        plannerRecipes(data.catalogue, COMPOSE_STORE, data.observations, data.now),
        {
          month: monthOf(weekStart),
          filters,
          random: seededRandom(isoWeek(weekStart) * 7919 + (filters?.vegetarian ? 1 : 0)),
        },
      );
    } catch {
      return null;
    }
    const byId = new Map(data.catalogue.map((r) => [r.id, r]));
    const recipes = new Map(data.catalogue.map((r) => [r.id, toRecipe(r)]));
    const lines = buildShoppingLines(
      meals.map((m) => ({ recipeId: m.recipeId, servings: REFERENCE_SERVINGS })),
      recipes,
    );
    const comparison = compareStores(lines, STORES, 'lidl', data.observations, data.now);
    const ids = lines.map((l) => l.productId);
    const [{ data: products }, { data: aisles }, stores] = await Promise.all([
      supabase.from('products').select('id, name, quantity_label, aisle_id').in('id', ids),
      supabase.from('aisles').select('id, label, position'),
      listStores(supabase),
    ]);
    const aisleOf = new Map((products ?? []).map((p) => [p.id, p.aisle_id ?? 'divers']));
    const groups = totalsByGroup(
      lines,
      (id) => aisleOf.get(id) ?? 'divers',
      STORES,
      data.observations,
      data.now,
    );
    const used = new Set(ids);
    return {
      weekStart,
      meals: meals.map((m) => ({ ...m, recipe: byId.get(m.recipeId)! })),
      comparison,
      aisles: [...groups]
        .map(([id, totals]) => {
          const a = aisles?.find((x) => x.id === id);
          return {
            id,
            label: a?.label ?? 'Divers',
            position: a?.position ?? 99,
            count: lines.filter((l) => (aisleOf.get(l.productId) ?? 'divers') === id && !l.pantry).length,
            totals: totals.map((t) => ({ storeId: t.storeId, cents: t.cents, partial: t.partial })),
          };
        })
        .sort((a, b) => a.position - b.position),
      productCount: lines.filter((l) => !l.pantry).length,
      pricesAt: latest(comparison.totals.map((t) => t.latestObservedAt)),
      demo: data.observations.some((o) => used.has(o.productId) && o.source === 'manual'),
      stores,
      products: (products ?? []).map((p) => ({ id: p.id, name: p.name, quantity: p.quantity_label })),
    };
  },
);

export const MONTH_YEAR = (at: string | Date) =>
  new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'Europe/Paris' }).format(
    new Date(at),
  );

export const storeName = (b: Basket, id: string) => b.stores.find((s) => s.id === id)?.name ?? id;
