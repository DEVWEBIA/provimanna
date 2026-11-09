'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, type CSSProperties } from 'react';
import { cx, inputClasses, Reveal, Toast, type PlatVariant } from '@repas/ui';
import { placeRecipesAction } from '@/app/app/(main)/plan/actions';
import { RecipeCard } from './recipe-card';

export interface BrowserRecipe {
  id: string;
  slug: string;
  title: string;
  illustration: PlatVariant;
  minutes: number;
  perServingCents: number | null;
  tags: string[];
  /** Mots utilisés par la recherche (titre, ingrédients). */
  search: string;
  inPlan: boolean;
}

const FILTERS = [
  ['all', 'Toutes'],
  ['De saison', 'De saison'],
  ['Végé', 'Végé'],
  ['− de 30 min', 'Rapide'],
  ['Enfants', 'Enfants'],
] as const;

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Catalogue de l'espace client (maquettes AppRecettes / MRecettes) : recherche, filtres, ajout à la semaine. */
export function RecipeBrowser({
  planId,
  weekNumber,
  recipes,
}: {
  planId: string | null;
  weekNumber: number;
  recipes: BrowserRecipe[];
}) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [picked, setPicked] = useState<string[]>([]);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const terms = norm(q).split(/\s+/).filter(Boolean);
  const list = recipes.filter(
    (r) => (filter === 'all' || r.tags.includes(filter)) && terms.every((t) => r.search.includes(t)),
  );

  const place = () =>
    planId &&
    start(async () => {
      const res = await placeRecipesAction(planId, { recipeIds: picked });
      if (res.ok) router.push('/app/plan');
      else setMessage(res.error);
    });

  return (
    <>
      <div className="anim-rise flex flex-col gap-4" style={{ '--d': '200ms' } as CSSProperties}>
        <div className="relative max-w-[520px]">
          <label htmlFor="q" className="sr-only">
            Rechercher une recette
          </label>
          <input
            id="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Potimarron, lentilles, poulet…"
            className={inputClasses(false, 'min-h-[54px] pl-5 text-[17px]')}
          />
        </div>
        <div role="group" aria-label="Filtres" className="flex flex-wrap gap-2">
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={cx(
                'rounded-pill min-h-tap border-2 px-4 text-[14px] font-extrabold transition-colors',
                filter === id
                  ? 'border-brand bg-brand text-brand-on'
                  : 'border-line text-ink hover:border-brand bg-white/80',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {picked.length > 0 ? (
        <div
          role="status"
          className="anim-rise bg-brand text-brand-on sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[20px] px-5 py-3 shadow-[0_14px_34px_rgba(107,56,104,0.3)]"
        >
          <span className="font-black">
            {picked.length} recette{picked.length > 1 ? 's' : ''} à placer dans ta semaine {weekNumber}
          </span>
          <button
            type="button"
            onClick={place}
            disabled={pending || !planId}
            className="rounded-pill text-brand min-h-tap bg-white px-5 text-[15px] font-black disabled:opacity-60"
          >
            Les placer dans mon plan
          </button>
        </div>
      ) : null}

      <p className="text-ink-muted -mb-2 text-[15px] font-black">{list.length} recettes</p>
      {list.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
          {list.map((r, i) => {
            const on = picked.includes(r.id);
            return (
              <Reveal as="li" key={r.id} delay={(i % 4) * 70}>
                <RecipeCard
                  headingLevel="h2"
                  href={`/app/recettes/${r.slug}`}
                  title={r.title}
                  illustration={r.illustration}
                  minutes={r.minutes}
                  perServingCents={r.perServingCents}
                  tags={r.tags}
                  action={
                    r.inPlan ? (
                      <p className="text-success min-h-tap mt-3 flex items-center text-[14px] font-black">
                        ✓ Déjà dans ta semaine
                      </p>
                    ) : (
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPicked(on ? picked.filter((x) => x !== r.id) : [...picked, r.id])}
                        className={cx(
                          'rounded-pill min-h-tap mt-3 border-2 text-[14px] font-black transition-colors',
                          on
                            ? 'border-brand bg-brand-soft text-brand'
                            : 'border-line text-ink hover:border-brand bg-white',
                        )}
                      >
                        {on ? 'Ajoutée ✓' : '+ Ajouter à ma semaine'}
                      </button>
                    )
                  }
                />
              </Reveal>
            );
          })}
        </ul>
      ) : (
        <p className="text-ink-muted border-line rounded-[20px] border border-dashed bg-white/60 px-5 py-8 text-center text-[16px] font-bold">
          Aucune recette ne correspond. Essaie un autre ingrédient.
        </p>
      )}
      {message ? (
        <div className="fixed inset-x-4 bottom-28 z-30 mx-auto max-w-[520px] lg:bottom-8">
          <Toast>{message}</Toast>
        </div>
      ) : null}
    </>
  );
}
