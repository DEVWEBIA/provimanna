'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { formatEuro } from '@repas/core';
import { Button, cx, glassClasses, Toast } from '@repas/ui';
import { StoreLogo } from '@/components/store-logo';
import { moderatePrice } from './actions';

export interface AlertRow {
  id: number;
  product: string;
  ean: string | null;
  store: string;
  storeId: string;
  source: string;
  observedAt: string;
  cents: number;
  medianCents: number | null;
  gapPercent: number | null;
  history: { week: string; cents: number | null }[];
  hint: string;
}

/** File des prix aberrants (maquette BOPrix) : sélection, détail, décisions au clavier. */
export function PriceQueue({ rows }: { rows: AlertRow[] }) {
  const router = useRouter();
  const [sel, setSel] = useState(0);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const cur = rows[Math.min(sel, rows.length - 1)];

  const decide = useCallback(
    (decision: 'valider' | 'rejeter' | 'promo') => {
      if (!cur || pending) return;
      start(async () => {
        const res = await moderatePrice({ priceId: cur.id, decision });
        if (!res.ok) setMessage(res.error);
        else {
          setMessage(decision === 'valider' ? 'Prix validé : il entre dans la médiane.' : 'Prix écarté.');
          router.refresh();
        }
      });
    },
    [cur, pending, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.metaKey ||
        e.ctrlKey
      )
        return;
      const k = e.key.toLowerCase();
      if (k === 'v') decide('valider');
      else if (k === 'r') decide('rejeter');
      else if (k === 'j') setSel((s) => Math.min(rows.length - 1, s + 1));
      else if (k === 'k') setSel((s) => Math.max(0, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide, rows.length]);

  if (!rows.length) {
    return (
      <p className={cx(glassClasses, 'text-ink-muted p-8 text-center text-[16px] font-bold')}>
        Aucun prix aberrant à traiter. Tout est à jour.
      </p>
    );
  }
  const max = Math.max(...(cur?.history.map((h) => h.cents ?? 0) ?? [1]), 1);

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className={cx(glassClasses, 'overflow-x-auto p-2')}>
        <table className="w-full min-w-[640px] text-[14px] tabular-nums">
          <thead>
            <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
              {['PRODUIT', 'ENSEIGNE', 'RELEVÉ', 'MÉDIANE', 'ÉCART', 'SOURCE'].map((h) => (
                <th key={h} scope="col" className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                onClick={() => setSel(i)}
                aria-selected={i === sel}
                className={cx(
                  'border-line cursor-pointer border-t',
                  i === sel ? 'bg-brand-soft' : 'hover:bg-site-hover',
                )}
              >
                <td className="px-3 py-2.5">
                  <button type="button" onClick={() => setSel(i)} className="text-left font-extrabold">
                    {r.product}
                  </button>
                  {r.ean ? <span className="text-ink-muted block text-[12px]">EAN {r.ean}</span> : null}
                </td>
                <td className="px-3 py-2.5">
                  <StoreLogo id={r.storeId} name={r.store} height={22} />
                </td>
                <td className="px-3 py-2.5 font-black">{formatEuro(r.cents)}</td>
                <td className="text-ink-muted px-3 py-2.5 font-bold">
                  {r.medianCents !== null ? formatEuro(r.medianCents) : '—'}
                </td>
                <td className="px-3 py-2.5">
                  {r.gapPercent !== null ? (
                    <span className="bg-danger-soft text-danger-ink rounded-pill px-2 py-0.5 font-black">
                      {r.gapPercent > 0 ? '+' : '−'}
                      {Math.abs(r.gapPercent)} %
                    </span>
                  ) : null}
                </td>
                <td className="text-ink-muted px-3 py-2.5 font-bold">{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-ink-muted px-3 py-2 text-[12px] font-bold">
          Raccourcis : V valider · R rejeter · J / K suivant / précédent
        </p>
      </div>
      {cur ? (
        <aside className={cx(glassClasses, 'p-5 xl:sticky xl:top-8')} aria-live="polite">
          <p className="text-ink-muted text-[13px] font-bold">
            {cur.store} · {cur.source} · {new Date(cur.observedAt).toLocaleDateString('fr-FR')}
          </p>
          <h2 className="font-display mt-1 text-[24px] font-extrabold">{cur.product}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[14px] bg-white p-3">
              <dt className="text-ink-muted text-[12px] font-black tracking-[1px]">RELEVÉ</dt>
              <dd className="font-display text-danger-ink text-[26px] font-extrabold tabular-nums">
                {formatEuro(cur.cents)}
              </dd>
            </div>
            <div className="rounded-[14px] bg-white p-3">
              <dt className="text-ink-muted text-[12px] font-black tracking-[1px]">MÉDIANE 30 J</dt>
              <dd className="font-display text-[26px] font-extrabold tabular-nums">
                {cur.medianCents !== null ? formatEuro(cur.medianCents) : '—'}
              </dd>
            </div>
          </dl>
          <div
            className="mt-4 flex h-[90px] items-end gap-1.5"
            role="img"
            aria-label="8 dernières semaines, tous relevés de l'enseigne"
          >
            {cur.history.map((h, i) => (
              <span
                key={h.week}
                className={cx(
                  'flex-1 rounded-t-[6px]',
                  i === cur.history.length - 1 ? 'bg-danger' : 'bg-site-brand-light',
                  h.cents === null && 'opacity-20',
                )}
                style={{ height: `${h.cents ? Math.max(6, (h.cents / max) * 80) : 6}px` }}
                title={h.cents ? formatEuro(h.cents) : 'pas de relevé'}
              />
            ))}
          </div>
          <p className="text-ink-muted mt-1 text-[12px] font-bold">
            8 dernières semaines, tous relevés de l’enseigne
          </p>
          <p className="bg-warning-soft text-warning mt-4 rounded-[12px] px-3 py-2 text-[14px] font-bold">
            Piste : {cur.hint}
          </p>
          <div className="mt-5 flex gap-2">
            <Button variant="neutral" className="flex-1" disabled={pending} onClick={() => decide('rejeter')}>
              Rejeter (R)
            </Button>
            <Button className="flex-1" disabled={pending} onClick={() => decide('valider')}>
              Valider (V)
            </Button>
          </div>
          <button
            type="button"
            onClick={() => decide('promo')}
            disabled={pending}
            className="text-brand min-h-tap mt-2 w-full text-[14px] font-black underline"
          >
            Marquer comme promo
          </button>
        </aside>
      ) : null}
      {message ? (
        <div className="fixed inset-x-4 bottom-6 z-30 mx-auto max-w-[480px]">
          <Toast>{message}</Toast>
        </div>
      ) : null}
    </div>
  );
}
