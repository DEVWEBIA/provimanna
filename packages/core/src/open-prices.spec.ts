import { describe, expect, it } from 'vitest';
import {
  mapOpenPrice,
  openPriceIndex,
  packageKg,
  type OpenPrice,
  type OpenPriceProduct,
} from './open-prices.ts';

const index = openPriceIndex([
  { id: 'potimarron', ean: null, off_category: 'en:pumpkins', unit_kg: 1.2 },
  { id: 'persil', ean: null, off_category: 'en:parsley', unit_kg: null },
  { id: 'endives', ean: null, off_category: 'en:endives', unit_kg: 1 },
  { id: 'creme', ean: '3250390000001', off_category: null, unit_kg: null },
  { id: 'penne', ean: null, off_category: 'en:penne', unit_kg: 0.5, aisle_id: 'epicerie' },
  { id: 'lait', ean: null, off_category: 'en:semi-skimmed-milks', unit_kg: 1, aisle_id: 'cremerie' },
  { id: 'champignons', ean: null, off_category: 'en:mushrooms', unit_kg: 0.5, aisle_id: 'fruits_legumes' },
  { id: 'lardons', ean: null, off_category: 'en:lardons', unit_kg: 0.2, aisle_id: 'viandes_poissons' },
  {
    id: 'lardons_fumes',
    ean: null,
    off_category: 'en:smoked-lardons',
    unit_kg: 0.2,
    aisle_id: 'viandes_poissons',
  },
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
  location: {
    osm_brand: 'Carrefour Market',
    osm_name: 'Carrefour Market Lyon',
    osm_address_country_code: 'FR',
  },
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
    const m = mapOpenPrice(
      { ...base, product_code: '3250390000001', category_tag: null, price_per: null, price: 0.89 },
      index,
    );
    expect(m).toMatchObject({ status: 'import', productId: 'creme', cents: 89 });
  });
  it('n’accepte un prix à la pièce que pour un produit vendu à la pièce', () => {
    expect(
      mapOpenPrice({ ...base, category_tag: 'en:parsley', price_per: 'UNIT', price: 0.79 }, index),
    ).toMatchObject({
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
    expect(mapOpenPrice({ ...base, price_is_discounted: true }, index)).toEqual({
      status: 'skip',
      reason: 'promo',
    });
  });
  it('signale enseigne ou produit inconnus', () => {
    const shop = { ...base, location: { ...base.location!, osm_brand: 'Épicerie du coin', osm_name: null } };
    expect(mapOpenPrice(shop, index)).toEqual({ status: 'unmatched', reason: 'enseigne' });
    expect(mapOpenPrice({ ...base, category_tag: 'en:kiwis' }, index)).toEqual({
      status: 'unmatched',
      reason: 'produit',
    });
  });

  describe('produit emballé au code-barres inconnu', () => {
    const packed = (product: OpenPriceProduct, extra: Partial<OpenPrice> = {}): OpenPrice => ({
      ...base,
      product_code: '3000000000001',
      category_tag: null,
      price_per: null,
      price: 1.2,
      product,
      ...extra,
    });
    const penne = {
      categories_tags: ['en:plant-based-foods', 'en:pastas', 'en:dry-pastas', 'en:penne'],
      product_quantity: 1000,
      product_quantity_unit: 'g',
    };
    it('le rattache par sa catégorie et ramène le prix à notre unité (1 kg à 1,20 € → 500 g à 0,60 €)', () => {
      expect(mapOpenPrice(packed(penne), index)).toMatchObject({
        status: 'import',
        productId: 'penne',
        cents: 60,
      });
    });
    it('prend la catégorie la plus précise de la fiche', () => {
      const tags = ['en:meats', 'en:lardons', 'en:smoked-lardons'];
      const p = packed(
        { categories_tags: tags, product_quantity: 200, product_quantity_unit: 'g' },
        { price: 1.5 },
      );
      expect(mapOpenPrice(p, index)).toMatchObject({
        status: 'import',
        productId: 'lardons_fumes',
        cents: 150,
      });
    });
    it('convertit les volumes (25 cl → litre) et refuse un paquet trop éloigné de notre unité', () => {
      expect(packageKg({ product_quantity: 25, product_quantity_unit: 'cl' })).toBe(0.25);
      expect(packageKg({ product_quantity: '1,5', product_quantity_unit: 'kg' })).toBeNull();
      const small = {
        categories_tags: ['en:milks', 'en:semi-skimmed-milks'],
        product_quantity: 25,
        product_quantity_unit: 'cl',
      };
      expect(mapOpenPrice(packed(small), index)).toEqual({ status: 'unmatched', reason: 'unite' });
      expect(mapOpenPrice(packed({ ...penne, product_quantity: null }), index)).toEqual({
        status: 'unmatched',
        reason: 'unite',
      });
    });
    it('utilise le prix au kilo tel quel quand il est donné', () => {
      const p = packed({ ...penne, product_quantity: null }, { price_per: 'KILOGRAM', price: 2 });
      expect(mapOpenPrice(p, index)).toMatchObject({ status: 'import', cents: 100 });
    });
    it('ne compare les fruits et légumes qu’en vrac, et écarte plats préparés et bio', () => {
      const canned = {
        categories_tags: ['en:canned-foods', 'en:mushrooms'],
        product_quantity: 400,
        product_quantity_unit: 'g',
      };
      expect(mapOpenPrice(packed(canned), index)).toEqual({ status: 'unmatched', reason: 'produit' });
      const meal = { ...penne, categories_tags: ['en:meals', ...penne.categories_tags] };
      expect(mapOpenPrice(packed(meal), index)).toEqual({ status: 'unmatched', reason: 'produit' });
      expect(mapOpenPrice(packed({ ...penne, labels_tags: ['en:organic'] }), index)).toEqual({
        status: 'skip',
        reason: 'bio',
      });
      expect(mapOpenPrice({ ...base, labels_tags: ['en:organic'] }, index)).toEqual({
        status: 'skip',
        reason: 'bio',
      });
    });
  });
});
