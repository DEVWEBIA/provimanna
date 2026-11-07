import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { OnboardingWizard } from '@/components/onboarding/wizard';
import { createClient } from '@/lib/supabase/server';
import { listStores } from '@/lib/stores';

export const metadata: Metadata = {
  title: 'Créer mon plan',
  description:
    'Décris ton foyer en 2 minutes : on compose ta semaine et on compare son prix dans 6 enseignes.',
  robots: { index: false, follow: true },
};

/** Questionnaire sans compte : le compte est créé à la fin, avec l'email (lien magique). */
export default async function CommencerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/app');

  return (
    <OnboardingWizard
      mode="guest"
      stores={await listStores(supabase)}
      initial={{
        adults: 2,
        children: 0,
        prefs: [],
        cooking_time: 'peu_importe',
        store: null,
        postal_code: '',
      }}
    />
  );
}
