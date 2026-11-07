import type { ReactNode } from 'react';
import { formatEuro } from '@repas/core';
import { cx } from './cx.ts';

export interface SavingBadgeProps {
  /** Économie en centimes, affichée « − 11,50 € » (ou contenu libre via children). */
  cents?: number;
  children?: ReactNode;
  /** solid = orange + encre ; soft = pêche + texte pêche. */
  tone?: 'solid' | 'soft';
  className?: string;
}

/** Badge d'économie. Orange réservé aux économies, toujours avec un texte foncé (jamais de blanc). */
export function SavingBadge({ cents, children, tone = 'solid', className }: SavingBadgeProps) {
  return (
    <span
      className={cx(
        'rounded-pill inline-flex items-center px-3 py-1 text-[13px] font-black tabular-nums',
        tone === 'solid' ? 'bg-saving text-raw-encre' : 'bg-saving-soft text-saving-ink',
        className,
      )}
    >
      {children ?? (cents !== undefined ? `− ${formatEuro(cents)}` : null)}
    </span>
  );
}
