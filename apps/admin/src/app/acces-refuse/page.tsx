import type { Metadata } from 'next';
import { GlassCard, Glow, Logo, PageHeader } from '@repas/ui';

export const metadata: Metadata = { title: 'Accès réservé' };

export default function AccesRefusePage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <Glow className="bg-raw-aubergine-clair -left-24 top-24 h-80 w-80" />
      <main className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-center gap-8 px-6 py-10">
        <Logo />
        <GlassCard className="p-8">
          <PageHeader
            eyebrow="Espace staff"
            title="Accès réservé à l’équipe"
            lead="Ton compte n’a pas de rôle staff. Demande à un administrateur de t’en attribuer un."
          />
          <form action="/auth/deconnexion" method="post" className="mt-6">
            <button type="submit" className="text-brand min-h-tap font-black underline">
              Se déconnecter
            </button>
          </form>
        </GlassCard>
      </main>
    </div>
  );
}
