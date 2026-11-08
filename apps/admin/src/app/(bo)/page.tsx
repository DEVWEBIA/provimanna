import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { addDays, isoWeek, weekStartOf, STORE_IDS, STORES_INFO } from '@repas/core';
import { animDelay, cx, glassClasses, PageHeader, Reveal } from '@repas/ui';
import { StoreLogo } from '@/components/store-logo';
import { coverageByStore, recentObservations, STORES } from '@/lib/coverage';
import { requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Vue d’ensemble' };
export const dynamic = 'force-dynamic';

const STORE_NAME: Record<string, string> = Object.fromEntries(
  STORE_IDS.map((id) => [id, STORES_INFO[id].name]),
);
const pct = (n: number) => `${Math.round(n * 100)} %`;
const nb = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

/** Vue d'ensemble (maquette BOVue) : chiffres réels, agrégés côté serveur. */
export default async function BoVuePage() {
  await requireRole(['admin', 'moderateur_prix', 'editeur', 'support']);
  const admin = createAdminClient();
  const now = new Date();
  const week = weekStartOf(now);
  const since7 = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const since30 = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const count = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0;
  const head = { count: 'exact' as const, head: true };

  const weeks = Array.from({ length: 8 }, (_, i) => addDays(week, (i - 7) * 7));
  const [
    active,
    trials,
    premium,
    validated7,
    pendingTickets,
    aberrant,
    unlinked,
    signups,
    plans8,
    ingredients,
    obs,
    tickets7,
  ] = await Promise.all([
    count(admin.from('meal_plans').select('id', head).eq('week_start', week)),
    count(
      admin
        .from('subscriptions')
        .select('household_id', head)
        .eq('tier', 'trial')
        .gt('trial_ends_at', now.toISOString()),
    ),
    count(admin.from('subscriptions').select('household_id', head).eq('tier', 'premium')),
    count(admin.from('meal_plans').select('id', head).gte('validated_at', since7)),
    count(admin.from('receipts').select('id', head).in('status', ['en_attente', 'en_revue'])),
    count(admin.from('prices').select('id', head).eq('flagged_aberrant', true).is('moderated_by', null)),
    admin.from('recipe_ingredients').select('recipe_id').is('product_id', null),
    admin.from('profiles').select('id, household_id').gte('created_at', since30),
    admin.from('meal_plans').select('week_start, household_id, validated_at').gte('week_start', weeks[0]!),
    admin.from('recipe_ingredients').select('product_id').not('product_id', 'is', null),
    recentObservations(admin, now),
    admin.from('receipts').select('store_id').gte('created_at', since7),
  ]);
  const perWeek = weeks.map((w) => ({ w, n: (plans8.data ?? []).filter((p) => p.week_start === w).length }));
  const maxWeek = Math.max(1, ...perWeek.map((x) => x.n));
  const productIds = [...new Set((ingredients.data ?? []).map((i) => i.product_id!))];
  const coverage = coverageByStore(productIds, obs, now).sort((a, b) => b.ratio - a.ratio);
  const unlinkedRecipes = new Set((unlinked.data ?? []).map((i) => i.recipe_id)).size;
  const cohort = signups.data ?? [];
  const cohortHouseholds = new Set(cohort.map((p) => p.household_id));
  const withPlan = new Set(
    (plans8.data ?? []).filter((p) => cohortHouseholds.has(p.household_id)).map((p) => p.household_id),
  ).size;
  const withValidated = new Set(
    (plans8.data ?? [])
      .filter((p) => cohortHouseholds.has(p.household_id) && p.validated_at)
      .map((p) => p.household_id),
  ).size;
  const kpis = [
    ['FOYERS ACTIFS', nb(active), `plan de la semaine ${isoWeek(week)}`],
    ['ESSAIS EN COURS', nb(trials), '14 jours sans carte'],
    [
      'PREMIUM PAYANTS',
      nb(premium),
      trials + premium ? `${pct(premium / (trials + premium))} des essais et abonnés` : '—',
    ],
    ['SEMAINES VALIDÉES', nb(validated7), 'sur 7 jours'],
    ['À TRAITER', nb(pendingTickets + aberrant + (unlinked.data?.length ?? 0)), 'tickets, prix, produits'],
  ];
  const funnel = [
    ['Inscrits (30 j)', cohort.length],
    ['Avec un plan', withPlan],
    ['Semaine validée', withValidated],
  ] as const;
  const todo = [
    {
      n: pendingTickets,
      label: 'Tickets à valider',
      hint: 'file de modération des tickets',
      href: '/tickets',
    },
    { n: aberrant, label: 'Prix aberrants', hint: 'écart de plus de 40 % avec la médiane', href: '/prix' },
    {
      n: unlinked.data?.length ?? 0,
      label: 'Ingrédients à lier',
      hint: `bloquent le coût de ${unlinkedRecipes} recette${unlinkedRecipes > 1 ? 's' : ''}`,
      href: '/recettes',
    },
  ];

  return (
    <>
      <PageHeader eyebrow={`Semaine ${isoWeek(week)} · France`} title="Vue d’ensemble" />
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map(([l, v, d], i) => (
          <div key={l} className={cx(glassClasses, 'anim-rise p-4')} style={animDelay(120 + i * 60)}>
            <dt className="text-ink-muted text-[12px] font-black tracking-[1px]">{l}</dt>
            <dd className="font-display mt-1 text-[32px] font-extrabold tabular-nums">{v}</dd>
            <dd className="text-ink-muted text-[13px] font-bold">{d}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Reveal className={cx(glassClasses, 'p-6')}>
          <h2 className="font-display text-[22px] font-extrabold">
            Foyers avec un plan, semaine par semaine
          </h2>
          <p className="text-ink-muted text-[14px] font-bold">
            S{isoWeek(weeks[0]!)} à S{isoWeek(week)}
          </p>
          <div
            className="mt-6 flex h-[180px] items-end gap-3"
            role="img"
            aria-label={perWeek.map((x) => `S${isoWeek(x.w)} : ${x.n}`).join(', ')}
          >
            {perWeek.map((x, i) => (
              <div key={x.w} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[12px] font-black tabular-nums">{x.n}</span>
                <span
                  className={cx(
                    'w-full rounded-t-[10px]',
                    i === perWeek.length - 1 ? 'bg-brand' : 'bg-site-brand-light',
                  )}
                  style={{ height: `${Math.max(4, (x.n / maxWeek) * 140)}px` }}
                />
                <span className="text-ink-muted text-[11px] font-bold">S{isoWeek(x.w)}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100} className={cx(glassClasses, 'p-6')}>
          <h2 className="font-display text-[22px] font-extrabold">Entonnoir des inscrits</h2>
          <p className="text-ink-muted text-[14px] font-bold">Comptes créés ces 30 derniers jours</p>
          <ol className="mt-5 flex flex-col gap-3">
            {funnel.map(([l, n]) => (
              <li key={l}>
                <p className="flex justify-between text-[14px] font-bold">
                  <span>{l}</span>
                  <span className="tabular-nums">
                    {nb(n)}
                    {cohort.length && l !== funnel[0][0] ? ` · ${pct(n / cohort.length)}` : ''}
                  </span>
                </p>
                <span className="bg-site-track mt-1 block h-2.5 overflow-hidden rounded-[9px]">
                  <span
                    className="bg-brand block h-full rounded-[9px]"
                    style={{ width: `${cohort.length ? (n / cohort.length) * 100 : 0}%` }}
                  />
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Reveal className={cx(glassClasses, 'p-6')}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[22px] font-extrabold">
              Couverture des prix (relevés de moins de 7 jours)
            </h2>
            <Link href="/prix" className="text-brand text-[14px] font-black">
              Gérer les prix
            </Link>
          </div>
          <table className="mt-4 w-full text-[15px] tabular-nums">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                <th scope="col" className="pb-2">
                  ENSEIGNE
                </th>
                <th scope="col" className="pb-2">
                  COUVERTURE
                </th>
                <th scope="col" className="pb-2 text-right">
                  TICKETS 7 J
                </th>
                <th scope="col" className="pb-2 text-right">
                  ÉTAT
                </th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((c) => (
                <tr key={c.store} className="border-line border-t">
                  <th scope="row" className="py-2.5 text-left font-extrabold">
                    <StoreLogo id={c.store} name={STORE_NAME[c.store] ?? c.store} height={22} />
                  </th>
                  <td className="py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="bg-site-track block h-2 w-28 overflow-hidden rounded-[9px]">
                        <span
                          className="bg-success block h-full"
                          style={{ width: pct(c.ratio).replace(' ', '') }}
                        />
                      </span>
                      {pct(c.ratio)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold">
                    {(tickets7.data ?? []).filter((t) => t.store_id === c.store).length}
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className={cx(
                        'rounded-pill px-2.5 py-0.5 text-[12px] font-black',
                        c.ratio >= 0.75
                          ? 'bg-success-soft text-success'
                          : c.ratio >= 0.6
                            ? 'bg-warning-soft text-warning'
                            : 'bg-danger-soft text-danger-ink',
                      )}
                    >
                      {c.ratio >= 0.75 ? 'Bon' : c.ratio >= 0.6 ? 'Moyen' : 'À renforcer'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-ink-muted mt-3 text-[13px]">
            {productIds.length} produits utilisés par les recettes · {STORES.length} enseignes
          </p>
        </Reveal>
        <Reveal delay={100} className={cx(glassClasses, 'overflow-hidden')}>
          <h2 className="font-display flex items-center justify-between px-6 pt-6 text-[22px] font-extrabold">
            À traiter
            <span className="rounded-pill bg-saving text-raw-encre px-2.5 text-[15px] tabular-nums">
              {todo.reduce((s, t) => s + t.n, 0)}
            </span>
          </h2>
          <ul className="mt-4">
            {todo.map((t) => (
              <li key={t.label}>
                <Link
                  href={t.href as Route}
                  className="border-line text-ink hover:bg-site-hover flex min-h-[64px] items-center gap-4 border-t px-6 no-underline"
                >
                  <span className="font-display w-10 text-[24px] font-extrabold tabular-nums">{t.n}</span>
                  <span className="flex-1">
                    <span className="block font-black">{t.label}</span>
                    <span className="text-ink-muted text-[13px] font-bold">{t.hint}</span>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  );
}
