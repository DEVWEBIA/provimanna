'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { MAX_MEMBERS, moveToOwnHousehold } from '@/lib/family';
import { getAccount } from '@/lib/household';
import { SITE_URL } from '@/lib/site';
import { createAdminClient } from '@/lib/supabase/admin';

export type FamilyState =
  | { status: 'idle' }
  | { status: 'ok'; message: string; link?: string }
  | { status: 'error'; message: string };

const inviteSchema = z.object({ email: z.email('Vérifie l’adresse : il manque le @ ou le domaine.') });

/** Invitation dans le foyer (valable 7 jours). Le lien est à transmettre ; l'envoi par email arrive au lot 11. */
export async function inviteMember(_prev: FamilyState, formData: FormData): Promise<FamilyState> {
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0]!.message };
  const { supabase, household, profile } = await getAccount();
  const [{ count: members }, { count: pending }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('household_id', household.id),
    supabase
      .from('household_invites')
      .select('id', { count: 'exact', head: true })
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString()),
  ]);
  if ((members ?? 0) + (pending ?? 0) >= MAX_MEMBERS)
    return { status: 'error', message: `Un foyer compte ${MAX_MEMBERS} membres au plus.` };
  const { data, error } = await supabase
    .from('household_invites')
    .insert({ household_id: household.id, email: parsed.data.email.toLowerCase(), invited_by: profile.id })
    .select('token')
    .single();
  if (error || !data) return { status: 'error', message: 'L’invitation n’a pas pu être créée.' };
  revalidatePath('/app/famille');
  return {
    status: 'ok',
    message: 'Invitation prête : envoie-lui ce lien, valable 7 jours.',
    link: `${SITE_URL}/invitation/${data.token}`,
  };
}

export async function revokeInvite(id: unknown) {
  const parsed = z.guid().safeParse(id);
  if (!parsed.success) return;
  const { supabase } = await getAccount();
  await supabase.from('household_invites').delete().eq('id', parsed.data);
  revalidatePath('/app/famille');
}

/** Retirer un membre (titulaire du foyer) : il retrouve son propre foyer. */
export async function removeMember(profileId: unknown): Promise<FamilyState> {
  const id = z.guid().safeParse(profileId);
  if (!id.success) return { status: 'error', message: 'Membre invalide.' };
  const { supabase, household, profile } = await getAccount();
  if (!profile.is_household_owner)
    return { status: 'error', message: 'Seul le titulaire du foyer peut retirer un membre.' };
  if (id.data === profile.id) return { status: 'error', message: 'Tu ne peux pas te retirer toi-même.' };
  const { data: member } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id.data)
    .eq('household_id', household.id)
    .maybeSingle();
  if (!member) return { status: 'error', message: 'Ce membre ne fait pas partie de ton foyer.' };
  await moveToOwnHousehold(createAdminClient(), id.data);
  revalidatePath('/app/famille');
  return { status: 'ok', message: 'Membre retiré du foyer.' };
}

/** Quitter un foyer partagé (membre invité) : retour à un foyer à soi. */
export async function leaveHousehold(): Promise<FamilyState> {
  const { profile } = await getAccount();
  if (profile.is_household_owner)
    return {
      status: 'error',
      message: 'Le titulaire ne peut pas quitter son foyer : retire d’abord les autres membres.',
    };
  await moveToOwnHousehold(createAdminClient(), profile.id);
  redirect('/app/famille?parti=1');
}
