import { z } from 'zod';
import {
  BUDGET_MAX_CENTS,
  BUDGET_MIN_CENTS,
  EQUIPMENT_IDS,
  MAX_STYLES,
  MOTIVATION_IDS,
  PREFERENCE_IDS,
  STORE_IDS,
  STYLE_IDS,
  CUISINE_IDS,
  type PreferenceId,
} from '@repas/core';

// Hors du composant client : la page serveur /app/bienvenue lit aussi cette liste.
/** Écrans du questionnaire, dans l'ordre. */
export const WIZARD_STEPS = [
  'motivations',
  'foyer',
  'repas',
  'enseigne',
  'budget',
  'regime',
  'ambiance',
  'cuisines',
  'ingredients',
  'equipement',
  'resultat',
] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];
export const COOKING_TIMES = ['moins_30', '30_45', 'peu_importe'] as const;

export const foyerSchema = z.object({
  adults: z.number().int().min(1).max(8),
  children: z.number().int().min(0).max(8),
});

export const enseigneSchema = z.object({
  // Toutes les enseignes, Picard et Grand Frais compris (décision du 08/11/2026 : les produits qu'ils ne
  // vendent pas sont comptés au prix médian des autres enseignes).
  store: z.enum(STORE_IDS, { error: 'Choisis ton enseigne habituelle.' }),
  postal_code: z
    .string()
    .trim()
    .regex(/^\d{5}$/, { error: 'Le code postal fait 5 chiffres, par exemple 69003.' }),
});

/** Jours et repas à prévoir. */
export const repasSchema = z.object({
  meal_days: z
    .array(z.number().int().min(1).max(7))
    .min(1, { error: 'Choisis au moins un jour.' })
    .max(7)
    .transform((a) => [...new Set(a)].sort((x, y) => x - y)),
  with_lunch: z.boolean(),
});

export const equipementSchema = z.object({
  equipment: z
    .array(z.enum(EQUIPMENT_IDS as [string, ...string[]]))
    .min(1, { error: 'Choisis au moins un équipement : plaques, four ou air fryer.' })
    .transform((a) => [...new Set(a)]),
});

/**
 * Réponses complètes du questionnaire (avant ou après la création du compte).
 * Les réponses ajoutées le 08/11/2026 ont une valeur par défaut : un brouillon plus ancien reste valide.
 */
export const onboardingDraftSchema = foyerSchema.extend(enseigneSchema.shape).extend({
  prefs: z
    .array(z.string())
    .max(PREFERENCE_IDS.length)
    .transform((a) => a.filter((p): p is PreferenceId => (PREFERENCE_IDS as string[]).includes(p))),
  cooking_time: z.enum(COOKING_TIMES),
  meal_days: repasSchema.shape.meal_days.default([1, 2, 3, 4, 5, 6, 7]),
  with_lunch: z.boolean().default(true),
  budget_cents: z.number().int().min(BUDGET_MIN_CENTS).max(BUDGET_MAX_CENTS).nullable().default(null),
  styles: z
    .array(z.enum(STYLE_IDS as [string, ...string[]]))
    .max(MAX_STYLES)
    .default([]),
  equipment: equipementSchema.shape.equipment.default(['plaques', 'four']),
  disliked: z.array(z.guid()).max(60).default([]),
  cuisines: z
    .array(z.enum(CUISINE_IDS as [string, ...string[]]))
    .max(CUISINE_IDS.length)
    .default([]),
  motivations: z
    .array(z.enum(MOTIVATION_IDS as [string, ...string[]]))
    .max(MOTIVATION_IDS.length)
    .default([]),
});

export type OnboardingDraft = z.input<typeof onboardingDraftSchema>;
