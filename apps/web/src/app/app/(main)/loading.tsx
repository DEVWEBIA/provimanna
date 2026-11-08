import { Skeleton } from '@repas/ui';

/** Chargement d'un écran de l'espace client (maquette AppEtats) : squelettes, sans indicateur qui tourne. */
export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Chargement">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-[220px] w-full rounded-[28px]" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 rounded-[22px]" />
        <Skeleton className="h-28 rounded-[22px]" />
        <Skeleton className="h-28 rounded-[22px]" />
      </div>
    </div>
  );
}
