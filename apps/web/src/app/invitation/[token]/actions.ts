'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { MAX_MEMBERS } from '@/lib/family';
import { getAccount } from '@/lib/household';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Accepter une invitation : vérifiée et appliquée par le serveur (l'utilisateur ne peut pas modifier
 * lui-même profiles.household_id, faille fermée par la migration 0003).
 */
export async function acceptInvite(token: unknown): Promise<{ error: string }> {
  const t = z
    .string()
    .regex(/^[0-9a-f]{48}$/)
    .safeParse(token);
  if (!t.success) return { error: 'Lien d’invitation invalide.' };
  const { profile, household } = await getAccount(`/invitation/${t.data}`);
  const admin = createAdminClient();
  const { data: invite } = await admin
    .from('household_invites')
    .select('id, household_id, accepted_at, expires_at')
    .eq('token', t.data)
    .maybeSingle();
  if (!invite || invite.accepted_at || Date.parse(invite.expires_at) < Date.now())
    return { error: 'Cette invitation a expiré ou a déjà servi.' };
  if (invite.household_id === household.id) redirect('/app/famille');
  const [{ count: mine }, { count: theirs }] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('household_id', household.id),
    admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('household_id', invite.household_id),
  ]);
  if ((mine ?? 0) > 1)
    return {
      error: 'Tu fais déjà partie d’un foyer avec d’autres membres : quitte-le d’abord depuis Famille.',
    };
  if ((theirs ?? 0) >= MAX_MEMBERS) return { error: 'Ce foyer est déjà complet.' };
  await admin
    .from('profiles')
    .update({ household_id: invite.household_id, is_household_owner: false })
    .eq('id', profile.id);
  await admin.from('household_invites').update({ accepted_at: new Date().toISOString() }).eq('id', invite.id);
  redirect('/app/famille');
}
