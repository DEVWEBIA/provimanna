import type { Metadata } from 'next';
import { isRecipeAllowed, recipeServingCents, zonedDate, type StoreId } from '@repas/core';
import { PageHeader } from '@repas/ui';
import { RecipeBrowser } from '@/components/recipes/recipe-browser';
import { currentPlan, plannerHousehold, toRecipe } from '@/lib/plan';
import { recipeTags } from '@/lib/recipes';

export const metadata: Metadata = { title: 'Recettes', robots: { index: false } };

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default async function AppRecettesPage() {
  const { supabase, household, view, stores, data } = await currentPlan();
  const store = (household.preferred_store_id ?? 'lidl') as StoreId;
  const m = Number(zonedDate(data.now).iso.slice(5, 7));
  const hh = plannerHousehold(household);
  // Noms des ingrédients pour la recherche (« lentilles » trouve le dahl).
  const { data: ings } = await supabase.from('recipe_ingredients').select('recipe_id, label');
  const words = new Map<string, string>();
  for (const i of ings ?? []) words.set(i.recipe_id, `${words.get(i.recipe_id) ?? ''} ${i.label}`);
  const inPlan = new Set(view?.meals.map((x) => x.recipe.id));
  const people = household.adults + household.children;
  const recipes = data.catalogue
    .filter((r) =>
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
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      illustration: r.illustration,
      minutes: r.minutes,
      perServingCents: recipeServingCents(toRecipe(r), store, data.observations, data.now),
      tags: recipeTags(r, m),
      search: norm(`${r.title} ${words.get(r.id) ?? ''}`),
      inPlan: inPlan.has(r.id),
    }))
    .sort((a, b) => (a.perServingCents ?? 9e9) - (b.perServingCents ?? 9e9));

  return (
    <>
      <PageHeader
        eyebrow={`${recipes.length} recettes pour toi`}
        title="Recettes"
        lead={`Prix par part chez ${stores.find((s) => s.id === store)?.name ?? store}, pour ton foyer de ${people}`}
      />
      <RecipeBrowser planId={view?.id ?? null} weekNumber={view?.weekNumber ?? 0} recipes={recipes} />
    </>
  );
}
