import Link from 'next/link';
import { formatEuro, PREFERENCES, preferencesFromHousehold, STYLES } from '@repas/core';
import { Icon, type IconName } from '@repas/ui';
import type { Household } from '@/lib/household';
import { href } from '@/lib/site';

const COOKING: Record<string, string | null> = {
  moins_30: 'Moins de 30 min en semaine',
  '30_45': '30 à 45 min en semaine',
  peu_importe: null,
};

/**
 * « Ta semaine respecte… » : les réponses du questionnaire appliquées au plan, en pastilles,
 * avec un lien pour les ajuster. Rend le plan explicable (pourquoi ces recettes).
 */
export function PlanCriteria({ household, totalCents }: { household: Household; totalCents: number }) {
  const prefs = preferencesFromHousehold(household.diet, household.exclusions).map(
    (p) => PREFERENCES.find((x) => x.id === p)!.label,
  );
  const styles = household.styles.map((id) => STYLES.find((s) => s.id === id)?.label).filter(Boolean);
  const eq = household.equipment;
  const budget = household.weekly_budget_cents;
  const chips: { icon: IconName; text: string; warn?: boolean }[] = [
    ...prefs.map((p) => ({ icon: 'bouclier' as const, text: p })),
    ...(!eq.includes('four')
      ? [{ icon: 'four' as const, text: eq.includes('air_fryer') ? 'Sans four (air fryer)' : 'Sans four' }]
      : []),
    ...(!eq.includes('plaques') ? [{ icon: 'plaques' as const, text: 'Sans plaques' }] : []),
    ...(COOKING[household.cooking_time]
      ? [{ icon: 'horloge' as const, text: COOKING[household.cooking_time]! }]
      : []),
    ...(household.disliked_product_ids.length
      ? [
          {
            icon: 'interdit' as const,
            text: `${household.disliked_product_ids.length} ingrédient${household.disliked_product_ids.length > 1 ? 's' : ''} évité${household.disliked_product_ids.length > 1 ? 's' : ''}`,
          },
        ]
      : []),
    ...styles.map((s) => ({ icon: 'toque' as const, text: String(s) })),
    ...(budget
      ? [
          totalCents <= budget
            ? { icon: 'pieces' as const, text: `Budget de ${formatEuro(budget)} tenu` }
            : { icon: 'pieces' as const, text: `Budget ${formatEuro(budget)} : au plus près`, warn: true },
        ]
      : []),
  ];
  if (chips.length === 0) return null;
  return (
    <section
      aria-label="Ce que respecte ta semaine"
      className="anim-rise mb-6 flex flex-wrap items-center gap-2"
    >
      <span className="text-ink-muted mr-1 text-[13px] font-black uppercase tracking-[1px]">
        Ta semaine respecte
      </span>
      {chips.map((c) => (
        <span
          key={c.text}
          className={
            c.warn
              ? 'rounded-pill bg-warning-soft text-warning inline-flex min-h-9 items-center gap-1.5 px-3 text-[13px] font-black'
              : 'rounded-pill bg-brand-soft text-brand inline-flex min-h-9 items-center gap-1.5 px-3 text-[13px] font-black'
          }
        >
          <Icon name={c.icon} size={15} />
          {c.text}
        </span>
      ))}
      <Link
        href={href('/app/profil')}
        className="text-brand min-h-tap ml-1 inline-flex items-center text-[13px] font-black underline"
      >
        Ajuster mes réponses
      </Link>
    </section>
  );
}
