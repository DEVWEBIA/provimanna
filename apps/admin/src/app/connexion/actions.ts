'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export type StaffAuthState =
  | { status: 'idle' }
  | { status: 'sent'; email: string }
  | { status: 'error'; message: string; email?: string };

const emailSchema = z.object({ email: z.email('Vérifie l’adresse email.') });
const codeSchema = z.object({
  email: z.email(),
  code: z.string().regex(/^\d{6}$/, 'Le code fait 6 chiffres.'),
});
const ADMIN_URL = (process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001').replace(/\/$/, '');

/** Envoie un lien et un code de connexion. Aucun compte n'est créé depuis le back-office. */
export async function requestStaffCode(_prev: StaffAuthState, formData: FormData): Promise<StaffAuthState> {
  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: 'error',
      message: parsed.error.issues[0]!.message,
      email: String(formData.get('email') ?? ''),
    };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: false, emailRedirectTo: `${ADMIN_URL}/auth/callback` },
  });
  // Même réponse que le compte existe ou non (pas d'énumération des comptes staff).
  if (error && (error.status === 429 || /seconds|rate/i.test(error.message)))
    return {
      status: 'error',
      message: 'Un code vient de partir. Attends 30 secondes.',
      email: parsed.data.email,
    };
  return { status: 'sent', email: parsed.data.email };
}

export async function verifyStaffCode(_prev: StaffAuthState, formData: FormData): Promise<StaffAuthState> {
  const parsed = codeSchema.safeParse(Object.fromEntries(formData));
  const email = String(formData.get('email') ?? '');
  if (!parsed.success) return { status: 'error', message: parsed.error.issues.at(-1)!.message, email };
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.code,
    type: 'email',
  });
  if (error) return { status: 'error', message: 'Ce code ne marche pas ou a expiré.', email };
  redirect('/');
}
