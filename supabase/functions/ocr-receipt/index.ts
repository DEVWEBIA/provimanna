/**
 * Edge Function ocr-receipt : lit la photo d'un ticket (Storage receipts/{uid}/…) et renvoie ses lignes.
 * Appelée uniquement côté serveur (clé serveur en Authorization) ; le rapprochement avec les produits
 * se fait ensuite dans l'appli avec packages/core. Clé du fournisseur : secret ANTHROPIC_API_KEY.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { pickReader, UnreadableReceipt, type ImageMediaType } from '../_shared/receipt-reader.ts';

const MEDIA: Record<string, ImageMediaType> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'méthode non autorisée' }, 405);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceKey || req.headers.get('authorization') !== `Bearer ${serviceKey}`) {
    return json({ error: 'réservé au serveur' }, 401);
  }
  const body = (await req.json().catch(() => null)) as { path?: unknown } | null;
  const path = typeof body?.path === 'string' ? body.path : null;
  const ext = path?.split('.').pop()?.toLowerCase() ?? '';
  if (!path || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.[a-z]+$/.test(path) || !MEDIA[ext]) {
    return json({ error: 'chemin de photo invalide' }, 400);
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
  const { data: file, error } = await supabase.storage.from('receipts').download(path);
  if (error || !file) return json({ error: 'photo introuvable' }, 404);

  const reader = pickReader(Deno.env);
  try {
    const receipt = await reader.read(new Uint8Array(await file.arrayBuffer()), MEDIA[ext]);
    return json({ provider: reader.name, receipt });
  } catch (e) {
    if (e instanceof UnreadableReceipt) return json({ provider: reader.name, receipt: null, reason: e.message });
    console.error('ocr-receipt', e);
    return json({ error: 'lecture indisponible' }, 502);
  }
});
