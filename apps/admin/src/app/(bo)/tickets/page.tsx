import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import {
  isPromoLine,
  medianCents,
  RECEIPT_MATCH_THRESHOLD,
  storeDisplayName,
  STORE_IDS,
  STORES_INFO,
  type StoreId,
} from '@repas/core';
import { cx, EmptyState, glassClasses, PageHeader, Plat } from '@repas/ui';
import { Badge } from '@/components/bo-ui';
import { StoreLogo } from '@/components/store-logo';
import { recentObservations } from '@/lib/coverage';
import { requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';
import { TicketReview, type ReviewLine } from './ticket-review';

export const metadata: Metadata = { title: 'Tickets' };
export const dynamic = 'force-dynamic';
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const pct = (n: number | null) => (n === null ? '—' : `${Math.round(n * 100)} %`);
const ago = (iso: string, now: Date) => {
  const h = Math.round((now.getTime() - Date.parse(iso)) / 3_600_000);
  return h < 1 ? 'à l’instant' : h < 24 ? `il y a ${h} h` : `il y a ${Math.round(h / 24)} j`;
};

/** Tickets à valider (maquette BOTickets) : file, photo, lignes lues avec suggestion, médiane et confiance. */
export default async function TicketsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireRole(['moderateur_prix']);
  const now = new Date();
  const { data: queue } = await supabase
    .from('receipts')
    .select('id, store_id, ocr_confidence, created_at, purchased_at, status, receipt_lines(count)')
    .in('status', ['en_attente', 'en_revue'])
    .order('created_at', { ascending: true })
    .limit(30);
  const items = queue ?? [];

  if (!items.length) {
    return (
      <>
        <PageHeader eyebrow="Modération" title="Tickets à valider" />
        <EmptyState
          title="Aucun ticket en attente."
          description="Les tickets envoyés par les utilisateurs apparaîtront ici, lus et rapprochés des produits."
          illustration={<Plat variant="salade" size={96} decorative />}
        />
      </>
    );
  }

  const selectedId = typeof sp.id === 'string' && items.some((i) => i.id === sp.id) ? sp.id : items[0]!.id;
  const admin = createAdminClient();
  const [{ data: receipt }, { data: products }, obs] = await Promise.all([
    supabase
      .from('receipts')
      .select(
        'id, store_id, photo_path, purchased_at, total_cents, ocr_confidence, receipt_lines(id, raw_text, cents, product_id, match_confidence, decision)',
      )
      .eq('id', selectedId)
      .single(),
    supabase.from('products').select('id, name, quantity_label').order('name'),
    recentObservations(supabase, now),
  ]);
  if (!receipt) throw new Error('Ticket introuvable');
  const { data: signed } = await admin.storage.from('receipts').createSignedUrl(receipt.photo_path, 600);
  const store = receipt.store_id as StoreId | null;
  const median = (productId: string | null) => {
    if (!productId || !store) return null;
    const v = obs.filter((o) => o.productId === productId && o.storeId === store).map((o) => o.cents);
    return v.length ? medianCents(v) : null;
  };
  const lines: ReviewLine[] = receipt.receipt_lines.map((l) => ({
    id: l.id,
    raw: l.raw_text,
    cents: l.cents,
    productId: l.product_id,
    confidence: l.match_confidence,
    median: median(l.product_id),
    ignored: l.decision === 'ignore',
    promo: isPromoLine(l.raw_text) || (l.cents ?? 0) < 0,
    // Proposé coché : reconnu au-dessus du seuil, prix positif, pas une promo.
    accept:
      l.decision !== 'ignore' &&
      Boolean(l.product_id) &&
      (l.match_confidence ?? 0) >= RECEIPT_MATCH_THRESHOLD &&
      (l.cents ?? 0) > 0 &&
      !isPromoLine(l.raw_text),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Modération"
        title="Tickets à valider"
        lead={`${items.length} en attente · le plus ancien envoyé ${ago(items[0]!.created_at, now)}`}
      />
      <div className="grid items-start gap-6 2xl:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="File des tickets"
          className="flex gap-2 overflow-x-auto pb-1 2xl:flex-col 2xl:overflow-visible"
        >
          {items.map((t) => {
            const on = t.id === selectedId;
            const n = t.receipt_lines[0]?.count ?? 0;
            return (
              <Link
                key={t.id}
                href={`/tickets?id=${t.id}` as Route}
                aria-current={on ? 'page' : undefined}
                className={cx(
                  glassClasses,
                  'text-ink flex shrink-0 items-center gap-3 p-3 no-underline transition-colors max-2xl:w-[300px]',
                  on ? 'ring-brand ring-2' : 'hover:ring-line hover:ring-1',
                )}
              >
                {t.store_id ? (
                  <StoreLogo id={t.store_id} name={storeDisplayName(t.store_id)} height={20} />
                ) : (
                  <Badge tone="warn">Enseigne ?</Badge>
                )}
                <span className="min-w-0 flex-1 text-[13px] font-bold">
                  {n} lignes · {ago(t.created_at, now)}
                </span>
                <Badge tone={(t.ocr_confidence ?? 0) >= RECEIPT_MATCH_THRESHOLD ? 'ok' : 'warn'}>
                  {pct(t.ocr_confidence)}
                </Badge>
              </Link>
            );
          })}
        </nav>
        <TicketReview
          key={receipt.id}
          receiptId={receipt.id}
          photoUrl={signed?.signedUrl ?? null}
          storeId={store}
          stores={STORE_IDS.map((id) => ({ id, name: STORES_INFO[id].name }))}
          purchasedAt={receipt.purchased_at}
          totalCents={receipt.total_cents}
          lines={lines}
          products={(products ?? []).map((p) => ({
            id: p.id,
            label: p.quantity_label ? `${p.name} · ${p.quantity_label}` : p.name,
          }))}
        />
      </div>
    </>
  );
}
