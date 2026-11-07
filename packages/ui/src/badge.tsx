import type { ReactNode } from 'react';
import { cx } from './cx.ts';

export type BadgeVariant = 'cheapest' | 'mine' | 'premium' | 'success' | 'draft' | 'rejected';

const VARIANTS: Record<BadgeVariant, string> = {
  cheapest: 'bg-saving-soft text-saving-ink text-[13px] px-3', // « Le moins cher »
  mine: 'bg-brand-soft text-brand-soft-ink text-[13px] px-3', // « Ton enseigne »
  premium: 'bg-brand text-brand-on text-[12px] px-2.5 tracking-wide',
  success: 'bg-success-soft text-success text-[12px] px-2.5', // « Validé »
  draft: 'bg-warning-soft text-warning text-[12px] px-2.5', // « Brouillon »
  rejected: 'bg-danger-soft text-danger text-[12px] px-2.5', // « Rejeté »
};

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx('rounded-pill inline-flex items-center py-1 font-black', VARIANTS[variant], className)}
    >
      {children}
    </span>
  );
}
