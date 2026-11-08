import {
  dietFromPreferences,
  EQUIPMENT_IDS,
  MOTIVATION_IDS,
  preferencesFromHousehold,
  STYLE_IDS,
  type EquipmentId,
  type MotivationId,
  type StoreId,
  type StyleId,
} from '@repas/core';
import type { Database } from '@repas/core/database.types';
import { onboardingDraftSchema } from '@/components/onboarding/schema';
import type { WizardDraft } from '@/components/onboarding/wizard';

/** Réponses du questionnaire → colonnes du foyer. Renvoie null si les réponses sont invalides. */
export function householdUpdateFromDraft(
  input: unknown,
): Database['public']['Tables']['households']['Update'] | null {
  const parsed = onboardingDraftSchema.safeParse(input);
  if (!parsed.success) return null;
  const d = parsed.data;
  const { diet, exclusions } = dietFromPreferences(d.prefs);
  return {
    adults: d.adults,
    children: d.children,
    diet,
    exclusions,
    cooking_time: d.cooking_time,
    preferred_store_id: d.store,
    postal_code: d.postal_code,
    meal_days: d.meal_days,
    with_lunch: d.with_lunch,
    meals_per_week: d.meal_days.length * (d.with_lunch ? 2 : 1),
    weekly_budget_cents: d.budget_cents,
    styles: d.styles,
    equipment: d.equipment,
    disliked_product_ids: d.disliked,
    motivations: d.motivations,
  };
}

type HouseholdRow = Database['public']['Tables']['households']['Row'];

/** Réponses de départ d'un visiteur sans compte. */
export const DEFAULT_DRAFT: WizardDraft = {
  adults: 2,
  children: 0,
  prefs: [],
  cooking_time: 'peu_importe',
  store: null,
  postal_code: '',
  meal_days: [1, 2, 3, 4, 5, 6, 7],
  with_lunch: true,
  budget_cents: null,
  styles: [],
  equipment: ['plaques', 'four'],
  disliked: [],
  motivations: [],
};

/** Foyer enregistré → réponses du questionnaire (compte connecté, modification depuis le profil). */
export function draftFromHousehold(h: HouseholdRow): WizardDraft {
  return {
    adults: h.adults,
    children: h.children,
    prefs: preferencesFromHousehold(h.diet, h.exclusions),
    cooking_time: h.cooking_time,
    store: (h.preferred_store_id as StoreId | null) ?? null,
    postal_code: h.postal_code ?? '',
    meal_days: [...h.meal_days],
    with_lunch: h.with_lunch,
    budget_cents: h.weekly_budget_cents,
    styles: h.styles.filter((s): s is StyleId => (STYLE_IDS as string[]).includes(s)),
    equipment: h.equipment.filter((e): e is EquipmentId => (EQUIPMENT_IDS as string[]).includes(e)),
    disliked: [...h.disliked_product_ids],
    motivations: h.motivations.filter((m): m is MotivationId => (MOTIVATION_IDS as string[]).includes(m)),
  };
}
