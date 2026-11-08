'use client';

import { useMemo, useState, useTransition, type ReactNode } from 'react';
import {
  costPerServing,
  formatEuro,
  recipeStoreTotals,
  type PriceObservation,
  type StoreId,
  STORE_IDS,
  STORES_INFO,
  completeTotals,
  STORE_COUNT,
} from '@repas/core';
import {
  Button,
  buttonClasses,
  cx,
  glassClasses,
  inputClasses,
  Plat,
  PLAT_VARIANTS,
  Toast,
  type PlatVariant,
} from '@repas/ui';
import { saveRecipe } from '../actions';
import { StoreLogo } from '@/components/store-logo';

export interface EditorProduct {
  id: string;
  name: string;
  quantity: string | null;
}

export interface EditorRecipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  family: string;
  illustration: string;
  diets: string[];
  tags: string[];
  seasonMonths: number[];
  steps: { text: string; minutes: number | null }[];
  ingredients: { label: string; productId: string | null; units: number; pantry: boolean }[];
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
}

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const DIETS = [
  ['vegetarien', 'Végétarien'],
  ['vegan', 'Vegan'],
  ['sans_porc', 'Sans porc'],
  ['halal', 'Halal'],
  ['sans_gluten', 'Sans gluten'],
] as const;
const TAGS = [
  ['lactose', 'Contient du lactose'],
  ['poisson', 'Contient du poisson'],
  ['fruits_a_coque', 'Fruits à coque'],
  ['epice', 'Épicé'],
  ['enfants', 'Enfants'],
  ['batch', 'Batch cooking'],
] as const;
const STORE_NAME: Record<string, string> = Object.fromEntries(
  STORE_IDS.map((id) => [id, STORES_INFO[id].name]),
);
const STORES: StoreId[] = [...STORE_IDS];

const words = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z]+/)
    .filter((w) => w.length > 2);

/** Ressemblance (0 à 1) entre un libellé d'ingrédient et un nom de produit : mots en commun. */
function match(label: string, name: string) {
  const a = words(label);
  const b = words(name);
  if (!a.length || !b.length) return 0;
  const hits = b.filter((w) =>
    a.some((x) => x.startsWith(w.slice(0, 5)) || w.startsWith(x.slice(0, 5))),
  ).length;
  return hits / b.length;
}

