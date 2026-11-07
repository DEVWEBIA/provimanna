import Link from 'next/link';
import { Logo } from '@repas/ui';
import { ROUTES } from '@/lib/site';

/** En-tête minimal du site : logo et connexion. */
export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex h-[92px] max-w-[1000px] items-center justify-between gap-4 px-6">
      <Link href="/" className="no-underline" aria-label="Accueil">
        <Logo />
      </Link>
      <Link
        href={ROUTES.connexion}
        className="min-h-tap rounded-pill bg-surface-0 text-brand hover:text-ink inline-flex items-center px-5 text-[15px] font-extrabold no-underline shadow-[0_2px_10px_rgba(42,26,40,0.08)]"
      >
        Se connecter
      </Link>
    </header>
  );
}
