import { describe, expect, it } from 'vitest';
import { MAIN_STORE_IDS, STORE_IDS, STORES_INFO, isStoreId, storeDisplayName } from './stores.ts';

describe('enseignes', () => {
  it('12 enseignes, dont Picard et Grand Frais en assortiment partiel', () => {
    expect(STORE_IDS).toHaveLength(12);
    expect(MAIN_STORE_IDS).toHaveLength(10);
    expect(MAIN_STORE_IDS).not.toContain('picard');
    expect(MAIN_STORE_IDS).not.toContain('grand-frais');
  });

  it('chaque fiche reprend son identifiant et des initiales sur 2 lettres', () => {
    for (const id of STORE_IDS) {
      expect(STORES_INFO[id].id).toBe(id);
      expect(STORES_INFO[id].initials).toMatch(/^[A-Z]{2}$/);
    }
  });

  it('noms affichés et garde de type', () => {
    expect(storeDisplayName('super-u')).toBe('Super U');
    expect(storeDisplayName('inconnue')).toBe('inconnue');
    expect(isStoreId('netto')).toBe(true);
    expect(isStoreId('casino')).toBe(false);
  });
});
