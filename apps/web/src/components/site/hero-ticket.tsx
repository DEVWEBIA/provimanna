'use client';

import { useState } from 'react';
import { formatEuro, priceSpread, scaleCents, type StoreId } from '@repas/core';
import { cx, StoreChip, TicketCard } from '@repas/ui';
import type { ExampleStore } from '@/lib/landing-data';

export interface HeroTicketProps {
  stores: ExampleStore[];
  myStore: StoreId;
  households: readonly { people: number; label: string; factor: number }[];
  weekLabel: string;
  /** Couleur du fond derrière le ticket (dents du bord dentelé). */
  edge?: 'surface-50' | 'brand';
}

/** Ticket comparateur interactif du hero : le total des 6 enseignes suit la taille du foyer. */
export function HeroTicket({ stores, myStore, households, weekLabel, edge = 'surface-50' }: HeroTicketProps) {
  const [people, setPeople] = useState(4);
  const factor = households.find((h) => h.people === people)?.factor ?? 1;
  const rows = stores.map((s) => ({ ...s, total: scaleCents(s.cents, factor) }));
  const spread = priceSpread(rows.map((r) => r.total));
  const cheapestId = rows.find((r) => r.total === spread.minCents)?.id;
  const mine = rows.find((r) => r.id === myStore);
  const gap = mine ? mine.total - spread.minCents : spread.gapCents;

  return (
    <TicketCard
      edge={edge}
      className="w-full max-w-[440px] -rotate-[1.2deg] rounded-t-[22px] px-[26px] pb-[34px] pt-[26px] shadow-[0_24px_48px_rgba(42,26,40,0.14)] motion-reduce:rotate-0"
    >
      <div className="border-line flex items-baseline justify-between gap-3 border-b-2 border-dashed pb-3.5">
        <div>
          <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">TA SEMAINE · 14 REPAS</p>
          <p className="font-display mt-1 text-[24px] font-extrabold tracking-[-0.5px]">Combien ça coûte ?</p>
        </div>
        <p className="text-ink-muted text-[12px] font-bold">Exemple · {weekLabel}</p>
      </div>
      <fieldset className="mb-3 mt-4">
        <legend className="text-ink-muted mb-2 text-[13px] font-extrabold">Ton foyer</legend>
        <div className="flex flex-wrap gap-2">
          {households.map((h) => {
            const on = h.people === people;
            return (
              <button
                key={h.people}
                type="button"
                aria-pressed={on}
                onClick={() => setPeople(h.people)}
                className={cx(
                  'min-h-tap rounded-pill border-2 px-4 text-[14px] font-extrabold',
                  on
                    ? 'border-brand bg-brand text-brand-on'
                    : 'border-line bg-surface-0 text-ink hover:border-brand',
                )}
              >
                {h.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <ul className="flex flex-col gap-1.5" aria-live="polite">
        {rows.map((r) => {
          const cheap = r.id === cheapestId;
          const isMine = r.id === myStore;
          return (
            <li
              key={r.id}
              className={cx(
                'flex items-center gap-3 rounded-[14px] px-2.5 py-2',
                cheap && 'bg-site-highlight',
              )}
            >
              <span aria-hidden="true">
                <StoreChip storeId={r.id} name={r.name} initials={r.initials} hideName size="sm" />
              </span>
              <span className="min-w-0 flex-auto">
                <span className="flex justify-between gap-2 text-[15px] font-extrabold">
                  <span>
                    {r.name}
                    {cheap ? (
                      <span className="rounded-pill bg-saving-soft text-saving-ink ml-1.5 px-2 py-0.5 text-[11px] font-black">
                        Le moins cher
                      </span>
                    ) : isMine ? (
                      <span className="rounded-pill bg-brand-soft text-brand ml-1.5 px-2 py-0.5 text-[11px] font-black">
                        Ton enseigne
                      </span>
                    ) : null}
                  </span>
                  <span className="font-black tabular-nums">{formatEuro(r.total)}</span>
                </span>
                <span className="bg-site-track mt-1.5 block h-1.5 rounded-[9px]" aria-hidden="true">
                  <span
                    className={cx(
                      'block h-1.5 rounded-[9px]',
                      cheap ? 'bg-saving' : isMine ? 'bg-brand' : 'bg-site-bar',
                    )}
                    style={{ width: `${Math.round((r.total / spread.maxCents) * 100)}%` }}
                  />
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-muted max-w-[200px] text-[14px] font-bold">
          Écart entre ton enseigne et la moins chère
        </p>
        <p className="bg-saving font-display text-raw-encre rounded-[14px] px-4 py-2 text-[30px] font-extrabold tabular-nums tracking-[-1px]">
          −{formatEuro(gap)}
        </p>
      </div>
    </TicketCard>
  );
}
