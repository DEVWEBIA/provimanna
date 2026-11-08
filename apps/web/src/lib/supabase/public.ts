import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@repas/core/database.types';
import { publicEnv } from '../env';

/**
 * Client anonyme sans cookies pour les pages publiques (SSG/ISR) : il ne rend pas la page dynamique
 * et ne voit que les données publiques (recettes publiées, prix non aberrants).
 */
export function createPublicClient() {
  return createClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
