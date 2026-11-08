'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAccount } from '@/lib/household';
import { householdUpdateFromDraft } from '@/lib/onboarding';
import { rebuildCurrentWeek } from '@/lib/plan';
import { THEME_COOKIE } from '@/lib/theme';
import type { OnboardingDraft } from '@/components/onboarding/schema';

export async function setTheme(choice: unknown) {
  const c = z.enum(['auto', 'clair', 'sombre']).safeParse(choice);
  if (!c.success) return;
  (await cookies()).set(THEME_COOKIE, c.data, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  revalidatePath('/app', 'layout');
}

const notifSchema = z.object({ notify_thursday: z.boolean(), notify_promos: z.boolean() });

/** Préférences de notifications (colonnes autorisées à l'utilisateur, migration 0003). */
export async function setNotifications(input: unknown) {
  const parsed = notifSchema.safeParse(input);
  if (!parsed.success) return;
  const { supabase, profile } = await getAccount();
  await supabase.from('profiles').update(parsed.data).eq('id', profile.id);
  revalidatePath('/app/profil');
}

/**
 * Une réponse du questionnaire modifiée depuis le profil : enregistre le foyer, puis recompose la
 * semaine en cours si elle n'est pas encore validée (sinon, la suivante en tiendra compte).
 */
export async function updatePreferences(
  draft: OnboardingDraft,
): Promise<{ error?: string; result?: 'recomposee' | 'validee' | 'aucune' }> {
  const update = householdUpdateFromDraft(draft);
  if (!update) return { error: 'Une réponse n’est pas valide : vérifie-la et réessaie.' };
  const { supabase, household } = await getAccount('/app/profil');
  const { data: saved, error } = await supabase
    .from('households')
    .update(update)
    .eq('id', household.id)
    .select()
    .single();
  if (error || !saved) return { error: 'L’enregistrement n’a pas marché. Réessaie dans un instant.' };
  const result = await rebuildCurrentWeek(supabase, saved);
  revalidatePath('/app', 'layout');
  return { result };
}
