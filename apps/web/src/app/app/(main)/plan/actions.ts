'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  mealServings,
  monthOf,
  PlannerError,
  replaceMeal,
  type PlannedMeal,
  type StoreId,
} from '@repas/core';
import { getAccount } from '@/lib/household';
import { validatePlan } from '@/lib/list';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  composeMeals,
  getWeekPlan,
  loadPlanData,
  plannerHousehold,
  plannerRecipes,
  previousWeekRecipes,
} from '@/lib/plan';

export type PlanActionResult = { ok: true } | { ok: false; error: string };

const PREMIUM_ONLY =
  'Avec la formule gratuite, ta semaine est composée une fois par semaine. Remplacer un repas fait partie de Premium.';
const FAILED = 'Ça n’a pas marché. Réessaie dans un instant.';
const NO_RECIPE = 'Aucune autre recette ne correspond à tes préférences pour ce repas.';

const filtersSchema = z
  .object({
    vegetarian: z.boolean().optional(),
    quick: z.boolean().optional(),
    seasonal: z.boolean().optional(),
    kids: z.boolean().optional(),
    batch: z.boolean().optional(),
  })
  .strict();
const itemSchema = z.object({ itemId: z.uuid() });
const lockSchema = itemSchema.extend({ locked: z.boolean() });
const moveSchema = itemSchema.extend({
  day: z.number().int().min(1).max(7),
  slot: z.enum(['dejeuner', 'diner']),
});

/** Plan de la semaine affichée + contrôle Premium côté serveur (is_premium). */
async function context(planId: string) {
  const { supabase, household } = await getAccount();
  const { data: plan } = await supabase
    .from('meal_plans')
    .select('id, week_start')
    .eq('id', planId)
    .eq('household_id', household.id)
    .maybeSingle();
  if (!plan) return null;
  const full = await getWeekPlan(supabase, household.id, plan.week_start);
  const { data: premium } = await supabase.rpc('is_premium', { h: household.id });
  return { supabase, household, plan: full!, premium: premium === true };
}

type Ctx = NonNullable<Awaited<ReturnType<typeof context>>>;

/**
 * Après un changement de repas : si la semaine est déjà validée, ses totaux figés sont recalculés
 * (côté serveur). La liste, elle, se remet à jour à sa prochaine ouverture.
 */
async function done(ctx: Ctx): Promise<PlanActionResult> {
  if (ctx.plan.validated_at) {
    const fresh = await getWeekPlan(ctx.supabase, ctx.household.id, ctx.plan.week_start);
    if (fresh)
      await validatePlan(
        createAdminClient(),
        fresh,
        ctx.household,
        fresh.store_id as StoreId,
        await loadPlanData(ctx.supabase),
      );
  }
  revalidatePath('/app', 'layout');
  return { ok: true };
}

/** « Varier la semaine » : recompose tous les repas non verrouillés. */
export async function regenerateWeek(planId: string, filters: unknown): Promise<PlanActionResult> {
  const f = filtersSchema.safeParse(filters);
  const id = z.uuid().safeParse(planId);
  if (!f.success || !id.success) return { ok: false, error: FAILED };
  const ctx = await context(id.data);
  if (!ctx) return { ok: false, error: FAILED };
  if (!ctx.premium) return { ok: false, error: PREMIUM_ONLY };

  const locked: PlannedMeal[] = ctx.plan.meal_plan_items
    .filter((i) => i.locked)
    .map((i) => ({ day: i.day, slot: i.slot, recipeId: i.recipe_id, locked: true }));
  let meals: PlannedMeal[];
  try {
    meals = await composeMeals({
      supabase: ctx.supabase,
      household: ctx.household,
      data: await loadPlanData(ctx.supabase),
      weekStart: ctx.plan.week_start,
      locked,
      filters: f.data,
    });
  } catch (e) {
    if (e instanceof PlannerError) return { ok: false, error: NO_RECIPE };
    throw e;
  }
  const servings = mealServings(ctx.household.adults, ctx.household.children);
  const del = await ctx.supabase
    .from('meal_plan_items')
    .delete()
    .eq('meal_plan_id', ctx.plan.id)
    .eq('locked', false);
  if (del.error) return { ok: false, error: FAILED };
  const { error } = await ctx.supabase.from('meal_plan_items').insert(
    meals
      .filter((m) => !m.locked)
      .map((m) => ({
        meal_plan_id: ctx.plan.id,
        day: m.day,
        slot: m.slot,
        recipe_id: m.recipeId,
        servings,
        locked: false,
      })),
  );
  return error ? { ok: false, error: FAILED } : done(ctx);
}

