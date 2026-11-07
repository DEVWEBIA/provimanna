import { formatEuro } from '@repas/core';
import { cx } from './cx.ts';

export type PriceSize = 'xl' | 'lg' | 'md' | 'sm';

const SIZES: Record<PriceSize, string> = {
  xl: 'font-display text-[60px] leading-none font-extrabold tracking-[-2px]',
  lg: 'font-display text-[34px] leading-none font-extrabold',
  md: 'text-[18px] font-black',
  sm: 'text-[14px] font-extrabold',
};

export interface PriceProps {
  /** Montant en centimes ; null = prix inconnu. */
  cents: number | null;
  /** Estimation (relevés de plus de 7 jours) : préfixée par « ≈ ». */
  estimate?: boolean;
  size?: PriceSize;
  /** Suffixe, ex. « / part ». */
  suffix?: string;
  className?: string;
}

/** Montant en euros, chiffres tabulaires, formaté par @repas/core. */
export function Price({ cents, estimate = false, size = 'md', suffix, className }: PriceProps) {
  if (cents === null) {
    return <span className={cx('text-ink-muted text-[14px] font-extrabold', className)}>prix inconnu</span>;
  }
  return (
    <span className={cx('whitespace-nowrap tabular-nums', SIZES[size], className)}>
      {estimate ? (
        <>
          <span aria-hidden="true">≈ </span>
          <span className="sr-only">environ </span>
        </>
      ) : null}
      {formatEuro(cents)}
      {suffix ? ` ${suffix}` : null}
    </span>
  );
}
