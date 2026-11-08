import type { Metadata } from 'next';
import { GlassCard, Glow, Logo, PageHeader } from '@repas/ui';

export const metadata: Metadata = { title: 'Connexion' };

// Page d'attente : la connexion staff (lien magique + contrôle has_role) arrive au lot 9.
export default function AdminConnexionPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <Glow className="bg-raw-aubergine-clair -left-24 top-24 h-80 w-80" />
      <Glow className="bg-raw-peche bottom-10 right-0 h-72 w-72 opacity-70" />
      <main className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-center gap-8 px-6 py-10">
        <div className="anim-rise">
          <Logo />
        </div>
        <GlassCard className="anim-rise p-8 [--d:120ms]">
          <PageHeader
            eyebrow="Espace staff"
            title="Connexion à l’espace staff"
            lead="La connexion du back-office sera disponible au lot 9."
          />
        </GlassCard>
      </main>
    </div>
  );
}
