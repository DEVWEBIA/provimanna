import type { ReactNode } from 'react';
import Image from 'next/image';
import { Glow } from '@repas/ui';
import bowlColore from '@/assets/photos/bowl-colore.jpg';

/**
 * Panneau aubergine des écrans d'entrée (connexion, questionnaire) : halos, plat coloré qui
 * tourne lentement en sortant par le bas, comme le hero de la page d'accueil.
 */
export function BrandPanel({
  children,
  className,
  bowlClassName = '-bottom-40 -right-36 w-[440px] lg:w-[520px]',
}: {
  children: ReactNode;
  className?: string;
  /** Position et taille du plat (il doit rester derrière le texte, sans le gêner). */
  bowlClassName?: string;
}) {
  return (
    <aside className={`bg-brand relative isolate box-border overflow-hidden text-white ${className ?? ''}`}>
      <Glow className="-left-24 -top-24 h-80 w-80 bg-white/20" />
      <Glow className="bg-raw-peche/40 -right-10 top-1/3 h-72 w-72" />
      <div aria-hidden="true" className={`pointer-events-none absolute -z-10 max-md:hidden ${bowlClassName}`}>
        <div className="anim-spin aspect-square overflow-hidden rounded-full opacity-95 shadow-[0_40px_80px_rgba(20,8,18,0.45)] ring-8 ring-white/10">
          <Image
            src={bowlColore}
            alt=""
            placeholder="blur"
            sizes="520px"
            className="h-full w-full scale-105 object-cover"
          />
        </div>
      </div>
      {children}
    </aside>
  );
}
