import 'server-only';
import { cache } from 'react';
import { challengeProgress, displayedStreak, savingsCents, weekStartOf } from '@repas/core';
import { getAccount } from './household';

/** Données d'engagement du foyer connecté : plans validés, série, défis, tickets (lecture RLS). */
export const getEngagement = cache(async () => {
  const { supabase, household, profile } = await getAccount();
  const now = new Date();
  const week = weekStartOf(now);
  const [{ data: plans }, { data: streak }, { data: challenges }, { count: tickets }, { data: items }] =
    await Promise.all([
      supabase
        .from('meal_plans')
        .select('id, week_start, store_id, total_cents, reference_cents, validated_at')
        .eq('household_id', household.id)
        .order('week_start', { ascending: false }),
      supabase
        .from('streaks')
        .select('current_weeks, best_weeks, last_validated_week')
        .eq('household_id', household.id)
        .maybeSingle(),
      supabase
        .from('challenges')
        .select('id, title, description, target, window_weeks')
        .eq('active', true)
        .order('title'),
      supabase.from('receipts').select('id', { count: 'exact', head: true }),
      supabase
        .from('meal_plan_items')
        .select('recipe_id, meal_plans!inner(household_id)')
        .eq('meal_plans.household_id', household.id),
    ]);
  const all = plans ?? [];
  const current = displayedStreak(
    streak ?? { current_weeks: 0, best_weeks: 0, last_validated_week: null },
    week,
  );
  const counts = new Map<string, number>();
  for (const i of items ?? []) counts.set(i.recipe_id, (counts.get(i.recipe_id) ?? 0) + 1);
  return {
    profile,
    household,
    week,
    plans: all,
    saved: savingsCents(all),
    streak: current,
    bestStreak: streak?.best_weeks ?? 0,
    challenges: (challenges ?? []).map((c) => ({
      ...c,
      progress: challengeProgress(c, {
        plans: all,
        streak: current,
        tickets: tickets ?? 0,
        currentWeek: week,
      }),
    })),
    recipeCounts: counts,
  };
});
