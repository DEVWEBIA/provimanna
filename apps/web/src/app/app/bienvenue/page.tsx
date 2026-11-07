import { preferencesFromHousehold, type StoreId } from '@repas/core';
import { OnboardingWizard } from '@/components/onboarding/wizard';
import { getAccount } from '@/lib/household';
import { listStores } from '@/lib/stores';

// Questionnaire pour un compte déjà connecté (inscription passée par « Se connecter »).
export default async function BienvenuePage() {
  const { supabase, household } = await getAccount('/app/bienvenue');
  return (
    <OnboardingWizard
      mode="account"
      stores={await listStores(supabase)}
      initial={{
        adults: household.adults,
        children: household.children,
        prefs: preferencesFromHousehold(household.diet, household.exclusions),
        cooking_time: household.cooking_time,
        store: (household.preferred_store_id as StoreId | null) ?? null,
        postal_code: household.postal_code ?? '',
      }}
    />
  );
}
