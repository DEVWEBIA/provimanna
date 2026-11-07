'use server';

import { createClient } from '@/lib/supabase/server';
import { householdUpdateFromDraft } from '@/lib/onboarding';
import { SITE_URL } from '@/lib/site';
import { emailSchema } from '@/app/connexion/schemas';
import type { AuthFormState } from '@/app/connexion/actions';

/**
 * Fin du questionnaire sans compte : envoie le lien magique en joignant les réponses.
 * Elles sont stockées dans les métadonnées du compte à sa création, puis appliquées au foyer
 * à la première ouverture de l'espace client (même si le lien est ouvert sur un autre appareil).
 */
export async function startSignup(_prev: AuthFormState, fd: FormData): Promise<AuthFormState> {
  const email = String(fd.get('email') ?? '');
  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) {
    return {
      status: 'error',
      field: 'email',
      email,
      message: 'Vérifie l’adresse : il manque le @ ou le domaine.',
    };
  }
  if (fd.get('cgu') !== 'on') {
    return {
      status: 'error',
      field: 'cgu',
      email,
      message: 'Coche la case pour accepter les conditions d’utilisation.',
    };
  }
  let draft: unknown;
  try {
    draft = JSON.parse(String(fd.get('draft') ?? ''));
  } catch {
    draft = null;
  }
  if (!householdUpdateFromDraft(draft)) {
    return {
      status: 'error',
      field: 'global',
      email,
      message: 'Il manque une réponse : reviens aux étapes précédentes.',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsedEmail.data,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback?suite=${encodeURIComponent('/app')}`,
      shouldCreateUser: true,
      data: { cgu_accepted_at: new Date().toISOString(), onboarding: draft as Record<string, unknown> },
    },
  });
  if (error) {
    const tooSoon = error.status === 429 || /seconds|rate/i.test(error.message);
    return {
      status: 'error',
      field: 'global',
      email,
      message: tooSoon
        ? 'Un lien vient de partir. Attends 30 secondes avant d’en demander un autre.'
        : 'L’envoi n’a pas marché. Réessaie dans un instant.',
    };
  }
  return { status: 'sent', email: parsedEmail.data, sentAt: Date.now() };
}
