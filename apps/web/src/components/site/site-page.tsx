import type { ReactNode } from 'react';
import Link from 'next/link';
import { Glow } from '@repas/ui';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Gabarit des pages publiques hors accueil : menu flottant, halos, fil d'Ariane, pied de page.
 * Même langage visuel que la page d'accueil.
 */
export function SitePage({ crumbs, children }: { crumbs?: Crumb[]; children: ReactNode }) {
  return (
    <div className="bg-surface-50 text-ink relative isolate min-h-screen overflow-x-clip font-sans">
      <Glow className="bg-raw-aubergine-clair -left-24 top-24 h-96 w-96" />
      <Glow className="bg-raw-peche right-0 top-[38rem] h-80 w-80 opacity-70" />
      <SiteHeader variant="pages" />
      <main className="mx-auto flex max-w-[1080px] flex-col gap-14 px-6 pb-24 pt-8">
        {crumbs ? (
          <nav aria-label="Fil d'Ariane" className="anim-rise text-ink-muted -mb-8 text-[14px] font-bold">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {c.href ? (
                    <Link
                      href={c.href as never}
                      className="text-ink-muted hover:text-brand min-h-tap inline-flex items-center no-underline hover:underline"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink">
                      {c.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 ? <span aria-hidden="true">›</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
