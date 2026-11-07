import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  medianCents,
  resolvePrice,
  isAberrant,
  reliabilityFromRatio,
  buildShoppingLines,
  planCostInStore,
  compareStores,
  costPerServing,
  formatEuro,
  type PriceObservation,
  type Recipe,
} from './pricing.ts';

const NOW = new Date('2026-11-14T12:00:00Z');
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000).toISOString();

test('medianCents : impair, pair, erreur si vide', () => {
  assert.equal(medianCents([300, 100, 200]), 200);
  assert.equal(medianCents([100, 200, 300, 400]), 250);
  assert.throws(() => medianCents([]));
});

test('resolvePrice : médiane fraîche, repli estimation, puis null', () => {
  const obs: PriceObservation[] = [
    { productId: 'feta', storeId: 'lidl', cents: 225, observedAt: daysAgo(1), source: 'ticket' },
    { productId: 'feta', storeId: 'lidl', cents: 229, observedAt: daysAgo(3), source: 'open_prices' },
    { productId: 'feta', storeId: 'lidl', cents: 400, observedAt: daysAgo(20), source: 'ticket' },
    { productId: 'feta', storeId: 'auchan', cents: 275, observedAt: daysAgo(15), source: 'ticket' },
  ];
  assert.deepEqual(resolvePrice(obs, 'feta', 'lidl', NOW), {
    cents: 227,
    fresh: true,
    observedAt: daysAgo(1),
  });
  assert.deepEqual(resolvePrice(obs, 'feta', 'auchan', NOW), {
    cents: 275,
    fresh: false,
    observedAt: daysAgo(15),
  });
  assert.equal(resolvePrice(obs, 'feta', 'aldi', NOW), null);
});

test('isAberrant : seuil de 40 %', () => {
  assert.equal(isAberrant(329, 225), true); // +46 % (cas de la maquette BO Prix)
  assert.equal(isAberrant(289, 225), false); // +28 %
  assert.equal(isAberrant(45, 129), true); // −65 %
});

test('reliabilityFromRatio', () => {
  assert.equal(reliabilityFromRatio(0.95), 'high');
  assert.equal(reliabilityFromRatio(0.7), 'medium');
  assert.equal(reliabilityFromRatio(0.3), 'low');
});

const veloute: Recipe = {
  id: 'veloute',
  servings: 4,
  ingredients: [
    { productId: 'potimarron', units: 1 },
    { productId: 'oignons', units: 0.15 },
    { productId: 'huile', units: 0.02, pantry: true },
  ],
};
const recipes = new Map([[veloute.id, veloute]]);

test('buildShoppingLines : agrège et met à l’échelle', () => {
  const lines = buildShoppingLines(
    [
      { recipeId: 'veloute', servings: 4 },
      { recipeId: 'veloute', servings: 2 },
    ],
    recipes,
  );
  const poti = lines.find((l) => l.productId === 'potimarron')!;
  assert.equal(poti.units, 1.5);
  assert.equal(lines.find((l) => l.productId === 'huile')!.pantry, true);
  assert.throws(() => buildShoppingLines([{ recipeId: 'inconnue', servings: 4 }], recipes));
});

test('planCostInStore et compareStores', () => {
  const obs: PriceObservation[] = [
    { productId: 'potimarron', storeId: 'lidl', cents: 149, observedAt: daysAgo(1), source: 'open_prices' },
    { productId: 'potimarron', storeId: 'auchan', cents: 182, observedAt: daysAgo(2), source: 'ticket' },
    { productId: 'oignons', storeId: 'lidl', cents: 100, observedAt: daysAgo(1), source: 'open_prices' },
    { productId: 'oignons', storeId: 'auchan', cents: 127, observedAt: daysAgo(12), source: 'ticket' },
    { productId: 'huile', storeId: 'lidl', cents: 500, observedAt: daysAgo(1), source: 'open_prices' },
    { productId: 'huile', storeId: 'auchan', cents: 500, observedAt: daysAgo(1), source: 'open_prices' },
  ];
  const lines = buildShoppingLines([{ recipeId: 'veloute', servings: 4 }], recipes);

  const lidl = planCostInStore(lines, 'lidl', obs, NOW);
  assert.equal(lidl.cents, 149 + 15 + 10);
  assert.equal(lidl.reliability, 'high');

  const auchan = planCostInStore(lines, 'auchan', obs, NOW);
  assert.equal(auchan.cents, Math.round(182 + 127 * 0.15 + 10));
  assert.equal(auchan.reliability, 'medium'); // 2 lignes fraîches sur 3

  const aldi = planCostInStore(lines, 'aldi', obs, NOW);
  assert.deepEqual(aldi.missing, ['potimarron', 'oignons', 'huile']);
  assert.equal(aldi.reliability, 'low');

  const cmp = compareStores(lines, ['auchan', 'lidl'], 'auchan', obs, NOW);
  assert.equal(cmp.cheapest, 'lidl');
  assert.equal(cmp.savingCents, auchan.cents - lidl.cents);
  assert.equal(cmp.totals[0]!.storeId, 'lidl');
});

test('costPerServing et formatEuro', () => {
  assert.equal(costPerServing(406, 4), 102);
  assert.throws(() => costPerServing(406, 0));
  assert.equal(formatEuro(7160), '71,60 €');
  assert.equal(formatEuro(102), '1,02 €');
});
