'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  startTransition,
  useActionState,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  BUDGET_MAX_CENTS,
  BUDGET_MIN_CENTS,
  EQUIPMENT,
  formatEuro,
  householdFactor,
  MAX_STYLES,
  MOTIVATIONS,
  PREFERENCES,
  priceSpread,
  scaleCents,
  STORES_INFO,
  STYLES,
  CUISINES,
  regionOf,
  type CuisineId,
  type EquipmentId,
  type MotivationId,
  type PreferenceId,
  type StoreId,
  type StyleId,
} from '@repas/core';
import {
  animDelay,
  APP_NAME,
  Button,
  buttonClasses,
  cx,
  Glow,
  Icon,
  inputClasses,
  LogoMark,
  Plat,
  TicketCard,
  type IconName,
  AccentTitle,
  StepTransition,
} from '@repas/ui';
import { saveOnboarding, type GeneratedPlan } from '@/app/app/bienvenue/actions';
import { updatePreferences } from '@/app/app/(main)/profil/actions';
import { startSignup } from '@/app/commencer/actions';
import type { AuthFormState } from '@/app/connexion/actions';
import { EmailSent } from '@/components/auth/email-sent';
import { StoreLogo } from '@/components/store-logo';
import type { IngredientGroup } from '@/lib/ingredients';
import { EXAMPLE_STORES } from '@/lib/landing-data';
import { href, ROUTES } from '@/lib/site';
import { daysSummary } from '@/lib/meal-days';
import { ChipToggle, IconBubble, InfoNote, OptionCard, OptionTile, WeekGrid } from './controls';
import {
  enseigneSchema,
  equipementSchema,
  repasSchema,
  WIZARD_STEPS,
  type COOKING_TIMES,
  type WizardStep,
} from './schema';

type CookingTime = (typeof COOKING_TIMES)[number];

export interface WizardDraft {
  adults: number;
  children: number;
  prefs: PreferenceId[];
  cooking_time: CookingTime;
  store: StoreId | null;
  postal_code: string;
  meal_days: number[];
  with_lunch: boolean;
  budget_cents: number | null;
  styles: StyleId[];
  equipment: EquipmentId[];
  disliked: string[];
  motivations: MotivationId[];
  cuisines: CuisineId[];
}

const LAST_QUESTION = WIZARD_STEPS.indexOf('equipement');

export interface OnboardingWizardProps {
  /**
   * guest : sans compte, le dernier écran demande l'email. account : compte connecté, on enregistre
   * après la dernière question. edit : une seule réponse modifiée depuis le profil.
   */
  mode: 'guest' | 'account' | 'edit';
  stores: { id: StoreId; name: string; initials: string }[];
  ingredients: IngredientGroup[];
  /** Nombre de recettes publiées par cuisine (francaise → 40…). */
  cuisineCounts: Record<string, number>;
  initial: WizardDraft;
  /** Le foyer a déjà répondu « pas de budget précis ». */
  initialNoBudget?: boolean;
  /** Mode edit : l'écran à afficher. */
  editStep?: WizardStep;
  /** Code de parrainage reçu dans le lien (/commencer?parrain=…). */
  referral?: string;
}

const COOKING: { v: CookingTime; l: string }[] = [
  { v: 'moins_30', l: 'Moins de 30 min' },
  { v: '30_45', l: '30 à 45 min' },
  { v: 'peu_importe', l: 'Peu importe' },
];

const MOTIVATION_ICONS: Record<MotivationId, IconName> = {
  inspiration: 'idee',
  budget: 'tirelire',
  temps: 'horloge',
  equilibre: 'pousse',
  gaspillage: 'poubelle',
};
const STYLE_ICONS: Record<StyleId, IconName> = {
  equilibre: 'balance',
  rapide: 'eclair',
  gourmand: 'toque',
  famille: 'personnes',
  monde: 'monde',
  vegetal: 'pousse',
};
const PREF_ICONS: Record<PreferenceId, IconName> = {
  vegetarien: 'pousse',
  sans_porc: 'interdit',
  sans_gluten: 'ble',
  sans_lactose: 'goutte',
  halal: 'bouclier',
  sans_poisson: 'poisson',
  sans_fruits_a_coque: 'noix',
  peu_epice: 'piment',
};
const EQUIPMENT_ICONS: Record<EquipmentId, IconName> = {
  plaques: 'plaques',
  gaziniere: 'flamme',
  four: 'four',
  air_fryer: 'airfryer',
  micro_ondes: 'microondes',
  robot: 'robot',
};

// Panier d'exemple de la landing (14 repas) : sert de repère avant le vrai plan.
const MEDIAN_EXAMPLE = [...EXAMPLE_STORES].sort((a, b) => a.cents - b.cents)[2]?.cents ?? 6420;
const exampleCents = (id: StoreId | null) => EXAMPLE_STORES.find((s) => s.id === id)?.cents ?? MEDIAN_EXAMPLE;
const CHEAPEST_EXAMPLE = priceSpread(EXAMPLE_STORES.map((s) => s.cents)).minCents;
const roundEuro = (cents: number) => Math.round(cents / 100) * 100;
const clampBudget = (cents: number) => Math.min(BUDGET_MAX_CENTS, Math.max(BUDGET_MIN_CENTS, cents));

