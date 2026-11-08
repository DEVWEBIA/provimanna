import type { ReactNode } from 'react';
import Link from 'next/link';
import { cx } from '@repas/ui';
import { href, ROUTES } from '@/lib/site';
import { SitePage } from './site-page';

const LEGAL = [
  { href: ROUTES.mentionsLegales, label: 'Mentions légales' },
  { href: '/cgu', label: 'Conditions d’utilisation' },
  { href: ROUTES.confidentialite, label: 'Confidentialité' },
  { href: ROUTES.methodologie, label: 'Méthodologie des prix' },
];

/** Gabarit des pages légales (maquette SiteLegal). Les mentions entre crochets restent à compléter. */
export function LegalPage({ path, title, children }: { path: string; title: string; children: ReactNode }) {
  return (
    <SitePage crumbs={[{ label: 'Accueil', href: '/' }, { label: title }]}>
      <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Informations légales" className="lg:sticky lg:top-24">
          <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">INFORMATIONS LÉGALES</p>
          <ul className="mt-3 flex flex-col gap-1">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={href(l.href)}
                  aria-current={l.href === path ? 'page' : undefined}
                  className={cx(
                    'min-h-tap flex items-center rounded-[12px] px-3 text-[15px] font-extrabold no-underline',
                    l.href === path ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-white/70',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="border-line rounded-[28px] border bg-white/80 p-[clamp(20px,4vw,48px)] backdrop-blur [&_h2]:mt-8 [&_h2]:text-[22px] [&_h2]:font-black [&_li]:text-[16px] [&_p]:mt-3 [&_p]:text-[16px] [&_p]:leading-[26px] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <p className="bg-warning-soft text-warning !mt-0 rounded-[14px] px-4 py-3 text-[14px] font-bold">
            Gabarit de mise en page : le texte définitif est à rédiger et faire valider par un professionnel
            du droit.
          </p>
          <h1 className="font-display mt-6 text-[clamp(32px,4vw,44px)] font-extrabold tracking-[-1px]">
            {title}
          </h1>
          <p className="text-ink-muted !mt-1 text-[14px] font-bold">Dernière mise à jour : [date]</p>
          {children}
        </article>
      </div>
    </SitePage>
  );
}
