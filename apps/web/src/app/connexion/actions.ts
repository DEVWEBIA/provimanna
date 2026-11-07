'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { safeNext } from '@/lib/auth/redirect';
import { href, SITE_URL } from '@/lib/site';
import { providerSchema, requestLinkSchema, verifyCodeSchema } from './schemas';

export type AuthFormState =
  | { status: 'idle' }
  | { status: 'sent'; email: string; sentAt: number }
  | {
      status: 'error';
      field: 'email' | 'cgu' | 'code' | 'provider' | 'global';
      message: string;
      email?: string;
    };

const callbackUrl = (suite: string) => `${SITE_URL}/auth/callback?suite=${encodeURIComponent(suite)}`;

/** Envoie le lien magique (et le code à 6 chiffres). Crée le compte s'il n'existe pas. */
export async function requestLink(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = requestLinkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      status: 'error',
      field: issue?.path[0] === 'cgu' ? 'cgu' : 'email',
      message: issue?.message ?? 'Vérifie l’adresse : il manque le @ ou le domaine.',
      email: String(formData.get('email') ?? ''),
    };
  }
  const { email, mode, suite } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl(safeNext(suite)),
      shouldCreateUser: true,
      ...(mode === 'inscription' ? { data: { cgu_accepted_at: new Date().toISOString() } } : {}),
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
  return { status: 'sent', email, sentAt: Date.now() };
}

/** Connexion avec le code à 6 chiffres reçu par email. */
export async function verifyCode(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = verifyCodeSchema.safeParse(Object.fromEntries(formData));
  const email = String(formData.get('email') ?? '');
  if (!parsed.success) {
    return {
      status: 'error',
      field: 'code',
      email,
      message: parsed.error.issues[0]?.message ?? 'Code invalide.',
    };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.code,
    type: 'email',
  });
  if (error) {
    return {
      status: 'error',
      field: 'code',
      email,
      message: 'Ce code ne marche pas ou a expiré. Demande un nouveau lien.',
    };
  }
  redirect(href(safeNext(parsed.data.suite)));
}

/** Connexion Google / Apple (OAuth). */
export async function signInWithProvider(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const provider = providerSchema.safeParse(formData.get('provider'));
  if (!provider.success) return { status: 'error', field: 'provider', message: 'Fournisseur inconnu.' };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider.data,
    options: { redirectTo: callbackUrl(safeNext(formData.get('suite'))) },
  });
  if (error || !data.url) {
    const name = provider.data === 'google' ? 'Google' : 'Apple';
    return {
      status: 'error',
      field: 'provider',
      message: `La connexion avec ${name} n’est pas encore disponible. Utilise ton adresse email.`,
    };
  }
  redirect(href(data.url));
}
