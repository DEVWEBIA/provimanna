import 'server-only';
import type { AdminClient } from './supabase/admin';

export const MAX_MEMBERS = 6;

/**
 * Donne à un membre son propre foyer (retrait ou départ d'un foyer partagé), comme à l'inscription :
 * foyer, essai déjà consommé non recréé (abonnement gratuit), série à zéro. Écrit par le serveur.
 */
export async function moveToOwnHousehold(admin: AdminClient, profileId: string) {
  const { data: h, error } = await admin.from('households').insert({}).select('id').single();
  if (error || !h) throw new Error('Foyer non créé');
  await admin.from('subscriptions').insert({ household_id: h.id, tier: 'free', trial_ends_at: null });
  await admin.from('streaks').insert({ household_id: h.id });
  await admin.from('profiles').update({ household_id: h.id, is_household_owner: true }).eq('id', profileId);
}
