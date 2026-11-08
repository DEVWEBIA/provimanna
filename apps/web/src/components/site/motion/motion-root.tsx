'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';

/**
 * Racine des animations de la landing : si l'utilisateur demande à réduire les animations,
 * Motion supprime les déplacements (seuls de courts fondus restent).
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
