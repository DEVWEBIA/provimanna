import type { ReactNode } from 'react';
import { cx } from './cx.ts';
import { Icon } from './icons.tsx';
import { DefaultLink, type LinkComponent } from './link.tsx';
import { Logo } from './logo.tsx';
import { NavIndicator } from './motion.tsx';
import { APP_NAV, type AppSection } from './nav.ts';
import { Glow } from './surface.tsx';
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
  /** Thème de l'espace client : clair, sombre, ou celui du téléphone (system). */
  theme?: 'light' | 'dark' | 'system';
}

/** Gabarit de la web app : barre latérale 8 entrées (desktop), barre d'onglets 5 entrées (mobile). */
export function AppShell({
  active,
  children,
  unreadNotifications = 0,
  trial,
  Link = DefaultLink,
  homeHref = '/',
  theme = 'light',
}: AppShellProps) {
  return (
    <div
      data-theme={theme}
      className="bg-surface-50 text-ink relative isolate flex min-h-screen overflow-x-clip font-sans"
    >
      {/* Halos de la page d'accueil, discrets derrière le contenu. */}
      <Glow className="bg-raw-aubergine-clair -top-24 left-[30%] h-96 w-96" />
      <Glow className="bg-raw-peche right-0 top-[40vh] h-80 w-80 opacity-60" />
      <aside
        aria-label="Menu principal"
        className="dark:border-line dark:bg-surface-0 sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col gap-6 border-r border-white/70 bg-white/60 px-4 py-6 shadow-[8px_0_30px_rgba(42,26,40,0.04)] backdrop-blur-xl lg:flex"
      >
        <Link href={homeHref} className="min-h-tap inline-flex items-center px-2 no-underline">
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
                  'relative isolate flex min-h-[46px] items-center gap-3 rounded-[14px] px-3.5 text-[15px] font-extrabold no-underline transition-[background-color,transform] duration-200 motion-reduce:transition-none',
                  on
                    ? 'text-brand'
                    : 'text-ink dark:hover:bg-surface-50 hover:translate-x-0.5 hover:bg-white/80',
                )}
              >
                {on ? <NavIndicator group="app" className="bg-brand-soft rounded-[14px]" /> : null}
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
          <div className="bg-brand text-brand-on relative isolate mt-auto overflow-hidden rounded-[20px] p-4 shadow-[0_14px_30px_rgba(107,56,104,0.3)]">
            <Glow className="-right-10 -top-10 h-28 w-28 bg-white/25 blur-2xl" />
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
        <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-8 px-5 pb-28 pt-8 lg:px-[clamp(20px,3vw,48px)] lg:pb-20 lg:pt-12">
          {children}
        </main>
        <TabBar active={active} Link={Link} className="fixed inset-x-0 bottom-0 z-10 lg:hidden" />
      </div>
    </div>
  );
}
