import type { Metadata } from 'next';
import { Button, EmptyState, Plat } from '@repas/ui';
import { getAccount } from '@/lib/household';

export const metadata: Metadata = { title: 'Accueil', robots: { index: false } };

// Tableau de bord provisoire : le plan de la semaine (AppDashboard) arrive au lot 5.
export default async function DashboardPage() {
  const { profile } = await getAccount();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-title">Bonjour {profile.display_name}</h1>
        <form action="/auth/deconnexion" method="post">
          <Button type="submit" variant="link" size="sm">
            Se déconnecter
          </Button>
        </form>
      </div>
      <EmptyState
        title="Ta semaine n'est pas encore planifiée."
        description="On compose 14 repas de saison pour ton foyer en quelques secondes. Tu pourras tout remplacer ensuite."
        illustration={<Plat variant="soupe" size={96} decorative />}
      />
    </>
  );
}
