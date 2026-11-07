import type { ReactNode } from 'react';
import { cx } from './cx.ts';
import { Icon } from './icons.tsx';
import { DefaultLink, type LinkComponent } from './link.tsx';
import { Logo } from './logo.tsx';
import { APP_NAV, type AppSection } from './nav.ts';
import { TabBar } from './tab-bar.tsx';

export interface TrialInfo {
  daysLeft: number;
  /** Part de l'essai écoulée, entre 0 et 1. */
  elapsed: number;
}

export interface AppShellProps {
  active: AppSection;
  children: ReactNode;
  unreadNotifications?: number;
  trial?: TrialInfo | null;
  Link?: LinkComponent;
  homeHref?: string;
}

/** Gabarit de la web app : barre latérale 8 entrées (desktop), barre d'onglets 5 entrées (mobile). */
export function AppShell({
  active,
  children,
  unreadNotifications = 0,
  trial,
  Link = DefaultLink,
  homeHref = '/',
}: AppShellProps) {
  return (
    <div className="bg-surface-50 text-ink flex min-h-screen font-sans">
      <aside className="border-line bg-surface-0 sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col gap-6 border-r px-4 py-6 lg:flex">
        <Link href={homeHref} className="px-2 no-underline">
          <Logo />
        </Link>
        <nav aria-label="Web app" className="flex flex-col gap-0.5">
          {APP_NAV.map((item) => {
            const on = item.id === active;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={on ? 'page' : undefined}
                className={cx(
                  'flex min-h-[46px] items-center gap-3 rounded-[14px] px-3.5 text-[15px] font-extrabold no-underline',
                  on ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-surface-50',
                )}
              >
                <Icon name={item.icon} size={20} />
                {item.label}
                {item.id === 'notifications' && unreadNotifications > 0 ? (
                  <span className="rounded-pill bg-saving text-raw-encre ml-auto px-2 py-px text-[12px] font-black">
                    <span className="sr-only">non lues : </span>
                    {unreadNotifications}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        {trial ? (
          <div className="bg-brand text-brand-on mt-auto rounded-md p-4">
            <p className="text-brand-soft text-[12px] font-black tracking-[1px]">ESSAI PREMIUM</p>
            <p className="mb-2.5 mt-1.5 font-black">
              {trial.daysLeft} {trial.daysLeft > 1 ? 'jours restants' : 'jour restant'}
            </p>
            <div
              className="h-1.5 rounded-[9px] bg-white/20"
              role="progressbar"
              aria-label="Essai écoulé"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(trial.elapsed * 100)}
            >
              <div
                className="bg-saving h-1.5 rounded-[9px]"
                style={{ width: `${Math.round(trial.elapsed * 100)}%` }}
              />
            </div>
          </div>
        ) : null}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-5 px-5 pb-28 pt-7 lg:px-[clamp(20px,3vw,44px)] lg:pb-16">
          {children}
        </main>
        <TabBar active={active} Link={Link} className="fixed inset-x-0 bottom-0 z-10 lg:hidden" />
      </div>
    </div>
  );
}
