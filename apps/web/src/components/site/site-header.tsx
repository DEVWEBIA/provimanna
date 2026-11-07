import Link from 'next/link';
import { Logo } from '@repas/ui';
import { ROUTES } from '@/lib/site';

/** En-tête flottant en verre dépoli, collé en haut de l'écran au défilement. */
export function SiteHeader() {
  return (
    <div className="sticky top-0 z-40 px-4 pt-3">
      <header className="rounded-pill mx-auto flex h-[64px] max-w-[880px] items-center justify-between gap-4 border border-white/70 bg-white/60 pl-5 pr-2 shadow-[0_8px_30px_rgba(42,26,40,0.08)] backdrop-blur-xl backdrop-saturate-150">
        <Link href="/" className="no-underline" aria-label="Accueil">
          <Logo />
        </Link>
        <Link
          href={ROUTES.connexion}
          className="min-h-tap rounded-pill border-brand text-brand hover:bg-brand-soft inline-flex items-center border-2 px-5 text-[15px] font-extrabold no-underline"
        >
          Se connecter
        </Link>
      </header>
    </div>
  );
}
