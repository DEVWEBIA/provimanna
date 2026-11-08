import Image, { type StaticImageData } from 'next/image';
import { cx } from '@repas/ui';
import aldi from '@/assets/logos/aldi.svg';
import auchan from '@/assets/logos/auchan.svg';
import intermarche from '@/assets/logos/intermarche.svg';
import leclerc from '@/assets/logos/leclerc.svg';
import lidl from '@/assets/logos/lidl.svg';

const LOGOS: Record<string, StaticImageData> = { lidl, aldi, leclerc, intermarche, auchan };

/**
 * Vrai logo de l'enseigne, en couleur, sur une vignette blanche (lisible aussi en mode sombre).
 * Espace client et bandeau du site (décision du propriétaire du 08/11/2026). Sources : assets/logos/SOURCES.md.
 * Sans fichier (Carrefour pour l'instant) : initiales et nom en clair.
 */
export function StoreLogo({
  id,
  name,
  size = 40,
  className,
}: {
  id: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const logo = LOGOS[id];
  const ratio = logo ? logo.width / logo.height : 1;
  const w = Math.round(Math.min(ratio, 2.6) * size * 0.72);
  return (
    <span
      className={cx(
        'border-line bg-raw-blanc grid shrink-0 place-items-center overflow-hidden rounded-[12px] border',
        className,
      )}
      style={{ height: size, minWidth: size, padding: logo ? Math.round(size * 0.14) : 0 }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={w}
          height={Math.round(w / ratio)}
          unoptimized
          className="h-auto max-h-full w-auto max-w-full object-contain"
        />
      ) : (
        <span
          className="text-raw-encre px-2 font-black"
          style={{ fontSize: Math.round(size * 0.3) }}
          role="img"
          aria-label={name}
        >
          {name}
        </span>
      )}
    </span>
  );
}
