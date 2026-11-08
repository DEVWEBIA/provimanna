import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { formatEuro, monthOf, seasonalProduce, weekRangeLabel, weekStartOf, zonedDate } from '@repas/core';
import {
  animDelay,
  EmptyState,
  Eyebrow,
  glassClasses,
  Glow,
  Icon,
  PageHeader,
  Plat,
  Price,
  Reliability,
  Reveal,
  TicketCard,
} from '@repas/ui';
import { DAY_SHORT, PLAT_TINT, SLOT_LABEL } from '@/components/plan/labels';
import { DemoNotice } from '@/components/plan/demo-notice';
import { pricesAtLabel } from '@/components/plan/totals';
import { currentPlan } from '@/lib/plan';
import { href } from '@/lib/site';

export const metadata: Metadata = { title: 'Accueil', robots: { index: false } };

const longDate = (at: Date) => {
  const s = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Paris',
  }).format(at);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Tableau de bord (maquettes AppDashboard / MDashboard), dans le style de la page d'accueil. */
export default async function DashboardPage() {
  const { profile, view, stores, data } = await currentPlan();
  const firstName = (profile.display_name ?? '').split(' ')[0];
  const { hour, weekday } = zonedDate(data.now);
  const greeting = `${hour >= 18 ? 'Bonsoir' : 'Bonjour'}${firstName ? ` ${firstName}` : ''}`;
  const header = <PageHeader eyebrow={longDate(data.now)} title={greeting} />;

  if (!view) {
    return (
      <>
        {header}
        <EmptyState
          title="Aucune recette ne correspond encore à tes préférences."
          description="Assouplis un choix dans ton profil : on compose ta semaine dès qu’il y a assez de recettes."
          illustration={<Plat variant="soupe" size={96} decorative />}
        />
      </>
    );
  }

  const name = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const mine = view.comparison.reference;
  const cheapest = view.comparison.totals[0]!;
  const isCurrent = weekStartOf(data.now) === view.weekStart;
  const todayMeals = view.meals.filter((m) => m.day === (isCurrent ? weekday : 1));
  const featured = [...new Set(view.meals.map((m) => m.recipe.illustration))].slice(0, 3);
  const pricesAt = pricesAtLabel(view);

  return (
    <>
      {header}

      {/* La semaine : ticket aubergine, comme l'encart final de la page d'accueil. */}
      <div className="anim-rise" style={animDelay(240)}>
        <TicketCard
          edge="surface-50"
          tone="brand"
          className="relative isolate flex flex-wrap items-center gap-8 overflow-hidden rounded-t-[32px] px-[clamp(24px,4vw,48px)] pb-[clamp(40px,5vw,56px)] pt-[clamp(28px,4vw,44px)]"
        >
          <Glow className="-left-16 -top-24 h-72 w-72 bg-white/20" />
          <Glow className="bg-raw-peche/30 -bottom-20 right-10 h-64 w-64" />
          <div className="min-w-0 flex-[1_1_380px]">
            <p className="rounded-pill inline-flex items-center gap-2 bg-white/15 px-3 py-1 text-[12px] font-black tracking-[1.2px] backdrop-blur">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="rounded-pill bg-saving absolute inline-flex h-full w-full animate-ping opacity-60 motion-reduce:animate-none" />
                <span className="rounded-pill bg-saving relative inline-flex h-2 w-2" />
              </span>
              {isCurrent ? 'NOUVEAU · ' : ''}SEMAINE {view.weekNumber}
            </p>
            <h2 className="font-display mt-4 text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.05] tracking-[-1.2px]">
              Ton menu de la semaine est prêt.
            </h2>
            <p className="text-site-lilac mt-2.5 text-[16px] font-bold">
              {weekRangeLabel(view.weekStart)} · {view.people} {view.people > 1 ? 'personnes' : 'personne'} ·{' '}
              {view.meals.length} repas · chez {name(view.myStore)}
            </p>
            <div className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-3">
              <p className="font-display text-[56px] font-extrabold tabular-nums leading-none tracking-[-2px]">
                {mine.freshRatio < 1 ? <span aria-hidden="true">≈ </span> : null}
                {formatEuro(mine.cents)}
              </p>
              <div className="pb-1.5">
                {cheapest.storeId !== view.myStore ? (
                  <p className="bg-saving text-raw-encre rounded-pill inline-flex px-3 py-1 text-[14px] font-black tabular-nums">
                    Possible dès {formatEuro(cheapest.cents)} chez {name(cheapest.storeId)} · −
                    {formatEuro(view.comparison.savingCents)}
                  </p>
                ) : (
                  <p className="rounded-pill inline-flex bg-white/15 px-3 py-1 text-[14px] font-black">
                    Ton enseigne est la moins chère cette semaine.
                  </p>
                )}
                <p className="text-site-on-brand-faint mt-1.5 flex items-center gap-2 text-[13px] font-bold">
                  <Reliability level={mine.reliability} className="text-white" />
                  {pricesAt ? `Prix relevés le ${pricesAt}` : null}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href={href('/app/plan')}
                className="rounded-pill text-brand inline-flex min-h-14 items-center gap-3 bg-white px-7 text-[17px] font-black no-underline transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                Ouvrir mon plan <span aria-hidden="true">→</span>
              </Link>
              <Link
                href={href('/app/plan#comparateur')}
                className="text-[15px] font-extrabold text-white underline-offset-4 hover:underline"
              >
                Comparer les enseignes
              </Link>
            </div>
          </div>
          <div className="relative hidden h-[220px] w-[260px] shrink-0 md:block" aria-hidden="true">
            {featured.map((v, i) => (
              <div
                key={v}
                className="absolute"
                style={
                  [
                    { left: 40, top: 10 },
                    { left: 0, top: 120 },
                    { left: 150, top: 110 },
                  ][i] as CSSProperties
                }
              >
                <div
                  className="anim-float drop-shadow-[0_18px_30px_rgba(20,8,18,0.35)]"
                  style={{ animationDelay: `${i * 1.2}s` }}
                >
                  <Plat variant={v} size={[150, 110, 120][i]} decorative />
                </div>
              </div>
            ))}
          </div>
        </TicketCard>
      </div>

      {view.demoPrices ? <DemoNotice /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Reveal as="section" className={`${glassClasses} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[26px] font-extrabold tracking-[-0.6px]">Au menu aujourd’hui</h2>
            <Link href={href('/app/plan')} className="text-brand text-[15px] font-black">
              Toute la semaine
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {todayMeals.map((m) => (
              <Link
                key={m.id}
                href={href(`/app/recettes/${m.recipe.slug}`)}
                className="border-line hover:border-brand text-ink group flex items-center gap-4 rounded-[20px] border bg-white p-3 no-underline transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                <span
                  className={`grid h-[84px] w-[84px] shrink-0 place-items-center rounded-[16px] ${PLAT_TINT[m.recipe.illustration] ?? ''}`}
                >
                  <Plat variant={m.recipe.illustration} size={76} decorative />
                </span>
                <span className="min-w-0">
                  <span className="text-ink-muted block text-[12px] font-black tracking-[1px]">
                    {SLOT_LABEL[m.slot]}
                  </span>
                  <span className="block text-[16px] font-black leading-snug">{m.recipe.title}</span>
                  <Price cents={m.perServingCents} size="sm" suffix="/ part" className="text-ink-muted" />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" delay={120} className={`${glassClasses} relative isolate overflow-hidden p-6`}>
          <Glow className="bg-raw-peche -right-16 -top-16 h-48 w-48 blur-3xl" />
          <Eyebrow>De saison cette semaine</Eyebrow>
          <ul className="mt-4 flex flex-wrap gap-2">
            {seasonalProduce(monthOf(view.weekStart)).map((p) => (
              <li
                key={p}
                className="rounded-pill bg-site-mint text-success px-3.5 py-1.5 text-[14px] font-black"
              >
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-7 gap-1.5 text-center" aria-label="Ta semaine en un coup d’œil">
            {DAY_SHORT.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <span
                  className={`text-[11px] font-black ${isCurrent && weekday === i + 1 ? 'text-brand' : 'text-ink-muted'}`}
                >
                  {d}
                </span>
                {view.meals
                  .filter((m) => m.day === i + 1)
                  .map((m) => (
                    <span
                      key={m.id}
                      title={m.recipe.title}
                      className={`grid h-9 w-9 place-items-center rounded-[10px] ${PLAT_TINT[m.recipe.illustration] ?? ''}`}
                    >
                      <Plat variant={m.recipe.illustration} size={30} decorative />
                    </span>
                  ))}
              </div>
            ))}
          </div>
          <p className="text-ink-muted mt-4 flex items-center gap-1.5 text-[13px] font-bold">
            <Icon name="horloge" size={14} /> Ton prochain menu arrive jeudi soir.
          </p>
        </Reveal>
      </div>
    </>
  );
}
