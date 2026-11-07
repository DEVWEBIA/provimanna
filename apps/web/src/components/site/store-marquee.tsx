import Image, { type StaticImageData } from 'next/image';
import type { StoreId } from '@repas/core';
import aldi from '@/assets/logos/aldi.svg';
import auchan from '@/assets/logos/auchan.svg';
import intermarche from '@/assets/logos/intermarche.svg';
import leclerc from '@/assets/logos/leclerc.svg';
import lidl from '@/assets/logos/lidl.svg';
import type { ExampleStore } from '@/lib/landing-data';

/**
 * Logos officiels (Wikimedia Commons, voir src/assets/logos/SOURCES.md), affichés UNIQUEMENT dans ce bandeau,
 * en gris, avec la mention de propriété des marques. Partout ailleurs : pastilles neutres (décision du 07/11/2026).
 * Carrefour : pas de fichier réutilisable pour l'instant → nom en lettres grises.
 */
const LOGOS: Partial<Record<StoreId, { src: StaticImageData; h: number }>> = {
  lidl: { src: lidl, h: 44 },
  aldi: { src: aldi, h: 44 },
  leclerc: { src: leclerc, h: 30 },
  intermarche: { src: intermarche, h: 26 },
  auchan: { src: auchan, h: 30 },
};

function StoreMark({ store }: { store: ExampleStore }) {
  const logo = LOGOS[store.id];
  const cls =
    'opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 motion-reduce:transition-none';
  if (!logo) {
    return <span className={`${cls} text-ink text-[26px] font-black tracking-[-0.5px]`}>{store.name}</span>;
  }
  const w = Math.round((logo.src.width / logo.src.height) * logo.h);
  return <Image src={logo.src} alt="" width={w} height={logo.h} unoptimized className={cls} />;
}

/** Bandeau défilant des enseignes comparées. Figé si l'utilisateur réduit les animations. */
export function StoreMarquee({ stores }: { stores: ExampleStore[] }) {
  const row = () => (
    <ul className="flex shrink-0 items-center gap-16 pr-16">
      {[...stores, ...stores].map((s, i) => (
        <li key={`${s.id}-${i}`} className="flex h-12 items-center">
          <StoreMark store={s} />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Enseignes comparées" className="py-12">
      <p className="text-ink-muted text-center text-[12px] font-black uppercase tracking-[1.4px]">
        6 enseignes comparées à chaque plan
      </p>
      <p className="sr-only">{stores.map((s) => s.name).join(', ')}</p>
      <div className="mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div
          className="animate-marquee flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none"
          aria-hidden="true"
        >
          {row()}
          {row()}
        </div>
      </div>
      <p className="text-ink-muted mx-auto mt-6 max-w-[640px] px-6 text-center text-[12px]">
        Marques et logos © leurs propriétaires respectifs. Cités à titre de comparaison des prix, sans
        affiliation ni partenariat.
      </p>
    </section>
  );
}
