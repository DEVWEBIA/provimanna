'use client';

import { useState } from 'react';
import type { PlanFilters } from '@repas/core';
import { Button, cx } from '@repas/ui';
import { regenerateWeek } from '@/app/app/(main)/plan/actions';
import { ActionMessage, usePlanAction } from './use-plan-action';

const FILTERS: { key: keyof PlanFilters; label: string }[] = [
  { key: 'vegetarian', label: 'Végé' },
  { key: 'quick', label: 'Moins de 30 min' },
  { key: 'seasonal', label: 'De saison' },
  { key: 'kids', label: 'Enfants' },
  { key: 'batch', label: 'Batch cooking' },
];

/** Filtres de la maquette AppPlan + « Varier la semaine » (les repas verrouillés restent). */
export function PlanControls({ planId }: { planId: string }) {
  const [filters, setFilters] = useState<PlanFilters>({ seasonal: true });
  const { run, pending, message, clear } = usePlanAction();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Filtres" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = Boolean(filters[f.key]);
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilters({ ...filters, [f.key]: !on })}
              className={cx(
                'rounded-pill min-h-[40px] border-2 px-4 text-[14px] font-extrabold transition-[background-color,border-color,transform] hover:-translate-y-0.5 motion-reduce:transition-none',
                on
                  ? 'border-brand bg-brand text-brand-on'
                  : 'border-line text-ink hover:border-brand bg-white/80 backdrop-blur',
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() => run(() => regenerateWeek(planId, filters))}
      >
        {pending ? 'Je compose…' : 'Varier la semaine'}
      </Button>
      <ActionMessage message={message} onClose={clear} />
    </div>
  );
}
