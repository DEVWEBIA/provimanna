// Économies (docs/05 §1) : reference_cents − total_cents, plancher à 0, uniquement pour les plans validés.

export interface PlanTotals {
  total_cents: number | null;
  reference_cents: number | null;
  validated_at: string | null;
}

/** Économie d'une semaine ; 0 si le plan n'est pas validé ou si l'enseigne choisie est plus chère. */
export function weekSavingCents(p: PlanTotals): number {
  if (!p.validated_at || p.total_cents === null || p.reference_cents === null) return 0;
  return Math.max(0, p.reference_cents - p.total_cents);
}

/** Total des économies réalisées (jamais d'économie hypothétique). */
export function savingsCents(plans: readonly PlanTotals[]): number {
  return plans.reduce((s, p) => s + weekSavingCents(p), 0);
}
