// Logique foyer partagée (onboarding, profil, abonnement). Fonctions pures.

/** Facteur de quantités/budget d'un foyer, par rapport au foyer de référence 2 adultes + 2 enfants (= 1). */
export function householdFactor(adults: number, children: number): number {
  if (adults < 1) throw new Error('au moins 1 adulte');
  if (children < 0) throw new Error('enfants ≥ 0');
  return (adults + children * 0.7) / 3.4;
}

export type Diet = 'omnivore' | 'sans_porc' | 'vegetarien' | 'vegan' | 'halal' | 'sans_gluten';

/** Préférences proposées à l'onboarding (maquette AppOnboarding, étape 2). */
export const PREFERENCES = [
  { id: 'vegetarien', label: 'Végétarien' },
  { id: 'sans_porc', label: 'Sans porc' },
  { id: 'sans_gluten', label: 'Sans gluten' },
  { id: 'sans_lactose', label: 'Sans lactose' },
  { id: 'halal', label: 'Halal' },
  { id: 'sans_poisson', label: 'Sans poisson' },
  { id: 'sans_fruits_a_coque', label: 'Sans fruits à coque' },
  { id: 'peu_epice', label: 'Peu épicé' },
] as const;

export type PreferenceId = (typeof PREFERENCES)[number]['id'];
export const PREFERENCE_IDS = PREFERENCES.map((p) => p.id) as PreferenceId[];

// Le schéma n'a qu'un régime principal (households.diet) : on retient le plus structurant,
// les autres choix vont dans households.exclusions.
const DIET_PRIORITY: Diet[] = ['vegetarien', 'halal', 'sans_porc'];

export function dietFromPreferences(selected: readonly PreferenceId[]): {
  diet: Diet;
  exclusions: PreferenceId[];
} {
  const unique = PREFERENCE_IDS.filter((id) => selected.includes(id));
  const diet = DIET_PRIORITY.find((d) => (unique as string[]).includes(d)) ?? 'omnivore';
  return { diet, exclusions: unique.filter((id) => id !== diet) };
}

export function preferencesFromHousehold(diet: Diet, exclusions: readonly string[]): PreferenceId[] {
  const set = new Set<string>(exclusions);
  if (diet === 'vegan') set.add('vegetarien');
  else if (diet !== 'omnivore') set.add(diet);
  return PREFERENCE_IDS.filter((id) => set.has(id));
}

/** Jours d'essai Premium restants (jours bonus inclus), arrondis au jour supérieur, jamais négatifs. */
export function trialDaysLeft(trialEndsAt: string | Date, bonusDays: number, now: Date = new Date()): number {
  const end = new Date(trialEndsAt).getTime() + bonusDays * 86_400_000;
  return Math.max(0, Math.ceil((end - now.getTime()) / 86_400_000));
}

/** Styles de repas du questionnaire (« Quelle ambiance ? »), 3 au plus. */
export const STYLES = [
  { id: 'equilibre', label: 'Équilibré', hint: 'Légumes et légèreté' },
  { id: 'rapide', label: 'Rapide & facile', hint: '30 minutes ou moins' },
  { id: 'gourmand', label: 'Gourmand', hint: 'Gratins, tartes, fromage' },
  { id: 'famille', label: 'En famille', hint: 'Ce que les enfants aiment' },
  { id: 'monde', label: 'Saveurs du monde', hint: 'Curry, épices, coco' },
  { id: 'vegetal', label: 'Plus végétal', hint: 'Moins de viande' },
] as const;
export type StyleId = (typeof STYLES)[number]['id'];
export const STYLE_IDS = STYLES.map((s) => s.id) as StyleId[];
export const MAX_STYLES = 3;

/** Équipement de cuisine du foyer. */
export const EQUIPMENT = [
  { id: 'plaques', label: 'Plaques', hint: 'Induction, vitrocéramique' },
  { id: 'gaziniere', label: 'Gazinière', hint: 'Feux au gaz, bouteille ou ville' },
  { id: 'four', label: 'Four', hint: null },
  { id: 'air_fryer', label: 'Air fryer', hint: null },
  { id: 'micro_ondes', label: 'Micro-ondes', hint: 'Pour réchauffer' },
  { id: 'robot', label: 'Robot cuiseur', hint: 'Thermomix, Cookeo…' },
] as const;
export type EquipmentId = (typeof EQUIPMENT)[number]['id'];
export const EQUIPMENT_IDS = EQUIPMENT.map((e) => e.id) as EquipmentId[];

