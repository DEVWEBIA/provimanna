import { dietFromPreferences } from '@repas/core';
import type { Database } from '@repas/core/database.types';
import { onboardingDraftSchema } from '@/components/onboarding/schema';

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
  };
}
