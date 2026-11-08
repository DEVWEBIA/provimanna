'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { formatEuro, type StoreId } from '@repas/core';
import { buttonClasses, cx, glassClasses, Icon, Price, Reliability, StoreChip, TicketCard } from '@repas/ui';
import { href } from '@/lib/site';
import type { StoreTotalView } from './store-totals';
import { ActionMessage } from './use-plan-action';
import { useChooseStore } from './use-choose-store';

export interface ProductRowView {
  name: string;
  quantity: string | null;
  mineCents: number;
  otherCents: number;
  diffCents: number;
}

export interface StoreDetail {
  /** Lignes visibles (toutes en Premium, 2 en gratuit). */
  rows: ProductRowView[];
  /** Lignes masquées (formule gratuite). */
  hidden: number;
  cheaper: number;
  pricier: number;
  equal: number;
}

export interface ComparatorViewProps {
  planId: string;
  totals: StoreTotalView[];
  myStore: StoreId;
  cheapest: StoreId;
  premium: boolean;
  details: Partial<Record<StoreId, StoreDetail>>;
}

const signed = (cents: number) => (cents < 0 ? `−${formatEuro(-cents)}` : `+${formatEuro(cents)}`);

/** Comparateur détaillé (maquettes AppComparateur / MComparateur). */
export function ComparatorView({ planId, totals, myStore, cheapest, premium, details }: ComparatorViewProps) {
  const others = totals.filter((t) => t.id !== myStore);
  const [other, setOther] = useState<StoreId>(cheapest !== myStore ? cheapest : (others[0]?.id ?? myStore));
  const { choose, pending, message, clear } = useChooseStore(planId);
  const mine = totals.find((t) => t.id === myStore)!;
  const cur = totals.find((t) => t.id === other)!;
  const max = Math.max(...totals.map((t) => t.cents));
  const detail = details[other];
  const save = mine.cents - cur.cents;

  return (
    <>
      <section aria-label="Total par enseigne" className="flex flex-col gap-2.5">
        {totals.map((t, i) => {
          const on = t.id === other;
          const isMine = t.id === myStore;
          const diff = mine.cents - t.cents;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              disabled={isMine}
              onClick={() => setOther(t.id)}
              className={cx(
                'anim-rise flex min-h-[64px] flex-wrap items-center gap-x-2.5 gap-y-2 rounded-[18px] border-2 bg-white/85 px-3 py-2 text-left backdrop-blur transition-[border-color,box-shadow,transform] disabled:cursor-default motion-reduce:transition-none sm:gap-x-4 sm:px-4',
                on
                  ? 'border-brand shadow-[0_0_0_3px_theme(colors.brand.soft)]'
                  : 'hover:border-line border-transparent enabled:hover:-translate-y-0.5',
              )}
              style={{ '--d': `${120 + i * 60}ms` } as CSSProperties}
            >
              <StoreChip storeId={t.id} name={t.name} initials={t.initials} hideName />
              <span className="min-w-0 flex-1 text-[16px] font-extrabold sm:w-[200px] sm:flex-none">
                {t.name}{' '}
                {t.id === cheapest ? (
                  <span className="rounded-pill bg-saving-soft text-saving-ink mt-0.5 block w-fit px-2 py-0.5 text-[11px] font-black sm:ml-1 sm:mt-0 sm:inline">
                    Le moins cher
                  </span>
                ) : isMine ? (
                  <span className="rounded-pill bg-brand-soft text-brand mt-0.5 block w-fit px-2 py-0.5 text-[11px] font-black sm:ml-1 sm:mt-0 sm:inline">
                    Ton enseigne
                  </span>
                ) : null}
              </span>
              <span
                className="bg-site-track order-last h-3 basis-full overflow-hidden rounded-[9px] sm:order-none sm:min-w-[120px] sm:flex-1 sm:basis-0"
                aria-hidden="true"
              >
                <span
                  className={cx(
                    'block h-full rounded-[9px] transition-[width] duration-700',
                    t.id === cheapest
                      ? 'bg-saving'
                      : isMine
                        ? 'bg-brand'
                        : on
                          ? 'bg-site-brand-light'
                          : 'bg-site-bar',
                  )}
                  style={{ width: `${Math.round((t.cents / max) * 100)}%` }}
                />
              </span>
              <span className="flex flex-col items-end sm:w-[110px]">
                <Price
                  cents={t.cents}
                  estimate={t.estimate}
                  size="md"
                  className="font-display text-[19px] sm:text-[22px]"
                />
                <Reliability level={t.reliability} className="text-[11px]" />
              </span>
              <span
                className={cx(
                  'text-right text-[14px] font-black tabular-nums max-sm:w-[70px] sm:w-[86px]',
                  isMine ? 'text-brand' : diff > 0 ? 'text-saving-ink' : 'text-ink-muted',
                )}
              >
                {isMine ? 'ton choix' : signed(-diff)}
              </span>
            </button>
          );
        })}
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className={cx(glassClasses, 'relative overflow-hidden p-5')} aria-labelledby="detail-titre">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="detail-titre" className="font-display text-[22px] font-extrabold tracking-[-0.4px]">
              Produit par produit · {mine.name} vs {cur.name}
            </h2>
            <span className="rounded-pill bg-brand text-brand-on px-2.5 py-0.5 text-[11px] font-black">
              PREMIUM
            </span>
          </div>
          {detail && detail.rows.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[460px] text-[15px] tabular-nums">
                <thead>
                  <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                    <th scope="col" className="pb-2">
                      PRODUIT
                    </th>
                    <th scope="col" className="pb-2 text-right">
                      {mine.name.toUpperCase()}
                    </th>
                    <th scope="col" className="pb-2 text-right">
                      {cur.name.toUpperCase()}
                    </th>
                    <th scope="col" className="pb-2 text-right">
                      ÉCART
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detail.rows.map((r) => (
                    <tr key={r.name} className="border-line border-t">
                      <th scope="row" className="py-2.5 text-left font-extrabold">
                        {r.name}{' '}
                        {r.quantity ? <span className="text-ink-muted font-bold">· {r.quantity}</span> : null}
                      </th>
                      <td className="py-2.5 text-right font-bold">{formatEuro(r.mineCents)}</td>
                      <td className="py-2.5 text-right font-bold">{formatEuro(r.otherCents)}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className={cx(
                            'rounded-pill px-2.5 py-1 text-[13px] font-black',
                            r.diffCents < 0
                              ? 'bg-saving-soft text-saving-ink'
                              : 'bg-site-track text-ink-muted',
                          )}
                        >
                          {r.diffCents === 0 ? '=' : signed(r.diffCents)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {!premium && detail ? (
            <div className="border-line mt-4 flex flex-col items-center gap-2 rounded-[18px] border border-dashed bg-white/70 px-5 py-6 text-center">
              <Icon name="verrou" size={26} className="text-brand" />
              <p className="font-display text-[22px] font-extrabold">
                {detail.hidden} autres produits à comparer
              </p>
              <p className="text-ink-muted max-w-[420px] text-[15px]">
                Vois exactement où se cache l’écart, et bascule ta liste chez {cur.name} en un clic.
              </p>
              <Link
                href={href('/app/abonnement')}
                className={buttonClasses('secondary', 'md', 'mt-2 no-underline')}
              >
                Essayer Premium 14 jours, sans carte
              </Link>
            </div>
          ) : null}
        </section>

        <aside className="flex flex-col gap-3">
          <TicketCard edge="surface-50" tone="brand" className="rounded-t-[26px] px-6 pb-9 pt-6">
            <p className="text-site-lilac text-[12px] font-black tracking-[1.2px]">
              EN PASSANT CHEZ {cur.name.toUpperCase()}
            </p>
            <p className="font-display mt-1 text-[44px] font-extrabold tabular-nums tracking-[-1.4px]">
              {save > 0 ? `−${formatEuro(save)}` : signed(-save)}
            </p>
            {detail ? (
              <p className="text-site-on-brand-muted text-[15px] font-bold">
                {detail.cheaper} produits moins chers, {detail.pricier} plus chers, le reste à prix égal.
              </p>
            ) : null}
            <button
              type="button"
              disabled={pending}
              onClick={() => choose(other)}
              className="rounded-pill text-brand mt-5 min-h-[52px] w-full bg-white text-[16px] font-black transition-transform hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:transition-none"
            >
              Basculer ma liste chez {cur.name}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => choose(myStore)}
              className="mt-2 min-h-[44px] w-full text-[15px] font-extrabold text-white underline-offset-4 hover:underline"
            >
              Garder {mine.name}
            </button>
          </TicketCard>
          <p className="text-ink-muted px-2 text-[14px] font-bold leading-snug">
            Le prix est un repère : c’est toi qui choisis. Distance, habitudes, promos locales comptent aussi.
          </p>
        </aside>
      </div>
      <ActionMessage message={message} onClose={clear} />
    </>
  );
}
