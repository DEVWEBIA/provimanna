import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from './cx.ts';

/** Couleur du fond sur lequel la carte est posée : les dents du bord prennent cette couleur. */
/**
 * Couleur du fond sur lequel la carte est posée (les dents prennent cette couleur),
 * ou « cutout » : dents réellement découpées (masque CSS), pour une carte posée sur une photo.
 */
export type TicketEdge = 'surface-50' | 'surface-0' | 'brand' | 'cutout';

export interface TicketCardProps {
  children: ReactNode;
  edge?: TicketEdge;
  /** Couleur de la carte : blanche (défaut) ou aubergine (encart mis en avant). */
  tone?: 'paper' | 'brand';
  as?: ElementType;
  className?: string;
}

/**
 * Signature de marque : carte « ticket de caisse » à bord inférieur dentelé
 * (radial-gradient, cf. classe .edge de design/maquettes/Main.dc.html).
 */
export function TicketCard({
  children,
  edge = 'surface-50',
  tone = 'paper',
  as: Tag = 'div',
  className,
}: TicketCardProps) {
  const cutout = edge === 'cutout';
  const edgeStyle: CSSProperties = {
    background: `radial-gradient(circle, var(--${edge}) 7px, transparent 7.5px) repeat-x`,
    backgroundSize: '22px 16px',
  };
  // Découpe : plein partout, sauf une bande de 8 px en bas percée de demi-cercles de 7 px tous les 22 px.
  const mask = cutout
    ? 'linear-gradient(#000 0 0) top / 100% calc(100% - 8px) no-repeat, radial-gradient(circle at 50% 100%, transparent 7px, #000 7.5px) bottom / 22px 8px repeat-x'
    : undefined;
  return (
    <Tag
      style={mask ? { mask, WebkitMask: mask } : undefined}
      className={cx(
        tone === 'brand' ? 'bg-brand text-brand-on' : 'bg-surface-0 text-ink',
        'relative rounded-t-[20px] px-[18px] pb-[26px] pt-[18px]',
        className,
      )}
    >
      {children}
      {cutout ? null : (
        <span aria-hidden="true" className="absolute -bottom-2 left-0 right-0 h-4" style={edgeStyle} />
      )}
    </Tag>
  );
}
