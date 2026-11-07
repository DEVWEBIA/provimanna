'use server';

import { getAccount } from '@/lib/household';
import { householdUpdateFromDraft } from '@/lib/onboarding';
import type { OnboardingDraft } from '@/components/onboarding/schema';

/** Enregistre le questionnaire d'un compte déjà connecté. */
export async function saveOnboarding(draft: OnboardingDraft): Promise<{ error?: string }> {
  const update = householdUpdateFromDraft(draft);
  if (!update) return { error: 'Il manque une réponse : vérifie les étapes précédentes.' };
  const { supabase, household } = await getAccount('/app/bienvenue');
  const { error } = await supabase.from('households').update(update).eq('id', household.id);
  return error ? { error: 'L’enregistrement n’a pas marché. Réessaie dans un instant.' } : {};
}
