import { AppShell, EmptyState, Plat, Button } from '@repas/ui';
import { AppLink } from '@/components/app-link';

export default function DevShellPage() {
  return (
    <AppShell active="accueil" unreadNotifications={3} trial={{ daysLeft: 9, elapsed: 0.36 }} Link={AppLink}>
      <h1 className="font-display text-title">Bonjour Marion</h1>
      <EmptyState
        overline="Semaine 48 · 23 – 29 nov."
        title="Ta semaine n'est pas encore planifiée."
        description="On compose 14 repas de saison pour ton foyer en quelques secondes. Tu pourras tout remplacer ensuite."
        illustration={<Plat variant="soupe" size={96} decorative />}
        actions={<Button>Générer mon plan</Button>}
      />
    </AppShell>
  );
}
