import 'server-only';
import { cache } from 'react';
import {
  buildShoppingLines,
  cheaperProductCount,
  compareStores,
  generatePlan,
  isoWeek,
  mealServings,
  monthOf,
  addDays,
  PlannerError,
  recipeServingCents,
  sortMeals,
  weekStartOf,
  type Comparison,
  type CookingTime,
  type Diet,
  type MealSlot,
  type PlanFilters,
  type PlannedMeal,
  type PlannerHousehold,
  type PlannerRecipe,
  type PriceObservation,
  type PriceSource,
  type Recipe,
  type StoreId,
} from '@repas/core';
import { PLAT_VARIANTS, type PlatVariant } from '@repas/ui';
import { getAccount, type Household } from './household';
import { listStores } from './stores';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@repas/core/database.types';

type Client = SupabaseClient<Database>;

export interface CatalogueRecipe {
  id: string;
  slug: string;
  title: string;
  servings: number;
  minutes: number;
  illustration: PlatVariant;
  family: string;
  tags: string[];
  diets: Diet[];
  seasonMonths: number[];
  ingredients: { productId: string; units: number; pantry: boolean }[];
}

export interface PlanMealView {
  id: string;
  day: number;
  slot: MealSlot;
  locked: boolean;
  servings: number;
  recipe: Pick<CatalogueRecipe, 'id' | 'slug' | 'title' | 'illustration' | 'minutes'>;
  /** Coût d'une part dans l'enseigne du foyer (centimes), null si inconnu. */
  perServingCents: number | null;
}

export interface PlanView {
  id: string;
  weekStart: string;
  weekNumber: number;
  people: number;
  myStore: StoreId;
  /** Enseigne choisie pour cette semaine (celle de la liste). */
  planStore: StoreId;
  /** Semaine validée (enseigne choisie) : ses totaux sont figés côté serveur. */
  validated: boolean;
  meals: PlanMealView[];
  comparison: Comparison;
  /** Produits moins chers dans l'enseigne la moins chère que dans celle du foyer (encart Premium). */
  cheaperProducts: number;
  /** Date du relevé le plus récent utilisé, toutes enseignes confondues. */
  pricesAt: string | null;
  /** Nombre de produits de la liste (pour « 9 produits sur 31 sans relevé récent »). */
  lineCount: number;
  /** Des prix de démonstration (catalogue de départ) entrent dans les totaux. */
  demoPrices: boolean;
}

export const STORES: StoreId[] = ['lidl', 'aldi', 'leclerc', 'intermarche', 'carrefour', 'auchan'];
const PLAN_COLUMNS = 'id, week_start, store_id, validated_at';
const ITEM_COLUMNS = 'id, day, slot, recipe_id, servings, locked';
const isPlat = (v: string | null): v is PlatVariant => PLAT_VARIANTS.includes(v as PlatVariant);

/** Recettes publiées et leurs ingrédients reliés à un produit. */
export async function loadCatalogue(supabase: Client): Promise<CatalogueRecipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, slug, title, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, recipe_ingredients(product_id, units, pantry)',
    )
    .eq('published', true);
  if (error) throw new Error(`Catalogue indisponible : ${error.message}`);
  return data.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    servings: r.servings,
    minutes: (r.prep_minutes ?? 0) + (r.cook_minutes ?? 0),
    illustration: isPlat(r.illustration) ? r.illustration : 'soupe',
    family: r.family,
    tags: r.tags,
    diets: r.diets,
    seasonMonths: r.season_months,
    ingredients: r.recipe_ingredients.flatMap((i) =>
      i.product_id ? [{ productId: i.product_id, units: Number(i.units), pantry: i.pantry }] : [],
    ),
  }));
}

/** Relevés de prix des 30 derniers jours (les aberrants sont exclus par la RLS). */
export async function loadObservations(supabase: Client, now: Date): Promise<PriceObservation[]> {
  const since = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const rows: PriceObservation[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('prices')
      .select('product_id, store_id, cents, observed_at, source')
      .gte('observed_at', since)
      .order('id')
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`Prix indisponibles : ${error.message}`);
    for (const p of data)
      rows.push({
        productId: p.product_id,
        storeId: p.store_id as StoreId,
        cents: p.cents,
        observedAt: p.observed_at,
        source: p.source as PriceSource,
      });
    if (data.length < PAGE) break;
  }
  return rows;
}

