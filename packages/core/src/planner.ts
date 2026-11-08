/**
 * Génération du plan de la semaine — logique pure et déterministe (aléa injectable).
 * Règles : docs/05 §1 « Génération du plan ».
 */
import type { Diet, PreferenceId } from './household.ts';

export type MealSlot = 'dejeuner' | 'diner';
export type CookingTime = 'moins_30' | '30_45' | 'peu_importe';

/** Recette telle que la voit le planificateur. */
export interface PlannerRecipe {
  id: string;
  /** Famille de plat (soupe, pates, curry…) : sert à varier la semaine. */
  family: string;
  /** Régimes compatibles (recipes.diets). */
  diets: readonly Diet[];
  /** Marqueurs (recipes.tags) : lactose, poisson, fruits_a_coque, epice, enfants, batch. */
  tags: readonly string[];
  /** Mois de saison (1 à 12). */
  seasonMonths: readonly number[];
  /** Temps total (préparation + cuisson), en minutes. */
  totalMinutes: number;
  /** Coût d'une part dans l'enseigne du foyer, en centimes (null si inconnu). */
  costPerServingCents: number | null;
  /** Équipement nécessaire (recipes.equipment) : four, plaques. Absent = aucun contrôle. */
  equipment?: readonly string[];
  /** Produits utilisés (pour éviter les ingrédients que le foyer n'aime pas). */
  productIds?: readonly string[];
}

export interface PlannerHousehold {
  diet: Diet;
  exclusions: readonly string[];
  cookingTime: CookingTime;
  /** Jours planifiés (1 = lundi … 7). Absent = toute la semaine. */
  mealDays?: readonly number[];
  /** Midi + soir (true, par défaut) ou soir seulement. */
  withLunch?: boolean;
  /** Équipement du foyer : four, plaques, air_fryer. Absent = tout. */
  equipment?: readonly string[];
  /** Produits évités (strictement tant qu'il reste assez de recettes, sinon le moins possible). */
  dislikedProductIds?: readonly string[];
  /** Styles préférés (equilibre, rapide, gourmand, famille, monde, vegetal) : favorisés, jamais imposés. */
  styles?: readonly string[];
}

/** Filtres de la maquette AppPlan (« Varier la semaine »). */
export interface PlanFilters {
  vegetarian?: boolean;
  quick?: boolean;
  seasonal?: boolean;
  kids?: boolean;
  batch?: boolean;
}

export interface PlannedMeal {
  /** 1 = lundi … 7 = dimanche. */
  day: number;
  slot: MealSlot;
  recipeId: string;
  locked: boolean;
}

export interface GenerateOptions {
  /** Mois de la semaine planifiée (1 à 12). */
  month: number;
  /** Repas verrouillés : conservés tels quels. */
  locked?: readonly PlannedMeal[];
  filters?: PlanFilters;
  /** Recettes de la semaine précédente : évitées si possible. */
  recentRecipeIds?: readonly string[];
  /** Coût visé par part (budget du foyer), en centimes : les recettes plus chères sont pénalisées. */
  budgetPerServingCents?: number;
  /** Aléa dans [0, 1[ (Math.random par défaut) : injecter `seededRandom(n)` pour des tests déterministes. */
  random?: () => number;
}

export const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
export const SLOTS: readonly MealSlot[] = ['dejeuner', 'diner'];
/** Au plus 2 plats de la même famille par semaine (avant relâchement). */
export const MAX_PER_FAMILY = 2;
const WEEKDAY_LIMIT: Record<CookingTime, number> = { moins_30: 30, '30_45': 45, peu_importe: Infinity };

export class PlannerError extends Error {}

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

// Préférence du questionnaire → test sur la recette.
const EXCLUSION_RULES: Partial<Record<PreferenceId, (r: PlannerRecipe) => boolean>> = {
  vegetarien: (r) => r.diets.includes('vegetarien'),
  halal: (r) => r.diets.includes('halal'),
  sans_porc: (r) => r.diets.includes('sans_porc'),
  sans_gluten: (r) => r.diets.includes('sans_gluten'),
  sans_lactose: (r) => !r.tags.includes('lactose'),
  sans_poisson: (r) => !r.tags.includes('poisson'),
  sans_fruits_a_coque: (r) => !r.tags.includes('fruits_a_coque'),
  peu_epice: (r) => !r.tags.includes('epice'),
};

/**
 * La recette est-elle faisable avec l'équipement du foyer ? Le four peut être remplacé par un
 * air fryer quand la recette est marquée 'air_fryer'.
 */
export function canCook(recipe: PlannerRecipe, equipment: readonly string[] | undefined): boolean {
  if (!equipment || !recipe.equipment) return true;
  if (recipe.equipment.includes('plaques') && !equipment.includes('plaques')) return false;
  if (
    recipe.equipment.includes('four') &&
    !equipment.includes('four') &&
    !(equipment.includes('air_fryer') && recipe.tags.includes('air_fryer'))
  )
    return false;
  return true;
}

