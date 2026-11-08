'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@repas/core/database.types';
import { publicEnv } from '@/lib/env';

export type SupportResult = { ok: boolean; message: string };
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** « Offrir 7 jours de Premium » : jours bonus sur l'abonnement du foyer (admin ; écrit par le serveur). */
export async function giftDays(householdId: unknown): Promise<SupportResult> {
  const id = z.guid().safeParse(householdId);
  if (!id.success) return { ok: false, message: 'Foyer invalide.' };
  const { supabase } = await requireRole(['admin']);
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('bonus_days')
    .eq('household_id', id.data)
    .maybeSingle();
  if (!sub) return { ok: false, message: 'Abonnement introuvable.' };
  const { error } = await admin
    .from('subscriptions')
    .update({ bonus_days: sub.bonus_days + 7, updated_at: new Date().toISOString() })
    .eq('household_id', id.data);
  if (error) return { ok: false, message: 'Impossible d’ajouter les jours.' };
  await supabase.rpc('log_action', {
    p_action: 'support.offrir_jours',
    p_entity: 'subscriptions',
    p_entity_id: id.data,
    p_details: { jours: 7 },
  });
  revalidatePath('/utilisateurs');
  return { ok: true, message: '7 jours de Premium offerts.' };
}

/** « Renvoyer un lien de connexion » : même envoi que sur le site, sans créer de compte. */
export async function resendLink(email: unknown, userId: unknown): Promise<SupportResult> {
  const e = z.email().safeParse(email);
  const id = z.guid().safeParse(userId);
  if (!e.success || !id.success) return { ok: false, message: 'Adresse invalide.' };
  const { supabase } = await requireRole(['support']);
  // Client anonyme sans cookies : l'envoi ne doit pas toucher la session du membre du staff.
  // L'utilisateur se connecte avec le code à 6 chiffres de l'email (ou le lien, sur le même appareil).
  const anon = createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const { error } = await anon.auth.signInWithOtp({
    email: e.data,
    options: { shouldCreateUser: false, emailRedirectTo: `${SITE_URL}/auth/callback?suite=/app` },
  });
  if (error)
    return {
      ok: false,
      message: /seconds|rate/i.test(error.message)
        ? 'Un lien vient de partir, attends 30 secondes.'
        : 'Envoi impossible.',
    };
  await supabase.rpc('log_action', {
    p_action: 'support.renvoyer_lien',
    p_entity: 'profiles',
    p_entity_id: id.data,
    p_details: {},
  });
  return { ok: true, message: `Lien envoyé à ${e.data}.` };
}
