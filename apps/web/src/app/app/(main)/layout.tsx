import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { trialDaysLeft } from '@repas/core';
import { AppShell } from '@repas/ui';
import { AppLink } from '@/components/app-link';
import { getAccount, isOnboarded } from '@/lib/household';

const TRIAL_DAYS = 14;

// Espace client : session obligatoire (proxy + getAccount) et onboarding terminé.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const { household, subscription } = await getAccount();
  if (!isOnboarded(household)) redirect('/app/bienvenue');

  const daysLeft =
    subscription?.tier === 'trial' && subscription.trial_ends_at
      ? trialDaysLeft(subscription.trial_ends_at, subscription.bonus_days)
      : 0;
  const trial = daysLeft > 0 ? { daysLeft, elapsed: Math.max(0, 1 - daysLeft / TRIAL_DAYS) } : null;

  // La section active est fixée par chaque page au fil des lots ; « accueil » par défaut.
  return (
    <AppShell active="accueil" trial={trial} Link={AppLink}>
      {children}
    </AppShell>
  );
}
