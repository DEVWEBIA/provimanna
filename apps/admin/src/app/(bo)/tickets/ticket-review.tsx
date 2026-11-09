'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { formatEuro, type StoreId } from '@repas/core';
import { buttonClasses, cx, glassClasses, inputClasses, Notice } from '@repas/ui';
import { Badge } from '@/components/bo-ui';
import { publishReceipt, rejectReceipt } from './actions';

export interface ReviewLine {
  id: string;
  raw: string;
  cents: number | null;
  productId: string | null;
  confidence: number | null;
  median: number | null;
  ignored: boolean;
  promo: boolean;
  accept: boolean;
}

/** Décisions ligne par ligne, puis « Publier et ticket suivant » (raccourci P) ou « Rejeter le ticket ». */
export function TicketReview({
  receiptId,
  photoUrl,
  storeId,
  stores,
  purchasedAt,
  totalCents,
  lines,
  products,
}: {
  receiptId: string;
  photoUrl: string | null;
  storeId: StoreId | null;
  stores: { id: StoreId; name: string }[];
  purchasedAt: string | null;
  totalCents: number | null;
  lines: ReviewLine[];
  products: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [store, setStore] = useState<string>(storeId ?? '');
  const [rows, setRows] = useState(lines);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = (id: string, patch: Partial<ReviewLine>) =>
    setRows((r) => r.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const run = (action: () => Promise<{ ok: true; message: string } | { ok: false; error: string }>) =>
    start(async () => {
      const res = await action();
      if (res.ok) {
        setMessage({ tone: 'ok', text: res.message });
        router.push('/tickets');
        router.refresh();
      } else setMessage({ tone: 'error', text: res.error });
    });
  const publish = () =>
    run(() =>
      publishReceipt({
        receiptId,
        storeId: store,
        lines: rows
          .filter((l) => !l.ignored)
          .map((l) => ({ id: l.id, accept: l.accept, productId: l.productId })),
      }),
    );
  const okN = rows.filter((l) => !l.ignored && l.accept).length;
  const koN = rows.filter((l) => !l.ignored && !l.accept).length;
  const flagged = rows.find(
    (l) => l.accept && l.median && l.cents && Math.abs(l.cents - l.median) / l.median > 0.4,
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <figure className={cx(glassClasses, 'overflow-hidden p-3 lg:sticky lg:top-8')}>
        {photoUrl ? (
          // Photo privée (lien signé de 10 min) : pas d'optimisation d'image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="Photo du ticket envoyé"
            className="max-h-[70vh] w-full rounded-[14px] object-contain"
          />
        ) : (
          <p className="text-ink-muted p-4 text-[14px] font-bold">Photo indisponible.</p>
        )}
        <figcaption className="text-ink-muted mt-2 px-1 text-[13px] font-bold">
          {purchasedAt ? `Acheté le ${new Date(purchasedAt).toLocaleDateString('fr-FR')}` : 'Date non lue'}
          {totalCents !== null ? ` · total ${formatEuro(totalCents)}` : ''}
        </figcaption>
      </figure>

      <section className={cx(glassClasses, 'p-5')} aria-labelledby="lignes-titre">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="lignes-titre" className="font-display text-[22px] font-extrabold">
            Lignes lues
          </h2>
          <p className="text-ink-muted text-[14px] font-bold">
            {okN} validées · {koN} rejetées
          </p>
        </div>
        <label htmlFor="ticket-enseigne" className="mb-1.5 mt-4 block text-[13px] font-black">
          Enseigne du ticket
        </label>
        <select
          id="ticket-enseigne"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          className={inputClasses(!store, 'max-w-[280px] px-3')}
        >
          <option value="">Choisir…</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px] tabular-nums">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                <th scope="col" className="pb-2">
                  PRODUIT RECONNU
                </th>
                <th scope="col" className="pb-2 text-right">
                  PRIX
                </th>
                <th scope="col" className="pb-2 text-right">
                  MÉDIANE
                </th>
                <th scope="col" className="pb-2 text-right">
                  CONFIANCE
                </th>
                <th scope="col" className="pb-2 text-right">
                  DÉCISION
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className={cx('border-line border-t', l.ignored && 'opacity-50')}>
                  <td className="py-2.5 pr-3">
                    {l.ignored ? (
                      <span className="font-bold">Hors produits</span>
                    ) : (
                      <select
                        aria-label={`Produit pour « ${l.raw} »`}
                        value={l.productId ?? ''}
                        onChange={(e) =>
                          set(l.id, { productId: e.target.value || null, accept: Boolean(e.target.value) })
                        }
                        className={inputClasses(false, 'h-10 min-h-0 max-w-[300px] px-2 text-[14px]')}
                      >
                        <option value="">Aucun produit</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    )}
                    <span className="text-ink-muted mt-1 block text-[12px] font-bold">
                      lu « {l.raw} »{l.promo ? ' · promo' : ''}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-black">
                    {l.cents !== null ? formatEuro(l.cents) : '—'}
                  </td>
                  <td className="text-ink-muted py-2.5 text-right font-bold">
                    {l.median !== null ? formatEuro(l.median) : '—'}
                  </td>
                  <td className="py-2.5 text-right">
                    {l.confidence !== null ? (
                      <Badge tone={l.confidence >= 0.85 ? 'ok' : l.confidence >= 0.6 ? 'warn' : 'bad'}>
                        {Math.round(l.confidence * 100)} %
                      </Badge>
                    ) : null}
                  </td>
                  <td className="py-2.5 text-right">
                    {l.ignored ? null : (
                      <span className="inline-flex gap-1">
                        <button
                          type="button"
                          aria-pressed={l.accept}
                          aria-label={`Valider « ${l.raw} »`}
                          disabled={!l.productId || l.promo}
                          onClick={() => set(l.id, { accept: true })}
                          className={cx(
                            'min-h-tap min-w-tap rounded-[10px] font-black disabled:opacity-30',
                            l.accept ? 'bg-success text-white' : 'bg-site-track',
                          )}
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          aria-pressed={!l.accept}
                          aria-label={`Rejeter « ${l.raw} »`}
                          onClick={() => set(l.id, { accept: false })}
                          className={cx(
                            'min-h-tap min-w-tap rounded-[10px] font-black',
                            !l.accept ? 'bg-danger-soft text-danger-ink' : 'bg-site-track',
                          )}
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {flagged ? (
          <Notice
            tone="warning"
            className="mt-4"
            title={`« ${flagged.raw} » s’écarte de plus de 40 % de la médiane.`}
          >
            Vérifie qu’il ne s’agit pas d’une promo ou d’un autre format.
          </Notice>
        ) : null}
        {message ? (
          message.tone === 'error' ? (
            <Notice tone="error" className="mt-4" title={message.text} />
          ) : (
            <p role="status" className="text-success mt-4 font-black">
              {message.text}
            </p>
          )
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => rejectReceipt(receiptId))}
            className={buttonClasses('secondary', 'md')}
          >
            Rejeter le ticket
          </button>
          <button
            type="button"
            disabled={pending || !store}
            onClick={publish}
            className={buttonClasses('primary', 'md')}
          >
            Publier et ticket suivant →
          </button>
        </div>
      </section>
    </div>
  );
}
