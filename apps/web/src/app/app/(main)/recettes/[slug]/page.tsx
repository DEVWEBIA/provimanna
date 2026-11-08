import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  costPerServing,
  formatEuro,
  isRecipeAllowed,
  mealServings,
  recipeServingCents,
  recipeStoreTotals,
  shortDate,
  zonedDate,
  type StoreId,
} from '@repas/core';
import { animDelay, Glow, Plat } from '@repas/ui';
import { DAY_LONG } from '@/components/plan/labels';
import { RecipeDetail, type Alternative } from '@/components/recipes/recipe-detail';
import { coreRecipe, getRecipe, ingredientLines, recipeTags } from '@/lib/recipes';
import { currentPlan, plannerHousehold, STORES, toRecipe } from '@/lib/plan';
import { href } from '@/lib/site';

export const metadata: Metadata = { title: 'Recette', robots: { index: false } };

type Params = Promise<{ slug: string }>;

export default async function AppRecettePage({ params }: { params: Params }) {
  const { slug } = await params;
  const { supabase, household, view, stores, data } = await currentPlan();
  const recipe = await getRecipe(supabase, slug);
  if (!recipe) notFound();
  const store = (household.preferred_store_id ?? 'lidl') as StoreId;
  const name = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const servings = mealServings(household.adults, household.children);
  const totals = recipeStoreTotals(coreRecipe(recipe), servings, STORES, data.observations, data.now);
  const mine = totals.find((t) => t.storeId === store)!;
  const cheapest = totals[0]!;
  const lines = ingredientLines(recipe, servings, store, data.observations, data.now);
  const priced = lines.filter((l) => l.productId && !l.pantry);
  const fresh = priced.filter((l) => l.fresh).length;
  const oldest = priced
    .filter((l) => !l.fresh && l.observedAt)
    .sort((a, b) => Date.parse(a.observedAt!) - Date.parse(b.observedAt!))[0];
  const reliabilityText = `${fresh} produit${fresh > 1 ? 's' : ''} sur ${priced.length} relevé${fresh > 1 ? 's' : ''} il y a moins de 7 jours chez ${name(store)}.${
    oldest ? ` Le prix « ${oldest.label} » date du ${shortDate(oldest.observedAt!)}.` : ''
  }`;
  const minutes = recipe.prepMinutes + recipe.cookMinutes;
  const m = Number(zonedDate(data.now).iso.slice(5, 7));
  const meal = view?.meals.find((x) => x.recipe.id === recipe.id) ?? null;
  const mealLabel = meal
    ? `${DAY_LONG[meal.day - 1]!.toLowerCase()} ${meal.slot === 'dejeuner' ? 'midi' : 'soir'}`
    : '';

  // Tiroir « Remplacer » : moins cher, végé, rapide — parmi les recettes permises hors de la semaine.
  let alternatives: Alternative[] = [];
  if (meal && view) {
    const hh = plannerHousehold(household);
    const current = recipeServingCents(coreRecipe(recipe), store, data.observations, data.now) ?? 0;
    const pool = data.catalogue
      .filter(
        (r) =>
          !view.meals.some((x) => x.recipe.id === r.id) &&
          isRecipeAllowed(
            {
              id: r.id,
              family: r.family,
              diets: r.diets,
              tags: r.tags,
              seasonMonths: r.seasonMonths,
              totalMinutes: r.minutes,
              costPerServingCents: null,
            },
            hh,
          ),
      )
      .map((r) => ({ r, per: recipeServingCents(toRecipe(r), store, data.observations, data.now) ?? 9e9 }));
    const picks: { r: (typeof pool)[number]; reason: string }[] = [];
    const add = (p: (typeof pool)[number] | undefined, reason: string) => {
      if (p && !picks.some((x) => x.r.r.id === p.r.id)) picks.push({ r: p, reason });
    };
    add([...pool].sort((a, b) => a.per - b.per)[0], 'Moins cher');
    add([...pool].filter((p) => p.r.diets.includes('vegetarien')).sort((a, b) => a.per - b.per)[0], 'Végé');
    add(
      [...pool].filter((p) => p.r.minutes <= 30).sort((a, b) => a.r.minutes - b.r.minutes)[0],
      '− de 30 min',
    );
    alternatives = picks.map(({ r: p, reason }) => ({
      id: p.r.id,
      title: p.r.title,
      illustration: p.r.illustration,
      minutes: p.r.minutes,
      diffCents: (p.per - current) * meal.servings,
      reason,
    }));
  }

  return (
    <>
      <Link
        href={href(meal ? '/app/plan' : '/app/recettes')}
        className="anim-rise text-brand self-start text-[15px] font-black"
      >
        ←{' '}
        {meal && view
          ? `Semaine ${view.weekNumber} · ${DAY_LONG[meal.day - 1]} ${meal.slot === 'dejeuner' ? 'midi' : 'soir'}`
          : 'Recettes'}
      </Link>
      <section className="relative isolate -mt-2 flex flex-wrap items-center gap-8">
        <Glow className="bg-raw-peche left-0 top-0 h-60 w-60" />
        <div className="anim-ticket">
          <div className="anim-float drop-shadow-[0_24px_40px_rgba(42,26,40,0.2)]">
            <Plat variant={recipe.illustration} size={220} decorative />
          </div>
        </div>
        <div className="min-w-0 flex-[1_1_380px]">
          <p className="anim-rise text-ink-muted text-[14px] font-black">
            {[
              ...recipeTags({ ...recipe, minutes }, m)
                .filter((t) => t !== '− de 30 min')
                .slice(0, 2),
              `${minutes} min`,
              `${servings} parts`,
            ].join(' · ')}
          </p>
          <h1
            className="anim-rise font-display mt-2 text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.04] tracking-[-1.4px]"
            style={animDelay(80)}
          >
            {recipe.title}
          </h1>
          <div className="anim-rise mt-5 flex flex-wrap gap-3" style={animDelay(160)}>
            <div className="border-line rounded-[18px] border bg-white/80 px-4 py-3 backdrop-blur">
              <p className="text-ink-muted text-[12px] font-black tracking-[1px]">
                CHEZ {name(store).toUpperCase()} · TON CHOIX
              </p>
              <p className="font-display text-[28px] font-extrabold tabular-nums">{formatEuro(mine.cents)}</p>
              <p className="text-ink-muted text-[13px] font-bold tabular-nums">
                {formatEuro(costPerServing(mine.cents, servings))} / part
              </p>
            </div>
            {cheapest.storeId !== store ? (
              <div className="bg-saving-soft rounded-[18px] px-4 py-3">
                <p className="text-saving-ink text-[12px] font-black tracking-[1px]">
                  LE MOINS CHER · {name(cheapest.storeId).toUpperCase()}
                </p>
                <p className="font-display text-ink text-[28px] font-extrabold tabular-nums">
                  {formatEuro(cheapest.cents)}
                </p>
                <p className="text-saving-ink text-[13px] font-black tabular-nums">
                  −{formatEuro(mine.cents - cheapest.cents)} sur ce repas
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <RecipeDetail
        slug={recipe.slug}
        ingredients={lines.map((l) => ({ label: l.label, aisle: l.aisle, cents: l.cents, pantry: l.pantry }))}
        steps={recipe.steps}
        storeName={name(store)}
        reliabilityText={reliabilityText}
        meal={meal && view ? { planId: view.id, itemId: meal.id, label: mealLabel } : null}
        alternatives={alternatives}
      />
    </>
  );
}
