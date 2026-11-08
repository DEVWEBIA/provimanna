'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/staff';

const schema = z.object({
  priceId: z.number().int().positive(),
  decision: z.enum(['valider', 'rejeter', 'promo']),
});

export type ModerationResult = { ok: true } | { ok: false; error: string };

/**
 * Décision sur un relevé aberrant. Valider : le prix entre dans la médiane. Rejeter ou promo : il reste
 * masqué. Le relevé est marqué comme traité (moderated_by) et la décision journalisée (log_action).
 */
export async function moderatePrice(input: unknown): Promise<ModerationResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Décision invalide.' };
  const { supabase, user } = await requireRole(['moderateur_prix']);
  const { priceId, decision } = parsed.data;
  const { data, error } = await supabase
    .from('prices')
    .update({ flagged_aberrant: decision !== 'valider', moderated_by: user.id })
    .eq('id', priceId)
    .eq('flagged_aberrant', true)
    .is('moderated_by', null)
    .select('id, product_id, store_id, cents')
    .maybeSingle();
  if (error || !data) return { ok: false, error: 'Ce relevé a déjà été traité ou n’existe plus.' };
  await supabase.rpc('log_action', {
    p_action: `prix.${decision}`,
    p_entity: 'prices',
    p_entity_id: String(priceId),
    p_details: { product_id: data.product_id, store_id: data.store_id, cents: data.cents },
  });
  revalidatePath('/', 'layout');
  return { ok: true };
}
