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
  'auchan',
  'grand-frais',
  'picard',
  'franprix',
  'monoprix',
] as const;

export type StoreId = (typeof STORE_IDS)[number];

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
}

export const STORES_INFO: Record<StoreId, StoreInfo> = {
  lidl: { id: 'lidl', name: 'Lidl', initials: 'LI', partialAssortment: false },
  aldi: { id: 'aldi', name: 'Aldi', initials: 'AL', partialAssortment: false },
  netto: { id: 'netto', name: 'Netto', initials: 'NE', partialAssortment: false },
  leclerc: { id: 'leclerc', name: 'E.Leclerc', initials: 'EL', partialAssortment: false },
  'super-u': { id: 'super-u', name: 'Super U', initials: 'SU', partialAssortment: false },
  intermarche: { id: 'intermarche', name: 'Intermarché', initials: 'IN', partialAssortment: false },
  carrefour: { id: 'carrefour', name: 'Carrefour', initials: 'CA', partialAssortment: false },
  auchan: { id: 'auchan', name: 'Auchan', initials: 'AU', partialAssortment: false },
  'grand-frais': { id: 'grand-frais', name: 'Grand Frais', initials: 'GF', partialAssortment: true },
  picard: { id: 'picard', name: 'Picard', initials: 'PI', partialAssortment: true },
  franprix: { id: 'franprix', name: 'Franprix', initials: 'FR', partialAssortment: false },
  monoprix: { id: 'monoprix', name: 'Monoprix', initials: 'MO', partialAssortment: false },
};

/** Enseignes qui peuvent être l'enseigne principale d'un foyer (assortiment complet). */
export const MAIN_STORE_IDS: StoreId[] = STORE_IDS.filter((id) => !STORES_INFO[id].partialAssortment);

export function isStoreId(value: string): value is StoreId {
  return (STORE_IDS as readonly string[]).includes(value);
}

/** Nom affiché d'une enseigne (l'identifiant tel quel si inconnu). */
export function storeDisplayName(id: string): string {
  return isStoreId(id) ? STORES_INFO[id].name : id;
}

/** Nombre d'enseignes comparées (textes « dans 12 enseignes »). */
export const STORE_COUNT = STORE_IDS.length;
