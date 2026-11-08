import { STORE_COUNT } from '@repas/core';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { OnboardingWizard } from '@/components/onboarding/wizard';
import { dislikableIngredients } from '@/lib/ingredients';
import { DEFAULT_DRAFT } from '@/lib/onboarding';
import { createClient } from '@/lib/supabase/server';
import { listStores } from '@/lib/stores';

export const metadata: Metadata = {
  title: 'Créer mon plan',
  description: `Décris ton foyer en 2 minutes : on compose ta semaine et on compare son prix dans ${STORE_COUNT} enseignes.`,
  robots: { index: false, follow: true },
};

/** Questionnaire sans compte : le compte est créé à la fin, avec l'email (lien magique). */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CommencerPage({ searchParams }: { searchParams: SearchParams }) {
  const parrain = (await searchParams).parrain;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/app');

  const [stores, ingredients] = await Promise.all([listStores(supabase), dislikableIngredients(supabase)]);
  return (
    <OnboardingWizard
      mode="guest"
      referral={typeof parrain === 'string' ? parrain : undefined}
      stores={stores}
      ingredients={ingredients}
      initial={DEFAULT_DRAFT}
    />
  );
}
