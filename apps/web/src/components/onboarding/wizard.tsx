'use client';

import Link from 'next/link';
import { startTransition, useActionState, useState, type FormEvent, type ReactNode } from 'react';
import {
  formatEuro,
  householdFactor,
  PREFERENCES,
  priceSpread,
  scaleCents,
  type PreferenceId,
  type StoreId,
} from '@repas/core';
import { APP_NAME, Button, cx, LogoMark, Plat, StoreChip } from '@repas/ui';
import { saveOnboarding } from '@/app/app/bienvenue/actions';
import { startSignup } from '@/app/commencer/actions';
import type { AuthFormState } from '@/app/connexion/actions';
import { EmailSent } from '@/components/auth/email-sent';
import { EXAMPLE_STORES } from '@/lib/landing-data';
import { href, ROUTES } from '@/lib/site';
import { enseigneSchema, type COOKING_TIMES } from './schema';

type CookingTime = (typeof COOKING_TIMES)[number];

export interface WizardDraft {
  adults: number;
  children: number;
  prefs: PreferenceId[];
  cooking_time: CookingTime;
  store: StoreId | null;
  postal_code: string;
}

export interface OnboardingWizardProps {
  /** guest : sans compte, l'étape 4 demande l'email. account : compte connecté, on enregistre à l'étape 3. */
  mode: 'guest' | 'account';
  stores: { id: StoreId; name: string; initials: string }[];
  initial: WizardDraft;
}

const STEPS = [
  ['Ton foyer', 'Adultes et enfants'],
  ['Tes préférences', 'Régime, temps de cuisine'],
  ['Ton enseigne', 'Et ton code postal'],
  ['Ta semaine', 'Générée pour toi'],
] as const;

const COOKING: { v: CookingTime; l: string }[] = [
  { v: 'moins_30', l: 'Moins de 30 minutes' },
  { v: '30_45', l: '30 à 45 minutes' },
  { v: 'peu_importe', l: 'Peu importe' },
];

const WEEK_COLORS = [
  'bg-food-curry',
  'bg-food-salade',
  'bg-food-soupe',
  'bg-food-pates',
  'bg-food-salade',
  'bg-food-tomate',
  'bg-food-curry',
  'bg-food-pates',
  'bg-food-soupe',
  'bg-food-salade',
  'bg-food-curry',
  'bg-food-tomate',
  'bg-food-pates',
  'bg-food-soupe',
];

// TODO(lot 5) : remplacer le panier d'exemple par le vrai plan généré (generatePlan) et ses totaux.
const MEDIAN_EXAMPLE = [...EXAMPLE_STORES].sort((a, b) => a.cents - b.cents)[2]?.cents ?? 6420;
const exampleCents = (id: StoreId | null) => EXAMPLE_STORES.find((s) => s.id === id)?.cents ?? MEDIAN_EXAMPLE;
const CHEAPEST_EXAMPLE = priceSpread(EXAMPLE_STORES.map((s) => s.cents)).minCents;

const h1 = 'font-display text-[clamp(34px,3.6vw,50px)] leading-[1.05] font-extrabold tracking-[-1.4px]';
const lead = 'mt-3 mb-9 text-[18px] text-ink-muted';

