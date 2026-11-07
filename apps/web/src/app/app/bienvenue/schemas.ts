import { z } from 'zod';
import { PREFERENCE_IDS, type PreferenceId } from '@repas/core';

export const foyerSchema = z.object({
  adults: z.coerce.number().int().min(1).max(8),
  children: z.coerce.number().int().min(0).max(8),
});

export const preferencesSchema = z.object({
  prefs: z
    .array(z.string())
    .transform((a) => a.filter((p): p is PreferenceId => (PREFERENCE_IDS as string[]).includes(p))),
  cooking_time: z.enum(['moins_30', '30_45', 'peu_importe']),
});

export const enseigneSchema = z.object({
  store: z.enum(['lidl', 'aldi', 'leclerc', 'intermarche', 'carrefour', 'auchan'], {
    error: 'Choisis ton enseigne habituelle.',
  }),
  postal_code: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { error: 'Le code postal fait 5 chiffres, par exemple 69003.' }),
});
