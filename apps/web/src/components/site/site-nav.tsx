import Link from 'next/link';
import { APP_NAME, LogoMark } from '@repas/ui';
import { ROUTES, href } from '@/lib/site';
import { MobileMenu } from './mobile-menu';

const LINKS = [
  { href: ROUTES.commentCaMarche, label: 'Comment ça marche' },
  { href: ROUTES.recettes, label: 'Recettes' },
  { href: ROUTES.comparatif, label: 'Comparatifs' },
  { href: ROUTES.tarifs, label: 'Tarifs' },
];

/** Navigation principale du site, sur fond aubergine (maquettes Main et MSite). */
export function SiteNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-4 px-6 py-5"
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 text-[19px] font-black tracking-[-0.3px] text-white no-underline"
      >
        <LogoMark size={34} tone="onBrand" />
        {APP_NAME}
      </Link>
      <div className="hidden flex-auto flex-wrap gap-x-6 gap-y-1 text-[15px] font-bold md:flex">
        {LINKS.map((l) => (
          <Link key={l.href} href={href(l.href)} className="text-site-on-brand no-underline hover:underline">
            {l.label}
          </Link>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-4 md:ml-0">
        <Link
          href={href(ROUTES.connexion)}
          className="hidden text-[15px] font-extrabold text-white no-underline hover:underline md:inline"
        >
          Se connecter
        </Link>
        <a
          href="#attente"
          className="min-h-tap rounded-pill text-brand hidden items-center bg-white px-5 text-[15px] font-black no-underline sm:inline-flex"
        >
          Rejoindre la liste
        </a>
        <MobileMenu
          links={[...LINKS.slice(0, 2), { href: ROUTES.menus, label: 'Menus' }, ...LINKS.slice(2)]}
          loginHref={ROUTES.connexion}
        />
      </div>
    </nav>
  );
}
