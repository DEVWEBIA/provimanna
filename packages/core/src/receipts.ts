/**
 * Tickets de caisse — logique pure : rapprochement des lignes lues avec les produits du catalogue,
 * lignes à ignorer, enseigne, récompense. Partagé par le web et le back-office (l'Edge Function ne fait que lire).
 */
import type { StoreId } from './stores.ts';

/** Une ligne est rattachée automatiquement à un produit au-delà de ce score (docs/08, lot 10). */
export const RECEIPT_MATCH_THRESHOLD = 0.85;
/** Jours de Premium offerts par ticket validé. */
export const RECEIPT_REWARD_DAYS = 3;
/** Plafond de jours gagnés par mois avec les tickets (maquette AppTicket). */
export const RECEIPT_REWARD_MONTHLY_CAP = 14;
/** Un ticket plus ancien ne met plus les prix à jour (maquette : « ticket de moins de 7 jours »). */
export const RECEIPT_MAX_AGE_DAYS = 7;

/** Abréviations fréquentes des tickets français → mot complet (après normalisation). */
const ABBREVIATIONS: Record<string, string> = {
  leg: 'legumes',
  bouill: 'bouillon',
  liq: 'liquide',
  fr: 'frais',
  pdt: 'pommes de terre',
  bio: 'bio',
  ble: 'ble',
  choc: 'chocolat',
  fromg: 'fromage',
  yaourt: 'yaourt',
  yt: 'yaourt',
  oeuf: 'oeufs',
  tom: 'tomates',
  carot: 'carottes',
  cour: 'courgettes',
  champ: 'champignons',
  poul: 'poulet',
  jbn: 'jambon',
  emmen: 'emmental',
  moz: 'mozzarella',
  past: 'pates',
  sauc: 'sauce',
  conc: 'concentre',
  vinaig: 'vinaigre',
  hle: 'huile',
  ol: 'olive',
  surg: 'surgeles',
};

/** Mots sans valeur pour le rapprochement (unités, marques distributeur génériques, liaisons). */
const STOP_WORDS = new Set([
  'de',
  'du',
  'des',
  'la',
  'le',
  'les',
  'au',
  'aux',
  'et',
  'a',
  'en',
  'kg',
  'g',
  'gr',
  'cl',
  'l',
  'ml',
  'x',
  'pce',
  'pc',
  'piece',
  'u',
  'lot',
]);

/** Minuscules, sans accents ni ponctuation. */
export function normalizeLabel(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim();
}

/** Mots utiles d'un libellé : abréviations développées, unités et liaisons retirées, chiffres seuls retirés. */
export function labelTokens(raw: string): string[] {
  return normalizeLabel(raw)
    .split(' ')
    .flatMap((w) => (ABBREVIATIONS[w] ?? w).split(' '))
    .map((w) => w.replace(/s$/, ''))
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w) && !/^\d+$/.test(w) && !/^\d+(g|kg|cl|ml|l|x)$/.test(w) && !/^x\d+$/.test(w));
}

/** Deux mots se correspondent s'ils sont égaux ou si l'un est le début de l'autre (au moins 4 lettres). */
function tokenMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 4 && long.startsWith(short);
}

/**
 * Ressemblance entre une ligne de ticket et un produit (0 à 1) : coefficient de Dice sur les mots utiles,
 * un mot abrégé comptant comme le mot complet.
 */
export function labelSimilarity(receiptLabel: string, productLabel: string): number {
  const a = labelTokens(receiptLabel);
  const b = labelTokens(productLabel);
  if (a.length === 0 || b.length === 0) return 0;
  const used = new Set<number>();
  let common = 0;
  for (const t of a) {
    const j = b.findIndex((u, k) => !used.has(k) && tokenMatch(t, u));
    if (j >= 0) {
      used.add(j);
      common += 1;
    }
  }
  return (2 * common) / (a.length + b.length);
}

