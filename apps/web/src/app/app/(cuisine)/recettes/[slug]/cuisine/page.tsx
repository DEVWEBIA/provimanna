import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mealServings } from '@repas/core';
import { CookingMode } from '@/components/recipes/cooking-mode';
import { getAccount } from '@/lib/household';
import { getRecipe } from '@/lib/recipes';

export const metadata: Metadata = { title: 'Mode cuisine', robots: { index: false } };

type Params = Promise<{ slug: string }>;

export default async function CuisinePage({ params }: { params: Params }) {
  const { slug } = await params;
  const { supabase, household } = await getAccount();
  const recipe = await getRecipe(supabase, slug);
  if (!recipe) notFound();
  return (
    <CookingMode
      slug={recipe.slug}
      title={recipe.title}
      illustration={recipe.illustration}
      servings={mealServings(household.adults, household.children)}
      steps={recipe.steps}
      ingredients={recipe.ingredients.map((i) => i.label)}
    />
  );
}
