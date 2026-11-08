/**
 * Enseignes comparées — source unique pour le web, le back-office et le mobile.
 * L'ordre est celui d'affichage par défaut (bandeaux, tableaux, filtres).
 */

export const STORE_IDS = [
  'lidl',
  'aldi',
  'netto',
  'leclerc',
  'super-u',
  'intermarche',
  'carrefour',
  'match',
  'auchan',
  'grand-frais',
  'picard',
  'franprix',
  'monoprix',
] as const;

export type StoreId = (typeof STORE_IDS)[number];

/**
 * Régions de comparaison : un foyer ne compare que les enseignes présentes chez lui.
 * Outre-mer (codes postaux 97x et 98x) : à La Réunion, Jumbo et Score sont devenus Carrefour (2020),
 * Leader Price et Run Market passent sous Intermarché (novembre 2026).
 */
export type Region = 'metropole' | 'outre_mer';

/** Région d'un code postal (métropole par défaut, y compris s'il est vide ou invalide). */
export function regionOf(postalCode: string | null | undefined): Region {
  return /^9[78]\d{3}$/.test((postalCode ?? '').trim()) ? 'outre_mer' : 'metropole';
}

export interface StoreInfo {
  id: StoreId;
  name: string;
  /** Pastille neutre 2 lettres (pages éditoriales publiques). */
  initials: string;
  /**
   * Assortiment partiel (surgelés seulement, frais surtout…) : l'enseigne ne peut pas être
   * l'enseigne principale du foyer (décision du propriétaire, 08/11/2026).
   */
  partialAssortment: boolean;
  /** Régions où l'enseigne est présente. */
  regions: readonly Region[];
}

const METRO: readonly Region[] = ['metropole'];
const BOTH: readonly Region[] = ['metropole', 'outre_mer'];

export const STORES_INFO: Record<StoreId, StoreInfo> = {
  lidl: { id: 'lidl', name: 'Lidl', initials: 'LI', partialAssortment: false, regions: METRO },
  aldi: { id: 'aldi', name: 'Aldi', initials: 'AL', partialAssortment: false, regions: METRO },
  netto: { id: 'netto', name: 'Netto', initials: 'NE', partialAssortment: false, regions: METRO },
  leclerc: { id: 'leclerc', name: 'E.Leclerc', initials: 'EL', partialAssortment: false, regions: BOTH },
  'super-u': { id: 'super-u', name: 'Super U', initials: 'SU', partialAssortment: false, regions: BOTH },
  intermarche: {
    id: 'intermarche',
    name: 'Intermarché',
    initials: 'IN',
    partialAssortment: false,
    regions: BOTH,
  },
  match: { id: 'match', name: 'Match', initials: 'MA', partialAssortment: false, regions: METRO },
  carrefour: { id: 'carrefour', name: 'Carrefour', initials: 'CA', partialAssortment: false, regions: BOTH },
  auchan: { id: 'auchan', name: 'Auchan', initials: 'AU', partialAssortment: false, regions: METRO },
  'grand-frais': {
    id: 'grand-frais',
    name: 'Grand Frais',
    initials: 'GF',
    partialAssortment: true,
    regions: METRO,
  },
  picard: { id: 'picard', name: 'Picard', initials: 'PI', partialAssortment: true, regions: METRO },
  franprix: { id: 'franprix', name: 'Franprix', initials: 'FR', partialAssortment: false, regions: METRO },
  monoprix: { id: 'monoprix', name: 'Monoprix', initials: 'MO', partialAssortment: false, regions: METRO },
};

/** Enseignes présentes dans une région, dans l'ordre d'affichage. */
export function storesForRegion(region: Region): StoreId[] {
  return STORE_IDS.filter((id) => STORES_INFO[id].regions.includes(region));
}

export function isStoreId(value: string): value is StoreId {
  return (STORE_IDS as readonly string[]).includes(value);
}

/** Nom affiché d'une enseigne (l'identifiant tel quel si inconnu). */
export function storeDisplayName(id: string): string {
  return isStoreId(id) ? STORES_INFO[id].name : id;
}

/** Nombre d'enseignes comparées en métropole (textes « dans 13 enseignes »). */
export const STORE_COUNT = storesForRegion('metropole').length;
