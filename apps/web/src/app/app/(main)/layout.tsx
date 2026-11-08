import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { trialDaysLeft } from '@repas/core';
import { AppShellClient } from '@/components/app-shell-client';
import { getAccount, isOnboarded } from '@/lib/household';
import { dataTheme, themeChoice } from '@/lib/theme';

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

  return (
    <AppShellClient trial={trial} theme={dataTheme(await themeChoice())}>
      {children}
    </AppShellClient>
  );
}