function Counter(props: {
  id: string;
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  addLabel: string;
  removeLabel: string;
}) {
  const { id, label, hint, value, min, max, onChange } = props;
  return (
    <div className="border-line bg-surface-0 flex items-center justify-between gap-4 rounded-[22px] border px-6 py-5">
      <span>
        <span className="block text-[19px] font-black" id={`${id}-label`}>
          {label}
        </span>
        <span className="text-ink-muted text-[15px]">{hint}</span>
      </span>
      <span className="flex items-center gap-3.5">
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
          aria-labelledby={`${id}-label`}
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

function Tile(props: {
  type: 'checkbox' | 'radio';
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={props.type}
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
        className="peer sr-only"
      />
      <span
        className={cx(
          'rounded-pill border-line bg-surface-0 text-ink hover:border-brand peer-checked:border-brand peer-focus-visible:outline-brand flex border-2 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2',
          props.className,
        )}
      >
        {props.children}
      </span>
    </label>
  );
}

function Alert({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} role="alert" className="text-danger mt-3 text-[15px] font-extrabold">
      {children}
    </p>
  );
}

/** Questionnaire d'onboarding (maquettes AppOnboarding / MOnboarding), avec ou sans compte. */
export function OnboardingWizard({ mode, stores, initial }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState<WizardDraft>(initial);
  const [errors, setErrors] = useState<{ store?: string; postal_code?: string; global?: string }>({});
  const [saving, setSaving] = useState(false);
  const [signup, sendSignup, sending] = useActionState(startSignup, { status: 'idle' } as AuthFormState);
  const [editingEmail, setEditingEmail] = useState(false);

  const set = <K extends keyof WizardDraft>(k: K, v: WizardDraft[K]) => setD((prev) => ({ ...prev, [k]: v }));
  const factor = householdFactor(d.adults, d.children);
  const myStore = stores.find((s) => s.id === d.store);
  const people = d.adults + d.children;

  const next = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 3) {
      const check = enseigneSchema.safeParse({ store: d.store ?? undefined, postal_code: d.postal_code });
      if (!check.success) {
        const fe: typeof errors = {};
        for (const issue of check.error.issues)
          fe[issue.path[0] as 'store' | 'postal_code'] ??= issue.message;
        setErrors(fe);
        return;
      }
      setErrors({});
      if (mode === 'account') {
        setSaving(true);
        const res = await saveOnboarding({ ...d, store: check.data.store });
        setSaving(false);
        if (res.error) return setErrors({ global: res.error });
      }
    }
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0 });
  };

  const submitEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('draft', JSON.stringify(d));
    setEditingEmail(false);
    startTransition(() => sendSignup(fd));
  };

  const emailSent = mode === 'guest' && signup.status === 'sent' && !editingEmail;
  const signupError = (f: string) =>
    signup.status === 'error' && signup.field === f ? signup.message : null;
  const lastEmail =
    signup.status === 'sent' ? signup.email : signup.status === 'error' ? (signup.email ?? '') : '';

  return (
    <div className="bg-surface-50 text-ink flex min-h-screen flex-wrap font-sans">
      <aside className="bg-brand relative box-border flex flex-[1_1_380px] flex-col gap-10 overflow-hidden px-[clamp(24px,4vw,56px)] py-10 text-white max-md:gap-6 max-md:py-6">
        <Link href="/" className="flex items-center gap-2.5 text-[18px] font-black text-white no-underline">
          <LogoMark size={30} tone="onBrand" />
          {APP_NAME}
        </Link>
        <div className="max-md:hidden">
          <p className="font-display text-[clamp(32px,3vw,44px)] font-extrabold leading-[1.02] tracking-[-1.4px]">
            Ta première semaine en 2 minutes.
          </p>
          <p className="text-site-lilac mt-3.5 text-[17px] leading-[26px]">
            Tu peux tout changer plus tard dans ton profil.
          </p>
        </div>
        <ol className="flex flex-col gap-2 max-md:hidden">
          {STEPS.map(([t, desc], i) => {
            const n = i + 1;
            const done = n < step;
            const cur = n === step;
            return (
              <li
                key={t}
                aria-current={cur ? 'step' : undefined}
                className={cx(
                  'flex items-center gap-3.5 rounded-[16px] px-3.5 py-3',
                  cur && 'bg-white/[0.12]',
                )}
              >
                <span
                  className={cx(
                    'rounded-pill box-border grid h-[34px] w-[34px] shrink-0 place-items-center text-[14px] font-black',
                    done
                      ? 'bg-saving text-raw-encre'
                      : cur
                        ? 'text-brand bg-white'
                        : 'border-2 border-white/40 text-white',
                  )}
                >
                  {done ? '✓' : n}
                </span>
                <span>
                  <span className="block text-[16px] font-black">{t}</span>
                  <span className="text-site-on-brand-faint block text-[14px]">{desc}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-auto flex items-end gap-2.5 max-md:hidden" aria-hidden="true">
          <Plat variant="curry" size={110} decorative />
          <Plat variant="soupe" size={84} decorative />
          <Plat variant="pates" size={96} decorative />
        </div>
        <p className="text-site-on-brand-faint text-[14px] font-bold max-md:hidden">
          14 jours de Premium offerts · sans carte bancaire
        </p>
      </aside>

      <main className="box-border flex min-w-0 flex-[999_1_560px] flex-col px-[clamp(24px,5vw,88px)] py-10">
        <div className="mb-12 flex items-center gap-4">
          <div
            className="bg-line h-2 flex-1 rounded-[9px]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={step}
            aria-label="Progression"
          >
            <div
              className="bg-brand h-2 rounded-[9px] transition-[width]"
              style={{ width: `${step * 25}%` }}
            />
          </div>
          <span className="text-ink-muted text-[14px] font-black tabular-nums">Étape {step} sur 4</span>
        </div>

        <div className="w-full max-w-[680px] flex-1">
          {emailSent && signup.status === 'sent' ? (
            <EmailSent
              email={signup.email}
              suite="/app"
              sentAt={signup.sentAt}
              onChangeEmail={() => setEditingEmail(true)}
            />
          ) : step < 4 ? (
            <form onSubmit={next} noValidate>
              {step === 1 ? (
                <>
                  <h1 className={h1}>Vous êtes combien à table ?</h1>
                  <p className={lead}>On adapte les quantités et le budget à ton foyer.</p>
                  <div className="flex flex-col gap-3.5">
                    <Counter
                      id="adults"
                      label="Adultes"
                      hint="13 ans et plus"
                      value={d.adults}
                      min={1}
                      max={8}
                      onChange={(n) => set('adults', n)}
                      addLabel="Ajouter un adulte"
                      removeLabel="Retirer un adulte"
                    />
                    <Counter
                      id="children"
                      label="Enfants"
                      hint="Portions adaptées"
                      value={d.children}
                      min={0}
                      max={8}
                      onChange={(n) => set('children', n)}
                      addLabel="Ajouter un enfant"
                      removeLabel="Retirer un enfant"
                    />
                    <p
                      className="bg-saving-soft text-saving-ink mt-1.5 rounded-[16px] px-[18px] py-3.5 text-[15px] font-extrabold tabular-nums"
                      aria-live="polite"
                    >
                      Budget repère pour ce foyer : ≈ {formatEuro(scaleCents(exampleCents(d.store), factor))}{' '}
                      par semaine
                    </p>
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <h1 className={h1}>Des choses à éviter ?</h1>
                  <p className={lead}>Choisis tout ce qui s’applique. Aucun choix, c’est très bien aussi.</p>
                  <fieldset>
                    <legend className="sr-only">Régimes et aliments à éviter</legend>
                    <div className="flex flex-wrap gap-2.5">
                      {PREFERENCES.map((p) => {
                        const on = d.prefs.includes(p.id);
                        return (
                          <Tile
                            key={p.id}
                            type="checkbox"
                            name="pref"
                            checked={on}
                            onChange={() =>
                              set('prefs', on ? d.prefs.filter((x) => x !== p.id) : [...d.prefs, p.id])
                            }
                            className="peer-checked:bg-brand peer-checked:text-brand-on min-h-12 items-center px-5 text-[16px] font-extrabold"
                          >
                            {p.label}
                          </Tile>
                        );
                      })}
                    </div>
                  </fieldset>
                  <div className="border-line bg-surface-0 mt-8 rounded-[22px] border px-6 py-5">
                    <label htmlFor="temps" className="mb-2.5 block text-[17px] font-black">
                      Temps de cuisine en semaine
                    </label>
                    <select
                      id="temps"
                      value={d.cooking_time}
                      onChange={(e) => set('cooking_time', e.target.value as CookingTime)}
                      className="border-line bg-surface-0 text-ink min-h-[52px] w-full rounded-[14px] border-2 px-3.5 text-[16px] font-bold"
                    >
                      {COOKING.map((c) => (
                        <option key={c.v} value={c.v}>
                          {c.l}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}

              {step === 3 ? (
                <>
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
                          checked={d.store === s.id}
                          onChange={() => set('store', s.id)}
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
                  {errors.store ? <Alert>{errors.store}</Alert> : null}
                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <div className="flex-[1_1_220px]">
                      <label htmlFor="cp" className="mb-2 block text-[15px] font-black">
                        Code postal
                      </label>
                      <input
                        id="cp"
                        value={d.postal_code}
                        onChange={(e) => set('postal_code', e.target.value)}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={5}
                        aria-invalid={errors.postal_code ? true : undefined}
                        aria-describedby={errors.postal_code ? 'cp-err' : 'cp-aide'}
                        className={cx(
                          'bg-surface-0 text-ink box-border min-h-[52px] w-full rounded-[14px] border-2 px-4 text-[17px] font-extrabold',
                          errors.postal_code ? 'border-danger' : 'border-line',
                        )}
                      />
                    </div>
                    <p id="cp-aide" className="text-ink-muted flex-[1_1_260px] text-[14px] leading-[21px]">
                      Il sert à choisir les prix des magasins proches. Il n’est jamais partagé.
                    </p>
                  </div>
                  {errors.postal_code ? <Alert id="cp-err">{errors.postal_code}</Alert> : null}
                </>
              ) : null}

              {errors.global ? <Alert>{errors.global}</Alert> : null}
              <div className="mt-12 flex max-w-[680px] items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-brand min-h-[52px] px-[22px] text-[16px] font-black"
                  >
                    ← Retour
                  </button>
                ) : (
                  <span />
                )}
                <Button type="submit" disabled={saving} className="min-h-14 px-[34px] text-[17px]">
                  {step === 3 ? 'Générer ma semaine' : 'Continuer'}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p className="rounded-pill bg-site-mint text-success mb-3.5 inline-flex items-center gap-2 px-3.5 py-2 text-[14px] font-black">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {mode === 'guest' ? 'Réponses prêtes' : 'Foyer enregistré'}
              </p>
              <h1 className={h1}>
                {mode === 'guest'
                  ? 'Ta première semaine t’attend.'
                  : 'Tout est prêt pour ta première semaine.'}
              </h1>
              <p className="text-ink-muted mb-7 mt-3 text-[18px]">
                14 repas pour {people} personnes, de saison, chez {myStore?.name}.
              </p>
              <div className="border-line bg-surface-0 rounded-[26px] border p-[22px]">
                <div
                  className="text-ink-muted grid grid-cols-7 gap-1.5 text-center text-[12px] font-black"
                  aria-hidden="true"
                >
                  {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                  {WEEK_COLORS.map((c, i) => (
                    <span key={i} className={`h-11 rounded-[10px] ${c}`} />
                  ))}
                </div>
                <div className="border-line mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed pt-[18px]">
                  <span>
                    <span className="text-ink-muted block text-[13px] font-black tracking-[1px]">
                      TOTAL ESTIMÉ CHEZ {myStore?.name.toUpperCase()}
                    </span>
                    <span className="font-display text-[44px] font-extrabold tabular-nums tracking-[-1.4px]">
                      ≈ {formatEuro(scaleCents(exampleCents(d.store), factor))}
                    </span>
                  </span>
                  {d.store !== 'lidl' ? (
                    <span className="bg-saving-soft text-saving-ink rounded-[14px] px-4 py-2.5 font-black tabular-nums">
                      Possible dès ≈ {formatEuro(scaleCents(CHEAPEST_EXAMPLE, factor))} chez Lidl
                    </span>
                  ) : null}
                </div>
              </div>

              {mode === 'guest' ? (
                <form onSubmit={submitEmail} noValidate className="mt-9 max-w-[480px]">
                  <h2 className="text-[22px] font-black">Où t’envoie-t-on ta semaine ?</h2>
                  <p className="text-ink-muted mb-5 mt-1 text-[16px]">
                    On t’envoie un lien de connexion : tes réponses sont enregistrées dans ton compte. Pas de
                    mot de passe.
                  </p>
                  {signupError('global') ? (
                    <p
                      role="alert"
                      className="bg-danger-soft text-danger-ink mb-4 rounded-[16px] px-4 py-3 text-[15px] font-bold"
                    >
                      {signupError('global')}
                    </p>
                  ) : null}
                  <label htmlFor="mail" className="mb-2 block text-[15px] font-black">
                    Adresse email
                  </label>
                  <input
                    id="mail"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={lastEmail}
                    placeholder="ton@email.fr"
                    aria-invalid={signupError('email') ? true : undefined}
                    aria-describedby={signupError('email') ? 'mail-err' : undefined}
                    className={cx(
                      'bg-surface-0 text-ink box-border min-h-[56px] w-full rounded-[16px] border-2 px-[18px] text-[17px] font-bold',
                      signupError('email') ? 'border-danger' : 'border-line',
                    )}
                  />
                  {signupError('email') ? <Alert id="mail-err">{signupError('email')}</Alert> : null}
                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] leading-[21px]">
                    <input type="checkbox" name="cgu" className="accent-brand mt-px h-5 w-5 shrink-0" />
                    <span>
                      J’accepte les{' '}
                      <Link href={href('/cgu')} className="text-brand underline">
                        conditions d’utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link href={href(ROUTES.confidentialite)} className="text-brand underline">
                        politique de confidentialité
                      </Link>
                      .
                    </span>
                  </label>
                  {signupError('cgu') ? <Alert>{signupError('cgu')}</Alert> : null}
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-brand min-h-[52px] px-[22px] text-[16px] font-black"
                    >
                      ← Retour
                    </button>
                    <Button type="submit" disabled={sending} className="min-h-14 px-[34px] text-[17px]">
                      Recevoir ma semaine
                    </Button>
                  </div>
                  <p className="text-ink-muted mt-6 text-[14px] font-bold">
                    Déjà un compte ?{' '}
                    <Link href={ROUTES.connexion} className="text-brand underline">
                      Se connecter
                    </Link>
                  </p>
                </form>
              ) : (
                <div className="mt-12 flex max-w-[680px] items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-brand min-h-[52px] px-[22px] text-[16px] font-black"
                  >
                    ← Retour
                  </button>
                  <Link
                    href="/app"
                    className="rounded-pill bg-brand text-brand-on inline-flex min-h-14 items-center px-[34px] text-[17px] font-black no-underline"
                  >
                    Voir mon plan →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
