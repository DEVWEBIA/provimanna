import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { recentObservations } from '@/lib/coverage';
import { requireRole } from '@/lib/staff';
import { RecipeEditor } from './recipe-editor';

export const metadata: Metadata = { title: 'Éditer une recette' };
export const dynamic = 'force-dynamic';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export default async function BoRecettePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireRole(['editeur']);
  const [{ data: r }, { data: products }, obs] = await Promise.all([
    supabase
      .from('recipes')
      .select('*, recipe_ingredients(label, product_id, units, pantry, position)')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('products').select('id, name, quantity_label').order('name'),
    recentObservations(supabase, new Date()),
  ]);
  if (!r) notFound();
  const steps = Array.isArray(r.steps)
    ? r.steps.flatMap((s) =>
        s && typeof s === 'object' && !Array.isArray(s) && typeof s.text === 'string'
          ? [{ text: s.text, minutes: typeof s.minutes === 'number' ? s.minutes : null }]
          : [],
      )
    : [];
  return (
    <>
      <Link href="/recettes" className="text-brand -mb-4 self-start text-[14px] font-black">
        ← Recettes
      </Link>
      <RecipeEditor
        siteUrl={SITE_URL}
        observations={obs}
        products={(products ?? []).map((p) => ({ id: p.id, name: p.name, quantity: p.quantity_label }))}
        initial={{
          id: r.id,
          title: r.title,
          slug: r.slug,
          description: r.description,
          servings: r.servings,
          prepMinutes: r.prep_minutes ?? 0,
          cookMinutes: r.cook_minutes ?? 0,
          family: r.family,
          illustration: r.illustration ?? 'soupe',
          diets: r.diets,
          tags: r.tags,
          seasonMonths: r.season_months,
          steps: steps.length ? steps : [{ text: '', minutes: null }],
          ingredients: [...r.recipe_ingredients]
            .sort((a, b) => a.position - b.position)
            .map((i) => ({
              label: i.label,
              productId: i.product_id,
              units: Number(i.units),
              pantry: i.pantry,
            })),
          seoTitle: r.seo_title,
          seoDescription: r.seo_description,
          published: r.published,
        }}
      />
    </>
  );
}
