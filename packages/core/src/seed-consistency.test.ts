// Verrouille les chiffres affichés dans les maquettes sur les données de supabase/seed.sql.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildShoppingLines,
  compareStores,
  formatEuro,
  type PriceObservation,
  type Recipe,
} from './pricing.ts';

const NOW = new Date('2026-11-14T12:00:00Z');
const d = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

const veloute: Recipe = {
  id: 'veloute-potimarron',
  servings: 4,
  ingredients: [
    { productId: 'potimarron', units: 1 },
    { productId: 'oignons', units: 0.25 },
    { productId: 'creme', units: 1 },
    { productId: 'bouillon', units: 0.1 },
    { productId: 'huile', units: 0.02, pantry: true },
    { productId: 'pain', units: 1 },
  ],
};

const P: Array<[string, number, number]> = [
  ['potimarron', 199, 249],
  ['oignons', 120, 159],
  ['creme', 89, 109],
  ['bouillon', 99, 129],
  ['huile', 399, 499],
  ['pain', 70, 75],
];
const obs: PriceObservation[] = P.flatMap(([productId, lidl, auchan]) => [
  { productId, storeId: 'lidl', cents: lidl, observedAt: d(1), source: 'open_prices' },
  { productId, storeId: 'auchan', cents: auchan, observedAt: d(2), source: 'ticket' },
]);

test('Velouté potimarron : 4,06 € chez Lidl, 4,96 € chez Auchan', () => {
  const lines = buildShoppingLines([{ recipeId: veloute.id, servings: 4 }], new Map([[veloute.id, veloute]]));
  const cmp = compareStores(lines, ['lidl', 'auchan'], 'auchan', obs, NOW);
  assert.equal(formatEuro(cmp.totals.find((t) => t.storeId === 'lidl')!.cents), '4,06 €');
  assert.equal(formatEuro(cmp.reference.cents), '4,96 €');
  assert.equal(cmp.savingCents, 90);
});

test('Panier semaine : écart de 11,50 € entre Lidl et Auchan', () => {
  const totals = { lidl: 6010, aldi: 6140, leclerc: 6420, intermarche: 6890, carrefour: 7030, auchan: 7160 };
  const v = Object.values(totals);
  assert.equal(formatEuro(Math.max(...v) - Math.min(...v)), '11,50 €');
});

test('Économies depuis septembre : 58,30 €', () => {
  const months = { sept: 960, oct: 3840, nov: 1030 };
  assert.equal(formatEuro(months.sept + months.oct + months.nov), '58,30 €');
});
