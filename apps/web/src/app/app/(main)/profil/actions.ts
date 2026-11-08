'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAccount } from '@/lib/household';
import { THEME_COOKIE } from '@/lib/theme';

export async function setTheme(choice: unknown) {
  const c = z.enum(['auto', 'clair', 'sombre']).safeParse(choice);
  if (!c.success) return;
  (await cookies()).set(THEME_COOKIE, c.data, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  revalidatePath('/app', 'layout');
}

const notifSchema = z.object({ notify_thursday: z.boolean(), notify_promos: z.boolean() });

/** Préférences de notifications (colonnes autorisées à l'utilisateur, migration 0003). */
export async function setNotifications(input: unknown) {
  const parsed = notifSchema.safeParse(input);
  if (!parsed.success) return;
  const { supabase, profile } = await getAccount();
  await supabase.from('profiles').update(parsed.data).eq('id', profile.id);
  revalidatePath('/app/profil');
}
