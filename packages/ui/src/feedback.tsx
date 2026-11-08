import type { ReactNode } from 'react';
import { cx } from './cx.ts';

export interface ToastProps {
  children: ReactNode;
  /** Ex. « Annuler ». */
  action?: ReactNode;
  className?: string;
}

/** Retour éphémère, positif et utile (role="status"). */
export function Toast({ children, action, className }: ToastProps) {
  return (
    <div
      role="status"
      className={cx('bg-raw-encre flex items-center gap-3 rounded-[16px] px-4 py-3.5 text-white', className)}
    >
      <span aria-hidden="true" className="text-success-bright font-black">
        ✓
      </span>
      <span className="flex-1 font-bold">{children}</span>
      {action}
    </div>
  );
}

/** Bouton d'action d'un toast (texte pêche sur fond encre). */
export function ToastAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-tap text-raw-peche bg-transparent px-1 text-[14px] font-black"
    >
      {children}
    </button>
  );
}

export interface NoticeProps {
  /** warning = prix incomplets / estimation ; error = échec. */
  tone: 'warning' | 'error';
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Encart d'information, jamais culpabilisant. */
export function Notice({ tone, title, children, className }: NoticeProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cx(
        'rounded-[16px] px-4 py-3.5 font-bold',
        tone === 'warning'
          ? 'bg-saving-soft text-notice-ink dark:text-saving-ink'
          : 'bg-danger-soft text-danger-ink',
        className,
      )}
    >
      <strong>{title}</strong> {children}
    </div>
  );
}

/** Bloc de chargement (squelette animé, figé si prefers-reduced-motion). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'animate-shimmer block rounded-[10px] bg-[length:600px_100%] motion-reduce:animate-none',
        'bg-[linear-gradient(90deg,theme(colors.skeleton.DEFAULT)_0,theme(colors.skeleton.shine)_50%,theme(colors.skeleton.DEFAULT)_100%)]',
        'dark:bg-[linear-gradient(90deg,var(--surface-0)_0,var(--line)_50%,var(--surface-0)_100%)]',
        className,
      )}
    />
  );
}

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  illustration?: ReactNode;
  /** Actions (un seul bouton plein). */
  actions?: ReactNode;
  overline?: ReactNode;
  className?: string;
}

/** État vide : ce qui manque et comment avancer. */
export function EmptyState({
  title,
  description,
  illustration,
  actions,
  overline,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cx(
        'border-line dark:bg-surface-0 flex flex-col items-center gap-3 rounded-[26px] border bg-white/70 px-6 py-12 text-center shadow-[0_2px_20px_rgba(42,26,40,0.05)] backdrop-blur',
        className,
      )}
    >
      {illustration}
      {overline ? <p className="text-overline text-ink-muted uppercase">{overline}</p> : null}
      <h2 className="font-display text-title text-ink">{title}</h2>
      {description ? <p className="text-body text-ink-muted max-w-md">{description}</p> : null}
      {actions ? <div className="mt-2 flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </section>
  );
}
