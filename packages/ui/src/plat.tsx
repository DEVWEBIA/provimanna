import { PLAT_LABELS, PLAT_SHAPES, type PlatVariant } from './plat-shapes.tsx';

export { PLAT_LABELS, PLAT_VARIANTS, type PlatVariant } from './plat-shapes.tsx';

export interface PlatProps {
  variant: PlatVariant;
  size?: number;
  /** Libellé accessible ; par défaut le nom du plat. */
  label?: string;
  /** Illustration purement décorative (le nom du plat est déjà écrit à côté). */
  decorative?: boolean;
  className?: string;
}

/** Illustration de plat, vue de dessus sur assiette blanche (12 variantes). */
export function Plat({ variant, size = 96, label, decorative = false, className }: PlatProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': label ?? PLAT_LABELS[variant] })}
    >
      {PLAT_SHAPES[variant]}
    </svg>
  );
}
