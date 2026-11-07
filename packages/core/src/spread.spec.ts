import { describe, expect, it } from 'vitest';
import { priceSpread, scaleCents } from './index.ts';

describe('priceSpread', () => {
  it('panier de la semaine : 11,50 € d’écart, +19 % entre Lidl et Auchan', () => {
    expect(priceSpread([6010, 6140, 6420, 6890, 7030, 7160])).toEqual({
      minCents: 6010,
      maxCents: 7160,
      gapCents: 1150,
      overPercent: 19,
    });
  });
  it('refuse une liste vide', () => {
    expect(() => priceSpread([])).toThrow();
  });
});

describe('scaleCents', () => {
  it('arrondit au centime', () => {
    expect(scaleCents(6010, 0.32)).toBe(1923);
    expect(scaleCents(7160, 1.42)).toBe(10167);
  });
  it('refuse un facteur négatif', () => {
    expect(() => scaleCents(100, -1)).toThrow();
  });
});
