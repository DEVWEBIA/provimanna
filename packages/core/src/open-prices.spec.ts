import { describe, expect, it } from 'vitest';
import { mapOpenPrice, openPriceIndex, type OpenPrice } from './open-prices.ts';

const index = openPriceIndex([
  { id: 'potimarron', ean: null, off_category: 'en:pumpkins', unit_kg: 1.2 },
  { id: 'persil', ean: null, off_category: 'en:parsley', unit_kg: null },
  { id: 'endives', ean: null, off_category: 'en:endives', unit_kg: 1 },
  { id: 'creme', ean: '3250390000001', off_category: null, unit_kg: null },
]);
const base: OpenPrice = {
  id: 42,
  price: 1.5,
  currency: 'EUR',
  date: '2026-11-08',
  product_code: null,
  category_tag: 'en:pumpkins',
  price_per: 'KILOGRAM',
  price_is_discounted: false,
  location: { osm_brand: 'Carrefour Market', osm_name: 'Carrefour Market Lyon', osm_address_country_code: 'FR' },
};

describe('import Open Prices', () => {
  it('ramène un prix au kilo à l’unité de vente (potimarron ≈ 1,2 kg)', () => {
    expect(mapOpenPrice(base, index)).toEqual({
      status: 'import',
      productId: 'potimarron',
      storeId: 'carrefour',
      cents: 180,
      observedAt: '2026-11-08',
      externalId: 'op:42',
    });
  });
  it('rattache un produit emballé par son code-barres', () => {
    const m = mapOpenPrice({ ...base, product_code: '3250390000001', category_tag: null, price_per: null, price: 0.89 }, index);
    expect(m).toMatchObject({ status: 'import', productId: 'creme', cents: 89 });
  });
  it('n’accepte un prix à la pièce que pour un produit vendu à la pièce', () => {
    expect(mapOpenPrice({ ...base, category_tag: 'en:parsley', price_per: 'UNIT', price: 0.79 }, index)).toMatchObject({
      status: 'import',
      cents: 79,
    });
    expect(mapOpenPrice({ ...base, category_tag: 'en:endives', price_per: 'UNIT' }, index)).toEqual({
      status: 'unmatched',
      reason: 'unite',
    });
  });
  it('écarte l’étranger, les autres devises et les promotions', () => {
    const de = { ...base, location: { ...base.location!, osm_address_country_code: 'DE' } };
    expect(mapOpenPrice(de, index)).toEqual({ status: 'skip', reason: 'pays' });
    expect(mapOpenPrice({ ...base, currency: 'CHF' }, index)).toEqual({ status: 'skip', reason: 'devise' });
    expect(mapOpenPrice({ ...base, price_is_discounted: true }, index)).toEqual({ status: 'skip', reason: 'promo' });
  });
  it('signale enseigne ou produit inconnus', () => {
    const shop = { ...base, location: { ...base.location!, osm_brand: 'Épicerie du coin', osm_name: null } };
    expect(mapOpenPrice(shop, index)).toEqual({ status: 'unmatched', reason: 'enseigne' });
    expect(mapOpenPrice({ ...base, category_tag: 'en:kiwis' }, index)).toEqual({ status: 'unmatched', reason: 'produit' });
  });
});
