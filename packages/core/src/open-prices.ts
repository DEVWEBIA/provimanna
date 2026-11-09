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
  location: {
    osm_brand: string | null;
    osm_name: string | null;
    osm_address_country_code: string | null;
  } | null;
}

export interface CatalogueEntry {
  id: string;
  /** Poids d'une unité de vente en kg ; null = vendu à la pièce. */
  unitKg: number | null;
}

export interface OpenPriceIndex {
  byEan: Map<string, CatalogueEntry>;
  byCategory: Map<string, CatalogueEntry>;
}

export type MappedOpenPrice =
  | { status: 'import'; productId: string; storeId: StoreId; cents: number; observedAt: string; externalId: string }
  | { status: 'skip'; reason: 'pays' | 'devise' | 'promo' | 'prix' }
  | { status: 'unmatched'; reason: 'enseigne' | 'produit' | 'unite' };

export const openPriceExternalId = (id: number) => `op:${id}`;

/**
 * Conversion d'un prix Open Prices : France et euro seulement, hors promotions (elles fausseraient les médianes),
 * enseigne reconnue, produit rattaché par code-barres ou par catégorie (vrac), prix au kilo ramené à l'unité de vente.
 */
export function mapOpenPrice(p: OpenPrice, index: OpenPriceIndex): MappedOpenPrice {
  if (p.location?.osm_address_country_code !== 'FR') return { status: 'skip', reason: 'pays' };
  if (p.currency !== 'EUR') return { status: 'skip', reason: 'devise' };
  if (p.price_is_discounted) return { status: 'skip', reason: 'promo' };
  if (!(p.price > 0)) return { status: 'skip', reason: 'prix' };
  const storeId = detectStoreId(p.location.osm_brand) ?? detectStoreId(p.location.osm_name);
  if (!storeId) return { status: 'unmatched', reason: 'enseigne' };

  let entry: CatalogueEntry | undefined;
  let cents: number | null = null;
  if (p.product_code && (entry = index.byEan.get(p.product_code))) {
    cents = Math.round(p.price * 100);
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

/** Index du catalogue pour l'import (produits avec code-barres ou catégorie de vrac). */
export function openPriceIndex(
  products: { id: string; ean: string | null; off_category: string | null; unit_kg: number | null }[],
): OpenPriceIndex {
  const byEan = new Map<string, CatalogueEntry>();
  const byCategory = new Map<string, CatalogueEntry>();
  for (const p of products) {
    const entry = { id: p.id, unitKg: p.unit_kg === null ? null : Number(p.unit_kg) };
    if (p.ean) byEan.set(p.ean, entry);
    if (p.off_category) byCategory.set(p.off_category, entry);
  }
  return { byEan, byCategory };
}