/**
 * La recette respecte-t-elle le régime, les exclusions et l'équipement du foyer ?
 * (contrainte stricte, jamais relâchée)
 */
export function isRecipeAllowed(recipe: PlannerRecipe, household: PlannerHousehold): boolean {
  if (household.diet !== 'omnivore' && !recipe.diets.includes(household.diet)) return false;
  for (const ex of household.exclusions) {
    const rule = EXCLUSION_RULES[ex as PreferenceId];
    if (rule && !rule(recipe)) return false;
  }
  return canCook(recipe, household.equipment);
}

/** La recette contient-elle un produit que le foyer n'aime pas ? */
export function hasDisliked(recipe: PlannerRecipe, disliked: readonly string[] | undefined): boolean {
  if (!disliked?.length || !recipe.productIds) return false;
  return recipe.productIds.some((p) => disliked.includes(p));
}

/** La recette correspond-elle à un des styles choisis ? */
export function matchesStyle(r: PlannerRecipe, style: string): boolean {
  if (style === 'rapide') return r.totalMinutes <= 30;
  if (style === 'famille') return r.tags.includes('enfants');
  if (style === 'vegetal') return r.diets.includes('vegetarien');
  return r.tags.includes(style);
}

/** Créneaux à planifier pour ce foyer (jours choisis × midi et/ou soir), dans l'ordre de la semaine. */
export function householdSlots(household: Pick<PlannerHousehold, 'mealDays' | 'withLunch'>) {
  const days = DAYS.filter((d) => !household.mealDays || household.mealDays.includes(d));
  const slots: readonly MealSlot[] = household.withLunch === false ? ['diner'] : SLOTS;
  return days.flatMap((day) => slots.map((slot) => ({ day, slot })));
}

/** Coût visé par part pour tenir un budget hebdomadaire (null sans budget). */
export function budgetPerServing(budgetCents: number | null | undefined, meals: number, servings: number) {
  if (!budgetCents || meals <= 0 || servings <= 0) return null;
  return Math.floor(budgetCents / (meals * servings));
}

function matchesFilters(r: PlannerRecipe, f: PlanFilters, month: number): boolean {
  if (f.vegetarian && !r.diets.includes('vegetarien')) return false;
  if (f.quick && r.totalMinutes > 30) return false;
  if (f.seasonal && !r.seasonMonths.includes(month)) return false;
  if (f.kids && !r.tags.includes('enfants')) return false;
  if (f.batch && !r.tags.includes('batch')) return false;
  return true;
}

const key = (day: number, slot: MealSlot) => `${day}:${slot}`;

interface Context {
  household: PlannerHousehold;
  month: number;
  pool: PlannerRecipe[];
  byId: Map<string, PlannerRecipe>;
  recent: Set<string>;
  random: () => number;
  minCost: number;
  maxCost: number;
  budget: number | null;
}

/**
 * Niveaux de contraintes, du plus strict au plus souple. On descend d'un niveau seulement
 * si aucune recette ne convient pour un créneau (petit catalogue, régime très restrictif).
 */
const LEVELS = [
  { familyCap: MAX_PER_FAMILY, time: true, unique: true },
  { familyCap: MAX_PER_FAMILY + 1, time: true, unique: true },
  { familyCap: Infinity, time: true, unique: true },
  { familyCap: Infinity, time: false, unique: true },
  { familyCap: Infinity, time: false, unique: false },
] as const;

function pickFor(
  day: number,
  slot: MealSlot,
  plan: Map<string, PlannedMeal>,
  ctx: Context,
  exclude?: string,
): PlannerRecipe {
  const meals = [...plan.values()];
  const used = new Set(meals.map((m) => m.recipeId));
  const familyCount = new Map<string, number>();
  for (const m of meals) {
    const f = ctx.byId.get(m.recipeId)?.family;
    if (f) familyCount.set(f, (familyCount.get(f) ?? 0) + 1);
  }
  const sameDay = meals.filter((m) => m.day === day).map((m) => ctx.byId.get(m.recipeId)?.family);
  const neighbours = meals
    .filter((m) => Math.abs(m.day - day) === 1)
    .map((m) => ctx.byId.get(m.recipeId)?.family);
  const limit = day <= 5 ? WEEKDAY_LIMIT[ctx.household.cookingTime] : Infinity;

  for (const level of LEVELS) {
    const candidates = ctx.pool.filter(
      (r) =>
        r.id !== exclude &&
        (!level.unique || !used.has(r.id)) &&
        (familyCount.get(r.family) ?? 0) < level.familyCap &&
        (!level.time || r.totalMinutes <= limit) &&
        // Jamais deux fois la même famille le même jour, jamais la même recette le même jour.
        !sameDay.includes(r.family) &&
        !meals.some((m) => m.day === day && m.recipeId === r.id),
    );
    if (candidates.length === 0) continue;
    let best: PlannerRecipe | undefined;
    let bestScore = Infinity;
    for (const r of candidates) {
      const s = score(r, ctx, neighbours);
      if (s < bestScore) {
        bestScore = s;
        best = r;
      }
    }
    if (best) return best;
  }
  throw new PlannerError(`Aucune recette possible pour le jour ${day} (${slot})`);
}

