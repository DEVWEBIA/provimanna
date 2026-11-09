'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { publicEnv } from '@/lib/env';
import { requireRole } from '@/lib/staff';

export type ImportResult = { ok: true; message: string } | { ok: false; error: string };

const Summary = z.object({
  imported: z.number().optional(),
  fetched: z.number().optional(),
  error: z.string().optional(),
});

/** « Lancer maintenant » : appelle l'Edge Function import-open-prices (clé serveur), action journalisée. */
export async function runImport(): Promise<ImportResult> {
  const { supabase, user } = await requireRole(['moderateur_prix']);
  const key = z.string().min(1).parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const res = await fetch(`${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/import-open-prices`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ triggered_by: user.id }),
    cache: 'no-store',
  });
  const summary = Summary.safeParse(await res.json().catch(() => ({})));
  await supabase.rpc('log_action', {
    p_action: 'import.lancer',
    p_entity: 'import_runs',
    p_entity_id: 'open_prices',
    p_details: summary.success ? summary.data : {},
  });
  revalidatePath('/prix/imports');
  if (!res.ok || !summary.success || summary.data.error) {
    return {
      ok: false,
      error: `L’import a échoué${summary.success && summary.data.error ? ` : ${summary.data.error}` : '.'}`,
    };
  }
  return {
    ok: true,
    message: `${summary.data.imported ?? 0} prix ajoutés sur ${summary.data.fetched ?? 0} lus.`,
  };
}
