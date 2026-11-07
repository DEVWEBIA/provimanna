import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from './cx.ts';

/** Couleur du fond sur lequel la carte est posée : les dents du bord prennent cette couleur. */
export type TicketEdge = 'surface-50' | 'surface-0' | 'brand';

export interface TicketCardProps {
  children: ReactNode;
  edge?: TicketEdge;
  as?: ElementType;
  className?: string;
}

/**
 * Signature de marque : carte « ticket de caisse » à bord inférieur dentelé
 * (radial-gradient, cf. classe .edge de design/maquettes/Main.dc.html).
 */
export function TicketCard({ children, edge = 'surface-50', as: Tag = 'div', className }: TicketCardProps) {
  const edgeStyle: CSSProperties = {
    background: `radial-gradient(circle, var(--${edge}) 7px, transparent 7.5px) repeat-x`,
    backgroundSize: '22px 16px',
  };
  return (
    <Tag
      className={cx(
        'bg-surface-0 text-ink relative rounded-t-[20px] px-[18px] pb-[26px] pt-[18px]',
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="absolute -bottom-2 left-0 right-0 h-4" style={edgeStyle} />
    </Tag>
  );
}
