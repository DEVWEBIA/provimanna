'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isStoreId, type StoreId } from '@repas/core';
import { getAccount } from '@/lib/household';
import {
  readReceipt,
  RECEIPT_MAX_BYTES,
  RECEIPT_TYPES,
  storeReadLines,
  type ReceiptSummary,
} from '@/lib/receipts';
import { createAdminClient } from '@/lib/supabase/admin';

export type SendReceiptResult = { ok: true; summary: ReceiptSummary } | { ok: false; error: string };

const FAILED = 'L’envoi n’a pas marché. Réessaie dans un instant.';

const formSchema = z.object({
  photo: z
    .instanceof(File, { error: 'Choisis la photo de ton ticket.' })
    .refine((f) => f.size > 0, { error: 'Choisis la photo de ton ticket.' })
    .refine((f) => f.size <= RECEIPT_MAX_BYTES, {
      error: 'La photo dépasse 10 Mo. Essaie une photo moins lourde.',
    })
    .refine((f) => f.type in RECEIPT_TYPES, { error: 'Envoie une photo au format JPG, PNG ou WEBP.' }),
  store: z
    .string()
    .optional()
    .transform((s): StoreId | null => (s && isStoreId(s) ? s : null)),
});

/**
 * Envoi d'un ticket : photo déposée dans le dossier de l'utilisateur (RLS), ticket créé avec sa session,
 * lecture par l'Edge Function, puis lignes rapprochées du catalogue (core) et ticket « en revue ».
 */
export async function sendReceiptAction(formData: FormData): Promise<SendReceiptResult> {
  const parsed = formSchema.safeParse({
    photo: formData.get('photo'),
    store: formData.get('store') ?? undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? FAILED };
  const { photo, store } = parsed.data;
  const { supabase, user } = await getAccount('/app/ticket');

  const id = crypto.randomUUID();
  const path = `${user.id}/${id}.${RECEIPT_TYPES[photo.type as keyof typeof RECEIPT_TYPES]}`;
  const upload = await supabase.storage.from('receipts').upload(path, photo, { contentType: photo.type });
  if (upload.error) return { ok: false, error: FAILED };
  const { error } = await supabase
    .from('receipts')
    .insert({ id, user_id: user.id, photo_path: path, store_id: store });
  if (error) return { ok: false, error: FAILED };

  try {
    const ocr = await readReceipt(path);
    const summary = await storeReadLines(createAdminClient(), id, store, ocr);
    revalidatePath('/app/ticket');
    return { ok: true, summary };
  } catch (e) {
    console.error('sendReceiptAction', e);
    // Le ticket reste « en attente » : l'équipe le lira à la main.
    return {
      ok: false,
      error: 'On n’a pas pu lire ton ticket tout de suite. L’équipe le vérifiera à la main.',
    };
  }
}
