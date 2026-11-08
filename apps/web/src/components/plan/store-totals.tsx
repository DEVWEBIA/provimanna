'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatEuro, type Reliability as ReliabilityLevel, type StoreId } from '@repas/core';
import { buttonClasses, cx, glassClasses, Icon, Price, Reliability } from '@repas/ui';
import { StoreLogo } from '@/components/store-logo';
import { href } from '@/lib/site';
import { ActionMessage } from './use-plan-action';
import { useChooseStore } from './use-choose-store';

export interface StoreTotalView {
  id: StoreId;
  name: string;
  initials: string;
  cents: number;
  reliability: ReliabilityLevel;
  /** Une partie des prix sont des estimations (relevés de plus de 7 jours). */
  estimate: boolean;
}

export interface StoreTotalsProps {
  planId: string;
  totals: StoreTotalView[];
  myStore: StoreId;
  cheapest: StoreId;
  pricesAt: string | null;
  cheaperProducts: number;
}

/** Comparateur à côté du plan (maquette AppPlan) : l'enseigne reste un choix libre. */
export function StoreTotals({
  planId,
  totals,
  myStore,
  cheapest,
  pricesAt,
  cheaperProducts,
}: StoreTotalsProps) {
  const [selected, setSelected] = useState<StoreId>(myStore);
  const { choose, pending, message, clear } = useChooseStore(planId);
  const mine = totals.find((t) => t.id === myStore)!;
  const cur = totals.find((t) => t.id === selected)!;
  const cheap = totals.find((t) => t.id === cheapest)!;
  const isMine = selected === myStore;
  const diff = mine.cents - cur.cents;

  return (
    <aside
      id="comparateur"
      aria-labelledby="comparateur-titre"
      className={cx(glassClasses, 'scroll-mt-8 p-5')}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="comparateur-titre" className="font-display text-[24px] font-extrabold tracking-[-0.5px]">
          Ce plan coûte…
        </h2>
        {pricesAt ? (
          <span className="rounded-pill bg-surface-50 text-ink-muted px-2.5 py-1 text-[12px] font-black">
            Prix relevés le {pricesAt}
          </span>
        ) : null}
      </div>
      <div role="radiogroup" aria-label="Enseigne" className="mt-4 flex flex-col gap-2">
        {totals.map((t) => {
          const on = t.id === selected;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSelected(t.id)}
              className={cx(
                'flex min-h-[54px] items-center gap-2.5 rounded-[14px] border-2 bg-white px-3 text-left transition-[border-color,box-shadow] motion-reduce:transition-none',
                on
                  ? 'border-brand shadow-[0_0_0_3px_theme(colors.brand.soft)]'
                  : 'border-surface-50 hover:border-line',
              )}
            >
              <StoreLogo id={t.id} name={t.name} size={34} />
              <span className="min-w-0 flex-1 text-[15px] font-extrabold">
                {t.name}
                {t.id === cheapest ? (
                  <span className="rounded-pill bg-saving-soft text-saving-ink ml-1.5 px-2 py-0.5 text-[11px] font-black">
                    Le moins cher
                  </span>
                ) : t.id === myStore ? (
                  <span className="rounded-pill bg-brand-soft text-brand ml-1.5 px-2 py-0.5 text-[11px] font-black">
                    Ton enseigne
                  </span>
                ) : null}
              </span>
              <span className="flex flex-col items-end">
                <Price cents={t.cents} estimate={t.estimate} size="md" className="text-[16px]" />
                <Reliability level={t.reliability} className="text-[11px]" />
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={cx(
          'mt-4 rounded-[16px] px-4 py-3',
          isMine || diff <= 0 ? 'bg-surface-50 text-ink-muted' : 'bg-saving-soft text-saving-ink',
        )}
        aria-live="polite"
      >
        <p className="text-[13px] font-black">
          {isMine
            ? 'Total chez ton enseigne'
            : diff > 0
              ? `Économie par rapport à ${mine.name}`
              : `Écart avec ${mine.name}`}
        </p>
        <p className="font-display text-ink text-[30px] font-extrabold tabular-nums tracking-[-1px]">
          {isMine ? formatEuro(mine.cents) : diff > 0 ? `−${formatEuro(diff)}` : `+${formatEuro(-diff)}`}
        </p>
      </div>
      <button
        type="button"
        onClick={() => choose(selected)}
        disabled={pending}
        className={buttonClasses('primary', 'md', 'mt-4 w-full')}
      >
        {isMine ? `Garder ${mine.name} et voir ma liste` : `Faire mes courses chez ${cur.name}`}
      </button>
      <p className="text-ink-muted mt-2.5 text-center text-[13px] font-bold">
        Ton choix reste libre, même plus cher.
      </p>

      {cheaperProducts > 0 && cheapest !== myStore ? (
        <Link
          href={href('/app/comparateur')}
          className="border-line text-ink hover:border-brand mt-4 flex items-center gap-3 rounded-[16px] border border-dashed bg-white/60 px-3.5 py-3 no-underline transition-colors"
        >
          <Icon name="panier" size={22} className="text-brand shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-black">Produit par produit</span>
            <span className="text-ink-muted block text-[13px] font-bold">
              {cheaperProducts} produits moins chers chez {cheap.name}
            </span>
          </span>
          <span className="rounded-pill bg-brand text-brand-on px-2 py-0.5 text-[11px] font-black">
            PREMIUM
          </span>
        </Link>
      ) : null}
      <ActionMessage message={message} onClose={clear} />
    </aside>
  );
}
