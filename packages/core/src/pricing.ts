/**
 * Moteur de prix — logique pure, sans dépendance, partagée web / admin / mobile.
 * Tous les montants sont en CENTIMES (entiers). Le formatage n'arrive qu'à l'affichage.
 */

export type StoreId = 'lidl' | 'aldi' | 'leclerc' | 'intermarche' | 'carrefour' | 'auchan';

export type PriceSource = 'open_prices' | 'ticket' | 'manual';

export interface PriceObservation {
  productId: string;
  storeId: StoreId;
  /** Prix pour UNE unité de vente du produit (ex. le sachet de 500 g), en centimes. */
  cents: number;
  /** Date ISO du relevé. */
  observedAt: string;
  source: PriceSource;
}

export interface RecipeIngredient {
  productId: string;
  /** Quantité nécessaire pour la recette de base, exprimée en unités de vente (0,5 = un demi-sachet). */
  units: number;
  /** Produit de placard (huile, sel…) : compté au prorata mais exclu de la liste de courses. */
  pantry?: boolean;
}

export interface Recipe {
  id: string;
  servings: number;
  ingredients: RecipeIngredient[];
}

export interface PlanItem {
  recipeId: string;
  /** Nombre de parts voulues pour ce repas (ex. foyer de 4). */
  servings: number;
}

export type Reliability = 'high' | 'medium' | 'low';

export interface ResolvedPrice {
  cents: number;
  /** true si au moins un relevé de moins de `freshDays` jours. */
  fresh: boolean;
  /** Date du relevé le plus récent utilisé. */
  observedAt: string;
}

export const DEFAULTS = {
  freshDays: 7,
  fallbackDays: 30,
  aberrantThreshold: 0.4,
} as const;

const DAY_MS = 86_400_000;

export function medianCents(values: number[]): number {
  if (values.length === 0) throw new Error('medianCents: liste vide');
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid]! : Math.round((s[mid - 1]! + s[mid]!) / 2);
}

/**
 * Prix d'un produit dans une enseigne :
 * 1. médiane des relevés de moins de `freshDays` jours → fiable ;
 * 2. sinon médiane des relevés de moins de `fallbackDays` jours → estimation (fresh = false) ;
 * 3. sinon null (prix inconnu).
 */
export function resolvePrice(
  observations: PriceObservation[],
  productId: string,
  storeId: StoreId,
  now: Date,
  opts: { freshDays?: number; fallbackDays?: number } = {},
): ResolvedPrice | null {
  const freshDays = opts.freshDays ?? DEFAULTS.freshDays;
  const fallbackDays = opts.fallbackDays ?? DEFAULTS.fallbackDays;
  const mine = observations.filter((o) => o.productId === productId && o.storeId === storeId);
  const ageDays = (o: PriceObservation) => (now.getTime() - Date.parse(o.observedAt)) / DAY_MS;
  const pick = (maxAge: number) => mine.filter((o) => ageDays(o) >= 0 && ageDays(o) <= maxAge);

  for (const [maxAge, fresh] of [[freshDays, true], [fallbackDays, false]] as const) {
    const window = pick(maxAge);
    if (window.length > 0) {
      const latest = window.reduce((a, b) => (Date.parse(a.observedAt) > Date.parse(b.observedAt) ? a : b));
      return { cents: medianCents(window.map((o) => o.cents)), fresh, observedAt: latest.observedAt };
    }
  }
  return null;
}

/** Un prix relevé est « aberrant » s'il s'écarte de plus de `threshold` (40 %) de la médiane. */
export function isAberrant(cents: number, median: number, threshold: number = DEFAULTS.aberrantThreshold): boolean {
  if (median <= 0) return false;
  return Math.abs(cents - median) / median > threshold;
}

export function reliabilityFromRatio(freshRatio: number): Reliability {
  if (freshRatio >= 0.9) return 'high';
  if (freshRatio >= 0.6) return 'medium';
  return 'low';
}

export interface ShoppingLine {
  productId: string;
  units: number;
  pantry: boolean;
}

/** Agrège les ingrédients de tout le plan (quantités mises à l'échelle du nombre de parts). */
export function buildShoppingLines(plan: PlanItem[], recipes: Map<string, Recipe>): ShoppingLine[] {
  const acc = new Map<string, ShoppingLine>();
  for (const item of plan) {
    const recipe = recipes.get(item.recipeId);
    if (!recipe) throw new Error(`Recette inconnue : ${item.recipeId}`);
    const factor = item.servings / recipe.servings;
    for (const ing of recipe.ingredients) {
      const prev = acc.get(ing.productId);
      const units = ing.units * factor;
      if (prev) prev.units += units;
      else acc.set(ing.productId, { productId: ing.productId, units, pantry: Boolean(ing.pantry) });
    }
  }
  return [...acc.values()];
}

export interface StoreTotal {
  storeId: StoreId;
  cents: number;
  reliability: Reliability;
  /** Part des lignes dont le prix est frais (0 à 1). */
  freshRatio: number;
  /** Produits sans aucun prix dans cette enseigne (exclus du total). */
  missing: string[];
}

/** Coût du plan dans une enseigne. Les lignes sont valorisées au prorata (units × prix unitaire). */
export function planCostInStore(
  lines: ShoppingLine[],
  storeId: StoreId,
  observations: PriceObservation[],
  now: Date,
): StoreTotal {
  let cents = 0;
  let fresh = 0;
  const missing: string[] = [];
  for (const line of lines) {
    const p = resolvePrice(observations, line.productId, storeId, now);
    if (!p) {
      missing.push(line.productId);
      continue;
    }
    cents += p.cents * line.units;
    if (p.fresh) fresh += 1;
  }
  const freshRatio = lines.length === 0 ? 1 : fresh / lines.length;
  return { storeId, cents: Math.round(cents), reliability: reliabilityFromRatio(freshRatio), freshRatio, missing };
}

export interface Comparison {
  totals: StoreTotal[];
  cheapest: StoreId;
  reference: StoreTotal;
  /** Économie possible vs l'enseigne de référence (≥ 0), en centimes. */
  savingCents: number;
}

/** Compare toutes les enseignes, trie du moins cher au plus cher. */
export function compareStores(
  lines: ShoppingLine[],
  stores: StoreId[],
  referenceStore: StoreId,
  observations: PriceObservation[],
  now: Date,
): Comparison {
  const totals = stores
    .map((s) => planCostInStore(lines, s, observations, now))
    .sort((a, b) => a.cents - b.cents);
  const reference = totals.find((t) => t.storeId === referenceStore);
  if (!reference) throw new Error(`Enseigne de référence absente : ${referenceStore}`);
  const cheapest = totals[0]!;
  return { totals, cheapest: cheapest.storeId, reference, savingCents: Math.max(0, reference.cents - cheapest.cents) };
}

export function costPerServing(totalCents: number, servings: number): number {
  if (servings <= 0) throw new Error('servings doit être > 0');
  return Math.round(totalCents / servings);
}

/** « 71,60 € » — espaces insécables normalisés pour l'affichage et les tests. */
export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
    .format(cents / 100)
    .replace(/[\u202f\u00a0]/g, '\u00a0');
}
