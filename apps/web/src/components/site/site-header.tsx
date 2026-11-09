'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cx, Icon, Logo } from '@repas/ui';
import { href, ROUTES } from '@/lib/site';

type NavLink = { href: string; label: string; anchor?: string };

// Page d'accueil : ancres vers ses sections. Autres pages : liens vers les rubriques du site.
const HOME_LINKS: NavLink[] = [
  { href: '#comment', anchor: 'comment', label: 'Comment ça marche' },
  { href: '#recettes', anchor: 'recettes', label: 'Recettes' },
  { href: '#faq', anchor: 'faq', label: 'Questions' },
];
const PAGE_LINKS: NavLink[] = [
  { href: ROUTES.recettes, label: 'Recettes' },
  { href: ROUTES.menus, label: 'Menus' },
  { href: ROUTES.comparatif, label: 'Comparatifs' },
  { href: ROUTES.tarifs, label: 'Tarifs' },
];

/**
 * Menu flottant : large et transparent en haut de page, il se rétracte en pastille de verre au défilement.
 * La section visible est surlignée. Le bouton « Créer mon plan » n'apparaît qu'une fois le hero dépassé
 * (un seul bouton plein à l'écran).
 */
export function SiteHeader({ variant = 'home' }: { variant?: 'home' | 'pages' }) {
  const LINKS = variant === 'home' ? HOME_LINKS : PAGE_LINKS;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(window.scrollY > window.innerHeight * (variant === 'home' ? 0.7 : 0.35));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  useEffect(() => {
    if (variant !== 'home') return;
    const sections = HOME_LINKS.map((l) => document.getElementById(l.anchor ?? '')).filter(
      (e): e is HTMLElement => !!e,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [variant]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const compact = scrolled || open;

  return (
    <div className="sticky top-0 z-50 px-3 pt-3">
      <header
        className={cx(
          'relative mx-auto border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          compact
            ? 'max-w-[900px] rounded-[28px] border-white/70 bg-white/70 shadow-[0_10px_40px_rgba(42,26,40,0.10)] backdrop-blur-xl backdrop-saturate-150'
            : 'max-w-[1080px] rounded-[28px] border-transparent bg-transparent',
        )}
      >
        <div
          className={cx(
            'flex items-center gap-3 pl-5 pr-2 transition-all duration-500',
            compact ? 'h-[60px]' : 'h-[72px]',
          )}
        >
          <Link href="/" className="min-h-tap mr-auto inline-flex items-center no-underline">
            <Logo />
          </Link>

          <nav aria-label="Sections" className="hidden md:block">
            <ul className="rounded-pill flex items-center gap-1 p-1">
              {LINKS.map((l) => {
                const on = l.anchor
                  ? active === l.anchor
                  : pathname.startsWith(l.href.split('/').slice(0, 2).join('/'));
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={on ? (l.anchor ? 'location' : 'page') : undefined}
                      className={cx(
                        'rounded-pill min-h-tap inline-flex items-center px-4 text-[14px] font-extrabold no-underline transition-colors',
                        on ? 'bg-brand-soft text-brand' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href={ROUTES.connexion}
            className="min-h-tap text-brand hidden items-center px-3 text-[14px] font-extrabold no-underline hover:underline md:inline-flex"
          >
            Se connecter
          </Link>
          <Link
            href={href(ROUTES.commencer)}
            tabIndex={pastHero ? undefined : -1}
            aria-hidden={pastHero ? undefined : true}
            className={cx(
              'min-h-tap rounded-pill bg-brand text-brand-on hidden items-center overflow-hidden whitespace-nowrap text-[14px] font-black no-underline transition-all duration-500 sm:inline-flex',
              pastHero ? 'max-w-[220px] px-5 opacity-100' : 'pointer-events-none max-w-0 px-0 opacity-0',
            )}
          >
            Créer mon plan
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-site"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="rounded-pill text-brand hover:bg-brand-soft grid h-11 w-11 place-items-center md:hidden"
          >
            {open ? (
              <span className="text-[24px] font-bold leading-none">×</span>
            ) : (
              <Icon name="menu" size={22} />
            )}
          </button>
        </div>

        {open ? (
          <nav
            id="menu-site"
            aria-label="Menu"
            className="absolute inset-x-0 top-full mt-2 rounded-[24px] border border-white/70 bg-white px-3 pb-4 pt-2 shadow-[0_20px_50px_rgba(42,26,40,0.16)] backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-ink hover:bg-brand-soft flex min-h-[52px] items-center rounded-[16px] px-3 text-[18px] font-extrabold no-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href={href(ROUTES.commencer)}
                className="rounded-pill bg-brand text-brand-on flex min-h-[52px] items-center justify-center text-[16px] font-black no-underline"
              >
                Créer mon plan gratuit
              </Link>
              <Link
                href={ROUTES.connexion}
                className="rounded-pill border-brand text-brand flex min-h-[52px] items-center justify-center border-2 text-[16px] font-extrabold no-underline"
              >
                Se connecter
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
    </div>
  );
}
