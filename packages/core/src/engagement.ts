// Série de semaines validées et progression des défis (docs/05, maquettes AppEconomies / AppDashboard).
import { addDays } from './week.ts';
import type { PlanTotals } from './savings.ts';

export interface Streak {
  current_weeks: number;
  best_weeks: number;
  last_validated_week: string | null;
}

/** Série après la validation de la semaine `weekStart` (lundi) : +1 si la semaine précédente était validée. */
export function nextStreak(prev: Streak, weekStart: string): Streak {
  if (prev.last_validated_week === weekStart) return prev;
  const current = prev.last_validated_week === addDays(weekStart, -7) ? prev.current_weeks + 1 : 1;
  return {
    current_weeks: current,
    best_weeks: Math.max(prev.best_weeks, current),
    last_validated_week: weekStart,
  };
}

/** Série affichée : elle reste en cours tant que la semaine précédente (ou la courante) est validée. */
export function displayedStreak(s: Streak, currentWeek: string): number {
  if (!s.last_validated_week) return 0;
  return s.last_validated_week === currentWeek || s.last_validated_week === addDays(currentWeek, -7)
    ? s.current_weeks
    : 0;
}

export interface ChallengeDef {
  id: string;
  target: number;
  window_weeks: number;
}

export interface ChallengeProgress {
  id: string;
  done: number;
  target: number;
  completed: boolean;
}

type WeekPlan = PlanTotals & { week_start: string };

/**
 * Progression d'un défi, déduite des données (rien de stocké) :
 * - `sous_70_3_sur_4` : semaines validées sous 70 € sur les 4 dernières ;
 * - `serie_N` : série en cours ;
 * - `premier_ticket` : tickets envoyés.
 */
export function challengeProgress(
  c: ChallengeDef,
  data: { plans: readonly WeekPlan[]; streak: number; tickets: number; currentWeek: string },
): ChallengeProgress {
  let done = 0;
  if (c.id.startsWith('sous_')) {
    const limit = Number.parseInt(c.id.split('_')[1] ?? '0', 10) * 100;
    const since = addDays(data.currentWeek, -7 * (c.window_weeks - 1));
    done = data.plans.filter(
      (p) =>
        p.validated_at &&
        p.total_cents !== null &&
        p.total_cents < limit &&
        p.week_start >= since &&
        p.week_start <= data.currentWeek,
    ).length;
  } else if (c.id.startsWith('serie_')) {
    done = data.streak;
  } else if (c.id === 'premier_ticket') {
    done = data.tickets;
  }
  return { id: c.id, done: Math.min(done, c.target), target: c.target, completed: done >= c.target };
}
