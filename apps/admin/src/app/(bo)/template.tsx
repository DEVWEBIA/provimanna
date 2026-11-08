import type { ReactNode } from 'react';
import { PageTransition } from '@repas/ui';

/** Rejoué à chaque navigation : entrée douce de la page (Motion). */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition className="flex flex-col gap-8">{children}</PageTransition>;
}
