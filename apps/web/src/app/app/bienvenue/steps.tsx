'use client';

import Link from 'next/link';
import { startTransition, useActionState, useState, type FormEvent, type ReactNode } from 'react';
import {
  formatEuro,
  householdFactor,
  PREFERENCES,
  scaleCents,
  type PreferenceId,
  type StoreId,
} from '@repas/core';
import { Button, cx, StoreChip } from '@repas/ui';
import { href } from '@/lib/site';
import { saveEnseigne, saveFoyer, savePreferences, type StepState } from './actions';

/**
 * Soumission sans la réinitialisation automatique de React 19 (<form action>) :
 * en cas d'erreur, toute la saisie reste en place.
 */
function useStepForm(action: (state: StepState, fd: FormData) => Promise<StepState>) {
  const [state, dispatch, pending] = useActionState(action, {});
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return { state, pending, onSubmit };
}

const h1 = 'font-display text-[clamp(34px,3.6vw,50px)] leading-[1.05] font-extrabold tracking-[-1.4px]';
const lead = 'mt-3 mb-9 text-[18px] text-ink-muted';

function StepNav({ step, nextLabel, pending }: { step: number; nextLabel: string; pending: boolean }) {
  return (
    <div className="mt-12 flex max-w-[680px] items-center justify-between gap-3">
      {step > 1 ? (
        <Link
          href={href(`/app/bienvenue?etape=${step - 1}`)}
          className="text-brand min-h-[52px] content-center px-[22px] text-[16px] font-black no-underline"
        >
          ← Retour
        </Link>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={pending} className="min-h-14 px-[34px] text-[17px]">
        {nextLabel}
      </Button>
    </div>
  );
}

function FormError({ state }: { state: StepState }) {
  return state.error ? (
    <p role="alert" className="text-danger mt-4 text-[15px] font-extrabold">
      {state.error}
    </p>
  ) : null;
}

function Counter(props: {
  name: string;
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  addLabel: string;
  removeLabel: string;
}) {
  const { name, label, hint, value, min, max, onChange } = props;
  return (
    <div className="border-line bg-surface-0 flex items-center justify-between gap-4 rounded-[22px] border px-6 py-5">
      <span>
        <span className="block text-[19px] font-black" id={`${name}-label`}>
          {label}
        </span>
        <span className="text-ink-muted text-[15px]">{hint}</span>
      </span>
      <span className="flex items-center gap-3.5">
        <input type="hidden" name={name} value={value} />
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={props.removeLabel}
          className="rounded-pill border-line bg-surface-0 text-brand h-12 w-12 border-2 text-[22px] font-black disabled:opacity-40"
        >
          −
        </button>
        <output
          aria-labelledby={`${name}-label`}
          aria-live="polite"
          className="font-display min-w-7 text-center text-[32px] font-extrabold tabular-nums"
        >
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={props.addLabel}
          className="rounded-pill bg-brand text-brand-on h-12 w-12 text-[22px] font-black disabled:opacity-40"
        >
          +
        </button>
      </span>
    </div>
  );
}

export function FoyerStep({
  adults,
  childrenCount,
  referenceCents,
}: {
  adults: number;
  childrenCount: number;
  referenceCents: number;
}) {
  const { state, pending, onSubmit } = useStepForm(saveFoyer);
  const [ad, setAd] = useState(adults);
  const [en, setEn] = useState(childrenCount);
  const budget = scaleCents(referenceCents, householdFactor(ad, en));
  return (
    <form onSubmit={onSubmit}>
      <h1 className={h1}>Vous êtes combien à table ?</h1>
      <p className={lead}>On adapte les quantités et le budget à ton foyer.</p>
      <div className="flex flex-col gap-3.5">
        <Counter
          name="adults"
          label="Adultes"
          hint="13 ans et plus"
          value={ad}
          min={1}
          max={8}
          onChange={setAd}
          addLabel="Ajouter un adulte"
          removeLabel="Retirer un adulte"
        />
        <Counter
          name="children"
          label="Enfants"
          hint="Portions adaptées"
          value={en}
          min={0}
          max={8}
          onChange={setEn}
          addLabel="Ajouter un enfant"
          removeLabel="Retirer un enfant"
        />
        <p
          className="bg-saving-soft text-saving-ink mt-1.5 rounded-[16px] px-[18px] py-3.5 text-[15px] font-extrabold tabular-nums"
          aria-live="polite"
        >
          Budget repère pour ce foyer : ≈ {formatEuro(budget)} par semaine
        </p>
      </div>
      <FormError state={state} />
      <StepNav step={1} nextLabel="Continuer" pending={pending} />
    </form>
  );
}

const COOKING = [
  { v: 'moins_30', l: 'Moins de 30 minutes' },
  { v: '30_45', l: '30 à 45 minutes' },
  { v: 'peu_importe', l: 'Peu importe' },
] as const;

function Tile({
  type,
  name,
  value,
  checked,
  onSelect,
  children,
  className,
}: {
  onSelect?: () => void;
  type: 'checkbox' | 'radio';
  name: string;
  value: string;
  checked: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        className="peer sr-only"
        {...(onSelect ? { checked, onChange: onSelect } : { defaultChecked: checked })}
      />
      <span
        className={cx(
          'rounded-pill border-line bg-surface-0 text-ink hover:border-brand peer-checked:border-brand peer-focus-visible:outline-brand flex border-2 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2',
          className,
        )}
      >
        {children}
      </span>
    </label>
  );
}

export function PreferencesStep({
  selected,
  cookingTime,
}: {
  selected: PreferenceId[];
  cookingTime: string;
}) {
  const { state, pending, onSubmit } = useStepForm(savePreferences);
  return (
    <form onSubmit={onSubmit}>
      <h1 className={h1}>Des choses à éviter ?</h1>
      <p className={lead}>Choisis tout ce qui s’applique. Aucun choix, c’est très bien aussi.</p>
      <fieldset>
        <legend className="sr-only">Régimes et aliments à éviter</legend>
        <div className="flex flex-wrap gap-2.5">
          {PREFERENCES.map((p) => (
            <Tile
              key={p.id}
              type="checkbox"
              name="pref"
              value={p.id}
              checked={selected.includes(p.id)}
              className="peer-checked:bg-brand peer-checked:text-brand-on min-h-12 items-center px-5 text-[16px] font-extrabold"
            >
              {p.label}
            </Tile>
          ))}
        </div>
      </fieldset>
      <div className="border-line bg-surface-0 mt-8 rounded-[22px] border px-6 py-5">
        <label htmlFor="temps" className="mb-2.5 block text-[17px] font-black">
          Temps de cuisine en semaine
        </label>
        <select
          id="temps"
          name="cooking_time"
          defaultValue={cookingTime}
          className="border-line bg-surface-0 text-ink min-h-[52px] w-full rounded-[14px] border-2 px-3.5 text-[16px] font-bold"
        >
          {COOKING.map((c) => (
            <option key={c.v} value={c.v}>
              {c.l}
            </option>
          ))}
        </select>
      </div>
      <FormError state={state} />
      <StepNav step={2} nextLabel="Continuer" pending={pending} />
    </form>
  );
}

export function EnseigneStep({
  stores,
  storeId,
  postalCode,
}: {
  stores: { id: StoreId; name: string; initials: string }[];
  storeId: string | null;
  postalCode: string;
}) {
  const { state, pending, onSubmit } = useStepForm(saveEnseigne);
  // Champs contrôlés : React réinitialise le formulaire après l'action, la saisie doit survivre à une erreur.
  const [store, setStore] = useState(storeId);
  const [cp, setCp] = useState(postalCode);
  const cpError = state.field === 'postal_code' ? state.error : undefined;
  return (
    <form onSubmit={onSubmit}>
      <h1 className={h1}>Où fais-tu tes courses ?</h1>
      <p className={lead}>
        On calcule les prix dans ton enseigne. Tu verras aussi les autres, pour comparer.
      </p>
      <fieldset>
        <legend className="sr-only">Ton enseigne habituelle</legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
          {stores.map((s) => (
            <Tile
              key={s.id}
              type="radio"
              name="store"
              value={s.id}
              checked={store === s.id}
              onSelect={() => setStore(s.id)}
              className="min-h-[76px] items-center gap-3.5 rounded-[20px] px-4 py-3.5 peer-checked:shadow-[0_0_0_4px_theme(colors.brand.soft)]"
            >
              <StoreChip
                storeId={s.id}
                name={s.name}
                initials={s.initials}
                className="text-[17px] font-black"
              />
            </Tile>
          ))}
        </div>
      </fieldset>
      {state.field === 'store' ? (
        <p role="alert" className="text-danger mt-3 text-[15px] font-extrabold">
          {state.error}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div className="flex-[1_1_220px]">
          <label htmlFor="cp" className="mb-2 block text-[15px] font-black">
            Code postal
          </label>
          <input
            id="cp"
            name="postal_code"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            aria-invalid={cpError ? true : undefined}
            aria-describedby={cpError ? 'cp-err' : 'cp-aide'}
            className={cx(
              'text-ink box-border min-h-[52px] w-full rounded-[14px] border-2 px-4 text-[17px] font-extrabold',
              cpError ? 'border-danger' : 'border-line',
            )}
          />
        </div>
        <p id="cp-aide" className="text-ink-muted flex-[1_1_260px] text-[14px] leading-[21px]">
          Il sert à choisir les prix des magasins proches. Il n’est jamais partagé.
        </p>
      </div>
      {cpError ? (
        <p id="cp-err" role="alert" className="text-danger mt-2 text-[14px] font-extrabold">
          {cpError}
        </p>
      ) : null}
      <StepNav step={3} nextLabel="Générer ma semaine" pending={pending} />
    </form>
  );
}
