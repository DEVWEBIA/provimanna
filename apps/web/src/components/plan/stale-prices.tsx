import Link from 'next/link';
import { Notice } from '@repas/ui';
import type { PlanView } from '@/lib/plan';
import { href } from '@/lib/site';

/** « Prix incomplets » (maquette AppEtats) : l'enseigne du foyer manque de relevés récents. */
export function StalePrices({ view, storeName }: { view: PlanView; storeName: string }) {
  const mine = view.comparison.reference;
  if (mine.reliability === 'high') return null;
  const stale = Math.round((1 - mine.freshRatio) * view.lineCount);
  return (
    <Notice tone="warning" title={`On manque de prix récents chez ${storeName}.`}>
      {stale} produit{stale > 1 ? 's' : ''} sur {view.lineCount} n’ont pas été relevés depuis plus de 7 jours
      près de chez toi. Le total affiché est une estimation.{' '}
      <Link href={href('/app/ticket')} className="underline">
        Envoyer un ticket {storeName} · +3 jours
      </Link>
    </Notice>
  );
}
