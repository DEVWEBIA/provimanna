import { describe, expect, it } from 'vitest';
import {
  regionOf,
  STORE_COUNT,
  STORE_IDS,
  STORES_INFO,
  isStoreId,
  storeDisplayName,
  storesForRegion,
} from './stores.ts';

describe('enseignes', () => {
  it('13 enseignes, dont Picard et Grand Frais en assortiment partiel', () => {
    expect(STORE_IDS).toHaveLength(13);
    expect(STORE_COUNT).toBe(13);
    expect(STORE_IDS.filter((id) => STORES_INFO[id].partialAssortment)).toEqual(['grand-frais', 'picard']);
  });

  it('chaque fiche reprend son identifiant et des initiales sur 2 lettres', () => {
    for (const id of STORE_IDS) {
      expect(STORES_INFO[id].id).toBe(id);
      expect(STORES_INFO[id].initials).toMatch(/^[A-Z]{2}$/);
      expect(STORES_INFO[id].regions.length).toBeGreaterThan(0);
    }
  });

  it('région du code postal et enseignes présentes', () => {
    expect(regionOf('97400')).toBe('outre_mer');
    expect(regionOf('97200')).toBe('outre_mer');
    expect(regionOf('69003')).toBe('metropole');
    expect(regionOf('')).toBe('metropole');
    expect(regionOf(null)).toBe('metropole');
    expect(storesForRegion('outre_mer')).toEqual(['leclerc', 'super-u', 'intermarche', 'carrefour']);
    expect(storesForRegion('metropole')).toHaveLength(13);
  });

  it('noms affichés et garde de type', () => {
    expect(storeDisplayName('super-u')).toBe('Super U');
    expect(storeDisplayName('inconnue')).toBe('inconnue');
    expect(isStoreId('match')).toBe(true);
    expect(isStoreId('casino')).toBe(false);
  });
});
