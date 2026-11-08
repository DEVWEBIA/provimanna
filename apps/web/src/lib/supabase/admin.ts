import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '@repas/core/database.types';
import { publicEnv } from '../env';

/**
 * Client Supabase « service_role » : ignore la RLS. Réservé au serveur (Server Actions, routes), pour les
 * écritures que l'utilisateur ne doit pas pouvoir faire lui-même (totaux du plan, liste recalculée).
 * Toujours vérifier avant, avec le client de l'utilisateur, que la ligne visée appartient à son foyer.
 */
export function createAdminClient() {
  const key = z.string().min(1).parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return createClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type AdminClient = ReturnType<typeof createAdminClient>;
