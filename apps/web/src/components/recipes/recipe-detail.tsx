'use client';

import { RecipePhoto } from '@/components/recipes/recipe-photo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { formatEuro, sumCents } from '@repas/core';
import { buttonClasses, cx, glassClasses, Toast, type PlatVariant } from '@repas/ui';
import { swapMealAction } from '@/app/app/(main)/plan/actions';
import { href } from '@/lib/site';

export interface DetailIngredient {
  label: string;
  aisle: string | null;
  cents: number | null;
  pantry: boolean;
}

export interface Alternative {
  id: string;
  slug: string;
  title: string;
  illustration: PlatVariant;
  minutes: number;
  /** Écart sur ce repas (centimes, négatif = moins cher). */
  diffCents: number;
  reason: string;
}

export interface RecipeDetailProps {
  slug: string;
  ingredients: DetailIngredient[];
  steps: { text: string; minutes: number | null }[];
  storeName: string;
  reliabilityText: string;
  meal: { planId: string; itemId: string; label: string } | null;
  alternatives: Alternative[];
}

/** Onglets Ingrédients / Étapes, encart « À acheter », tiroir « Remplacer ce repas » (maquettes AppRecette / MRecette). */
export function RecipeDetail({
  slug,
  ingredients,
  steps,
  storeName,
  reliabilityText,
  meal,
  alternatives,
}: RecipeDetailProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'ing' | 'steps'>('ing');
  const [have, setHave] = useState<number[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const toBuy = sumCents(ingredients.filter((_, i) => !have.includes(i)).map((g) => g.cents));

  useEffect(() => {
    if (!drawer) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [drawer]);

  const swap = (recipeId: string) =>
    meal &&
    start(async () => {
      const res = await swapMealAction(meal.planId, { itemId: meal.itemId, recipeId });
      if (res.ok) router.push('/app/plan');
      else setMessage(res.error);
    });

  return (
    <>
      <div className="anim-rise flex flex-wrap items-center gap-3" style={{ animationDelay: '260ms' }}>
        {meal ? (
          <button type="button" onClick={() => setDrawer(true)} className={buttonClasses('secondary')}>
            Remplacer ce repas
          </button>
        ) : null}
        <Link
          href={href(`/app/recettes/${slug}/cuisine`)}
          className={buttonClasses('primary', 'md', 'no-underline')}
        >
          Mode cuisine
        </Link>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className={cx(glassClasses, 'p-5')}>
          <div
            role="tablist"
            aria-label="Contenu de la recette"
            className="bg-surface-50 rounded-pill inline-flex p-1"
          >
            {(
              [
                ['ing', 'Ingrédients'],
                ['steps', 'Étapes'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                className={cx(
                  'rounded-pill min-h-tap px-5 text-[15px] font-black transition-colors',
                  tab === id ? 'bg-brand text-brand-on' : 'text-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === 'ing' ? (
            <div id="panel-ing" role="tabpanel" aria-labelledby="tab-ing" className="mt-4">
              <p className="text-ink-muted text-[14px] font-bold">
                Coche ce que tu as déjà : on le retire du coût de ce repas.
              </p>
              <ul className="mt-3">
                {ingredients.map((g, i) => {
                  const on = have.includes(i);
                  return (
                    <li key={g.label} className="border-line border-t">
                      <label className="flex min-h-[54px] cursor-pointer items-center gap-3 py-2">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setHave(on ? have.filter((x) => x !== i) : [...have, i])}
                          className="accent-brand h-5 w-5 shrink-0"
                        />
                        <span
                          className={cx('flex-1 text-[16px] font-bold', on && 'text-ink-muted line-through')}
                        >
                          {g.label}
                        </span>
                        {g.aisle ? (
                          <span className="text-ink-muted hidden text-[11px] font-black uppercase tracking-[0.8px] sm:inline">
                            {g.aisle}
                          </span>
                        ) : null}
                        <span
                          className={cx(
                            'w-[64px] text-right text-[14px] font-black tabular-nums',
                            on && 'text-ink-muted',
                          )}
                        >
                          {g.cents !== null ? formatEuro(g.cents) : '—'}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <ol
              id="panel-steps"
              role="tabpanel"
              aria-labelledby="tab-steps"
              className="mt-5 flex flex-col gap-4"
            >
              {steps.map((s, i) => (
                <li key={s.text} className="flex gap-4">
                  <span className="rounded-pill bg-brand-soft text-brand grid h-9 w-9 shrink-0 place-items-center font-black">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[17px] leading-[26px]">
                    {s.text}
                    {s.minutes ? <span className="text-ink-muted font-bold"> · {s.minutes} min</span> : null}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <div className="bg-raw-encre rounded-[24px] p-5 text-white">
            <p className="text-site-on-ink-faint text-[12px] font-black tracking-[1.2px]">
              À ACHETER POUR CE REPAS
            </p>
            <p className="font-display mt-1 text-[38px] font-extrabold tabular-nums">{formatEuro(toBuy)}</p>
            <p className="text-site-on-ink text-[14px] font-bold">
              {have.length} ingrédient{have.length > 1 ? 's' : ''} déjà dans tes placards
            </p>
            <Link
              href={href('/app/liste')}
              className="text-raw-peche min-h-tap mt-3 inline-flex items-center text-[15px] font-black"
            >
              Voir ma liste →
            </Link>
          </div>
          <div className={cx(glassClasses, 'p-4')}>
            <p className="text-[14px] font-black">Fiabilité des prix</p>
            <p className="text-ink-muted mt-1 text-[14px] font-bold">{reliabilityText}</p>
            <p className="text-ink-muted mt-1 text-[13px]">Prix chez {storeName}.</p>
          </div>
        </aside>
      </div>

      {drawer && meal ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setDrawer(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Remplacer ce repas"
            onClick={(e) => e.stopPropagation()}
            className="anim-rise bg-surface-50 flex h-full w-full max-w-[420px] flex-col gap-4 overflow-y-auto p-6 shadow-[-20px_0_50px_rgba(42,26,40,0.2)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[26px] font-extrabold">Remplacer {meal.label}</h2>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Fermer"
                autoFocus
                className="rounded-pill grid h-11 w-11 place-items-center bg-white text-[24px] font-bold"
              >
                ×
              </button>
            </div>
            {alternatives.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={pending}
                onClick={() => swap(a.id)}
                className="border-line hover:border-brand flex items-center gap-4 rounded-[20px] border bg-white p-3 text-left transition-colors disabled:opacity-60"
              >
                <RecipePhoto slug={a.slug} illustration={a.illustration} size={72} />
                <span className="flex-1">
                  <span className="text-ink-muted block text-[12px] font-black uppercase tracking-[1px]">
                    {a.reason}
                  </span>
                  <span className="block text-[16px] font-black">{a.title}</span>
                  <span className="text-ink-muted text-[14px] font-bold">{a.minutes} min</span>
                </span>
                <span
                  className={cx(
                    'rounded-pill px-2.5 py-1 text-[13px] font-black tabular-nums',
                    a.diffCents < 0 ? 'bg-saving-soft text-saving-ink' : 'bg-site-track text-ink-muted',
                  )}
                >
                  {a.diffCents < 0 ? `−${formatEuro(-a.diffCents)}` : `+${formatEuro(a.diffCents)}`}
                </span>
              </button>
            ))}
            <p className="text-ink-muted text-[14px] font-bold">
              L’écart s’applique au total de ta semaine chez {storeName}.
            </p>
          </section>
        </div>
      ) : null}
      {message ? (
        <div className="fixed inset-x-4 bottom-28 z-[60] mx-auto max-w-[520px] lg:bottom-8">
          <Toast>{message}</Toast>
        </div>
      ) : null}
    </>
  );
}
