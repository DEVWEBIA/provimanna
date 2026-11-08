import { describe, expect, it } from 'vitest';
import {
  averagePriceAgeDays,
  cheaperProductCount,
  compareProducts,
  listItems,
  type PriceObservation,
  type ShoppingLine,
} from './pricing.ts';

const NOW = new Date('2026-11-14T12:00:00Z');
const d = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();
const obs = (productId: string, storeId: 'lidl' | 'auchan', cents: number, days = 1): PriceObservation => ({
  productId,
  storeId,
  cents,
  observedAt: d(days),
  source: 'open_prices',
});

const LINES: ShoppingLine[] = [
  { productId: 'pates', units: 1.5, pantry: false },
  { productId: 'creme', units: 1, pantry: false },
  { productId: 'huile', units: 0.05, pantry: true },
  { productId: 'feta', units: 0.5, pantry: false },
];
const OBS = [
  obs('pates', 'lidl', 85),
  obs('pates', 'auchan', 109),
  obs('creme', 'lidl', 89),
  obs('creme', 'auchan', 89),
  obs('huile', 'lidl', 399),
  obs('huile', 'auchan', 499),
  obs('feta', 'lidl', 299, 12),
  obs('feta', 'auchan', 225, 3),
];

describe('listItems', () => {
  it('arrondit au paquet entier, exclut le placard, signale les estimations', () => {
    expect(listItems(LINES, 'lidl', OBS, NOW)).toEqual([
      { productId: 'pates', packs: 2, cents: 170, estimate: false },
      { productId: 'creme', packs: 1, cents: 89, estimate: false },
      { productId: 'feta', packs: 1, cents: 299, estimate: true },
    ]);
  });
  it('prix inconnu → cents null', () => {
    expect(listItems([{ productId: 'x', units: 1, pantry: false }], 'lidl', OBS, NOW)[0]?.cents).toBeNull();
  });
});

describe('compareProducts', () => {
  it('compare les prix unitaires, trie par écart, compte moins chers / plus chers / égaux', () => {
    const c = compareProducts(LINES, 'auchan', 'lidl', OBS, NOW);
    expect(c.rows.map((r) => [r.productId, r.diffCents])).toEqual([
      ['feta', 74],
      ['pates', -24],
      ['creme', 0],
    ]);
    expect([c.cheaper, c.pricier, c.equal]).toEqual([1, 1, 1]);
    expect(cheaperProductCount(LINES, 'lidl', 'auchan', OBS, NOW)).toBe(1);
    expect(cheaperProductCount(LINES, 'lidl', 'lidl', OBS, NOW)).toBe(0);
  });
});

describe('averagePriceAgeDays', () => {
  it('moyenne des âges des prix utilisés', () => {
    expect(averagePriceAgeDays(LINES, 'lidl', OBS, NOW)).toBe(4); // (1 + 1 + 1 + 12) / 4 = 3,75
    expect(averagePriceAgeDays([], 'lidl', OBS, NOW)).toBeNull();
  });
});
