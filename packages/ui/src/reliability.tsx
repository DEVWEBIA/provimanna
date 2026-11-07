import type { Reliability as ReliabilityLevel } from '@repas/core';
import { cx } from './cx.ts';

const LEVELS: Record<ReliabilityLevel, { dots: string; label: string; color: string }> = {
  high: { dots: '●●●', label: 'élevée', color: 'text-success dark:text-success-bright' },
  medium: { dots: '●●○', label: 'moyenne', color: 'text-warning dark:text-warning-soft' },
  low: { dots: '●○○', label: 'estimation', color: 'text-saving-ink' },
};

export interface ReliabilityProps {
  level: ReliabilityLevel;
  /** Affiche le libellé à côté des points (sinon seulement pour les lecteurs d'écran). */
  showLabel?: boolean;
  className?: string;
}

/** Indice de fiabilité d'un total : ●●● / ●●○ / ●○○. */
export function Reliability({ level, showLabel = false, className }: ReliabilityProps) {
  const l = LEVELS[level];
  return (
    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap font-black', className)}>
      <span className={l.color} aria-hidden="true">
        {l.dots}
      </span>
      {showLabel ? <span>{l.label}</span> : null}
      <span className="sr-only">{`Fiabilité ${l.label}`}</span>
    </span>
  );
}
