import 'server-only';
import {
  costPerServing,
  ingredientCosts,
  recipeStoreTotals,
  type Diet,
  type PriceObservation,
  type StoreId,
  type StoreTotal,
} from '@repas/core';
import { PLAT_VARIANTS, type PlatVariant } from '@repas/ui';
import { loadCatalogue, loadObservations, STORES, toRecipe, type CatalogueRecipe } from './plan';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@repas/core/database.types';

type AnyClient = SupabaseClient<Database>;

export interface RecipeDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  diets: Diet[];
  tags: string[];
  family: string;
  seasonMonths: number[];
  illustration: PlatVariant;
  steps: { text: string; minutes: number | null }[];
  ingredients: {
    label: string;
    productId: string | null;
    units: number;
    pantry: boolean;
    aisle: string | null;
  }[];
  updatedAt: string;
}

const isPlat = (v: string | null): v is PlatVariant => PLAT_VARIANTS.includes(v as PlatVariant);

export async function getRecipe(supabase: AnyClient, slug: string): Promise<RecipeDetail | null> {
  const { data } = await supabase
    .from('recipes')
    .select(
      'id, slug, title, description, servings, prep_minutes, cook_minutes, diets, tags, family, season_months, illustration, steps, updated_at, recipe_ingredients(label, product_id, units, pantry, position, products(aisles(label)))',
    )
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (!data) return null;
  const steps = Array.isArray(data.steps)
    ? data.steps.flatMap((s) =>
        s && typeof s === 'object' && !Array.isArray(s) && typeof s.text === 'string'
          ? [{ text: s.text, minutes: typeof s.minutes === 'number' ? s.minutes : null }]
          : [],
      )
    : [];
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    servings: data.servings,
    prepMinutes: data.prep_minutes ?? 0,
    cookMinutes: data.cook_minutes ?? 0,
    diets: data.diets,
    tags: data.tags,
    family: data.family,
    seasonMonths: data.season_months,
    illustration: isPlat(data.illustration) ? data.illustration : 'soupe',
    steps,
    ingredients: [...data.recipe_ingredients]
      .sort((a, b) => a.position - b.position)
      .map((i) => ({
        label: i.label,
        productId: i.product_id,
        units: Number(i.units),
        pantry: i.pantry,
        aisle: i.products?.aisles?.label ?? null,
      })),
    updatedAt: data.updated_at,
  };
}

/** Recette au format du moteur de prix (ingrédients reliés à un produit). */
export const coreRecipe = (r: RecipeDetail) => ({
  id: r.id,
  servings: r.servings,
  ingredients: r.ingredients.flatMap((i) =>
    i.productId ? [{ productId: i.productId, units: i.units, pantry: i.pantry }] : [],
  ),
});

/** Totaux d'une recette par enseigne pour plusieurs tailles de foyer (sélecteur de parts côté client). */
export function totalsByServings(
  r: RecipeDetail,
  obs: PriceObservation[],
  now: Date,
  options = [2, 4, 6, 8],
) {
  return Object.fromEntries(
    options.map((n) => [n, recipeStoreTotals(coreRecipe(r), n, STORES, obs, now)] as const),
  ) as Record<number, StoreTotal[]>;
}

export function ingredientLines(
  r: RecipeDetail,
  servings: number,
  store: StoreId,
  obs: PriceObservation[],
  now: Date,
) {
  const costs = ingredientCosts(coreRecipe(r), servings, store, obs, now);
  let k = 0;
  return r.ingredients.map((i) => {
    const c = i.productId ? costs[k++] : undefined;
    return { ...i, cents: c?.cents ?? null, fresh: c?.fresh ?? false, observedAt: c?.observedAt ?? null };
  });
}

/** Catalogue public + coût par part dans chaque enseigne pour 4 personnes. */
export async function publicCatalogue(supabase: AnyClient, now = new Date()) {
  const [catalogue, observations] = await Promise.all([
    loadCatalogue(supabase),
    loadObservations(supabase, now),
  ]);
  return {
    observations,
    recipes: catalogue.map((r: CatalogueRecipe) => {
      const totals = recipeStoreTotals(toRecipe(r), 4, STORES, observations, now);
      return { ...r, cheapest: totals[0]!, perServing: costPerServing(totals[0]!.cents, 4), totals };
    }),
  };
}

export const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];
export const FAMILY_LABEL: Record<string, string> = {
  soupe: 'Soupe',
  pates: 'Pâtes',
  curry: 'Curry',
  legumineuses: 'Légumineuses',
  gratin: 'Gratin',
  poisson: 'Poisson',
  oeufs: 'Œufs',
  cereales: 'Céréales',
  tarte: 'Tarte',
  salade: 'Salade',
  four: 'Au four',
  mijote: 'Plat mijoté',
  wrap: 'Wrap',
  poelee: 'Poêlée',
};

/** Étiquettes affichées sur une carte ou en tête de recette. */
export function recipeTags(
  r: { diets: readonly string[]; tags: readonly string[]; seasonMonths: readonly number[]; minutes?: number },
  month: number,
) {
  const out: string[] = [];
  if (r.diets.includes('vegetarien')) out.push('Végé');
  if (r.seasonMonths.length < 12 && r.seasonMonths.includes(month)) out.push('De saison');
  if (r.minutes !== undefined && r.minutes <= 30) out.push('− de 30 min');
  if (r.tags.includes('enfants')) out.push('Enfants');
  if (r.tags.includes('batch')) out.push('Batch cooking');
  if (r.diets.includes('sans_gluten')) out.push('Sans gluten');
  return out;
}
