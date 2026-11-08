import type { Metadata } from 'next';
import { GlassCard, Glow, Logo, PageHeader } from '@repas/ui';
import { StaffLogin } from './staff-login';

export const metadata: Metadata = { title: 'Connexion' };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminConnexionPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <Glow className="bg-raw-aubergine-clair -left-24 top-24 h-80 w-80" />
      <Glow className="bg-raw-peche bottom-10 right-0 h-72 w-72 opacity-70" />
      <main className="mx-auto flex min-h-screen max-w-[480px] flex-col justify-center gap-8 px-6 py-10">
        <div className="anim-rise">
          <Logo />
        </div>
        <GlassCard className="flex flex-col gap-6 p-8">
          <PageHeader eyebrow="Espace staff" title="Connexion au back-office" />
          <StaffLogin linkError={sp.erreur === 'lien'} />
        </GlassCard>
      </main>
    </div>
  );
}
