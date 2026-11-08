'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

type Tag = 'div' | 'li' | 'section';

/** Apparition au défilement avec un effet ressort (remplace <Reveal> sur la landing). */
export function FadeUp({
  children,
  delay = 0,
  className,
  as = 'div',
  y = 48,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
  y?: number;
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ type: 'spring', stiffness: 70, damping: 18, delay }}
    >
      {children}
    </Comp>
  );
}
