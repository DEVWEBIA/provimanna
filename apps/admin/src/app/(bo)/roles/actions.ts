'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';

export type RoleState =
  { status: 'idle' } | { status: 'ok'; message: string } | { status: 'error'; message: string };

const grantSchema = z.object({
  email: z.email('Vérifie l’adresse email.'),
  role: z.enum(['admin', 'moderateur_prix', 'editeur', 'support']),
});

/** Attribue un rôle staff à un compte existant (écriture avec la session de l'admin : RLS « admin seul »). */
export async function grantRole(_prev: RoleState, formData: FormData): Promise<RoleState> {
  const parsed = grantSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0]!.message };
  const { supabase, user } = await requireRole(['admin']);
  // Recherche du compte par email : seule lecture faite avec la clé serveur.
  const { data } = await createAdminClient().auth.admin.listUsers({ perPage: 1000 });
  const target = data.users.find((u) => u.email?.toLowerCase() === parsed.data.email.toLowerCase());
  if (!target)
    return {
      status: 'error',
      message: 'Aucun compte avec cette adresse. La personne doit d’abord créer son compte sur le site.',
    };
  const { error } = await supabase.from('roles').upsert({
    user_id: target.id,
    role: parsed.data.role,
    granted_by: user.id,
    granted_at: new Date().toISOString(),
  });
  if (error) return { status: 'error', message: 'Attribution impossible.' };
  await supabase.rpc('log_action', {
    p_action: 'role.attribuer',
    p_entity: 'roles',
    p_entity_id: target.id,
    p_details: { email: target.email ?? '', role: parsed.data.role },
  });
  revalidatePath('/roles');
  return { status: 'ok', message: `Rôle attribué à ${target.email}.` };
}

export async function revokeRole(userId: unknown): Promise<RoleState> {
  const id = z.guid().safeParse(userId);
  if (!id.success) return { status: 'error', message: 'Compte invalide.' };
  const { supabase, user } = await requireRole(['admin']);
  if (id.data === user.id) return { status: 'error', message: 'Tu ne peux pas retirer ton propre rôle.' };
  const { error } = await supabase.from('roles').delete().eq('user_id', id.data);
  if (error) return { status: 'error', message: 'Retrait impossible.' };
  await supabase.rpc('log_action', {
    p_action: 'role.retirer',
    p_entity: 'roles',
    p_entity_id: id.data,
    p_details: {},
  });
  revalidatePath('/roles');
  return { status: 'ok', message: 'Rôle retiré.' };
}
