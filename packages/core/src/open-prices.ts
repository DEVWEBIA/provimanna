/**
 * Import Open Prices — logique pure : un prix de la base ouverte devient (ou non) un relevé de notre catalogue.
 * Données sous licence ODbL 1.0, à créditer « © Open Food Facts contributors ».
 */
import { detectStoreId } from './receipts.ts';
import type { StoreId } from './stores.ts';

export const OPEN_PRICES_CREDIT = '© Open Food Facts contributors (Open Prices, ODbL)';

/** Champs utilisés d'un prix renvoyé par GET /api/v1/prices. */
export interface OpenPrice {
  id: number;
  price: number;
  currency: string;
  date: string;
  product_code: string | null;
  category_tag: string | null;
  price_per: 'KILOGRAM' | 'UNIT' | null;
  price_is_discounted: boolean;
  /** Labels saisis avec le prix (ex. `en:organic`). */
  labels_tags?: string[] | null;
  /** Fiche Open Food Facts jointe aux prix avec code-barres. */
  product?: OpenPriceProduct | null;
  location: {
    osm_brand: string | null;
    osm_name: string | null;
    osm_address_country_code: string | null;
  } | null;
}

/** Champs utilisés de la fiche produit (catégories avec leurs parents, du plus général au plus précis). */
export interface OpenPriceProduct {
  categories_tags?: string[] | null;
  labels_tags?: string[] | null;
  product_quantity?: number | string | null;
  product_quantity_unit?: string | null;
}

export interface CatalogueEntry {
  id: string;
  /** Poids (ou volume en litres) d'une unité de vente en kg ; null = vendu à la pièce. */
  unitKg: number | null;
  /**
   * Rattachable par la catégorie de sa fiche quand le code-barres est inconnu (produits emballés).
   * Faux pour les fruits et légumes : on ne les compare qu'en vrac (sinon une conserve de champignons
   * passerait pour des champignons frais).
   */
  packaged: boolean;
}

export interface OpenPriceIndex {
  byEan: Map<string, CatalogueEntry>;
  byCategory: Map<string, CatalogueEntry>;
}

export type MappedOpenPrice =
  | {
      status: 'import';
      productId: string;
      storeId: StoreId;
      cents: number;
      observedAt: string;
      externalId: string;
    }
  | { status: 'skip'; reason: 'pays' | 'devise' | 'promo' | 'prix' | 'bio' }
  | { status: 'unmatched'; reason: 'enseigne' | 'produit' | 'unite' };

export const openPriceExternalId = (id: number) => `op:${id}`;

/** Écart de contenance toléré entre le paquet relevé et l'unité du catalogue (prix ramené au kilo). */
export const PACKAGE_SIZE_RATIO = 2.5;

/** Contenance d'une fiche en kg (ou en litres) ; null si absente ou dans une unité non pondérale. */
export function packageKg(product: OpenPriceProduct): number | null {
  const q = Number(product.product_quantity);
  if (!Number.isFinite(q) || q <= 0) return null;
  const factor = { g: 0.001, ml: 0.001, cl: 0.01, kg: 1, l: 1 }[
    (product.product_quantity_unit ?? '').toLowerCase()
  ];
  return factor ? q * factor : null;
}

/** Catégorie du catalogue la plus précise parmi celles de la fiche (Open Food Facts les liste du général au précis). */
function entryForProduct(product: OpenPriceProduct, index: OpenPriceIndex): CatalogueEntry | undefined {
  const tags = product.categories_tags ?? [];
  for (let i = tags.length - 1; i >= 0; i--) {
    const entry = index.byCategory.get(tags[i]!);
    if (entry) return entry.packaged ? entry : undefined;
  }
  return undefined;
}

/**
 * Conversion d'un prix Open Prices : France et euro seulement, hors promotions (elles fausseraient les médianes),
 * enseigne reconnue, produit rattaché par code-barres ou par catégorie (vrac), prix au kilo ramené à l'unité de vente.
 */
export function mapOpenPrice(p: OpenPrice, index: OpenPriceIndex): MappedOpenPrice {
  if (p.location?.osm_address_country_code !== 'FR') return { status: 'skip', reason: 'pays' };
  if (p.currency !== 'EUR') return { status: 'skip', reason: 'devise' };
  if (p.price_is_discounted) return { status: 'skip', reason: 'promo' };
  if (!(p.price > 0)) return { status: 'skip', reason: 'prix' };
  // Bio écarté : nos produits sont des références conventionnelles, il gonflerait les médianes.
  if ([...(p.labels_tags ?? []), ...(p.product?.labels_tags ?? [])].includes('en:organic')) {
    return { status: 'skip', reason: 'bio' };
  }
  const storeId = detectStoreId(p.location.osm_brand) ?? detectStoreId(p.location.osm_name);
  if (!storeId) return { status: 'unmatched', reason: 'enseigne' };

  let entry: CatalogueEntry | undefined;
  let cents: number | null = null;
  if (p.product_code && (entry = index.byEan.get(p.product_code))) {
    cents = Math.round(p.price * 100);
  } else if (p.product_code && p.product) {
    // Code-barres inconnu : rattachement par la catégorie de la fiche, prix ramené au kilo puis à notre unité.
    if ((p.product.categories_tags ?? []).includes('en:meals'))
      return { status: 'unmatched', reason: 'produit' };
    entry = entryForProduct(p.product, index);
    if (!entry) return { status: 'unmatched', reason: 'produit' };
    if (entry.unitKg === null) return { status: 'unmatched', reason: 'unite' };
    let perKg: number;
    if (p.price_per === 'KILOGRAM') perKg = p.price;
    else {
      const kg = packageKg(p.product);
      if (kg === null || kg < entry.unitKg / PACKAGE_SIZE_RATIO || kg > entry.unitKg * PACKAGE_SIZE_RATIO) {
        return { status: 'unmatched', reason: 'unite' };
      }
      perKg = p.price / kg;
    }
    cents = Math.round(perKg * entry.unitKg * 100);
  } else if (p.category_tag && (entry = index.byCategory.get(p.category_tag))) {
    if (p.price_per === 'KILOGRAM' && entry.unitKg) cents = Math.round(p.price * entry.unitKg * 100);
    else if (p.price_per === 'UNIT' && entry.unitKg === null) cents = Math.round(p.price * 100);
    else return { status: 'unmatched', reason: 'unite' };
  }
  if (!entry || cents === null) return { status: 'unmatched', reason: 'produit' };
  if (cents <= 0) return { status: 'skip', reason: 'prix' };
  return {
    status: 'import',
    productId: entry.id,
    storeId,
    cents,
    observedAt: p.date,
    externalId: openPriceExternalId(p.id),
  };
}

/** Index du catalogue pour l'import (produits avec code-barres ou catégorie Open Food Facts). */
export function openPriceIndex(
  products: {
    id: string;
    ean: string | null;
    off_category: string | null;
    unit_kg: number | null;
    aisle_id?: string | null;
  }[],
): OpenPriceIndex {
  const byEan = new Map<string, CatalogueEntry>();
  const byCategory = new Map<string, CatalogueEntry>();
  for (const p of products) {
    const entry = {
      id: p.id,
      unitKg: p.unit_kg === null ? null : Number(p.unit_kg),
      packaged: p.aisle_id !== 'fruits_legumes',
    };
    if (p.ean) byEan.set(p.ean, entry);
    if (p.off_category) byCategory.set(p.off_category, entry);
  }
  return { byEan, byCategory };
}
