import 'server-only';
import { z } from 'zod';
import {
  detectStoreId,
  isIgnoredReceiptLine,
  isPromoLine,
  matchReceiptLine,
  receiptRewardDays,
  type StoreId,
} from '@repas/core';
import { publicEnv } from './env';
import type { AdminClient } from './supabase/admin';

/** Formats lus par le lecteur (vision) ; 10 Mo comme la limite du Storage local. */
export const RECEIPT_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as const;
export const RECEIPT_MAX_BYTES = 10 * 1024 * 1024;

/** Réponse de l'Edge Function ocr-receipt (validée : elle vient d'un service externe). */
const ReadReceipt = z.object({
  store_name: z.string().nullable(),
  city: z.string().nullable(),
  purchased_at: z.string().nullable(),
  total_cents: z.number().int().nullable(),
  lines: z.array(
    z.object({
      raw: z.string(),
      readable: z.string().nullable(),
      quantity: z.number().nullable(),
      cents: z.number().int().nullable(),
    }),
  ),
});
const OcrResponse = z.object({
  provider: z.enum(['claude', 'demo']),
  receipt: ReadReceipt.nullable(),
  reason: z.string().optional(),
});
export type OcrResult = z.infer<typeof OcrResponse>;

/** Appelle l'Edge Function (côté serveur uniquement, avec la clé serveur). */
export async function readReceipt(path: string): Promise<OcrResult> {
  const key = z.string().min(1).parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const res = await fetch(`${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ocr-receipt`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ path }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`ocr-receipt ${res.status}`);
  return OcrResponse.parse(await res.json());
}

export interface ReceiptSummary {
  storeId: StoreId | null;
  read: number;
  recognized: number;
  toReview: number;
  ignored: number;
}

const isoDate = (s: string | null) =>
  s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) ? s : null;

/**
 * Rapproche les lignes lues avec le catalogue (core), les enregistre et passe le ticket « en revue ».
 * Écritures avec la clé serveur : l'appelant a déjà vérifié que le ticket appartient à l'utilisateur.
 */
export async function storeReadLines(
  admin: AdminClient,
  receiptId: string,
  chosenStore: StoreId | null,
  ocr: OcrResult,
): Promise<ReceiptSummary> {
  const r = ocr.receipt;
  if (!r) {
    await admin.from('receipts').update({ status: 'en_revue', ocr_confidence: 0 }).eq('id', receiptId);
    return { storeId: chosenStore, read: 0, recognized: 0, toReview: 0, ignored: 0 };
  }
  const { data: products } = await admin.from('products').select('id, name');
  const catalogue = products ?? [];
  const rows = r.lines.map((l) => {
    const ignored = isIgnoredReceiptLine(l.raw);
    const promo = isPromoLine(l.raw) || (l.cents ?? 0) < 0;
    const m = ignored ? null : matchReceiptLine(l.raw, catalogue, l.readable);
    return {
      receipt_id: receiptId,
      raw_text: l.raw,
      cents: l.cents,
      // Suggestion gardée même sous le seuil : le modérateur confirme ou corrige.
      product_id: m && m.confidence >= 0.5 && !promo ? m.productId : null,
      match_confidence: m?.confidence ?? null,
      decision: ignored ? ('ignore' as const) : ('auto' as const),
      auto: Boolean(m?.auto) && !promo && (l.cents ?? 0) > 0,
    };
  });
  if (rows.length) await admin.from('receipt_lines').insert(rows.map(({ auto: _auto, ...row }) => row));
  const scored = rows.filter((x) => x.decision !== 'ignore');
  const confidence = scored.length
    ? scored.reduce((s, x) => s + (x.match_confidence ?? 0), 0) / scored.length
    : 0;
  const storeId = chosenStore ?? detectStoreId(r.store_name);
  await admin
    .from('receipts')
    .update({
      store_id: storeId,
      purchased_at: isoDate(r.purchased_at),
      total_cents: r.total_cents,
      ocr_confidence: Math.round(confidence * 100) / 100,
      status: 'en_revue',
    })
    .eq('id', receiptId);
  return {
    storeId,
    read: rows.length,
    recognized: rows.filter((x) => x.auto).length,
    toReview: scored.filter((x) => !x.auto).length,
    ignored: rows.length - scored.length,
  };
}

/** Début du mois en cours (heure de Paris approximée en UTC : suffisant pour un plafond mensuel). */
export const monthStart = (now: Date) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

/** Jours déjà gagnés ce mois-ci avec les tickets, et jours que rapporterait le prochain ticket validé. */
export function rewardStatus(validatedThisMonth: { reward_days: number }[]) {
  const earned = validatedThisMonth.reduce((s, r) => s + r.reward_days, 0);
  return { earned, next: receiptRewardDays(earned) };
}
