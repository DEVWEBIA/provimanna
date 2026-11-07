import { z } from 'zod';
import { PREFERENCE_IDS, type PreferenceId } from '@repas/core';

export const STORE_IDS = ['lidl', 'aldi', 'leclerc', 'intermarche', 'carrefour', 'auchan'] as const;
export const COOKING_TIMES = ['moins_30', '30_45', 'peu_importe'] as const;

export const foyerSchema = z.object({
  adults: z.number().int().min(1).max(8),
  children: z.number().int().min(0).max(8),
});

export const enseigneSchema = z.object({
  store: z.enum(STORE_IDS, { error: 'Choisis ton enseigne habituelle.' }),
  postal_code: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { error: 'Le code postal fait 5 chiffres, par exemple 69003.' }),
});

/** Réponses complètes du questionnaire (avant ou après la création du compte). */
export const onboardingDraftSchema = foyerSchema.extend(enseigneSchema.shape).extend({
  prefs: z
    .array(z.string())
    .max(PREFERENCE_IDS.length)
    .transform((a) => a.filter((p): p is PreferenceId => (PREFERENCE_IDS as string[]).includes(p))),
  cooking_time: z.enum(COOKING_TIMES),
});

export type OnboardingDraft = z.input<typeof onboardingDraftSchema>;