/** Éditeur de recette (maquette BORecettes) : coût recalculé par core à chaque modification. */
export function RecipeEditor({
  initial,
  products,
  observations,
  siteUrl,
}: {
  initial: EditorRecipe;
  products: EditorProduct[];
  observations: PriceObservation[];
  siteUrl: string;
}) {
  const [r, setR] = useState(initial);
  const [pending, start] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);
  const set = <K extends keyof EditorRecipe>(k: K, v: EditorRecipe[K]) => setR((p) => ({ ...p, [k]: v }));
  const setIng = (i: number, patch: Partial<EditorRecipe['ingredients'][number]>) =>
    set(
      'ingredients',
      r.ingredients.map((g, k) => (k === i ? { ...g, ...patch } : g)),
    );
  const setStep = (i: number, patch: Partial<EditorRecipe['steps'][number]>) =>
    set(
      'steps',
      r.steps.map((s, k) => (k === i ? { ...s, ...patch } : s)),
    );
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const totals = useMemo(
    () =>
      recipeStoreTotals(
        {
          id: r.id,
          servings: r.servings,
          ingredients: r.ingredients.flatMap((g) =>
            g.productId ? [{ productId: g.productId, units: g.units, pantry: g.pantry }] : [],
          ),
        },
        r.servings,
        STORES,
        observations,
        new Date(),
      ),
    [r.ingredients, r.servings, r.id, observations],
  );
  const stale = totals.reduce(
    (n, t) => n + Math.round((1 - t.freshRatio) * r.ingredients.filter((g) => g.productId).length),
    0,
  );
  const unlinked = r.ingredients.filter((g) => !g.productId && !g.pantry).length;
  const seoTitle =
    r.seoTitle ?? `${r.title} : ${totals[0] ? formatEuro(totals[0].cents) : '—'} pour ${r.servings}`;
  const seoDesc =
    r.seoDescription ??
    `${r.title} pour ${r.servings} : ${totals[0] ? formatEuro(costPerServing(totals[0].cents, r.servings)) : '—'} par part chez ${totals[0] ? STORE_NAME[totals[0].storeId] : '—'}. Prix comparés dans ${STORE_COUNT} enseignes.`;
  const checks = [
    { ok: seoTitle.length <= 60, text: `Titre SEO de ${seoTitle.length} caractères (60 maximum)` },
    { ok: seoDesc.length <= 155, text: `Méta-description de ${seoDesc.length} caractères (155 maximum)` },
    {
      ok: unlinked === 0,
      text: unlinked
        ? `${unlinked} ingrédient${unlinked > 1 ? 's' : ''} sans produit : coût incomplet`
        : 'Tous les ingrédients ont un produit',
    },
    { ok: r.steps.length >= 2, text: `${r.steps.length} étape${r.steps.length > 1 ? 's' : ''}` },
  ];

  const save = (published = r.published) =>
    start(async () => {
      const res = await saveRecipe({
        ...r,
        published,
        seoTitle: r.seoTitle || null,
        seoDescription: r.seoDescription || null,
      });
      if (res.ok) {
        set('published', published);
        setToast({ ok: true, text: res.message });
      } else setToast({ ok: false, text: res.error });
    });

  return (
    <>
      <header className="flex flex-wrap items-center gap-4">
        <Plat
          variant={
            (PLAT_VARIANTS.includes(r.illustration as PlatVariant) ? r.illustration : 'soupe') as PlatVariant
          }
          size={72}
          decorative
        />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[clamp(28px,3vw,38px)] font-extrabold leading-tight">{r.title}</h1>
          <p className="text-ink-muted text-[14px] font-bold">
            <span
              className={cx(
                'rounded-pill mr-2 px-2 py-0.5 text-[12px] font-black',
                r.published ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning',
              )}
            >
              {r.published ? 'Publiée' : 'Brouillon'}
            </span>
            /recettes/{r.slug}
          </p>
        </div>
        {r.published ? (
          <a
            href={`${siteUrl}/recettes/${r.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('link', 'sm')}
          >
            Aperçu ↗
          </a>
        ) : null}
        <Button variant="secondary" disabled={pending} onClick={() => save()}>
          Enregistrer
        </Button>
        <Button disabled={pending} onClick={() => save(!r.published)}>
          {r.published ? 'Retirer du site' : 'Publier'}
        </Button>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <section className={cx(glassClasses, 'grid gap-4 p-6 md:grid-cols-2')}>
            <Field label="Titre" id="title">
              <input
                id="title"
                value={r.title}
                onChange={(e) => set('title', e.target.value)}
                className={inputClasses()}
              />
            </Field>
            <Field label="Adresse (URL)" id="slug">
              <input
                id="slug"
                value={r.slug}
                onChange={(e) => set('slug', e.target.value)}
                className={inputClasses()}
              />
            </Field>
            <Field label="Description" id="desc" wide>
              <textarea
                id="desc"
                rows={2}
                value={r.description ?? ''}
                onChange={(e) => set('description', e.target.value || null)}
                className={inputClasses(false, 'py-3')}
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Préparation (min)" id="prep">
                <input
                  id="prep"
                  type="number"
                  min={0}
                  value={r.prepMinutes}
                  onChange={(e) => set('prepMinutes', Number(e.target.value))}
                  className={inputClasses()}
                />
              </Field>
              <Field label="Cuisson (min)" id="cook">
                <input
                  id="cook"
                  type="number"
                  min={0}
                  value={r.cookMinutes}
                  onChange={(e) => set('cookMinutes', Number(e.target.value))}
                  className={inputClasses()}
                />
              </Field>
              <Field label="Parts" id="servings">
                <input
                  id="servings"
                  type="number"
                  min={1}
                  max={12}
                  value={r.servings}
                  onChange={(e) => set('servings', Number(e.target.value))}
                  className={inputClasses()}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Famille" id="family">
                <input
                  id="family"
                  value={r.family}
                  onChange={(e) => set('family', e.target.value)}
                  className={inputClasses()}
                />
              </Field>
              <Field label="Illustration" id="plat">
                <select
                  id="plat"
                  value={r.illustration}
                  onChange={(e) => set('illustration', e.target.value)}
                  className={inputClasses()}
                >
                  {PLAT_VARIANTS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <fieldset className="md:col-span-2">
              <legend className="mb-2 text-[13px] font-black">Saisonnalité</legend>
              <div className="flex flex-wrap gap-1.5">
                {MONTHS.map((m, i) => (
                  <Chip
                    key={m}
                    on={r.seasonMonths.includes(i + 1)}
                    onClick={() =>
                      set(
                        'seasonMonths',
                        toggle(r.seasonMonths, i + 1).sort((a, b) => a - b),
                      )
                    }
                  >
                    {m}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-[13px] font-black">Régimes compatibles</legend>
              <div className="flex flex-wrap gap-1.5">
                {DIETS.map(([v, l]) => (
                  <Chip
                    key={v}
                    on={r.diets.includes(v)}
                    onClick={() =>
                      set('diets', toggle(r.diets, v).length ? toggle(r.diets, v) : ['omnivore'])
                    }
                  >
                    {l}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-[13px] font-black">Marqueurs</legend>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map(([v, l]) => (
                  <Chip key={v} on={r.tags.includes(v)} onClick={() => set('tags', toggle(r.tags, v))}>
                    {l}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </section>

          <section className={cx(glassClasses, 'p-6')} aria-labelledby="ing-t">
            <div className="flex items-center justify-between">
              <h2 id="ing-t" className="font-display text-[22px] font-extrabold">
                Ingrédients et produits liés
              </h2>
              <Button
                variant="link"
                size="sm"
                onClick={() =>
                  set('ingredients', [
                    ...r.ingredients,
                    { label: '', productId: null, units: 1, pantry: false },
                  ])
                }
              >
                + Ajouter
              </Button>
            </div>
            <p className="text-ink-muted mt-1 text-[13px] font-bold">
              Quantité en unités de vente du produit (0,5 = un demi-paquet).
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {r.ingredients.map((g, i) => {
                const ranked = [...products]
                  .map((p) => ({ p, s: match(g.label, p.name) }))
                  .sort((a, b) => b.s - a.s);
                const chosen = products.find((p) => p.id === g.productId);
                const score = chosen ? match(g.label, chosen.name) : 0;
                return (
                  <li
                    key={i}
                    className="grid items-center gap-2 rounded-[16px] bg-white p-3 md:grid-cols-[minmax(0,1.3fr)_90px_minmax(0,1.4fr)_auto_auto]"
                  >
                    <input
                      aria-label={`Ingrédient ${i + 1}`}
                      value={g.label}
                      onChange={(e) => setIng(i, { label: e.target.value })}
                      className={inputClasses(false, 'min-h-[44px]')}
                    />
                    <input
                      aria-label={`Quantité ${i + 1}`}
                      type="number"
                      step="0.01"
                      min={0}
                      value={g.units}
                      onChange={(e) => setIng(i, { units: Number(e.target.value) })}
                      className={inputClasses(false, 'min-h-[44px]')}
                    />
                    <select
                      aria-label={`Produit lié ${i + 1}`}
                      value={g.productId ?? ''}
                      onChange={(e) => setIng(i, { productId: e.target.value || null })}
                      className={inputClasses(!g.productId && !g.pantry, 'min-h-[44px]')}
                    >
                      <option value="">Choisir le produit…</option>
                      <optgroup label="Suggestions">
                        {ranked.slice(0, 4).map(({ p }) => (
                          <option key={`s-${p.id}`} value={p.id}>
                            {p.name} {p.quantity ? `· ${p.quantity}` : ''}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Tous les produits">
                        {[...products]
                          .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.quantity ? `· ${p.quantity}` : ''}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                    <span
                      className={cx(
                        'rounded-pill whitespace-nowrap px-2.5 py-1 text-center text-[12px] font-black',
                        g.pantry
                          ? 'bg-site-track text-ink-muted'
                          : !g.productId
                            ? 'bg-danger-soft text-danger-ink'
                            : score >= 0.5
                              ? 'bg-success-soft text-success'
                              : 'bg-warning-soft text-warning',
                      )}
                    >
                      {g.pantry ? 'Placard' : !g.productId ? 'À lier' : score >= 0.5 ? 'Bon' : 'À vérifier'}
                    </span>
                    <span className="flex items-center gap-1">
                      <label className="flex items-center gap-1 text-[12px] font-bold">
                        <input
                          type="checkbox"
                          checked={g.pantry}
                          onChange={(e) => setIng(i, { pantry: e.target.checked })}
                          className="accent-brand h-4 w-4"
                        />
                        Placard
                      </label>
                      <button
                        type="button"
                        aria-label={`Retirer l’ingrédient ${i + 1}`}
                        onClick={() =>
                          set(
                            'ingredients',
                            r.ingredients.filter((_, k) => k !== i),
                          )
                        }
                        className="text-danger grid h-11 w-11 place-items-center text-[20px] font-bold"
                      >
                        ×
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={cx(glassClasses, 'p-6')} aria-labelledby="steps-t">
            <div className="flex items-center justify-between">
              <h2 id="steps-t" className="font-display text-[22px] font-extrabold">
                Étapes
              </h2>
              <Button
                variant="link"
                size="sm"
                onClick={() => set('steps', [...r.steps, { text: '', minutes: null }])}
              >
                + Ajouter
              </Button>
            </div>
            <ol className="mt-4 flex flex-col gap-2">
              {r.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 rounded-[16px] bg-white p-3">
                  <span className="rounded-pill bg-brand-soft text-brand mt-2 grid h-8 w-8 shrink-0 place-items-center font-black">
                    {i + 1}
                  </span>
                  <textarea
                    aria-label={`Étape ${i + 1}`}
                    rows={2}
                    value={s.text}
                    onChange={(e) => setStep(i, { text: e.target.value })}
                    className={inputClasses(false, 'flex-1 py-2')}
                  />
                  <input
                    aria-label={`Minutes de l’étape ${i + 1}`}
                    type="number"
                    min={0}
                    value={s.minutes ?? ''}
                    placeholder="min"
                    onChange={(e) =>
                      setStep(i, { minutes: e.target.value === '' ? null : Number(e.target.value) })
                    }
                    className={inputClasses(false, 'w-20')}
                  />
                  <button
                    type="button"
                    aria-label={`Retirer l’étape ${i + 1}`}
                    onClick={() =>
                      set(
                        'steps',
                        r.steps.filter((_, k) => k !== i),
                      )
                    }
                    className="text-danger grid h-11 w-11 place-items-center text-[20px] font-bold"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-8">
          <section className="bg-raw-encre rounded-[24px] p-5 text-white" aria-live="polite">
            <h2 className="text-site-on-ink-faint text-[12px] font-black tracking-[1.2px]">
              COÛT CALCULÉ EN DIRECT POUR {r.servings} PARTS
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {totals.map((t, i) => (
                <li
                  key={t.storeId}
                  className="flex items-center justify-between gap-2 text-[15px] font-bold tabular-nums"
                >
                  <span className="flex items-center gap-2">
                    <span className="bg-raw-blanc grid h-7 min-w-[52px] place-items-center rounded-[8px] px-1.5">
                      <StoreLogo id={t.storeId} name={STORE_NAME[t.storeId] ?? t.storeId} height={18} />
                    </span>
                    {STORE_NAME[t.storeId]}
                  </span>
                  {t.partial ? (
                    <span className="text-site-on-ink-faint text-[13px]">
                      partiel · ingrédients manquants
                    </span>
                  ) : (
                    <span className={i === 0 ? 'text-raw-peche font-black' : ''}>
                      {t.freshRatio < 1 ? '≈ ' : ''}
                      {formatEuro(t.cents)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {totals.length ? (
              <p className="text-site-on-ink mt-3 text-[13px] font-bold">
                {formatEuro(costPerServing(totals[0]!.cents, r.servings))} à{' '}
                {formatEuro(costPerServing(completeTotals(totals).at(-1)?.cents ?? 0, r.servings))} par part
                {stale ? ` · ${stale} prix de plus de 7 jours` : ''}
              </p>
            ) : null}
          </section>
          <section className={cx(glassClasses, 'flex flex-col gap-3 p-5')}>
            <h2 className="font-display text-[20px] font-extrabold">Référencement</h2>
            <Field label={`Titre SEO · ${seoTitle.length} / 60`} id="seo-t">
              <input
                id="seo-t"
                value={r.seoTitle ?? ''}
                placeholder={seoTitle}
                onChange={(e) => set('seoTitle', e.target.value || null)}
                className={inputClasses(seoTitle.length > 60)}
              />
            </Field>
            <Field label={`Méta-description · ${seoDesc.length} / 155`} id="seo-d">
              <textarea
                id="seo-d"
                rows={3}
                value={r.seoDescription ?? ''}
                placeholder={seoDesc}
                onChange={(e) => set('seoDescription', e.target.value || null)}
                className={inputClasses(seoDesc.length > 155, 'py-2')}
              />
            </Field>
            <div className="rounded-[14px] bg-white p-3">
              <p className="text-success text-[12px]">[domaine].fr › recettes</p>
              <p className="text-brand text-[16px] font-bold">{seoTitle}</p>
              <p className="text-ink-muted text-[13px]">{seoDesc}</p>
            </div>
            <ul className="flex flex-col gap-1 text-[13px] font-bold">
              {checks.map((c) => (
                <li key={c.text} className={c.ok ? 'text-success' : 'text-warning'}>
                  {c.ok ? '✓' : '!'} {c.text}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
      {toast ? (
        <div
          className="fixed inset-x-4 bottom-6 z-30 mx-auto max-w-[480px]"
          role={toast.ok ? 'status' : 'alert'}
        >
          <Toast>{toast.text}</Toast>
        </div>
      ) : null}
    </>
  );
}

function Field({
  label,
  id,
  wide,
  children,
}: {
  label: string;
  id: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? 'md:col-span-2' : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-black">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cx(
        'rounded-pill min-h-[36px] border-2 px-3 text-[13px] font-extrabold',
        on ? 'border-brand bg-brand text-brand-on' : 'border-line text-ink bg-white',
      )}
    >
      {children}
    </button>
  );
}
