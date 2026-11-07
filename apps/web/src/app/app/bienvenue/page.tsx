import Link from 'next/link';
import {
  formatEuro,
  householdFactor,
  preferencesFromHousehold,
  priceSpread,
  scaleCents,
  type StoreId,
} from '@repas/core';
import { APP_NAME, cx, LogoMark, Plat } from '@repas/ui';
import { getAccount } from '@/lib/household';
import { EXAMPLE_STORES } from '@/lib/landing-data';
import { EnseigneStep, FoyerStep, PreferencesStep } from './steps';

const STEPS = [
  ['Ton foyer', 'Adultes et enfants'],
  ['Tes préférences', 'Régime, temps de cuisine'],
  ['Ton enseigne', 'Et ton code postal'],
  ['Ta semaine', 'Générée pour toi'],
] as const;

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

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// TODO(lot 5) : remplacer le panier d'exemple par le vrai plan généré (generatePlan) et ses totaux.
const exampleCents = (id: string | null) => EXAMPLE_STORES.find((s) => s.id === id)?.cents;
const MEDIAN_EXAMPLE = [...EXAMPLE_STORES].sort((a, b) => a.cents - b.cents)[2]?.cents ?? 6420;

export default async function BienvenuePage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase, household } = await getAccount('/app/bienvenue');
  const raw = Number((await searchParams).etape ?? 1);
  // On ne peut pas sauter à l'étape 4 sans avoir choisi son enseigne.
  const step = Math.min(
    Math.max(Number.isFinite(raw) ? Math.trunc(raw) : 1, 1),
    household.preferred_store_id ? 4 : 3,
  );

  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, initials')
    .eq('active', true)
    .order('name');
  const order = EXAMPLE_STORES.map((s) => s.id);
  const storeList = (stores ?? [])
    .map((s) => ({ id: s.id as StoreId, name: s.name, initials: s.initials }))
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  const factor = householdFactor(household.adults, household.children);
  const myStore = storeList.find((s) => s.id === household.preferred_store_id);
  const myTotal = scaleCents(exampleCents(household.preferred_store_id) ?? MEDIAN_EXAMPLE, factor);
  const cheapest = scaleCents(priceSpread(EXAMPLE_STORES.map((s) => s.cents)).minCents, factor);

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
          {STEPS.map(([t, d], i) => {
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
                  <span className="text-site-on-brand-faint block text-[14px]">{d}</span>
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
            <div className="bg-brand h-2 rounded-[9px]" style={{ width: `${step * 25}%` }} />
          </div>
          <span className="text-ink-muted text-[14px] font-black tabular-nums">Étape {step} sur 4</span>
        </div>
        <div className="w-full max-w-[680px] flex-1">
          {step === 1 ? (
            <FoyerStep
              adults={household.adults}
              childrenCount={household.children}
              referenceCents={exampleCents(household.preferred_store_id) ?? MEDIAN_EXAMPLE}
            />
          ) : null}
          {step === 2 ? (
            <PreferencesStep
              selected={preferencesFromHousehold(household.diet, household.exclusions)}
              cookingTime={household.cooking_time}
            />
          ) : null}
          {step === 3 ? (
            <EnseigneStep
              stores={storeList}
              storeId={household.preferred_store_id}
              postalCode={household.postal_code ?? ''}
            />
          ) : null}
          {step === 4 ? (
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
                Foyer enregistré
              </p>
              <h1 className="font-display text-[clamp(34px,3.6vw,50px)] font-extrabold leading-[1.05] tracking-[-1.4px]">
                Tout est prêt pour ta première semaine.
              </h1>
              <p className="text-ink-muted mb-7 mt-3 text-[18px]">
                14 repas pour {household.adults + household.children} personnes, de saison, chez{' '}
                {myStore?.name}.
              </p>
              <div className="border-line bg-surface-0 rounded-[26px] border p-[22px]">
                <div
                  className="text-ink-muted grid grid-cols-7 gap-1.5 text-center text-[12px] font-black"
                  aria-hidden="true"
                >
                  {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map((d) => (
                    <span key={d}>{d}</span>
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
                      ≈ {formatEuro(myTotal)}
                    </span>
                  </span>
                  {myStore && myStore.id !== 'lidl' ? (
                    <span className="bg-saving-soft text-saving-ink rounded-[14px] px-4 py-2.5 font-black tabular-nums">
                      Possible dès ≈ {formatEuro(cheapest)} chez Lidl
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="mt-12 flex max-w-[680px] items-center justify-between gap-3">
                <Link
                  href="/app/bienvenue?etape=3"
                  className="text-brand min-h-[52px] content-center px-[22px] text-[16px] font-black no-underline"
                >
                  ← Retour
                </Link>
                <Link
                  href="/app"
                  className="rounded-pill bg-brand text-brand-on inline-flex min-h-14 items-center px-[34px] text-[17px] font-black no-underline"
                >
                  Voir mon plan →
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
