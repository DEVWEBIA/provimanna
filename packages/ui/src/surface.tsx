import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from './cx.ts';

/** Halo de couleur flou en arrière-plan (purement décoratif). Le parent doit être `relative isolate`. */
export function Glow({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute -z-10 rounded-full',
        // Flou par défaut, sauf si l'appelant en fixe un autre (petits halos).
        /\bblur-/.test(className) ? null : 'blur-[100px]',
        className,
      )}
    />
  );
}

/** Classes de la carte « verre » de la page d'accueil (fond blanc translucide, flou, ombre douce). */
export const glassClasses =
  'border-line rounded-[26px] border bg-white/70 shadow-[0_2px_20px_rgba(42,26,40,0.05)] backdrop-blur dark:bg-surface-0';

export interface GlassCardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
}

/** Carte douce et translucide, à poser sur le fond sable et ses halos. */
export function GlassCard({ children, as: Tag = 'div', className, ...rest }: GlassCardProps) {
  return (
    <Tag className={cx(glassClasses, 'p-6', className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Pastille d'icône carrée et blanche (listes de garanties, étapes). */
export function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'text-brand dark:bg-surface-50 grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white shadow-[0_2px_10px_rgba(42,26,40,0.06)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Délai d'une entrée animée (`anim-rise`, `anim-line`…) : `style={animDelay(120)}`. */
export const animDelay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