/**
 * Cuisines du monde (questionnaire « Quelles cuisines te font envie ? »), favorisées dans le plan.
 * `plat` : illustration <Plat> de la carte.
 */
export const CUISINES = [
  { id: 'francaise', label: 'Française', hint: 'Gratins, soupes, quiches', plat: 'gratin' },
  { id: 'europeenne', label: 'Européenne', hint: 'Tortilla, plats d’ailleurs en Europe', plat: 'omelette' },
  { id: 'italienne', label: 'Italienne', hint: 'Pâtes, risotto, lasagnes', plat: 'pates' },
  { id: 'reunionnaise', label: 'Réunionnaise', hint: 'Caris, rougails, grains', plat: 'curry' },
  { id: 'iles', label: 'Des îles', hint: 'Colombo, poisson coco', plat: 'poisson' },
  { id: 'anglaise', label: 'Anglaise', hint: 'Pies, fish pie', plat: 'lasagnes' },
  { id: 'americaine', label: 'Américaine', hint: 'Chili, fajitas', plat: 'riz' },
  { id: 'asiatique', label: 'Asiatique', hint: 'Riz sautés, wok', plat: 'riz' },
  { id: 'indienne', label: 'Indienne', hint: 'Dahl, currys', plat: 'dahl' },
  { id: 'africaine', label: 'Africaine', hint: 'Yassa, mafé, couscous', plat: 'soupe' },
] as const;
export type CuisineId = (typeof CUISINES)[number]['id'];
export const CUISINE_IDS = CUISINES.map((c) => c.id) as CuisineId[];

/** Ce qui amène le foyer (premier écran du questionnaire, stats du back-office). */
export const MOTIVATIONS = [
  {
    id: 'inspiration',
    label: 'Je ne sais jamais quoi cuisiner',
    hint: 'Les idées de la semaine, prêtes le jeudi.',
  },
  {
    id: 'budget',
    label: 'Mes courses me coûtent trop cher',
    hint: 'Le prix de ta liste, enseigne par enseigne.',
  },
  { id: 'temps', label: 'Je manque de temps', hint: 'Des recettes rapides les soirs de semaine.' },
  {
    id: 'equilibre',
    label: 'Je voudrais manger plus équilibré',
    hint: 'Des légumes de saison, sans y penser.',
  },
  { id: 'gaspillage', label: 'Je jette trop de nourriture', hint: 'Les bonnes quantités pour ton foyer.' },
] as const;
export type MotivationId = (typeof MOTIVATIONS)[number]['id'];
export const MOTIVATION_IDS = MOTIVATIONS.map((m) => m.id) as MotivationId[];

/** Bornes du budget hebdomadaire (questionnaire), en centimes. */
export const BUDGET_MIN_CENTS = 1000;
export const BUDGET_MAX_CENTS = 30000;

// Jours planifiés du foyer (1 = lundi … 7 = dimanche) : textes d'affichage.
export const DAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

/** « Du lundi au vendredi », « Toute la semaine », « Lundi, mercredi et samedi »… */
export function daysSummary(days: readonly number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return 'Toute la semaine';
  if (sorted.length === 0) return 'Aucun jour';
  if (sorted.length === 1) return `Le ${DAY_NAMES[sorted[0]! - 1]}`;
  const contiguous = sorted.every((d, i) => i === 0 || d === sorted[i - 1]! + 1);
  if (contiguous) return `Du ${DAY_NAMES[sorted[0]! - 1]} au ${DAY_NAMES[sorted.at(-1)! - 1]}`;
  const names = sorted.map((d) => DAY_NAMES[d - 1]!);
  const text = `${names.slice(0, -1).join(', ')} et ${names.at(-1)}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
