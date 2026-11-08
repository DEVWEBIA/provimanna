import { addDays } from '@repas/core';

export const DAY_SHORT = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'] as const;
export const DAY_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;
export const SLOT_LABEL = { dejeuner: 'MIDI', diner: 'SOIR' } as const;

/** Numéro du jour dans le mois (« 16 ») pour le jour `day` (1 = lundi) de la semaine. */
export const dayOfMonth = (weekStart: string, day: number) =>
  Number(addDays(weekStart, day - 1).slice(8, 10));

/** Teinte douce derrière chaque illustration (maquette MPlan). */
export const PLAT_TINT: Record<string, string> = {
  soupe: 'bg-raw-peche',
  gratin: 'bg-raw-peche',
  curry: 'bg-raw-aubergine-clair',
  salade: 'bg-site-mint',
  riz: 'bg-site-mint',
  soupeverte: 'bg-site-mint',
  pates: 'bg-chip-4',
  dahl: 'bg-chip-4',
  tarte: 'bg-chip-4',
  poisson: 'bg-chip-1',
  lasagnes: 'bg-chip-6',
  omelette: 'bg-warning-soft',
};
