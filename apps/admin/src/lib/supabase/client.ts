import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@repas/core/database.types';
import { publicEnv } from '../env';

/** Client Supabase pour les composants client (clé anon, soumis à la RLS). */
export function createClient() {
  return createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
