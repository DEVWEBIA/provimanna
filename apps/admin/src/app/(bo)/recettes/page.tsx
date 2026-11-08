import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { costPerServing, formatEuro, recipeStoreTotals } from '@repas/core';
import { Button, cx, glassClasses, inputClasses, PageHeader } from '@repas/ui';
import { recentObservations, STORES } from '@/lib/coverage';
import { requireRole } from '@/lib/staff';
import { createRecipe } from './actions';

export const metadata: Metadata = { title: 'Recettes' };
export const dynamic = 'force-dynamic';

/** Catalogue des recettes (maquette BORecettes, liste) : état, coût par part, ingrédients à lier. */
export default async function BoRecettesPage() {
  const { supabase } = await requireRole(['editeur']);
  const now = new Date();
  const [{ data: recipes }, obs] = await Promise.all([
    supabase
      .from('recipes')
      .select(
        'id, slug, title, servings, published, updated_at, recipe_ingredients(product_id, units, pantry)',
      )
      .order('updated_at', { ascending: false }),
    recentObservations(supabase, now),
  ]);
  const rows = (recipes ?? []).map((r) => {
    const linked = r.recipe_ingredients.filter((i) => i.product_id);
    const totals = recipeStoreTotals(
      {
        id: r.id,
        servings: r.servings,
        ingredients: linked.map((i) => ({
          productId: i.product_id!,
          units: Number(i.units),
          pantry: i.pantry,
        })),
      },
      r.servings,
      STORES,
      obs,
      now,
    );
    return {
      ...r,
      unlinked: r.recipe_ingredients.length - linked.length,
      min: costPerServing(totals[0]?.cents ?? 0, r.servings),
      max: costPerServing(totals.at(-1)?.cents ?? 0, r.servings),
    };
  });
  return (
    <>
      <PageHeader
        eyebrow={`${rows.filter((r) => r.published).length} publiées · ${rows.filter((r) => !r.published).length} brouillons`}
        title="Recettes"
        actions={
          <form action={createRecipe} className="flex gap-2">
            <label htmlFor="new-title" className="sr-only">
              Titre de la nouvelle recette
            </label>
            <input
              id="new-title"
              name="title"
              required
              minLength={3}
              placeholder="Titre de la nouvelle recette"
              className={inputClasses(false, 'w-[280px]')}
            />
            <Button type="submit">Nouvelle recette</Button>
          </form>
        }
      />
      <div className={cx(glassClasses, 'overflow-x-auto p-2')}>
        <table className="w-full min-w-[720px] text-[14px] tabular-nums">
          <thead>
            <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
              {['RECETTE', 'ÉTAT', 'COÛT PAR PART', 'À LIER', 'MODIFIÉE'].map((h) => (
                <th key={h} scope="col" className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-line hover:bg-site-hover border-t">
                <td className="px-3 py-2.5">
                  <Link href={`/recettes/${r.id}` as Route} className="text-ink font-extrabold">
                    {r.title}
                  </Link>
                  <span className="text-ink-muted block text-[12px]">/recettes/{r.slug}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cx(
                      'rounded-pill px-2.5 py-0.5 text-[12px] font-black',
                      r.published ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning',
                    )}
                  >
                    {r.published ? 'Publiée' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-bold">
                  {r.min ? `${formatEuro(r.min)} à ${formatEuro(r.max)}` : '—'}
                </td>
                <td className="px-3 py-2.5">
                  {r.unlinked ? (
                    <span className="bg-danger-soft text-danger-ink rounded-pill px-2 py-0.5 text-[12px] font-black">
                      {r.unlinked}
                    </span>
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </td>
                <td className="text-ink-muted px-3 py-2.5">
                  {new Date(r.updated_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