export const toRecipe = (r: CatalogueRecipe): Recipe => ({
  id: r.id,
  servings: r.servings,
  ingredients: r.ingredients,
});

export function plannerHousehold(h: Household): PlannerHousehold {
  return { diet: h.diet, exclusions: h.exclusions, cookingTime: h.cooking_time as CookingTime };
}

/** Recettes vues par le planificateur, avec leur coût par part dans l'enseigne du foyer. */
export function plannerRecipes(
  catalogue: CatalogueRecipe[],
  store: StoreId,
  observations: PriceObservation[],
  now: Date,
): PlannerRecipe[] {
  return catalogue.map((r) => ({
    id: r.id,
    family: r.family,
    diets: r.diets,
    tags: r.tags,
    seasonMonths: r.seasonMonths,
    totalMinutes: r.minutes,
    costPerServingCents: recipeServingCents(toRecipe(r), store, observations, now),
  }));
}

export interface PlanData {
  catalogue: CatalogueRecipe[];
  observations: PriceObservation[];
  now: Date;
}

export async function loadPlanData(supabase: Client, now = new Date()): Promise<PlanData> {
  const [catalogue, observations] = await Promise.all([
    loadCatalogue(supabase),
    loadObservations(supabase, now),
  ]);
  return { catalogue, observations, now };
}

export type PlanRow = {
  id: string;
  week_start: string;
  store_id: string;
  validated_at: string | null;
  meal_plan_items: {
    id: string;
    day: number;
    slot: MealSlot;
    recipe_id: string;
    servings: number;
    locked: boolean;
  }[];
};

export async function getWeekPlan(
  supabase: Client,
  householdId: string,
  weekStart: string,
): Promise<PlanRow | null> {
  const { data } = await supabase
    .from('meal_plans')
    .select(`${PLAN_COLUMNS}, meal_plan_items(${ITEM_COLUMNS})`)
    .eq('household_id', householdId)
    .eq('week_start', weekStart)
    .maybeSingle();
  return data;
}

/** Recettes de la semaine précédente (à éviter pour varier d'une semaine à l'autre). */
export async function previousWeekRecipes(supabase: Client, householdId: string, weekStart: string) {
  const prev = await getWeekPlan(supabase, householdId, addDays(weekStart, -7));
  return prev?.meal_plan_items.map((i) => i.recipe_id) ?? [];
}

export interface GenerateInput {
  supabase: Client;
  household: Household;
  data: PlanData;
  weekStart: string;
  locked?: PlannedMeal[];
  filters?: PlanFilters;
}

/** Compose les repas d'une semaine (fonction pure de core) pour ce foyer. */
export async function composeMeals({ supabase, household, data, weekStart, locked, filters }: GenerateInput) {
  const store = (household.preferred_store_id ?? 'lidl') as StoreId;
  return generatePlan(
    plannerHousehold(household),
    plannerRecipes(data.catalogue, store, data.observations, data.now),
    {
      month: monthOf(weekStart),
      locked,
      filters,
      recentRecipeIds: await previousWeekRecipes(supabase, household.id, weekStart),
    },
  );
}

/**
 * Plan de la semaine en cours : le crée s'il n'existe pas encore (premier accès, onboarding).
 * Deux créations simultanées sont départagées par la contrainte unique (foyer, semaine).
 *
 * Attention : pendant un rendu, Next.js mémorise les requêtes GET identiques. On ne relit donc
 * jamais le plan avec la même requête après l'avoir créé : on renvoie les lignes insérées.
 */
