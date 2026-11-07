import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { Database } from '@repas/core/database.types';
import { createClient } from './supabase/server';

export type Household = Database['public']['Tables']['households']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

/** Onboarding terminé : enseigne et code postal renseignés (étape 3). */
export const isOnboarded = (h: Pick<Household, 'preferred_store_id' | 'postal_code'>) =>
  Boolean(h.preferred_store_id && h.postal_code);

/**
 * Utilisateur connecté + profil + foyer + abonnement (une requête par rendu, mise en cache).
 * Redirige vers /connexion sans session.
 */
export const getAccount = cache(async (next = '/app') => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/connexion?suite=${encodeURIComponent(next)}`);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, households(*, subscriptions(*))')
    .eq('id', user.id)
    .single();
  if (error || !profile?.households)
    throw new Error(`Profil ou foyer introuvable : ${error?.message ?? 'aucun foyer'}`);

  const { households, ...rest } = profile;
  const { subscriptions, ...household } = households;
  return {
    supabase,
    user,
    profile: rest as Profile,
    household: household as Household,
    subscription: subscriptions,
  };
});
