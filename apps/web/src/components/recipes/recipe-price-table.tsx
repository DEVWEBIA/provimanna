'use client';

import { useState } from 'react';
import type { Reliability as ReliabilityLevel, StoreId } from '@repas/core';
import { formatEuro } from '@repas/core';
import { cx, Price, Reliability, StoreChip } from '@repas/ui';

export interface PriceRow {
  id: StoreId;
  name: string;
  initials: string;
  cents: number;
  perServing: number;
  /** Écart avec l'enseigne la moins chère (0 pour elle). */
  diff: number;
  estimate: boolean;
  reliability: ReliabilityLevel;
  /** L'enseigne ne vend pas tous les ingrédients : total partiel, sans écart ni classement. */
  partial: boolean;
}

/** Coût d'une recette dans chaque enseigne, pour 2 à 8 parts (calculs faits par core côté serveur). */
export function RecipePriceTable({
  byServings,
  initial = 4,
}: {
  byServings: Record<number, PriceRow[]>;
  initial?: number;
}) {
  const options = Object.keys(byServings)
    .map(Number)
    .sort((a, b) => a - b);
  const [n, setN] = useState(options.includes(initial) ? initial : options[0]!);
  const rows = byServings[n] ?? [];
  const i = options.indexOf(n);
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-ink-muted text-[15px] font-black">Pour</span>
        <button
          type="button"
          onClick={() => setN(options[i - 1]!)}
          disabled={i <= 0}
          aria-label="Moins de parts"
          className="rounded-pill border-line text-brand h-11 w-11 border-2 bg-white text-[20px] font-black disabled:opacity-40"
        >
          −
        </button>
        <output
          aria-live="polite"
          className="font-display min-w-[110px] text-center text-[22px] font-extrabold tabular-nums"
        >
          {n} personnes
        </output>
        <button
          type="button"
          onClick={() => setN(options[i + 1]!)}
          disabled={i >= options.length - 1}
          aria-label="Plus de parts"
          className="rounded-pill bg-brand text-brand-on h-11 w-11 text-[20px] font-black disabled:opacity-40"
        >
          +
        </button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-[15px] tabular-nums">
          <thead>
            <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
              <th scope="col" className="pb-2">
                ENSEIGNE
              </th>
              <th scope="col" className="pb-2 text-right">
                TOTAL
              </th>
              <th scope="col" className="pb-2 text-right">
                PAR PART
              </th>
              <th scope="col" className="pb-2 text-right">
                ÉCART
              </th>
              <th scope="col" className="pb-2 text-right">
                FIABILITÉ
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, k) => (
              <tr key={r.id} className={cx('border-line border-t', k === 0 && 'bg-site-highlight')}>
                <th scope="row" className="py-3 pl-2 text-left">
                  <StoreChip
                    storeId={r.id}
                    name={r.name}
                    initials={r.initials}
                    size="sm"
                    className="text-[15px]"
                  />
                </th>
                <td className="py-3 text-right font-black">
                  <Price cents={r.cents} estimate={r.estimate} size="sm" className="text-[15px]" />
                </td>
                <td className="py-3 text-right font-bold">{formatEuro(r.perServing)}</td>
                <td
                  className={cx('py-3 text-right font-black', k === 0 ? 'text-saving-ink' : 'text-ink-muted')}
                >
                  {r.partial ? 'partiel' : k === 0 ? 'Le moins cher' : `+${formatEuro(r.diff)}`}
                </td>
                <td className="py-3 pr-2 text-right">
                  {r.partial ? (
                    <span className="text-ink-muted text-[13px] font-bold">ingrédients manquants</span>
                  ) : (
                    <Reliability level={r.reliability} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
