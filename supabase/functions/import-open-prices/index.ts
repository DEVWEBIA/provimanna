/**
 * Edge Function import-open-prices : import incrémental des prix Open Prices (cron quotidien ou bouton du BO).
 * Conversion et détection des aberrants par packages/core ; prix déjà importés écartés (prices.external_id).
 * Données sous licence ODbL : créditer « © Open Food Facts contributors ».
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { mapOpenPrice, openPriceIndex, type OpenPrice } from '../../../packages/core/src/open-prices.ts';
import { isAberrant, medianCents } from '../../../packages/core/src/pricing.ts';

const BASE = Deno.env.get('OPEN_PRICES_URL') ?? 'https://prices.openfoodfacts.org';
const MAX_PAGES = Number(Deno.env.get('OPEN_PRICES_MAX_PAGES') ?? '20');
const PAGE_SIZE = 100;
const USER_AGENT = `AppliRepas/0.1 (${Deno.env.get('APP_URL') ?? 'import quotidien'})`;
const DAY = 86_400_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'méthode non autorisée' }, 405);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceKey || req.headers.get('authorization') !== `Bearer ${serviceKey}`) {
    return json({ error: 'réservé au serveur' }, 401);
  }
  const body = (await req.json().catch(() => ({}))) as { triggered_by?: unknown };
  const triggeredBy = typeof body.triggered_by === 'string' ? body.triggered_by : null;
  const db = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);

  // Reprise après le dernier import réussi (1 h de recouvrement, les doublons sont écartés), sinon 3 jours.
  const { data: last } = await db
    .from('import_runs')
    .select('started_at')
    .eq('source', 'open_prices')
    .is('error', null)
    .not('finished_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const since = new Date(last ? Date.parse(last.started_at) - 3_600_000 : Date.now() - 3 * DAY).toISOString();
  const { data: run, error: runError } = await db
    .from('import_runs')
    .insert({ since, triggered_by: triggeredBy })
    .select('id')
    .single();
  if (runError || !run) return json({ error: 'historique indisponible' }, 500);

  const counts = { fetched: 0, imported: 0, unmatched: 0, aberrant: 0, skipped: 0 };
  try {
    const { data: products } = await db.from('products').select('id, ean, off_category, unit_kg, aisle_id');
    const index = openPriceIndex(products ?? []);
    const toImport: Extract<ReturnType<typeof mapOpenPrice>, { status: 'import' }>[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `${BASE}/api/v1/prices?currency=EUR&created__gte=${encodeURIComponent(since)}&order_by=created&size=${PAGE_SIZE}&page=${page}`;
      const res = await fetch(url, { headers: { 'user-agent': USER_AGENT, accept: 'application/json' } });
      if (!res.ok) throw new Error(`Open Prices ${res.status}`);
      const { items } = (await res.json()) as { items: OpenPrice[] };
      counts.fetched += items.length;
      for (const p of items) {
        const m = mapOpenPrice(p, index);
        if (m.status === 'import') toImport.push(m);
        else if (m.status === 'unmatched') counts.unmatched += 1;
        else counts.skipped += 1;
      }
      if (items.length < PAGE_SIZE) break;
    }

    if (toImport.length) {
      // Médiane des 30 derniers jours par produit et enseigne : un prix trop éloigné est importé mais signalé.
      const { data: recent } = await db
        .from('prices')
        .select('product_id, store_id, cents')
        .eq('flagged_aberrant', false)
        .gte('observed_at', new Date(Date.now() - 30 * DAY).toISOString())
        .in('product_id', [...new Set(toImport.map((m) => m.productId))]);
      const rows = toImport.map((m) => {
        const ref = (recent ?? [])
          .filter((r) => r.product_id === m.productId && r.store_id === m.storeId)
          .map((r) => r.cents);
        return {
          product_id: m.productId,
          store_id: m.storeId,
          cents: m.cents,
          observed_at: m.observedAt,
          source: 'open_prices' as const,
          external_id: m.externalId,
          flagged_aberrant: ref.length > 0 && isAberrant(m.cents, medianCents(ref)),
        };
      });
      const { data: inserted, error } = await db
        .from('prices')
        .upsert(rows, { onConflict: 'external_id', ignoreDuplicates: true })
        .select('flagged_aberrant');
      if (error) throw new Error(error.message);
      counts.imported = inserted?.length ?? 0;
      counts.aberrant = (inserted ?? []).filter((r) => r.flagged_aberrant).length;
      counts.skipped += rows.length - counts.imported;
    }
    await db
      .from('import_runs')
      .update({ ...counts, finished_at: new Date().toISOString() })
      .eq('id', run.id);
    return json({ run: run.id, since, ...counts });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('import-open-prices', message);
    await db
      .from('import_runs')
      .update({ ...counts, finished_at: new Date().toISOString(), error: message })
      .eq('id', run.id);
    return json({ run: run.id, error: message }, 502);
  }
});
