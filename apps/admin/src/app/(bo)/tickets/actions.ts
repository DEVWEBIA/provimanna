'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isAberrant, isPromoLine, isStoreId, medianCents, receiptRewardDays } from '@repas/core';
import { requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';

export type TicketResult = { ok: true; message: string } | { ok: false; error: string };

const publishSchema = z.object({
  receiptId: z.guid(),
  storeId: z.string().refine(isStoreId, { error: 'Choisis l’enseigne du ticket.' }),
  lines: z.array(z.object({ id: z.guid(), accept: z.boolean(), productId: z.guid().nullable() })),
});

const monthStart = (now: Date) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

/**
 * Publier un ticket : décisions ligne par ligne, prix acceptés ajoutés (source « ticket », aberrants
 * signalés par core), jours de Premium offerts dans la limite mensuelle, photo supprimée, action journalisée.
 * Lecture et décisions avec les droits du modérateur (RLS) ; prix, bonus et photo avec la clé serveur.
 */
export async function publishReceipt(input: unknown): Promise<TicketResult> {
  const parsed = publishSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Décision invalide.' };
  const { supabase, user } = await requireRole(['moderateur_prix']);
  const { receiptId, storeId, lines } = parsed.data;
  const { data: receipt } = await supabase
    .from('receipts')
    .select(
      'id, user_id, photo_path, purchased_at, created_at, status, receipt_lines(id, raw_text, cents, product_id)',
    )
    .eq('id', receiptId)
    .in('status', ['en_attente', 'en_revue'])
    .maybeSingle();
  if (!receipt) return { ok: false, error: 'Ce ticket a déjà été traité ou n’existe plus.' };

  const byId = new Map(receipt.receipt_lines.map((l) => [l.id, l]));
  for (const d of lines) {
    const line = byId.get(d.id);
    if (!line) continue;
    const decision = !d.accept ? 'ignore' : d.productId !== line.product_id ? 'corrige' : 'accepte';
    await supabase.from('receipt_lines').update({ decision, product_id: d.productId }).eq('id', d.id);
  }

  const admin = createAdminClient();
  const observedAt = receipt.purchased_at ?? receipt.created_at.slice(0, 10);
  const accepted = lines.flatMap((d) => {
    const line = byId.get(d.id);
    return d.accept && d.productId && line && (line.cents ?? 0) > 0 && !isPromoLine(line.raw_text)
      ? [{ productId: d.productId, cents: line.cents! }]
      : [];
  });
  // Médiane des 30 derniers jours dans l'enseigne : un prix trop éloigné part dans la file des aberrants.
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const { data: recent } = accepted.length
    ? await admin
        .from('prices')
        .select('product_id, cents')
        .eq('store_id', storeId)
        .eq('flagged_aberrant', false)
        .gte('observed_at', since)
        .in('product_id', [...new Set(accepted.map((a) => a.productId))])
    : { data: [] };
  const rows = accepted.map((a) => {
    const ref = (recent ?? []).filter((p) => p.product_id === a.productId).map((p) => p.cents);
    return {
      product_id: a.productId,
      store_id: storeId,
      cents: a.cents,
      observed_at: observedAt,
      source: 'ticket' as const,
      receipt_id: receiptId,
      flagged_aberrant: ref.length > 0 && isAberrant(a.cents, medianCents(ref)),
    };
  });
  if (rows.length) {
    const { error } = await admin.from('prices').insert(rows);
    if (error) return { ok: false, error: 'Impossible d’enregistrer les prix.' };
  }

  // Jours de Premium : plafond mensuel par utilisateur.
  const { data: month } = await admin
    .from('receipts')
    .select('reward_days')
    .eq('user_id', receipt.user_id)
    .eq('status', 'valide')
    .gte('created_at', monthStart(new Date()));
  const reward = receiptRewardDays((month ?? []).reduce((s, r) => s + r.reward_days, 0));
  if (reward > 0) {
    const { data: profile } = await admin
      .from('profiles')
      .select('household_id')
      .eq('id', receipt.user_id)
      .single();
    const { data: sub } = profile?.household_id
      ? await admin
          .from('subscriptions')
          .select('bonus_days')
          .eq('household_id', profile.household_id)
          .maybeSingle()
      : { data: null };
    if (sub && profile?.household_id) {
      await admin
        .from('subscriptions')
        .update({ bonus_days: sub.bonus_days + reward, updated_at: new Date().toISOString() })
        .eq('household_id', profile.household_id);
    }
  }

  await supabase
    .from('receipts')
    .update({ status: 'valide', store_id: storeId, reward_days: reward, reviewed_by: user.id })
    .eq('id', receiptId);
  await admin.storage.from('receipts').remove([receipt.photo_path]);
  await supabase.rpc('log_action', {
    p_action: 'ticket.publier',
    p_entity: 'receipts',
    p_entity_id: receiptId,
    p_details: { prix: rows.length, aberrants: rows.filter((r) => r.flagged_aberrant).length, jours: reward },
  });
  revalidatePath('/', 'layout');
  return { ok: true, message: `${rows.length} prix publiés${reward ? `, +${reward} jours offerts` : ''}.` };
}

/** Rejeter un ticket (illisible, ancien, hors alimentation) : aucun prix, photo supprimée, action journalisée. */
export async function rejectReceipt(receiptId: unknown): Promise<TicketResult> {
  const id = z.guid().safeParse(receiptId);
  if (!id.success) return { ok: false, error: 'Ticket invalide.' };
  const { supabase, user } = await requireRole(['moderateur_prix']);
  const { data } = await supabase
    .from('receipts')
    .update({ status: 'rejete', reviewed_by: user.id })
    .eq('id', id.data)
    .in('status', ['en_attente', 'en_revue'])
    .select('photo_path')
    .maybeSingle();
  if (!data) return { ok: false, error: 'Ce ticket a déjà été traité ou n’existe plus.' };
  await createAdminClient().storage.from('receipts').remove([data.photo_path]);
  await supabase.rpc('log_action', {
    p_action: 'ticket.rejeter',
    p_entity: 'receipts',
    p_entity_id: id.data,
    p_details: {},
  });
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Ticket rejeté.' };
}