export interface CatalogueProduct {
  id: string;
  name: string;
}

export interface LineMatch {
  productId: string | null;
  confidence: number;
  /** Rattachement automatique (score ≥ seuil) ; sinon la ligne passe en modération. */
  auto: boolean;
}

/**
 * Meilleur produit pour une ligne de ticket. `readable` : libellé développé proposé par le lecteur
 * (ex. « Bouillon de légumes × 10 » pour « BOUILL LEG X10 »), pris en compte s'il ressemble davantage.
 */
export function matchReceiptLine(
  raw: string,
  products: CatalogueProduct[],
  readable?: string | null,
): LineMatch {
  let best: { id: string; score: number } | null = null;
  for (const p of products) {
    const score = Math.max(labelSimilarity(raw, p.name), readable ? labelSimilarity(readable, p.name) : 0);
    if (!best || score > best.score) best = { id: p.id, score };
  }
  if (!best || best.score === 0) return { productId: null, confidence: 0, auto: false };
  const confidence = Math.round(best.score * 100) / 100;
  return { productId: best.id, confidence, auto: confidence >= RECEIPT_MATCH_THRESHOLD };
}

const IGNORED_LINE = /^(total|sous total|ss total|tva|cb|carte|especes|rendu|monnaie|sac|cabas|remise|fidelite|avantage|points|ticket|merci|caisse|n ?°|tel|siret)\b/;

/** Lignes qui ne sont pas des produits (totaux, paiement, sacs, fidélité) : jamais transformées en prix. */
export function isIgnoredReceiptLine(raw: string): boolean {
  const n = normalizeLabel(raw);
  return n.length === 0 || IGNORED_LINE.test(n);
}

/** Remise ou promotion lue sur une ligne : le prix doit être vérifié par l'équipe (maquette « PROMO -30% COCO »). */
export function isPromoLine(raw: string): boolean {
  return /(promo|remise|-\s?\d+\s?%|offert|lot de)/.test(normalizeLabel(raw));
}

/** Jours de Premium à offrir pour un ticket validé, compte tenu de ceux déjà gagnés ce mois-ci. */
export function receiptRewardDays(alreadyThisMonth: number): number {
  return Math.max(0, Math.min(RECEIPT_REWARD_DAYS, RECEIPT_REWARD_MONTHLY_CAP - alreadyThisMonth));
}

/** Ticket assez récent pour mettre les prix à jour. */
export function isRecentReceipt(purchasedAt: string, now: Date): boolean {
  const age = (now.getTime() - Date.parse(purchasedAt)) / 86_400_000;
  return age >= -1 && age <= RECEIPT_MAX_AGE_DAYS;
}

/** En-têtes de ticket → enseigne (formats de magasin compris : Carrefour Market, Hyper U, Intermarché Express…). */
const STORE_ALIASES: [RegExp, StoreId][] = [
  [/\blidl\b/, 'lidl'],
  [/\baldi\b/, 'aldi'],
  [/\bnetto\b/, 'netto'],
  [/\bleclerc\b/, 'leclerc'],
  [/\b(super|hyper|marche) ?u\b|\bu express\b|\bsysteme u\b/, 'super-u'],
  [/\bintermarche\b/, 'intermarche'],
  [/\bmatch\b/, 'match'],
  [/\bcarrefour\b/, 'carrefour'],
  [/\bauchan\b/, 'auchan'],
  [/\bgrand frais\b/, 'grand-frais'],
  [/\bpicard\b/, 'picard'],
  [/\bfranprix\b/, 'franprix'],
  [/\bmonoprix\b/, 'monoprix'],
];

/** Enseigne reconnue dans l'en-tête du ticket, null si aucune. */
export function detectStoreId(storeName: string | null | undefined): StoreId | null {
  if (!storeName) return null;
  const n = normalizeLabel(storeName);
  return STORE_ALIASES.find(([re]) => re.test(n))?.[1] ?? null;
}
