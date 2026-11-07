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

export function dietFromPreferences(selected: readonly PreferenceId[]): { diet: Diet; exclusions: PreferenceId[] } {
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
