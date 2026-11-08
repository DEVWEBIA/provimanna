'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { APP_NAV, AppShell, type AppSection, type TrialInfo } from '@repas/ui';
import { AppLink } from './app-link';
import { OfflineBanner } from './offline-banner';

/** Section active de la navigation, d'après l'adresse (la plus longue entrée qui correspond). */
export function sectionFor(pathname: string): AppSection {
  // Le comparateur prolonge l'écran du plan.
  if (pathname.startsWith('/app/comparateur')) return 'plan';
  const match = [...APP_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
  return match?.id ?? 'accueil';
}

export function AppShellClient({
  children,
  trial,
  theme,
}: {
  children: ReactNode;
  trial: TrialInfo | null;
  theme: 'light' | 'dark' | 'system';
}) {
  return (
    <AppShell active={sectionFor(usePathname())} trial={trial} theme={theme} Link={AppLink}>
      <OfflineBanner />
      {children}
    </AppShell>
  );
}
