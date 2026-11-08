'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

export interface RevealProps {
  children: ReactNode;
  /** Décalage en ms (cartes qui apparaissent l'une après l'autre). */
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}

/**
 * Fait apparaître son contenu au moment où il entre à l'écran (une seule fois), avec un effet ressort (Motion).
 * Les animations réduites sont respectées par <MotionRoot>, posé dans le gabarit racine de chaque app.
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay: delay / 1000 }}
    >
      {children}
    </Comp>
  );
}
