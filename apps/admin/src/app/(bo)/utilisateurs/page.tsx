import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import {
  CUISINES,
  daysSummary,
  EQUIPMENT,
  formatEuro,
  PREFERENCES,
  preferencesFromHousehold,
  savingsCents,
  STORE_IDS,
  STORES_INFO,
  STYLES,
  trialDaysLeft,
  type Diet,
} from '@repas/core';
import { cx, glassClasses, inputClasses, PageHeader } from '@repas/ui';
import { Badge, Kpi } from '@/components/bo-ui';
import { canAccess, requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';
import { SupportActions } from './support-actions';
import { StoreLogo } from '@/components/store-logo';

export const metadata: Metadata = { title: 'Utilisateurs' };
export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
const STORE: Record<string, string> = Object.fromEntries(STORE_IDS.map((id) => [id, STORES_INFO[id].name]));
const FILTERS = [
  ['tous', 'Tous'],
  ['essai', 'En essai'],
  ['premium', 'Premium'],
  ['gratuit', 'Gratuit'],
] as const;

/**
 * Utilisateurs (maquette BOUtilisateurs) : rôle support, lecture. Les données de plusieurs foyers sont
 * lues avec la clé serveur après contrôle du rôle ; seules les colonnes affichées sont chargées.
 */
export default async function UtilisateursPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { role } = await requireRole(['support']);
  const admin = createAdminClient();
  const now = new Date();
  const [users, { data: profiles }, { data: plans }, { data: receipts }, { data: streaks }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin
        .from('profiles')
        .select(
          'id, display_name, created_at, household_id, households(adults, children, preferred_store_id, postal_code, diet, exclusions, cooking_time, meal_days, with_lunch, weekly_budget_cents, styles, equipment, cuisines, disliked_product_ids, subscriptions(tier, trial_ends_at, bonus_days, interval, current_period_end))',
        ),
      admin
        .from('meal_plans')
        .select('household_id, week_start, store_id, total_cents, reference_cents, validated_at')
        .order('week_start', { ascending: false }),
      admin.from('receipts').select('user_id, status, created_at'),
      admin.from('streaks').select('household_id, current_weeks'),
    ]);
  const rows = (profiles ?? []).map((p) => {
    const sub = p.households?.subscriptions ?? null;
    const status: 'premium' | 'essai' | 'gratuit' =
      sub?.tier === 'premium'
        ? 'premium'
        : sub?.tier === 'trial' &&
            sub.trial_ends_at &&
            trialDaysLeft(sub.trial_ends_at, sub.bonus_days, now) > 0
          ? 'essai'
          : 'gratuit';
    const hPlans = (plans ?? []).filter((x) => x.household_id === p.household_id);
    return {
      ...p,
      email: users.data.users.find((u) => u.id === p.id)?.email ?? '—',
      status,
      sub,
      plans: hPlans,
      tickets: (receipts ?? []).filter((r) => r.user_id === p.id).length,
      streak: (streaks ?? []).find((s) => s.household_id === p.household_id)?.current_weeks ?? 0,
    };
  });
  const q = one(sp.q).toLowerCase();
  const filter = one(sp.filtre) || 'tous';
  const list = rows
    .filter((r) => !q || `${r.display_name ?? ''} ${r.email}`.toLowerCase().includes(q))
    .filter((r) => filter === 'tous' || r.status === filter);
  const sel = rows.find((r) => r.id === one(sp.id)) ?? list[0];
  const href = (patch: Record<string, string>) => {
    const u = new URLSearchParams({
      ...(q ? { q } : {}),
      ...(filter !== 'tous' ? { filtre: filter } : {}),
      ...patch,
    });
    for (const [k, v] of [...u]) if (!v) u.delete(k);
    return `/utilisateurs${u.toString() ? `?${u}` : ''}` as Route;
  };
  const statusBadge = (s: string) =>
    s === 'premium' ? (
      <Badge tone="brand">Premium</Badge>
    ) : s === 'essai' ? (
      <Badge tone="ok">Essai</Badge>
    ) : (
      <Badge tone="neutral">Gratuit</Badge>
    );

  return (
    <>
      <PageHeader eyebrow="Support" title="Utilisateurs" />
      <dl className="grid grid-cols-3 gap-3">
        <Kpi label="COMPTES" value={rows.length} index={0} />
        <Kpi label="EN ESSAI" value={rows.filter((r) => r.status === 'essai').length} index={1} />
        <Kpi label="PREMIUM" value={rows.filter((r) => r.status === 'premium').length} index={2} />
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <form action="/utilisateurs" className="flex-1">
          <label htmlFor="q" className="sr-only">
            Rechercher un utilisateur
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Nom ou email"
            className={inputClasses(false, 'max-w-[420px]')}
          />
        </form>
        <nav aria-label="Filtres" className="flex gap-2">
          {FILTERS.map(([id, label]) => (
            <Link
              key={id}
              href={href({ filtre: id === 'tous' ? '' : id, id: '' })}
              aria-current={filter === id ? 'page' : undefined}
              className={cx(
                'rounded-pill min-h-[40px] border-2 px-3.5 py-1.5 text-[14px] font-extrabold no-underline',
                filter === id ? 'border-brand bg-brand text-brand-on' : 'border-line text-ink bg-white',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className={cx(glassClasses, 'overflow-x-auto p-2')}>
          <table className="w-full min-w-[720px] text-[14px]">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                {['UTILISATEUR', 'FOYER', 'ENSEIGNE', 'STATUT', 'DERNIER PLAN', 'TICKETS'].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr
                  key={r.id}
                  className={cx(
                    'border-line border-t',
                    sel?.id === r.id ? 'bg-brand-soft' : 'hover:bg-site-hover',
                  )}
                >
                  <td className="px-3 py-2.5">
                    <Link href={href({ id: r.id })} className="text-ink font-extrabold">
                      {r.display_name ?? '—'}
                    </Link>
                    <span className="text-ink-muted block text-[12px]">{r.email}</span>
                  </td>
                  <td className="px-3 py-2.5 font-bold">
                    {r.households ? `${r.households.adults} ad. · ${r.households.children} enf.` : '—'}
                  </td>
                  <td className="px-3 py-2.5 font-bold">
                    {r.households?.preferred_store_id ? (
                      <StoreLogo
                        id={r.households.preferred_store_id}
                        name={STORE[r.households.preferred_store_id] ?? r.households.preferred_store_id}
                        height={20}
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-2.5">{statusBadge(r.status)}</td>
                  <td className="text-ink-muted px-3 py-2.5">
                    {r.plans[0] ? new Date(r.plans[0].week_start).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-3 py-2.5 font-bold tabular-nums">{r.tickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sel ? (
          <aside className={cx(glassClasses, 'flex flex-col gap-4 p-5 xl:sticky xl:top-8')}>
            <div>
              <h2 className="font-display text-[22px] font-extrabold">{sel.display_name ?? sel.email}</h2>
              <p className="text-ink-muted text-[13px] font-bold">
                {sel.email} · inscrit le {new Date(sel.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[
                ['SÉRIE', `${sel.streak} sem.`],
                ['PLANS', sel.plans.length],
                ['ÉCONOMIES', formatEuro(savingsCents(sel.plans))],
              ].map(([l, v]) => (
                <div key={l} className="rounded-[12px] bg-white p-2">
                  <dt className="text-ink-muted text-[11px] font-black tracking-[1px]">{l}</dt>
                  <dd className="font-display text-[18px] font-extrabold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-[14px] bg-white p-3 text-[14px]">
              <p className="text-ink-muted mb-1 text-[12px] font-black tracking-[1px]">
                ABONNEMENT · LECTURE SEULE
              </p>
              <p>
                Statut :{' '}
                <strong>
                  {sel.status === 'premium' ? 'Premium' : sel.status === 'essai' ? 'Essai' : 'Gratuit'}
                </strong>
              </p>
              {sel.sub?.tier === 'trial' && sel.sub.trial_ends_at ? (
                <p>
                  Fin de l’essai : {new Date(sel.sub.trial_ends_at).toLocaleDateString('fr-FR')}
                  {sel.sub.bonus_days ? ` + ${sel.sub.bonus_days} jours bonus` : ''}
                </p>
              ) : null}
              {sel.sub?.interval ? (
                <p>Formule : {sel.sub.interval === 'year' ? 'annuelle' : 'mensuelle'}</p>
              ) : null}
            </div>
            {sel.households ? <HouseholdAnswers h={sel.households} /> : null}
            {sel.household_id ? (
              <div>
                <p className="text-ink-muted mb-2 text-[12px] font-black tracking-[1px]">ACTIONS SUPPORT</p>
                <SupportActions
                  householdId={sel.household_id}
                  email={sel.email}
                  userId={sel.id}
                  canGift={canAccess(role, ['admin'])}
                />
              </div>
            ) : null}
            <div>
              <p className="text-ink-muted mb-1 text-[12px] font-black tracking-[1px]">DERNIÈRES SEMAINES</p>
              <ul className="text-[13px]">
                {sel.plans.slice(0, 5).map((pl) => (
                  <li key={pl.week_start} className="border-line flex justify-between border-t py-1.5">
                    <span>Semaine du {new Date(pl.week_start).toLocaleDateString('fr-FR')}</span>
                    <span className="flex items-center gap-1.5 font-bold">
                      {pl.validated_at ? (
                        <>
                          validée ·{' '}
                          <StoreLogo id={pl.store_id} name={STORE[pl.store_id] ?? pl.store_id} height={16} />
                        </>
                      ) : (
                        'non validée'
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </>
  );
}

const COOKING: Record<string, string> = {
  moins_30: 'moins de 30 min',
  '30_45': '30 à 45 min',
  peu_importe: 'temps libre',
};

/** Réponses du questionnaire du foyer (lecture seule, pour répondre au support). */
function HouseholdAnswers({
  h,
}: {
  h: {
    adults: number;
    children: number;
    diet: Diet;
    exclusions: string[];
    cooking_time: string;
    meal_days: number[];
    with_lunch: boolean;
    weekly_budget_cents: number | null;
    styles: string[];
    cuisines: string[];
    equipment: string[];
    disliked_product_ids: string[];
  };
}) {
  const label = <T extends { id: string; label: string }>(list: readonly T[], ids: readonly string[]) =>
    ids
      .map((id) => list.find((x) => x.id === id)?.label)
      .filter(Boolean)
      .join(', ');
  const prefs = label(PREFERENCES, preferencesFromHousehold(h.diet, h.exclusions));
  const rows: [string, string][] = [
    [
      'Repas',
      `${h.meal_days.length * (h.with_lunch ? 2 : 1)} · ${h.with_lunch ? 'midi et soir' : 'soir'} · ${daysSummary(h.meal_days).toLowerCase()}`,
    ],
    ['Budget', h.weekly_budget_cents ? `${formatEuro(h.weekly_budget_cents)} / semaine` : 'aucun'],
    ['Régime', prefs || 'aucun'],
    ['Ambiance', `${label(STYLES, h.styles) || 'aucune'} · ${COOKING[h.cooking_time] ?? ''}`],
    ['Cuisines', label(CUISINES, h.cuisines) || 'toutes'],
    ['Équipement', label(EQUIPMENT, h.equipment)],
    ['Évités', h.disliked_product_ids.length ? `${h.disliked_product_ids.length} ingrédient(s)` : 'aucun'],
  ];
  return (
    <div className="rounded-[14px] bg-white p-3 text-[13px]">
      <p className="text-ink-muted mb-1 text-[12px] font-black tracking-[1px]">RÉPONSES DU FOYER</p>
      <dl className="grid grid-cols-[88px_1fr] gap-x-2 gap-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-muted font-bold">{k}</dt>
            <dd className="font-bold">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
