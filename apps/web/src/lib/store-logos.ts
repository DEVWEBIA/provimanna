import type { StaticImageData } from 'next/image';
import type { StoreId } from '@repas/core';
import aldi from '@/assets/logos/aldi.svg';
import auchan from '@/assets/logos/auchan.svg';
import carrefour from '@/assets/logos/carrefour.svg';
import franprix from '@/assets/logos/franprix.svg';
import grandFrais from '@/assets/logos/grand-frais.png';
import intermarche from '@/assets/logos/intermarche.svg';
import leclerc from '@/assets/logos/leclerc.svg';
import lidl from '@/assets/logos/lidl.svg';
import monoprix from '@/assets/logos/monoprix.svg';
import netto from '@/assets/logos/netto.svg';
import picard from '@/assets/logos/picard.png';
import superU from '@/assets/logos/super-u.svg';

/**
 * Vrais logos des enseignes, en couleur (décision du propriétaire du 08/11/2026).
 * Sources et statut : src/assets/logos/SOURCES.md. À retirer si une enseigne le demande.
 */
export const STORE_LOGOS: Record<StoreId, StaticImageData> = {
  lidl,
  aldi,
  netto,
  leclerc,
  'super-u': superU,
  intermarche,
  carrefour,
  auchan,
  'grand-frais': grandFrais,
  picard,
  franprix,
  monoprix,
};
