'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

/** Le ticket « s'imprime » : il se déroule de haut en bas en entrant à l'écran. */
export function PrintIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(0 0 100% 0)', y: -24 }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