export async function ensureWeekPlan(
  supabase: Client,
  household: Household,
  data: PlanData,
): Promise<PlanRow | null> {
  const weekStart = weekStartOf(data.now);
  const existing = await getWeekPlan(supabase, household.id, weekStart);
  if (existing && existing.meal_plan_items.length > 0) return existing;

  let meals: PlannedMeal[];
  try {
    meals = await composeMeals({ supabase, household, data, weekStart });
  } catch (e) {
    if (e instanceof PlannerError) return null;
    throw e;
  }

  let plan = existing
    ? {
        id: existing.id,
        week_start: existing.week_start,
        store_id: existing.store_id,
        validated_at: existing.validated_at,
      }
    : null;
  if (!plan) {
    const { data: created, error } = await supabase
      .from('meal_plans')
      .insert({
        household_id: household.id,
        week_start: weekStart,
        store_id: household.preferred_store_id ?? 'lidl',
      })
      .select(PLAN_COLUMNS)
      .single();
    if (error) {
      // Créé entre-temps par une autre requête : on lit ce plan-là (requête différente, non mémorisée).
      const { data: other } = await supabase
        .from('meal_plans')
        .select(`${PLAN_COLUMNS}, meal_plan_items(${ITEM_COLUMNS})`)
        .eq('week_start', weekStart)
        .eq('household_id', household.id)
        .limit(1);
      return other?.[0] ?? null;
    }
    plan = created;
  }
  const servings = mealServings(household.adults, household.children);
  const { data: items, error } = await supabase
    .from('meal_plan_items')
    .insert(
      meals.map((m) => ({
        meal_plan_id: plan.id,
        day: m.day,
        slot: m.slot,
        recipe_id: m.recipeId,
        servings,
        locked: m.locked,
      })),
    )
    .select(ITEM_COLUMNS);
  if (error) {
    if (error.code !== '23505') throw new Error(`Plan non enregistré : ${error.message}`);
    const { data: other } = await supabase
      .from('meal_plan_items')
      .select(ITEM_COLUMNS)
      .eq('meal_plan_id', plan.id);
    return { ...plan, meal_plan_items: other ?? [] };
  }
  return { ...plan, meal_plan_items: items };
}

/** Lignes de courses agrégées du plan (quantités à l'échelle des parts), via core. */
export function planLines(plan: PlanRow, data: PlanData) {
  const recipes = new Map(data.catalogue.map((r) => [r.id, toRecipe(r)]));
  return buildShoppingLines(
    plan.meal_plan_items
      .filter((i) => recipes.has(i.recipe_id))
      .map((i) => ({ recipeId: i.recipe_id, servings: i.servings })),
    recipes,
  );
}

/** Tout ce qu'affichent le tableau de bord et l'écran du plan. Tous les calculs passent par core. */
export function planView(plan: PlanRow, household: Household, data: PlanData): PlanView {
  const byId = new Map(data.catalogue.map((r) => [r.id, r]));
  const myStore = (household.preferred_store_id ?? plan.store_id) as StoreId;
  const items = sortMeals(plan.meal_plan_items.filter((i) => byId.has(i.recipe_id)));
  const lines = planLines(plan, data);
  const comparison = compareStores(lines, STORES, myStore, data.observations, data.now);
  const usedProducts = new Set(lines.map((l) => l.productId));
  const used = data.observations.filter((o) => usedProducts.has(o.productId));
  const dates = comparison.totals.map((t) => t.latestObservedAt).filter((d): d is string => d !== null);
  return {
    id: plan.id,
    weekStart: plan.week_start,
    weekNumber: isoWeek(plan.week_start),
    people: household.adults + household.children,
    myStore,
    planStore: plan.store_id as StoreId,
    validated: plan.validated_at !== null,
    meals: items.map((i) => {
      const r = byId.get(i.recipe_id)!;
      return {
        id: i.id,
        day: i.day,
        slot: i.slot,
        locked: i.locked,
        servings: i.servings,
        recipe: { id: r.id, slug: r.slug, title: r.title, illustration: r.illustration, minutes: r.minutes },
        perServingCents: recipeServingCents(toRecipe(r), myStore, data.observations, data.now),
      };
    }),
    comparison,
    cheaperProducts: cheaperProductCount(lines, comparison.cheapest, myStore, data.observations, data.now),
    pricesAt: dates.length ? dates.reduce((a, b) => (Date.parse(a) > Date.parse(b) ? a : b)) : null,
    lineCount: lines.length,
    demoPrices: used.some((o) => o.source === 'manual'),
  };
}

/**
 * Plan de la semaine en cours pour le foyer connecté (créé au premier accès), prêt à afficher.
 * Une seule exécution par rendu (tableau de bord, plan, mise en page).
 */
export const currentPlan = cache(async () => {
  const account = await getAccount();
  const data = await loadPlanData(account.supabase);
  const [plan, stores] = await Promise.all([
    ensureWeekPlan(account.supabase, account.household, data),
    listStores(account.supabase),
  ]);
  return { ...account, data, stores, plan, view: plan ? planView(plan, account.household, data) : null };
});
