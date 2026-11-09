import { describe, expect, it } from 'vitest';
import {
  detectStoreId,
  isIgnoredReceiptLine,
  isPromoLine,
  isRecentReceipt,
  labelSimilarity,
  matchReceiptLine,
  receiptRewardDays,
} from './receipts.ts';

const CATALOGUE = [
  { id: 'feta', name: 'Feta AOP' },
  { id: 'coco', name: 'Lait de coco' },
  { id: 'bouillon', name: 'Bouillon de légumes' },
  { id: 'potimarron', name: 'Potimarron' },
  { id: 'oeufs', name: 'Œufs' },
  { id: 'creme', name: 'Crème liquide 15 %' },
];

describe('rapprochement des lignes de ticket', () => {
  it('reconnaît les libellés de la maquette AppTicket', () => {
    expect(matchReceiptLine('POTIMARRON KG', CATALOGUE)).toMatchObject({ productId: 'potimarron', auto: true });
    expect(matchReceiptLine('FETA AOP 200G', CATALOGUE)).toMatchObject({ productId: 'feta', auto: true });
    expect(matchReceiptLine('LAIT COCO 40CL', CATALOGUE).productId).toBe('coco');
    expect(matchReceiptLine('OEUFS X12', CATALOGUE)).toMatchObject({ productId: 'oeufs', auto: true });
  });

  it('développe les abréviations (BOUILL LEG → bouillon de légumes)', () => {
    expect(labelSimilarity('BOUILL LEG X10', 'Bouillon de légumes')).toBe(1);
    expect(matchReceiptLine('CREME LIQ 15%', CATALOGUE).productId).toBe('creme');
  });

  it('utilise le libellé développé proposé par le lecteur s’il ressemble davantage', () => {
    const m = matchReceiptLine('LT CCO 40', CATALOGUE, 'Lait de coco 40 cl');
    expect(m).toMatchObject({ productId: 'coco', auto: true });
  });

  it('renvoie en modération une ligne trop éloignée', () => {
    const m = matchReceiptLine('LESSIVE LIQUIDE 3L', CATALOGUE);
    expect(m.auto).toBe(false);
    expect(m.confidence).toBeLessThan(0.85);
  });
});

describe('lignes particulières', () => {
  it('ignore totaux, paiement, sacs et fidélité', () => {
    for (const l of ['TOTAL', 'SOUS-TOTAL', 'CB EMV', 'TVA 5,5%', 'SAC CABAS', 'Points fidélité']) {
      expect(isIgnoredReceiptLine(l)).toBe(true);
    }
    expect(isIgnoredReceiptLine('FETA AOP 200G')).toBe(false);
  });
  it('signale les promotions', () => {
    expect(isPromoLine('PROMO -30% COCO')).toBe(true);
    expect(isPromoLine('LAIT COCO 40CL')).toBe(false);
  });
});

describe('récompense et fraîcheur', () => {
  it('offre 3 jours, dans la limite de 14 par mois', () => {
    expect(receiptRewardDays(0)).toBe(3);
    expect(receiptRewardDays(12)).toBe(2);
    expect(receiptRewardDays(14)).toBe(0);
  });
  it('n’accepte que les tickets de moins de 7 jours', () => {
    const now = new Date('2026-11-14T12:00:00Z');
    expect(isRecentReceipt('2026-11-10', now)).toBe(true);
    expect(isRecentReceipt('2026-11-01', now)).toBe(false);
  });
});

describe('enseigne du ticket', () => {
  it('reconnaît les formats de magasin', () => {
    expect(detectStoreId('CARREFOUR MARKET')).toBe('carrefour');
    expect(detectStoreId('HYPER U')).toBe('super-u');
    expect(detectStoreId('E.LECLERC')).toBe('leclerc');
    expect(detectStoreId('Intermarché Express')).toBe('intermarche');
    expect(detectStoreId('ÉPICERIE DU COIN')).toBeNull();
  });
});
