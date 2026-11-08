import { WIZARD_STEPS, type WizardStep } from '@/components/onboarding/schema';
import { OnboardingWizard } from '@/components/onboarding/wizard';
import { getAccount, isOnboarded } from '@/lib/household';
import { dislikableIngredients } from '@/lib/ingredients';
import { draftFromHousehold } from '@/lib/onboarding';
import { listStores } from '@/lib/stores';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const isStep = (v: unknown): v is WizardStep =>
  typeof v === 'string' && v !== 'resultat' && (WIZARD_STEPS as readonly string[]).includes(v);

/**
 * Questionnaire d'un compte connecté : en entier (inscription passée par « Se connecter »), ou une
 * seule réponse depuis le profil (`?etape=budget`).
 */
export default async function BienvenuePage({ searchParams }: { searchParams: SearchParams }) {
  const etape = (await searchParams).etape;
  const { supabase, household } = await getAccount('/app/bienvenue');
  const [stores, ingredients] = await Promise.all([listStores(supabase), dislikableIngredients(supabase)]);
  const edit = isStep(etape);
  return (
    <OnboardingWizard
      mode={edit ? 'edit' : 'account'}
      editStep={edit ? etape : undefined}
      stores={stores}
      ingredients={ingredients}
      initial={draftFromHousehold(household)}
      initialNoBudget={isOnboarded(household) && household.weekly_budget_cents === null}
    />
  );
}
