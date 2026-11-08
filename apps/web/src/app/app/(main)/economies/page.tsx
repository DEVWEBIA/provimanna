import type { Metadata } from 'next';
import Link from 'next/link';
import { formatEuro, recipeServingCents, weekRangeLabel, weekSavingCents, type StoreId } from '@repas/core';
import {
  animDelay,
  cx,
  EmptyState,
  glassClasses,
  Glow,
  PageHeader,
  Plat,
  Reveal,
  TicketCard,
} from '@repas/ui';
import { ShareRecap } from '@/components/engagement/share-recap';
import { longDate } from '@/lib/dates';
import { getEngagement } from '@/lib/engagement';
import { currentPlan, toRecipe } from '@/lib/plan';
import { href } from '@/lib/site';

export const metadata: Metadata = { title: 'Mes économies', robots: { index: false } };

const PREMIUM_YEAR = 3999;
const MONTH = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: 'UTC' });

/** Mes économies (maquettes AppEconomies / MEconomies) : uniquement les semaines validées, jamais d'hypothétique. */
export default async function EconomiesPage() {
  const e = await getEngagement();
  const { stores, data } = await currentPlan();
  const name = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const validated = e.plans.filter((p) => p.validated_at);
  const first = [...validated].sort((a, b) => a.week_start.localeCompare(b.week_start))[0];
  const months = new Map<string, number>();
  for (const p of [...validated].reverse())
    months.set(p.week_start.slice(0, 7), (months.get(p.week_start.slice(0, 7)) ?? 0) + weekSavingCents(p));
  const maxMonth = Math.max(1, ...months.values());
  const thisMonth = e.week.slice(0, 7);
  const store = (e.household.preferred_store_id ?? 'lidl') as StoreId;
  const favourites = [...e.recipeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .flatMap(([id, n]) => {
      const r = data.catalogue.find((x) => x.id === id);
      return r ? [{ r, n, per: recipeServingCents(toRecipe(r), store, data.observations, data.now) }] : [];
    });
  const phrase =
    e.saved >= PREMIUM_YEAR
      ? `De quoi payer un an de Premium, et encore ${formatEuro(e.saved - PREMIUM_YEAR)}.`
      : e.saved > 0
        ? 'Chaque semaine validée compte, même petite.'
        : '';

  if (!validated.length) {
    return (
      <>
        <PageHeader eyebrow="Tes économies" title="Mes économies" />
        <EmptyState
          title="Tes économies apparaîtront ici."
          description="Dès que tu choisis ton enseigne pour une semaine, on compare avec ton enseigne habituelle, à liste égale."
          illustration={<Plat variant="salade" size={96} decorative />}
          actions={
            <Link
              href={href('/app/comparateur')}
              className="text-brand min-h-tap inline-flex items-center font-black"
            >
              Comparer les enseignes de ma semaine →
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <div className="anim-rise">
        <TicketCard
          edge="surface-50"
          tone="brand"
          className="relative isolate overflow-hidden rounded-t-[32px] px-[clamp(24px,4vw,48px)] pb-12 pt-9"
        >
          <Glow className="-left-16 -top-24 h-72 w-72 bg-white/20" />
          <p className="text-site-lilac text-[13px] font-black tracking-[1.2px]">
            DEPUIS TA PREMIÈRE SEMAINE VALIDÉE, LE {first ? longDate(first.week_start).toUpperCase() : ''}
          </p>
          <h1 className="font-display mt-2 text-[clamp(56px,8vw,88px)] font-extrabold tabular-nums leading-none tracking-[-2px]">
            {formatEuro(e.saved)}
          </h1>
          <p className="text-site-on-brand-muted mt-3 max-w-[560px] text-[17px] font-bold">
            d’écart évité par rapport à ton enseigne habituelle, à liste égale. {phrase}
          </p>
          <div className="mt-7">
            <ShareRecap
              text={`J’ai évité ${formatEuro(e.saved)} de courses en ${validated.length} semaine${validated.length > 1 ? 's' : ''}, en comparant 6 enseignes.`}
            />
          </div>
        </TicketCard>
      </div>

      <Reveal className={cx(glassClasses, 'p-6')}>
        <h2 className="font-display text-[22px] font-extrabold">Mois par mois</h2>
        <div
          className="mt-5 flex h-[170px] items-end gap-4"
          role="img"
          aria-label={[...months].map(([m, c]) => `${m} : ${formatEuro(c)}`).join(', ')}
        >
          {[...months].map(([m, c]) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[13px] font-black tabular-nums">{formatEuro(c)}</span>
              <span
                className={cx(
                  'w-full max-w-[90px] rounded-t-[12px]',
                  m === thisMonth ? 'bg-saving' : 'bg-site-brand-light',
                )}
                style={{ height: `${Math.max(6, (c / maxMonth) * 120)}px` }}
              />
              <span className="text-ink-muted text-[12px] font-bold">
                {MONTH.format(new Date(`${m}-01T00:00:00Z`))}
                {m === thisMonth ? ' (en cours)' : ''}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Reveal as="section" className={cx(glassClasses, 'p-6')}>
          <h2 className="font-display text-[22px] font-extrabold">Semaine par semaine</h2>
          <ul className="mt-4">
            {e.plans.slice(0, 12).map((p) => {
              const s = weekSavingCents(p);
              return (
                <li key={p.id} className="border-line flex flex-wrap items-center gap-3 border-t py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block font-black">{weekRangeLabel(p.week_start)}</span>
                    <span className="text-ink-muted text-[14px] font-bold">
                      {p.validated_at ? `chez ${name(p.store_id)}` : 'enseigne pas encore choisie'}
                    </span>
                  </span>
                  {p.validated_at && p.total_cents !== null ? (
                    <span className="font-black tabular-nums">{formatEuro(p.total_cents)}</span>
                  ) : null}
                  {p.validated_at ? (
                    s > 0 ? (
                      <span className="bg-saving text-raw-encre rounded-pill px-2.5 py-0.5 text-[13px] font-black tabular-nums">
                        −{formatEuro(s)}
                      </span>
                    ) : (
                      <span className="text-ink-muted text-[13px] font-bold">ton enseigne</span>
                    )
                  ) : p.week_start === e.week ? (
                    <Link href={href('/app/comparateur')} className="text-brand text-[14px] font-black">
                      Choisir mon enseigne →
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Reveal>
        <div className="flex flex-col gap-6">
          <Reveal as="section" delay={80} className={cx(glassClasses, 'p-6')}>
            <h2 className="font-display text-[22px] font-extrabold">Série et défis</h2>
            <p className="mt-2 text-[15px] font-bold">
              <span className="font-display text-[32px] font-extrabold">{e.streak}</span> semaine
              {e.streak > 1 ? 's' : ''} d’affilée
              {e.bestStreak > e.streak ? (
                <span className="text-ink-muted"> · record : {e.bestStreak}</span>
              ) : null}
            </p>
            <ul className="mt-4 flex flex-col gap-4">
              {e.challenges.map((c, i) => (
                <li key={c.id} className="anim-rise" style={animDelay(i * 60)}>
                  <p className="flex justify-between gap-3 text-[15px] font-black">
                    <span>{c.title}</span>
                    <span className="tabular-nums">
                      {c.progress.done} / {c.progress.target}
                    </span>
                  </p>
                  <p className="text-ink-muted text-[13px] font-bold">
                    {c.progress.completed ? 'Réussi, bravo !' : c.description}
                  </p>
                  <span className="bg-site-track mt-1.5 block h-2.5 overflow-hidden rounded-[9px]">
                    <span
                      className={cx(
                        'block h-full rounded-[9px]',
                        c.progress.completed ? 'bg-success' : 'bg-brand',
                      )}
                      style={{ width: `${(c.progress.done / c.progress.target) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          {favourites.length ? (
            <Reveal as="section" delay={140} className={cx(glassClasses, 'p-6')}>
              <h2 className="font-display text-[22px] font-extrabold">Tes plats les plus cuisinés</h2>
              <ul className="mt-3">
                {favourites.map(({ r, n, per }) => (
                  <li key={r.id}>
                    <Link
                      href={href(`/app/recettes/${r.slug}`)}
                      className="border-line text-ink flex items-center gap-3 border-t py-2.5 no-underline"
                    >
                      <Plat variant={r.illustration} size={44} decorative />
                      <span className="min-w-0 flex-1">
                        <span className="block font-black">{r.title}</span>
                        <span className="text-ink-muted text-[13px] font-bold tabular-nums">
                          Cuisiné {n} fois{per !== null ? ` · ${formatEuro(per)} / part` : ''}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </div>
      <p className="text-ink-muted text-[13px]">
        Une économie se compte uniquement sur une semaine validée : coût dans ton enseigne habituelle moins
        coût dans l’enseigne choisie.
      </p>
    </>
  );
}