/** Plus le score est bas, meilleure est la recette. Coût, saison et variété, plus une part d'aléa. */
function score(r: PlannerRecipe, ctx: Context, neighbours: (string | undefined)[]): number {
  const span = ctx.maxCost - ctx.minCost || 1;
  const cost = r.costPerServingCents === null ? 1 : (r.costPerServingCents - ctx.minCost) / span;
  let s = cost * 1.2 + ctx.random() * 1.4;
  if (!r.seasonMonths.includes(ctx.month)) s += 1.5;
  if (neighbours.includes(r.family)) s += 0.6;
  if (ctx.recent.has(r.id)) s += 0.8;
  if (r.costPerServingCents === null) s += 2;
  if (ctx.budget && r.costPerServingCents !== null && r.costPerServingCents > ctx.budget)
    s += ((r.costPerServingCents - ctx.budget) / ctx.budget) * 2.5;
  if (ctx.household.styles?.some((st) => matchesStyle(r, st))) s -= 0.6;
  if (hasDisliked(r, ctx.household.dislikedProductIds)) s += 3;
  return s;
}

function context(
  household: PlannerHousehold,
  recipes: readonly PlannerRecipe[],
  opts: GenerateOptions,
): Context {
  const f = opts.filters ?? {};
  const permitted = recipes.filter((r) => isRecipeAllowed(r, household));
  if (permitted.length === 0) throw new PlannerError('Aucune recette ne correspond à ce foyer');
  // Ingrédients non aimés : écartés tant qu'il reste de quoi varier, sinon seulement pénalisés.
  const liked = permitted.filter((r) => !hasDisliked(r, household.dislikedProductIds));
  const allowed = liked.length >= 7 ? liked : permitted;
  // Les filtres choisis sont respectés tant qu'ils laissent assez de recettes pour varier la semaine.
  const filtered = allowed.filter((r) => matchesFilters(r, f, opts.month));
  const pool = filtered.length >= 7 ? filtered : allowed;
  const costs = pool.map((r) => r.costPerServingCents).filter((c): c is number => c !== null);
  return {
    household,
    month: opts.month,
    pool,
    byId: new Map(recipes.map((r) => [r.id, r])),
    recent: new Set(opts.recentRecipeIds ?? []),
    random: opts.random ?? Math.random,
    minCost: costs.length ? Math.min(...costs) : 0,
    maxCost: costs.length ? Math.max(...costs) : 0,
    budget: opts.budgetPerServingCents ?? null,
  };
}

/**
 * Compose les repas de la semaine : les créneaux du foyer (14 par défaut, midi et soir, lundi → dimanche).
 * Les repas verrouillés sont conservés à leur place ; les autres sont choisis pour respecter
 * régime et exclusions (toujours), puis variété, temps de cuisine en semaine, saison et coût.
 */
export function generatePlan(
  household: PlannerHousehold,
  recipes: readonly PlannerRecipe[],
  opts: GenerateOptions,
): PlannedMeal[] {
  const ctx = context(household, recipes, opts);
  const plan = new Map<string, PlannedMeal>();
  const order = householdSlots(household);
  const wanted = new Set(order.map((o) => key(o.day, o.slot)));
  for (const m of opts.locked ?? [])
    if (wanted.has(key(m.day, m.slot))) plan.set(key(m.day, m.slot), { ...m, locked: true });
  // Les jours de semaine d'abord (créneaux les plus contraints par le temps), puis le reste.
  order.sort((a, b) => Number(b.day <= 5) - Number(a.day <= 5));
  for (const { day, slot } of order) {
    if (plan.has(key(day, slot))) continue;
    const r = pickFor(day, slot, plan, ctx);
    plan.set(key(day, slot), { day, slot, recipeId: r.id, locked: false });
  }
  return sortMeals([...plan.values()]);
}

/** Remplace un repas par une autre recette compatible (les autres repas ne bougent pas). */
export function replaceMeal(
  plan: readonly PlannedMeal[],
  target: { day: number; slot: MealSlot },
  household: PlannerHousehold,
  recipes: readonly PlannerRecipe[],
  opts: GenerateOptions,
): PlannedMeal {
  const ctx = context(household, recipes, opts);
  const current = plan.find((m) => m.day === target.day && m.slot === target.slot);
  const others = new Map(plan.filter((m) => m !== current).map((m) => [key(m.day, m.slot), m] as const));
  const r = pickFor(target.day, target.slot, others, ctx, current?.recipeId);
  return { day: target.day, slot: target.slot, recipeId: r.id, locked: false };
}

export function sortMeals<T extends { day: number; slot: MealSlot }>(meals: T[]): T[] {
  return meals.sort((a, b) => a.day - b.day || SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot));
}

/** Nombre de parts à cuisiner par repas : un enfant compte pour 0,7 part, arrondi à la part supérieure. */
export function mealServings(adults: number, children: number): number {
  return Math.max(1, Math.ceil(adults + children * 0.7 - 1e-9));
}
