'use server';

import type { MealSlot, StoreId } from '@repas/core';
import type { PlatVariant } from '@repas/ui';
import { getAccount } from '@/lib/household';
import { householdUpdateFromDraft } from '@/lib/onboarding';
import { ensureWeekPlan, loadPlanData, planView, rebuildCurrentWeek } from '@/lib/plan';
import { listStores } from '@/lib/stores';
import type { OnboardingDraft } from '@/components/onboarding/schema';

/** Résumé du plan généré à la fin du questionnaire (dernier écran). */
export interface GeneratedPlan {
  weekNumber: number;
  meals: { day: number; slot: MealSlot; illustration: PlatVariant }[];
  myCents: number;
  estimate: boolean;
  cheapestId: StoreId;
  cheapestName: string;
  cheapestCents: number;
  budgetCents: number | null;
}

/** Enregistre le questionnaire d'un compte déjà connecté, puis compose sa semaine. */
export async function saveOnboarding(
  draft: OnboardingDraft,
): Promise<{ error?: string; plan?: GeneratedPlan }> {
  const update = householdUpdateFromDraft(draft);
  if (!update) return { error: 'Il manque une réponse : vérifie les étapes précédentes.' };
  const { supabase, household } = await getAccount('/app/bienvenue');
  const { data: saved, error } = await supabase
    .from('households')
    .update(update)
    .eq('id', household.id)
    .select()
    .single();
  if (error || !saved) return { error: 'L’enregistrement n’a pas marché. Réessaie dans un instant.' };

  // Questionnaire refait : la semaine en cours (non validée) suit les nouvelles réponses.
  // Un échec ici n'empêche pas d'entrer dans l'espace client.
  await rebuildCurrentWeek(supabase, saved);
  const data = await loadPlanData(supabase);
  const plan = await ensureWeekPlan(supabase, saved, data);
  if (!plan) return {};
  const view = planView(plan, saved, data);
  const stores = await listStores(supabase);
  const cheapest = view.comparison.totals[0]!;
  return {
    plan: {
      weekNumber: view.weekNumber,
      meals: view.meals.map((m) => ({ day: m.day, slot: m.slot, illustration: m.recipe.illustration })),
      myCents: view.comparison.reference.cents,
      estimate: view.comparison.reference.freshRatio < 1,
      cheapestId: cheapest.storeId,
      cheapestName: stores.find((s) => s.id === cheapest.storeId)?.name ?? cheapest.storeId,
      cheapestCents: cheapest.cents,
      budgetCents: saved.weekly_budget_cents,
    },
  };
}
