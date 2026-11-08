import Image from 'next/image';
import { isStoreId } from '@repas/core';
import { cx } from '@repas/ui';
import { STORE_LOGOS } from '@/lib/store-logos';

/**
 * Vrai logo de l'enseigne, en couleur, sur une vignette blanche (lisible aussi en mode sombre).
 * Espace client et bandeau du site (décision du propriétaire du 08/11/2026). Sources : assets/logos/SOURCES.md.
 * Enseigne inconnue (sans fichier) : nom écrit en clair.
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
  const logo = isStoreId(id) ? STORE_LOGOS[id] : undefined;
  const ratio = logo ? logo.width / logo.height : 1;
  const pad = Math.round(size * 0.14);
  // Le logo tient dans la hauteur disponible, sans dépasser 2,4 fois la hauteur en largeur.
  const h = size - 2 * pad;
  const w = Math.round(Math.min(ratio, 2.4) * h);
  return (
    <span
      className={cx(
        'border-line bg-raw-blanc grid shrink-0 place-items-center overflow-hidden rounded-[12px] border',
        className,
      )}
      style={{
        height: size,
        width: logo ? Math.max(size, w + 2 * pad) : undefined,
        minWidth: size,
        padding: logo ? pad : 0,
      }}
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
