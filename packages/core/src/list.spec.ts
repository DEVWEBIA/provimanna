import { describe, expect, it } from 'vitest';
import {
  averagePriceAgeDays,
  ingredientCosts,
  percentVsAverage,
  productPriceGaps,
  totalsByGroup,
  recipeStoreTotals,
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

describe('coûts d’une recette', () => {
  const recipe = {
    id: 'r',
    servings: 4,
    ingredients: [
      { productId: 'pates', units: 1 },
      { productId: 'huile', units: 0.05, pantry: true },
    ],
  };
  it('par enseigne, à l’échelle des parts, triés', () => {
    const t = recipeStoreTotals(recipe, 8, ['auchan', 'lidl'], OBS, NOW);
    expect(t.map((x) => [x.storeId, x.cents])).toEqual([
      ['lidl', 210], // (85 + 399 × 0,05) × 2
      ['auchan', 268],
    ]);
  });
  it('par ingrédient (prorata)', () => {
    expect(ingredientCosts(recipe, 4, 'lidl', OBS, NOW).map((c) => c.cents)).toEqual([85, 20]);
  });
});

describe('observatoire', () => {
  it('totaux par rayon et par enseigne', () => {
    const g = totalsByGroup(
      LINES,
      (id) => (id === 'pates' || id === 'huile' ? 'epicerie' : 'cremerie'),
      ['lidl', 'auchan'],
      OBS,
      NOW,
    );
    expect(g.get('epicerie')?.map((t) => t.cents)).toEqual([147, 188]); // 85 × 1,5 + 399 × 0,05 = 147,45
    expect(g.get('cremerie')?.map((t) => t.cents)).toEqual([239, 202]);
  });
  it('écart à la moyenne', () => {
    expect(percentVsAverage(90, [90, 100, 110])).toBe(-10);
    expect(percentVsAverage(0, [])).toBe(0);
  });
});

describe('productPriceGaps', () => {
  it('écart au prix moyen, du plus avantageux au moins avantageux', () => {
    expect(
      productPriceGaps(LINES, 'lidl', ['lidl', 'auchan'], OBS, NOW).map((g) => [g.productId, g.diffCents]),
    ).toEqual([
      ['pates', -12],
      ['creme', 0],
      ['feta', 37],
    ]);
  });
});
