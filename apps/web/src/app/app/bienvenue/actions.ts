'use server';

import { redirect } from 'next/navigation';
import { dietFromPreferences } from '@repas/core';
import type { Database } from '@repas/core/database.types';
import { getAccount } from '@/lib/household';
import { enseigneSchema, foyerSchema, preferencesSchema } from './schemas';

export type StepState = { error?: string; field?: string };

async function updateHousehold(values: Database['public']['Tables']['households']['Update']) {
  const { supabase, household } = await getAccount('/app/bienvenue');
  const { error } = await supabase.from('households').update(values).eq('id', household.id);
  if (error) throw new Error(`Enregistrement du foyer impossible : ${error.message}`);
}

export async function saveFoyer(_prev: StepState, fd: FormData): Promise<StepState> {
  const parsed = foyerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: 'Il faut au moins 1 adulte, et 8 personnes au plus par catégorie.' };
  await updateHousehold(parsed.data);
  redirect('/app/bienvenue?etape=2');
}

export async function savePreferences(_prev: StepState, fd: FormData): Promise<StepState> {
  const parsed = preferencesSchema.safeParse({
    prefs: fd.getAll('pref').map(String),
    cooking_time: fd.get('cooking_time'),
  });
  if (!parsed.success) return { error: 'Choisis un temps de cuisine.' };
  const { diet, exclusions } = dietFromPreferences(parsed.data.prefs);
  await updateHousehold({ diet, exclusions, cooking_time: parsed.data.cooking_time });
  redirect('/app/bienvenue?etape=3');
}

export async function saveEnseigne(_prev: StepState, fd: FormData): Promise<StepState> {
  const parsed = enseigneSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue?.message, field: String(issue?.path[0] ?? '') };
  }
  await updateHousehold({ preferred_store_id: parsed.data.store, postal_code: parsed.data.postal_code });
  redirect('/app/bienvenue?etape=4');
}
