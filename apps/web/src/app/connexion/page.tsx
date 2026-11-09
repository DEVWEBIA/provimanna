import type { Metadata } from 'next';
import Link from 'next/link';
import { formatEuro } from '@repas/core';
import type React from 'react';
import { Glow, Logo, TicketCard } from '@repas/ui';
import { BrandPanel } from '@/components/brand/brand-panel';
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
    <div className="bg-surface-50 text-ink flex min-h-screen flex-wrap overflow-x-clip font-sans">
      <main className="relative isolate box-border flex min-w-0 flex-[999_1_520px] flex-col px-[clamp(24px,6vw,96px)] pb-12 pt-8">
        <Glow className="bg-raw-aubergine-clair -left-24 top-24 h-80 w-80" />
        <Glow className="bg-raw-peche bottom-10 right-0 h-72 w-72 opacity-70" />
        <Link href="/" className="anim-rise min-h-tap inline-flex items-center self-start no-underline">
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
      <BrandPanel
        bowlClassName="-bottom-56 -right-48 w-[460px]"
        className="hidden flex-[1_1_420px] flex-col justify-center gap-12 p-[clamp(32px,5vw,72px)] md:flex"
      >
        <p
          className="anim-rise font-display max-w-[420px] text-[clamp(28px,2.6vw,38px)] font-extrabold leading-[1.1] tracking-[-1px]"
          style={{ '--d': '150ms' } as React.CSSProperties}
        >
          Chaque jeudi, ton menu t’attend. Chaque mois, tu vois ce que tu as gardé.
        </p>
        <div className="anim-ticket max-w-[380px]">
          <div className="anim-float drop-shadow-[0_30px_50px_rgba(20,8,18,0.4)]">
            <TicketCard edge="cutout" className="rounded-t-[22px] px-6 pb-8 pt-6">
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
          </div>
        </div>
      </BrandPanel>
    </div>
  );
}
