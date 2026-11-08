import Image from 'next/image';
import { STORE_COUNT, type StoreId } from '@repas/core';
import { STORE_LOGOS } from '@/lib/store-logos';
import { VelocityMarquee } from './motion';

/** Hauteur d'affichage par logo, pour un poids visuel comparable (logos carrés plus hauts). */
const HEIGHT: Record<StoreId, number> = {
  lidl: 44,
  aldi: 44,
  netto: 34,
  leclerc: 30,
  'super-u': 28,
  intermarche: 26,
  carrefour: 44,
  auchan: 30,
  'grand-frais': 48,
  picard: 48,
  franprix: 26,
  monoprix: 22,
};

type MarqueeStore = { id: StoreId; name: string };

function StoreMark({ store }: { store: MarqueeStore }) {
  const src = STORE_LOGOS[store.id];
  const h = HEIGHT[store.id];
  const w = Math.round((src.width / src.height) * h);
  return (
    <Image
      src={src}
      alt=""
      width={w}
      height={h}
      unoptimized
      style={{ height: h, width: w, maxWidth: 'none' }}
      className="transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
    />
  );
}

/**
 * Bandeau défilant des enseignes comparées : vrais logos en couleur (src/assets/logos/SOURCES.md), avec la
 * mention de propriété des marques. Accélère avec le défilement (Motion) ; figé si l'utilisateur réduit les animations.
 */
export function StoreMarquee({ stores }: { stores: MarqueeStore[] }) {
  const row = () => (
    <ul className="flex shrink-0 items-center gap-16 pr-16">
      {stores.map((s) => (
        <li key={s.id} className="flex h-12 items-center">
          <StoreMark store={s} />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Enseignes comparées" className="py-12">
      <p className="text-ink-muted text-center text-[12px] font-black uppercase tracking-[1.4px]">
        {STORE_COUNT} enseignes comparées à chaque plan
      </p>
      <p className="sr-only">{stores.map((s) => s.name).join(', ')}</p>
      <div className="mt-7">
        <VelocityMarquee>{row()}</VelocityMarquee>
      </div>
      <p className="text-ink-muted mx-auto mt-6 max-w-[640px] px-6 text-center text-[12px]">
        Marques et logos © leurs propriétaires respectifs. Cités à titre de comparaison des prix, sans
        affiliation ni partenariat.
      </p>
    </section>
  );
}
