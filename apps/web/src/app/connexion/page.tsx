import type { Metadata } from 'next';
import Link from 'next/link';
import { formatEuro } from '@repas/core';
import { Logo, Plat, TicketCard } from '@repas/ui';
import { safeNext } from '@/lib/auth/redirect';
import { href, ROUTES } from '@/lib/site';
import { ConnexionForm } from './connexion-form';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connecte-toi sans mot de passe : on t’envoie un lien de connexion.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/connexion' },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ConnexionPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const email = one(sp.email) ?? '';
  // Arrivée depuis un CTA de la landing (email pré-rempli) ou ?mode=inscription → création de compte.
  const mode = one(sp.mode) === 'inscription' || email ? 'inscription' : 'connexion';

  return (
    <div className="bg-surface-50 text-ink flex min-h-screen flex-wrap font-sans">
      <main className="box-border flex min-w-0 flex-[999_1_520px] flex-col px-[clamp(24px,6vw,96px)] pb-12 pt-8">
        <Link href="/" className="no-underline">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center py-12">
          <div className="w-full max-w-[440px]">
            <ConnexionForm
              initialMode={mode}
              initialEmail={email}
              suite={safeNext(one(sp.suite))}
              linkError={one(sp.erreur) === 'lien'}
            />
          </div>
        </div>
        <p className="text-ink-muted text-[13px]">
          Tes données restent en France ·{' '}
          <Link href={href(ROUTES.confidentialite)} className="text-brand underline">
            Confidentialité
          </Link>
        </p>
      </main>
      <aside className="bg-brand box-border hidden flex-[1_1_420px] flex-col justify-center gap-10 p-[clamp(32px,5vw,72px)] text-white md:flex">
        <TicketCard
          edge="brand"
          className="max-w-[380px] rotate-[1.5deg] rounded-t-[22px] px-6 pb-8 pt-6 shadow-[0_30px_60px_rgba(20,8,18,0.35)] motion-reduce:rotate-0"
        >
          <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">TON RÉCAP · OCTOBRE</p>
          <p className="font-display mb-3.5 mt-1.5 text-[44px] font-extrabold tabular-nums tracking-[-1.6px]">
            −{formatEuro(3840)}
          </p>
          <div className="border-line flex flex-col gap-2 border-t-2 border-dashed pt-3.5 text-[15px] font-bold">
            <p className="flex justify-between">
              <span>4 plans planifiés</span>
              <span aria-hidden="true">✓</span>
            </p>
            <p className="flex justify-between">
              <span>56 repas de saison</span>
              <span aria-hidden="true">✓</span>
            </p>
            <p className="flex justify-between">
              <span>Badge « Octobre malin »</span>
              <span className="text-saving-ink">obtenu</span>
            </p>
          </div>
        </TicketCard>
        <p className="font-display max-w-[420px] text-[clamp(28px,2.6vw,38px)] font-extrabold leading-[1.1] tracking-[-1px]">
          Chaque jeudi, ton menu t’attend. Chaque mois, tu vois ce que tu as gardé.
        </p>
        <div className="flex gap-2" aria-hidden="true">
          <Plat variant="soupe" size={74} decorative />
          <Plat variant="curry" size={74} decorative />
          <Plat variant="pates" size={74} decorative />
        </div>
      </aside>
    </div>
  );
}