const h1Class = 'font-display text-[clamp(34px,4.4vw,50px)] leading-[1.04] font-extrabold tracking-[-1.4px]';
const primaryShadow = 'shadow-[0_12px_30px_rgba(107,56,104,0.28)]';

function StepTitle({ title, lead }: { title: ReactNode; lead: ReactNode }) {
  return (
    <>
      <h1 className={h1Class}>
        <AccentTitle title={title} animate baseDelay={40} />
      </h1>
      <p className="anim-rise text-ink-muted mb-8 mt-3 text-[18px] leading-[26px]" style={animDelay(120)}>
        {lead}
      </p>
    </>
  );
}

function StepBody({ children }: { children: ReactNode }) {
  return (
    <div className="anim-rise" style={animDelay(200)}>
      {children}
    </div>
  );
}

function Alert({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} role="alert" className="text-danger mt-3 text-[15px] font-extrabold">
      {children}
    </p>
  );
}

function Counter(props: {
  id: string;
  label: string;
  hint: string;
  icon: IconName;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  addLabel: string;
  removeLabel: string;
}) {
  const { id, label, hint, value, min, max, onChange } = props;
  return (
    <div className="dark:bg-surface-0 flex items-center justify-between gap-3 rounded-[24px] bg-white px-4 py-4 shadow-[0_2px_18px_rgba(42,26,40,0.06)] sm:px-5">
      <span className="flex min-w-0 items-center gap-3 sm:gap-4">
        <IconBubble name={props.icon} />
        <span className="min-w-0">
          <span className="block text-[18px] font-black" id={`${id}-label`}>
            {label}
          </span>
          <span className="text-ink-muted text-[15px] font-bold">{hint}</span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={props.removeLabel}
          className="bg-surface-50 text-ink grid h-12 w-12 place-items-center rounded-full text-[24px] font-black transition-colors disabled:opacity-40"
        >
          −
        </button>
        <output
          aria-labelledby={`${id}-label`}
          aria-live="polite"
          className="font-display text-brand min-w-8 text-center text-[34px] font-extrabold tabular-nums"
        >
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={props.addLabel}
          className="bg-brand text-brand-on grid h-12 w-12 place-items-center rounded-full text-[24px] font-black shadow-[0_6px_16px_rgba(107,56,104,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-40 motion-reduce:transition-none"
        >
          +
        </button>
      </span>
    </div>
  );
}

const toggle = <T,>(list: readonly T[], v: T) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

