'use client';

import Link from 'next/link';
import { Button, EmptyState, Plat } from '@repas/ui';

/** Erreur dans l'espace client (maquette AppEtats) : jamais culpabilisant, toujours une issue. */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EmptyState
      illustration={<Plat variant="soupe" size={96} decorative />}
      title="Cet écran n’a pas pu s’afficher."
      description="Ce n’est pas de ton fait : un de nos services ne répond pas. Ton foyer et tes préférences sont bien enregistrés."
      actions={
        <>
          <Button onClick={reset}>Réessayer</Button>
          <Link href="/app" className="text-brand min-h-tap inline-flex items-center px-3 font-black">
            Revenir à l’accueil
          </Link>
          {error.digest ? <p className="text-ink-muted w-full text-[12px]">Code {error.digest}</p> : null}
        </>
      }
    />
  );
}