/** « Remplacer » : une autre recette compatible pour ce repas. */
export async function replaceMealAction(planId: string, input: unknown): Promise<PlanActionResult> {
  const parsed = itemSchema.safeParse(input);
  const id = z.uuid().safeParse(planId);
  if (!parsed.success || !id.success) return { ok: false, error: FAILED };
  const ctx = await context(id.data);
  if (!ctx) return { ok: false, error: FAILED };
  if (!ctx.premium) return { ok: false, error: PREMIUM_ONLY };
  const item = ctx.plan.meal_plan_items.find((i) => i.id === parsed.data.itemId);
  if (!item) return { ok: false, error: FAILED };

  const data = await loadPlanData(ctx.supabase);
  const store = (ctx.household.preferred_store_id ?? 'lidl') as StoreId;
  let next: PlannedMeal;
  try {
    next = replaceMeal(
      ctx.plan.meal_plan_items.map((i) => ({
        day: i.day,
        slot: i.slot,
        recipeId: i.recipe_id,
        locked: i.locked,
      })),
      { day: item.day, slot: item.slot },
      plannerHousehold(ctx.household),
      plannerRecipes(data.catalogue, store, data.observations, data.now),
      {
        month: monthOf(ctx.plan.week_start),
        recentRecipeIds: await previousWeekRecipes(ctx.supabase, ctx.household.id, ctx.plan.week_start),
      },
    );
  } catch (e) {
    if (e instanceof PlannerError) return { ok: false, error: NO_RECIPE };
    throw e;
  }
  const { error } = await ctx.supabase
    .from('meal_plan_items')
    .update({ recipe_id: next.recipeId, locked: false })
    .eq('id', item.id);
  return error ? { ok: false, error: FAILED } : done(ctx);
}

/** Verrouiller : le repas est gardé quand on varie la semaine. */
export async function toggleLockAction(planId: string, input: unknown): Promise<PlanActionResult> {
  const parsed = lockSchema.safeParse(input);
  const id = z.uuid().safeParse(planId);
  if (!parsed.success || !id.success) return { ok: false, error: FAILED };
  const ctx = await context(id.data);
  if (!ctx) return { ok: false, error: FAILED };
  const { error } = await ctx.supabase
    .from('meal_plan_items')
    .update({ locked: parsed.data.locked })
    .eq('id', parsed.data.itemId)
    .eq('meal_plan_id', ctx.plan.id);
  return error ? { ok: false, error: FAILED } : done(ctx);
}

/** Déplacer un repas (glisser-déposer) : il échange sa place avec celui du créneau visé. */
export async function moveMealAction(planId: string, input: unknown): Promise<PlanActionResult> {
  const parsed = moveSchema.safeParse(input);
  const id = z.uuid().safeParse(planId);
  if (!parsed.success || !id.success) return { ok: false, error: FAILED };
  const ctx = await context(id.data);
  if (!ctx) return { ok: false, error: FAILED };
  const from = ctx.plan.meal_plan_items.find((i) => i.id === parsed.data.itemId);
  if (!from) return { ok: false, error: FAILED };
  const to = ctx.plan.meal_plan_items.find((i) => i.day === parsed.data.day && i.slot === parsed.data.slot);
  if (to?.id === from.id) return { ok: true };

  // La contrainte unique (plan, jour, créneau) empêche l'échange en place : on supprime puis on réinsère.
  const moved = [from, ...(to ? [to] : [])];
  const del = await ctx.supabase
    .from('meal_plan_items')
    .delete()
    .in(
      'id',
      moved.map((i) => i.id),
    );
  if (del.error) return { ok: false, error: FAILED };
  const rows = [
    { ...from, day: parsed.data.day, slot: parsed.data.slot },
    ...(to ? [{ ...to, day: from.day, slot: from.slot }] : []),
  ].map((i) => ({
    id: i.id,
    meal_plan_id: ctx.plan.id,
    day: i.day,
    slot: i.slot,
    recipe_id: i.recipe_id,
    servings: i.servings,
    locked: i.locked,
  }));
  const { error } = await ctx.supabase.from('meal_plan_items').insert(rows);
  return error ? { ok: false, error: FAILED } : done(ctx);
}