/** Questionnaire d'onboarding : une question par écran (refonte du 08/11/2026), avec ou sans compte. */
export function OnboardingWizard({
  mode,
  stores,
  ingredients,
  cuisineCounts,
  initial,
  initialNoBudget = false,
  editStep,
  referral,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [index, setIndex] = useState(editStep ? WIZARD_STEPS.indexOf(editStep) : 0);
  const step = WIZARD_STEPS[index]!;
  const [d, setD] = useState<WizardDraft>(initial);
  const [noBudget, setNoBudget] = useState(initialNoBudget);
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState<{
    store?: string;
    postal_code?: string;
    global?: string;
    step?: string;
  }>({});
  const [saving, setSaving] = useState(false);
  const [composing, setComposing] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [signup, sendSignup, sending] = useActionState(startSignup, { status: 'idle' } as AuthFormState);
  const [editingEmail, setEditingEmail] = useState(false);
  const budgetId = useId();

  const set = <K extends keyof WizardDraft>(k: K, v: WizardDraft[K]) => setD((prev) => ({ ...prev, [k]: v }));
  // Enseignes présentes dans la région du code postal (outre-mer : 97x, 98x).
  const region = regionOf(d.postal_code);
  const regionStores = stores.filter((s) => STORES_INFO[s.id].regions.includes(region));
  const factor = householdFactor(d.adults, d.children);
  const myStore = stores.find((s) => s.id === d.store);
  const people = d.adults + d.children;
  const meals = d.meal_days.length * (d.with_lunch ? 2 : 1);
  // Repère : panier d'exemple à l'échelle du foyer et du nombre de repas.
  const reference = roundEuro((scaleCents(exampleCents(d.store), factor) * meals) / 14);
  const budget = clampBudget(d.budget_cents ?? reference);

  // Sens de la transition entre écrans : vers la droite en avançant, vers la gauche en revenant.
  const [direction, setDirection] = useState<1 | -1>(1);
  const goTo = (i: number) => {
    setErrors({});
    setDirection(i >= index ? 1 : -1);
    setIndex(i);
    window.scrollTo({ top: 0 });
  };

  /** Vérifie l'écran courant ; renvoie le brouillon à jour, ou null si une réponse manque. */
  const checkStep = (): WizardDraft | null => {
    if (step === 'repas') {
      const r = repasSchema.safeParse({ meal_days: d.meal_days, with_lunch: d.with_lunch });
      if (!r.success) {
        setErrors({ step: r.error.issues[0]?.message });
        return null;
      }
    }
    if (step === 'enseigne') {
      const check = enseigneSchema.safeParse({ store: d.store ?? undefined, postal_code: d.postal_code });
      if (!check.success) {
        const fe: typeof errors = {};
        for (const issue of check.error.issues)
          fe[issue.path[0] as 'store' | 'postal_code'] ??= issue.message;
        setErrors(fe);
        return null;
      }
    }
    if (step === 'equipement') {
      const r = equipementSchema.safeParse({ equipment: d.equipment });
      if (!r.success) {
        setErrors({ step: r.error.issues[0]?.message });
        return null;
      }
    }
    if (step === 'budget') {
      const next = { ...d, budget_cents: noBudget ? null : budget };
      setD(next);
      return next;
    }
    return d;
  };

  const next = async (e: FormEvent) => {
    e.preventDefault();
    const draft = checkStep();
    if (!draft) return;
    setErrors({});
    if (mode === 'edit') {
      setSaving(true);
      const res = await updatePreferences({ ...draft, store: (draft.store ?? '') as StoreId });
      if (res.error) {
        setSaving(false);
        setErrors({ global: res.error });
        return;
      }
      router.push(`/app/profil?fait=${res.result}`);
      return;
    }
    if (index === LAST_QUESTION) {
      // « On compose ta semaine » : les critères s'affichent un à un pendant l'enregistrement
      // (durée minimale pour qu'on ait le temps de les lire, plus courte si les animations sont réduites).
      const started = performance.now();
      const minMs = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 600 : 2600;
      setComposing(true);
      window.scrollTo({ top: 0 });
      if (mode === 'account') {
        setSaving(true);
        const res = await saveOnboarding({ ...draft, store: (draft.store ?? '') as StoreId });
        setSaving(false);
        if (res.error) {
          setComposing(false);
          setErrors({ global: res.error });
          return;
        }
        setPlan(res.plan ?? null);
      }
      await new Promise((r) => setTimeout(r, Math.max(0, minMs - (performance.now() - started))));
      setComposing(false);
    }
    goTo(Math.min(WIZARD_STEPS.length - 1, index + 1));
  };

  const back = () => (index > 0 ? goTo(index - 1) : router.push('/'));

  const submitEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('draft', JSON.stringify(d));
    setEditingEmail(false);
    startTransition(() => sendSignup(fd));
  };

  const filteredIngredients = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('fr');
    if (!q) return ingredients;
    return ingredients
      .map((g) => ({ ...g, items: g.items.filter((i) => i.name.toLocaleLowerCase('fr').includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [ingredients, query]);

  const emailSent = mode === 'guest' && signup.status === 'sent' && !editingEmail;
  const signupError = (f: string) =>
    signup.status === 'error' && signup.field === f ? signup.message : null;
  const lastEmail =
    signup.status === 'sent' ? signup.email : signup.status === 'error' ? (signup.email ?? '') : '';
  const progress = mode === 'edit' ? 100 : Math.round(((index + 1) / WIZARD_STEPS.length) * 100);
  const backButtonClass =
    'text-ink -ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white/70';

  return (
    <main className="bg-surface-50 text-ink relative isolate min-h-screen overflow-x-clip font-sans">
      <Glow className="bg-raw-aubergine-clair right-[6%] top-24 h-80 w-80" />
      <Glow className="bg-raw-peche bottom-10 left-[4%] h-72 w-72 opacity-60" />

      <div className="mx-auto flex min-h-screen w-full max-w-[640px] flex-col px-4 pb-36 pt-6 sm:px-6">
        <Link
          href={mode === 'guest' ? '/' : '/app'}
          className="text-brand min-h-tap mx-auto flex items-center gap-2 text-[19px] font-black no-underline"
        >
          <LogoMark size={28} />
          {APP_NAME}
        </Link>

        <div className="mb-8 mt-5 flex items-center gap-3">
          {composing ? (
            <span className="-ml-2 h-11 w-11 shrink-0" aria-hidden="true" />
          ) : mode === 'edit' ? (
            <Link href={href('/app/profil')} aria-label="Retour au profil" className={backButtonClass}>
              <Icon name="retour" size={24} />
            </Link>
          ) : step !== 'resultat' || mode === 'guest' ? (
            <button
              type="button"
              onClick={back}
              aria-label={index > 0 ? 'Question précédente' : 'Retour à l’accueil'}
              className={backButtonClass}
            >
              <Icon name="retour" size={24} />
            </button>
          ) : null}
          <div
            className="h-2.5 flex-1 rounded-full bg-[#E9E2D3] dark:bg-white/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={
              mode === 'edit'
                ? 'Modification'
                : `Question ${Math.min(index + 1, LAST_QUESTION + 1)} sur ${LAST_QUESTION + 1}`
            }
          >
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-[#8A5486] to-[#6B3868] transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1" key={composing ? 'compose' : emailSent ? 'mail' : step}>
          {composing ? (
            <Composing
              lines={[
                `${meals} repas pour ${people} personne${people > 1 ? 's' : ''}`,
                d.prefs.length
                  ? `Régime respecté : ${d.prefs.map((p) => PREFERENCES.find((x) => x.id === p)?.label).join(', ')}`
                  : 'Aucun régime particulier',
                `Faisable avec : ${d.equipment.map((e) => EQUIPMENT.find((x) => x.id === e)?.label).join(', ')}`,
                ...(d.disliked.length
                  ? [
                      `${d.disliked.length} ingrédient${d.disliked.length > 1 ? 's' : ''} écarté${d.disliked.length > 1 ? 's' : ''}`,
                    ]
                  : []),
                ...(d.styles.length
                  ? [`Style : ${d.styles.map((s) => STYLES.find((x) => x.id === s)?.label).join(', ')}`]
                  : []),
                ...(d.cuisines.length
                  ? [
                      `Cuisines : ${d.cuisines.map((c) => CUISINES.find((x) => x.id === c)?.label).join(', ')}`,
                    ]
                  : []),
                d.budget_cents ? `Budget visé : ${formatEuro(d.budget_cents)}` : 'Recettes de saison',
                `Prix comparés dans ${regionStores.length} enseignes`,
              ]}
            />
          ) : emailSent && signup.status === 'sent' ? (
            <EmailSent
              email={signup.email}
              suite="/app"
              sentAt={signup.sentAt}
              onChangeEmail={() => setEditingEmail(true)}
            />
          ) : step !== 'resultat' ? (
            <form id="etape" onSubmit={next} noValidate>
              <StepTransition stepKey={step} direction={direction}>
                {step === 'motivations' ? (
                  <>
                    <StepTitle
                      title="Qu’est-ce qui t’amène ?"
                      lead="Coche tout ce qui te ressemble en ce moment. On en tient compte pour ta semaine."
                    />
                    <StepBody>
                      <fieldset className="flex flex-col gap-3">
                        <legend className="sr-only">Ce qui t’amène</legend>
                        {MOTIVATIONS.map((m) => (
                          <OptionCard
                            key={m.id}
                            type="checkbox"
                            name="motivation"
                            icon={MOTIVATION_ICONS[m.id]}
                            title={m.label}
                            hint={m.hint}
                            checked={d.motivations.includes(m.id)}
                            onChange={() => set('motivations', toggle(d.motivations, m.id))}
                          />
                        ))}
                      </fieldset>
                    </StepBody>
                  </>
                ) : null}

                {step === 'foyer' ? (
                  <>
                    <StepTitle
                      title="Vous êtes combien à table ?"
                      lead="On adapte les quantités et le budget à ton foyer."
                    />
                    <StepBody>
                      <div className="flex flex-col gap-3">
                        <Counter
                          id="adults"
                          label="Adultes"
                          hint="13 ans et plus"
                          icon="profil"
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
                          icon="famille"
                          value={d.children}
                          min={0}
                          max={8}
                          onChange={(n) => set('children', n)}
                          addLabel="Ajouter un enfant"
                          removeLabel="Retirer un enfant"
                        />
                      </div>
                    </StepBody>
                  </>
                ) : null}

                {step === 'repas' ? (
                  <>
                    <StepTitle
                      title="Quels repas on prévoit ?"
                      lead="Les moments et les jours de ta semaine."
                    />
                    <StepBody>
                      <fieldset className="grid grid-cols-2 gap-3">
                        <legend className="sr-only">Repas par jour</legend>
                        <OptionTile
                          type="radio"
                          name="moments"
                          checked={!d.with_lunch}
                          onChange={() => set('with_lunch', false)}
                          visual={<IconBubble name="lune" size={60} />}
                          title="Le soir"
                          hint="1 repas par jour"
                        />
                        <OptionTile
                          type="radio"
                          name="moments"
                          checked={d.with_lunch}
                          onChange={() => set('with_lunch', true)}
                          visual={<IconBubble name="soleil" size={60} />}
                          title="Midi + soir"
                          hint="2 repas par jour"
                        />
                      </fieldset>
                      <h2 className="text-ink-muted mb-2.5 mt-7 text-[13px] font-black uppercase tracking-[1.4px]">
                        Ta semaine
                      </h2>
                      <WeekGrid
                        days={d.meal_days}
                        withLunch={d.with_lunch}
                        onToggle={(day) => set('meal_days', toggle(d.meal_days, day))}
                      />
                      <p className="mt-4 text-center text-[16px]" aria-live="polite">
                        <strong className="font-black tabular-nums">{meals} repas</strong>
                        <span className="text-ink-muted font-bold"> · {daysSummary(d.meal_days)}</span>
                      </p>
                      {errors.step ? <Alert>{errors.step}</Alert> : null}
                    </StepBody>
                  </>
                ) : null}

                {step === 'enseigne' ? (
                  <>
                    <StepTitle
                      title="Où fais-tu tes courses ?"
                      lead="On calcule les prix dans ton enseigne. Tu verras aussi les autres, pour comparer."
                    />
                    <StepBody>
                      <div className="mb-6">
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
                          placeholder="69003"
                          aria-invalid={errors.postal_code ? true : undefined}
                          aria-describedby={errors.postal_code ? 'cp-err' : 'cp-aide'}
                          className={inputClasses(Boolean(errors.postal_code), 'text-[17px] font-extrabold')}
                        />
                        <p id="cp-aide" className="text-ink-muted mt-2 text-[14px] font-bold">
                          Il sert à choisir les enseignes et les prix proches de chez toi. Il n’est jamais
                          partagé.
                        </p>
                        {errors.postal_code ? <Alert id="cp-err">{errors.postal_code}</Alert> : null}
                      </div>
                      <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <legend className="mb-3 text-[17px] font-black">
                          {region === 'outre_mer'
                            ? 'Les enseignes près de chez toi'
                            : 'Ton enseigne habituelle'}
                        </legend>
                        {regionStores.map((s) => (
                          <OptionTile
                            key={s.id}
                            type="radio"
                            name="store"
                            checked={d.store === s.id}
                            onChange={() => set('store', s.id)}
                            visual={<StoreLogo id={s.id} name={s.name} size={56} />}
                            title={s.name}
                            hint={STORES_INFO[s.id].partialAssortment ? 'Assortiment partiel' : undefined}
                          />
                        ))}
                      </fieldset>
                      {errors.store ? <Alert>{errors.store}</Alert> : null}
                      {d.store && STORES_INFO[d.store].partialAssortment ? (
                        <InfoNote icon="panier" title="Assortiment partiel">
                          {STORES_INFO[d.store].name} ne vend pas tout : les produits absents de ta liste sont
                          comptés au prix moyen des autres enseignes, avec le signe ≈.
                        </InfoNote>
                      ) : null}
                      {region === 'outre_mer' ? (
                        <InfoNote icon="monde" title="Outre-mer">
                          On compare les enseignes présentes chez toi. Les prix affichés sont pour l’instant
                          ceux de la métropole : les relevés locaux arriveront avec les tickets de caisse.
                        </InfoNote>
                      ) : null}
                    </StepBody>
                  </>
                ) : null}

                {step === 'budget' ? (
                  <>
                    <StepTitle
                      title="Quel budget pour tes courses ?"
                      lead="Par semaine, pour tout le foyer. On compose tes repas pour rester dedans."
                    />
                    <StepBody>
                      <div className={cx('text-center transition-opacity', noBudget && 'opacity-40')}>
                        <p
                          className="font-display text-brand text-[clamp(72px,14vw,104px)] font-extrabold tabular-nums leading-none tracking-[-3px]"
                          aria-hidden="true"
                        >
                          {Math.round(budget / 100)} €
                        </p>
                        <p className="text-ink-muted mt-2 text-[17px] font-bold">
                          par semaine, pour {meals} repas
                        </p>
                        <p className="bg-brand-soft text-brand mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[16px] font-black">
                          <Icon name="personnes" size={20} />
                          {people} personne{people > 1 ? 's' : ''}
                        </p>
                      </div>
                      <label htmlFor={budgetId} className="sr-only">
                        Budget par semaine
                      </label>
                      <input
                        id={budgetId}
                        type="range"
                        min={BUDGET_MIN_CENTS / 100}
                        max={BUDGET_MAX_CENTS / 100}
                        step={1}
                        value={Math.round(budget / 100)}
                        disabled={noBudget}
                        aria-valuetext={`${Math.round(budget / 100)} euros par semaine`}
                        onChange={(e) => set('budget_cents', Number(e.target.value) * 100)}
                        className="accent-brand mt-8 h-11 w-full cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="flex justify-between text-[15px]">
                        <span>
                          <strong className="block font-black tabular-nums">
                            {BUDGET_MIN_CENTS / 100} €
                          </strong>
                          <span className="text-ink-muted font-bold">Budget serré</span>
                        </span>
                        <span className="text-right">
                          <strong className="block font-black tabular-nums">
                            {BUDGET_MAX_CENTS / 100} €
                          </strong>
                          <span className="text-ink-muted font-bold">Budget confort</span>
                        </span>
                      </div>
                      <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 text-[16px] font-bold">
                        <input
                          type="checkbox"
                          checked={noBudget}
                          onChange={(e) => setNoBudget(e.target.checked)}
                          className="accent-brand h-5 w-5"
                        />
                        Je n’ai pas de budget précis
                      </label>
                      <InfoNote icon="pieces" title={`Repère : ≈ ${formatEuro(reference)} par semaine`}>
                        {!noBudget && budget < reference * 0.8
                          ? 'Budget serré : on privilégie les recettes les moins chères de ton enseigne.'
                          : `C’est le prix habituel de ${meals} repas pour ${people} personne${people > 1 ? 's' : ''}${myStore ? ` chez ${myStore.name}` : ''}.`}
                      </InfoNote>
                    </StepBody>
                  </>
                ) : null}

                {step === 'regime' ? (
                  <>
                    <StepTitle
                      title="Un régime ou des allergies ?"
                      lead="Coche ce qui te concerne. Aucun choix, c’est très bien aussi."
                    />
                    <StepBody>
                      <fieldset className="grid grid-cols-2 gap-3">
                        <legend className="sr-only">Régimes et aliments à éviter</legend>
                        {PREFERENCES.map((p) => (
                          <OptionTile
                            key={p.id}
                            type="checkbox"
                            name="pref"
                            checked={d.prefs.includes(p.id)}
                            onChange={() => set('prefs', toggle(d.prefs, p.id))}
                            visual={<IconBubble name={PREF_ICONS[p.id]} />}
                            title={p.label}
                          />
                        ))}
                      </fieldset>
                      <InfoNote icon="bouclier" title="Jamais d’exception">
                        Ces choix s’appliquent à chaque recette de ta semaine.
                      </InfoNote>
                    </StepBody>
                  </>
                ) : null}

                {step === 'ambiance' ? (
                  <>
                    <StepTitle
                      title="Quelle ambiance à table ?"
                      lead={`Jusqu’à ${MAX_STYLES} styles : on les met en avant dans ta semaine.`}
                    />
                    <StepBody>
                      <fieldset className="flex flex-col gap-3">
                        <legend className="sr-only">Styles de repas, {MAX_STYLES} au plus</legend>
                        {STYLES.map((s) => {
                          const on = d.styles.includes(s.id);
                          return (
                            <OptionCard
                              key={s.id}
                              type="checkbox"
                              name="style"
                              icon={STYLE_ICONS[s.id]}
                              title={s.label}
                              hint={s.hint}
                              checked={on}
                              disabled={!on && d.styles.length >= MAX_STYLES}
                              onChange={() => set('styles', toggle(d.styles, s.id))}
                            />
                          );
                        })}
                      </fieldset>
                      <p className="text-ink-muted mt-3 text-[14px] font-bold" aria-live="polite">
                        {d.styles.length >= MAX_STYLES
                          ? `${MAX_STYLES} styles choisis : décoche-en un pour changer.`
                          : `${d.styles.length} sur ${MAX_STYLES}`}
                      </p>
                      <fieldset className="mt-7">
                        <legend className="mb-3 text-[17px] font-black">Temps de cuisine en semaine</legend>
                        <div className="dark:bg-surface-0 grid grid-cols-3 gap-1.5 rounded-[18px] bg-white p-1.5 shadow-[0_2px_18px_rgba(42,26,40,0.06)]">
                          {COOKING.map((c) => (
                            <label key={c.v} className="cursor-pointer">
                              <input
                                type="radio"
                                name="temps"
                                checked={d.cooking_time === c.v}
                                onChange={() => set('cooking_time', c.v)}
                                className="peer sr-only"
                              />
                              <span className="text-ink-muted peer-checked:bg-brand peer-checked:text-brand-on peer-focus-visible:outline-brand grid min-h-12 place-items-center rounded-[13px] px-2 text-center text-[14px] font-black leading-[18px] transition-colors peer-focus-visible:outline peer-focus-visible:outline-[3px] sm:text-[15px]">
                                {c.l}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </StepBody>
                  </>
                ) : null}

                {step === 'cuisines' ? (
                  <>
                    <StepTitle
                      title="Quelles cuisines te font envie ?"
                      lead="Coche autant de cuisines que tu veux : on les met plus souvent dans ta semaine."
                    />
                    <StepBody>
                      <fieldset className="flex flex-col gap-3">
                        <legend className="sr-only">Cuisines préférées</legend>
                        {CUISINES.map((c) => {
                          const n = cuisineCounts[c.id] ?? 0;
                          return (
                            <OptionCard
                              key={c.id}
                              type="checkbox"
                              name="cuisine"
                              visual={
                                <span className="bg-brand-soft grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full">
                                  <Plat variant={c.plat} size={40} decorative />
                                </span>
                              }
                              title={c.label}
                              hint={`${c.hint} · ${n ? `${n} recette${n > 1 ? 's' : ''}` : 'bientôt'}`}
                              checked={d.cuisines.includes(c.id)}
                              onChange={() => set('cuisines', toggle(d.cuisines, c.id))}
                            />
                          );
                        })}
                      </fieldset>
                      <p className="text-ink-muted mt-3 text-[14px] font-bold">
                        Aucune case cochée : on varie entre toutes les cuisines.
                      </p>
                    </StepBody>
                  </>
                ) : null}

                {step === 'ingredients' ? (
                  <>
                    <StepTitle
                      title="Des ingrédients à éviter ?"
                      lead="Coche ce que tu n’aimes pas : on l’évite dans tes recettes."
                    />
                    <StepBody>
                      <div className="relative">
                        <Icon
                          name="recherche"
                          size={20}
                          className="text-ink-muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                        />
                        <label htmlFor="ingredient-q" className="sr-only">
                          Chercher un ingrédient
                        </label>
                        <input
                          id="ingredient-q"
                          type="search"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Chercher un ingrédient…"
                          className={inputClasses(false, 'min-h-[56px] pl-12 text-[17px]')}
                        />
                      </div>
                      <p className="text-ink-muted mt-3 text-[14px] font-bold" aria-live="polite">
                        {d.disliked.length === 0
                          ? 'Rien à éviter ? Continue simplement.'
                          : `${d.disliked.length} ingrédient${d.disliked.length > 1 ? 's' : ''} évité${d.disliked.length > 1 ? 's' : ''}`}
                      </p>
                      {filteredIngredients.length === 0 ? (
                        <p className="text-ink-muted mt-6 text-[16px] font-bold">
                          Aucun ingrédient ne correspond à « {query} ».
                        </p>
                      ) : (
                        filteredIngredients.map((g) => (
                          <fieldset key={g.id} className="mt-6">
                            <legend className="mb-3 text-[18px] font-black">{g.label}</legend>
                            <div className="flex flex-wrap gap-2">
                              {g.items.map((i) => (
                                <ChipToggle
                                  key={i.id}
                                  name="ingredient"
                                  label={i.name}
                                  checked={d.disliked.includes(i.id)}
                                  onChange={() => set('disliked', toggle(d.disliked, i.id))}
                                />
                              ))}
                            </div>
                          </fieldset>
                        ))
                      )}
                    </StepBody>
                  </>
                ) : null}

                {step === 'equipement' ? (
                  <>
                    <StepTitle title="Ton équipement ?" lead="Coche ce que tu as dans ta cuisine." />
                    <StepBody>
                      <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <legend className="sr-only">Ton équipement de cuisine</legend>
                        {EQUIPMENT.map((e) => (
                          <OptionTile
                            key={e.id}
                            type="checkbox"
                            name="equipement"
                            checked={d.equipment.includes(e.id)}
                            onChange={() => set('equipment', toggle(d.equipment, e.id))}
                            visual={<IconBubble name={EQUIPMENT_ICONS[e.id]} />}
                            title={e.label}
                            hint={e.hint ?? undefined}
                          />
                        ))}
                      </fieldset>
                      {errors.step ? <Alert>{errors.step}</Alert> : null}
                      <InfoNote icon="check" title="Que des recettes faisables chez toi">
                        Sans four, pas de gratin. La gazinière vaut des plaques ; avec un air fryer ou un
                        robot cuiseur, d’autres recettes passent aussi.
                      </InfoNote>
                    </StepBody>
                  </>
                ) : null}
              </StepTransition>
              {errors.global ? <Alert>{errors.global}</Alert> : null}
            </form>
          ) : (
            <Result
              mode={mode}
              plan={plan}
              meals={meals}
              people={people}
              storeName={myStore?.name ?? ''}
              fallbackCents={reference}
              cheapestFallback={
                d.store !== 'lidl' ? roundEuro((scaleCents(CHEAPEST_EXAMPLE, factor) * meals) / 14) : null
              }
              withLunch={d.with_lunch}
              days={d.meal_days}
            >
              {mode === 'guest' ? (
                <form
                  id="email-form"
                  onSubmit={submitEmail}
                  noValidate
                  className="anim-rise mt-10"
                  style={animDelay(700)}
                >
                  {referral ? <input type="hidden" name="parrain" value={referral} /> : null}
                  <h2 className="text-[22px] font-black">Où t’envoie-t-on ta semaine&nbsp;?</h2>
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
                    className={inputClasses(
                      Boolean(signupError('email')),
                      'min-h-[56px] px-[18px] text-[17px]',
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
                  <p className="text-ink-muted mt-6 text-[14px] font-bold">
                    Déjà un compte ?{' '}
                    <Link href={ROUTES.connexion} className="text-brand underline">
                      Se connecter
                    </Link>
                  </p>
                </form>
              ) : null}
            </Result>
          )}
        </div>
      </div>

      {/* Bouton principal, toujours à portée de pouce. */}
      {!emailSent && !composing ? (
        <div className="from-surface-50 via-surface-50 pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t to-transparent px-4 pb-5 pt-10 sm:px-6">
          <div className="pointer-events-auto mx-auto max-w-[640px]">
            {step !== 'resultat' ? (
              <Button
                type="submit"
                form="etape"
                disabled={saving}
                className={cx('min-h-[60px] w-full text-[18px]', primaryShadow)}
              >
                {saving
                  ? 'Un instant…'
                  : mode === 'edit'
                    ? 'Enregistrer'
                    : index === LAST_QUESTION
                      ? 'Composer ma semaine'
                      : 'Continuer'}
              </Button>
            ) : mode === 'guest' ? (
              <Button
                type="submit"
                form="email-form"
                disabled={sending}
                className={cx('min-h-[60px] w-full text-[18px]', primaryShadow)}
              >
                Recevoir ma semaine
              </Button>
            ) : (
              <Link
                href="/app"
                className={buttonClasses(
                  'primary',
                  'md',
                  cx('min-h-[60px] w-full text-[18px] no-underline', primaryShadow),
                )}
              >
                Voir mon plan →
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}

const DAY_HEADERS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

/** Dernier écran : la semaine composée (ou son aperçu, sans compte), dans le ticket de caisse. */
function Result(props: {
  mode: OnboardingWizardProps['mode'];
  plan: GeneratedPlan | null;
  meals: number;
  people: number;
  storeName: string;
  fallbackCents: number;
  cheapestFallback: number | null;
  withLunch: boolean;
  days: number[];
  children: ReactNode;
}) {
  const { plan, mode } = props;
  const rows = props.withLunch ? (['dejeuner', 'diner'] as const) : (['diner'] as const);
  return (
    <>
      <p className="anim-rise bg-site-mint text-success mb-3.5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-black">
        <Icon name="check" size={16} strokeWidth={3} />
        {mode === 'guest' ? 'Réponses prêtes' : plan ? 'Plan généré' : 'Foyer enregistré'}
      </p>
      <h1 className={h1Class}>
        <AccentTitle
          animate
          baseDelay={80}
          title={
            mode === 'guest'
              ? 'Ta première semaine t’attend.'
              : plan
                ? `Ta semaine ${plan.weekNumber} est prête.`
                : 'Tout est prêt pour ta première semaine.'
          }
        />
      </h1>
      <p className="anim-rise text-ink-muted mb-7 mt-3 text-[18px]" style={animDelay(180)}>
        {props.meals} repas pour {props.people} personne{props.people > 1 ? 's' : ''}, de saison, chez{' '}
        {props.storeName}.
      </p>
      <div className="anim-ticket">
        <TicketCard
          edge="surface-50"
          className="rounded-t-[26px] p-[18px] pb-[30px] shadow-[0_24px_50px_rgba(42,26,40,0.12)] sm:p-[22px]"
        >
          <div
            className="text-ink-muted grid grid-cols-7 gap-1.5 text-center text-[12px] font-black"
            aria-hidden="true"
          >
            {DAY_HEADERS.map((x) => (
              <span key={x}>{x}</span>
            ))}
            {rows.flatMap((slot, row) =>
              [1, 2, 3, 4, 5, 6, 7].map((day) => {
                const meal = plan?.meals.find((m) => m.day === day && m.slot === slot);
                const planned = props.days.includes(day);
                return (
                  <span
                    key={`${slot}-${day}`}
                    className={cx(
                      'anim-rise grid h-11 place-items-center rounded-[10px]',
                      !planned && 'bg-surface-50',
                      planned && !plan && 'bg-brand-soft',
                    )}
                    style={animDelay(500 + (row * 7 + day) * 40)}
                  >
                    {meal ? <Plat variant={meal.illustration} size={40} decorative /> : null}
                  </span>
                );
              }),
            )}
          </div>
          <div className="border-line mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed pt-[18px]">
            <span>
              <span className="text-ink-muted block text-[13px] font-black tracking-[1px]">
                {plan ? 'TOTAL' : 'TOTAL ESTIMÉ'} CHEZ {props.storeName.toUpperCase()}
              </span>
              <span className="font-display text-[44px] font-extrabold tabular-nums tracking-[-1.4px]">
                {plan
                  ? `${plan.estimate ? '≈ ' : ''}${formatEuro(plan.myCents)}`
                  : `≈ ${formatEuro(props.fallbackCents)}`}
              </span>
            </span>
            {plan ? (
              plan.cheapestName !== props.storeName ? (
                <span className="bg-saving-soft text-saving-ink rounded-[14px] px-4 py-2.5 font-black tabular-nums">
                  Possible dès {formatEuro(plan.cheapestCents)} chez {plan.cheapestName}
                </span>
              ) : null
            ) : props.cheapestFallback !== null ? (
              <span className="bg-saving-soft text-saving-ink rounded-[14px] px-4 py-2.5 font-black tabular-nums">
                Possible dès ≈ {formatEuro(props.cheapestFallback)} chez Lidl
              </span>
            ) : null}
          </div>
        </TicketCard>
      </div>
      {plan?.budgetCents ? (
        <p
          className="anim-rise text-ink-muted mt-4 text-[15px] font-bold tabular-nums"
          style={animDelay(650)}
        >
          {plan.myCents <= plan.budgetCents
            ? `Dans ton budget de ${formatEuro(plan.budgetCents)}.`
            : `Ton budget est de ${formatEuro(plan.budgetCents)} : on a pris les recettes les moins chères compatibles avec tes choix.`}
        </p>
      ) : null}
      {props.children}
    </>
  );
}

/** Écran d'attente « On compose ta semaine » : les critères appliqués, cochés un à un. */
function Composing({ lines }: { lines: string[] }) {
  return (
    <div role="status" aria-live="polite">
      <div className="anim-float mx-auto mb-6 w-fit" aria-hidden="true">
        <Plat variant="curry" size={120} decorative />
      </div>
      <h1 className={cx(h1Class, 'text-center')}>
        <AccentTitle animate baseDelay={40} title="On compose ta semaine…" />
      </h1>
      <ul className="dark:bg-surface-0 mx-auto mt-8 flex max-w-[460px] flex-col gap-3 rounded-[24px] bg-white p-5 shadow-[0_2px_18px_rgba(42,26,40,0.06)]">
        {lines.map((l, i) => (
          <li
            key={l}
            className="anim-rise flex items-center gap-3 text-[16px] font-bold"
            style={animDelay(250 + i * 300)}
          >
            <span className="bg-brand text-brand-on grid h-7 w-7 shrink-0 place-items-center rounded-full">
              <Icon name="check" size={15} strokeWidth={3} />
            </span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
