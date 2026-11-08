'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/staff';

/** Active ou suspend un défi (session de l'admin, RLS « admin »), journalisé. */
export async function toggleChallenge(id: unknown, active: unknown) {
  const i = z.string().min(1).max(60).safeParse(id);
  const a = z.boolean().safeParse(active);
  if (!i.success || !a.success) return;
  const { supabase } = await requireRole(['admin']);
  const { error } = await supabase.from('challenges').update({ active: a.data }).eq('id', i.data);
  if (error) return;
  await supabase.rpc('log_action', {
    p_action: a.data ? 'defi.activer' : 'defi.suspendre',
    p_entity: 'challenges',
    p_entity_id: i.data,
    p_details: {},
  });
  revalidatePath('/engagement');
}
