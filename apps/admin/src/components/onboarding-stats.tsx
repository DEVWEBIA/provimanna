import { EQUIPMENT, formatEuro, MOTIVATIONS, STYLES } from '@repas/core';
import { cx, glassClasses, Reveal } from '@repas/ui';
import { createAdminClient } from '@/lib/supabase/admin';

const pct = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0);

/** Une liste de réponses, en barres horizontales (part des foyers qui ont répondu). */
function Bars({
  title,
  rows,
  total,
}: {
  title: string;
  rows: { label: string; n: number }[];
  total: number;
}) {
  const sorted = [...rows].sort((a, b) => b.n - a.n);
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-black uppercase tracking-[1px]">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {sorted.map((r) => (
          <li
            key={r.label}
            className="grid grid-cols-[minmax(0,1fr)_72px_40px] items-center gap-3 text-[14px]"
          >
            <span className="font-bold leading-tight">{r.label}</span>
            <span className="bg-site-track h-2.5 overflow-hidden rounded-full" aria-hidden="true">
              <span className="bg-brand block h-full rounded-full" style={{ width: `${pct(r.n, total)}%` }} />
            </span>
            <span className="text-right font-black tabular-nums">{pct(r.n, total)} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : Math.round((s[m - 1]! + s[m]!) / 2);
};

/**
 * Réponses au questionnaire (vue d'ensemble du BO) : motivations, repas, budget, styles, équipement.
 * Agrégées côté serveur, sur les foyers qui ont terminé le questionnaire (enseigne renseignée).
 */
export async function OnboardingStats() {
  const { data } = await createAdminClient()
    .from('households')
    .select('motivations, with_lunch, meal_days, weekly_budget_cents, adults, children, styles, equipment')
    .not('preferred_store_id', 'is', null);
  const rows = data ?? [];
  const total = rows.length;
  const has = (pick: (r: (typeof rows)[number]) => boolean) => rows.filter(pick).length;
  const budgets = rows
    .filter((r) => r.weekly_budget_cents)
    .map((r) => Math.round(r.weekly_budget_cents! / Math.max(1, r.adults + r.children)));
  const perPerson = median(budgets);
  const avgMeals = total
    ? rows.reduce((s, r) => s + r.meal_days.length * (r.with_lunch ? 2 : 1), 0) / total
    : 0;

  return (
    <Reveal as="section" className={cx(glassClasses, 'mt-6 p-6')}>
      <h2 id="questionnaire-t" className="font-display text-[22px] font-extrabold">
        Réponses au questionnaire
      </h2>
      <p className="text-ink-muted mt-1 text-[13px] font-bold">
        {total} foyer{total > 1 ? 's' : ''} ayant terminé le questionnaire · part des foyers par réponse
      </p>
      {total === 0 ? (
        <p className="text-ink-muted mt-4 font-bold">Pas encore de réponse.</p>
      ) : (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Repas par semaine', avgMeals.toLocaleString('fr-FR', { maximumFractionDigits: 1 })],
              [
                'Midi + soir',
                `${pct(
                  has((r) => r.with_lunch),
                  total,
                )} %`,
              ],
              ['Avec un budget', `${pct(budgets.length, total)} %`],
              ['Budget médian / personne', perPerson ? formatEuro(perPerson) : '—'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[14px] bg-white/70 p-3">
                <dt className="text-ink-muted text-[12px] font-black uppercase tracking-[1px]">{k}</dt>
                <dd className="font-display mt-0.5 text-[24px] font-extrabold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Bars
              title="Ce qui les amène"
              total={total}
              rows={MOTIVATIONS.map((m) => ({ label: m.label, n: has((r) => r.motivations.includes(m.id)) }))}
            />
            <Bars
              title="Ambiance"
              total={total}
              rows={STYLES.map((s) => ({ label: s.label, n: has((r) => r.styles.includes(s.id)) }))}
            />
            <Bars
              title="Équipement"
              total={total}
              rows={EQUIPMENT.map((e) => ({ label: e.label, n: has((r) => r.equipment.includes(e.id)) }))}
            />
          </div>
        </>
      )}
    </Reveal>
  );
}
