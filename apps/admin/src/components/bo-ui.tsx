import type { ReactNode } from 'react';
import { animDelay, cx, glassClasses } from '@repas/ui';

/** Indicateur chiffré (cartes du haut des écrans BO). */
export function Kpi({
  label,
  value,
  hint,
  index = 0,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  index?: number;
}) {
  return (
    <div className={cx(glassClasses, 'anim-rise p-4')} style={animDelay(100 + index * 60)}>
      <dt className="text-ink-muted text-[12px] font-black tracking-[1px]">{label}</dt>
      <dd className="font-display mt-1 text-[30px] font-extrabold tabular-nums">{value}</dd>
      {hint ? <dd className="text-ink-muted text-[13px] font-bold">{hint}</dd> : null}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
  action,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cx(glassClasses, 'p-6', className)}>
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-[22px] font-extrabold">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const TONES = {
  ok: 'bg-success-soft text-success',
  warn: 'bg-warning-soft text-warning',
  bad: 'bg-danger-soft text-danger-ink',
  neutral: 'bg-site-track text-ink-muted',
  brand: 'bg-brand-soft text-brand',
} as const;

export function Badge({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <span className={cx('rounded-pill whitespace-nowrap px-2.5 py-0.5 text-[12px] font-black', TONES[tone])}>
      {children}
    </span>
  );
}

/** Mention « arrive au lot N » pour une fonction prévue mais pas encore branchée. */
export const Later = ({ children }: { children: ReactNode }) => (
  <p className="text-ink-muted text-[13px] font-bold italic">{children}</p>
);
