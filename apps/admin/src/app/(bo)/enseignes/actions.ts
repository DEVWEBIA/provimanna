'use server';

import { revalidatePath } from 'next/cache';
import { STORE_IDS } from '@repas/core';
import { z } from 'zod';
import { requireRole } from '@/lib/staff';

export type StoreState = { status: 'idle' } | { status: 'ok' | 'error'; message: string };

const schema = z.object({
  id: z.enum(STORE_IDS),
  name: z.string().trim().min(2).max(40),
  initials: z
    .string()
    .trim()
    .length(2, 'La pastille fait 2 lettres.')
    .transform((v) => v.toUpperCase()),
  drive_url: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null)
    .refine((v) => v === null || /^https:\/\//.test(v), 'Le lien du drive commence par https://'),
  active: z.literal('on').optional(),
});

/** Modifie une enseigne (session de l'admin, RLS « staff écrit »), journalisé. */
export async function updateStore(_prev: StoreState, formData: FormData): Promise<StoreState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0]!.message };
  const { supabase } = await requireRole(['admin']);
  const { id, active, ...rest } = parsed.data;
  const { error } = await supabase
    .from('stores')
    .update({ ...rest, active: active === 'on' })
    .eq('id', id);
  if (error) return { status: 'error', message: 'Enregistrement impossible.' };
  await supabase.rpc('log_action', {
    p_action: 'enseigne.modifier',
    p_entity: 'stores',
    p_entity_id: id,
    p_details: { ...rest, active: active === 'on' },
  });
  revalidatePath('/enseignes');
  return { status: 'ok', message: 'Enseigne enregistrée.' };
}
