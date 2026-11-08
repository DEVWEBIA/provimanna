import type { StoreId } from '@repas/core';
import { cx } from './cx.ts';

// Fond pastel neutre par enseigne (jamais de logo ni de couleur officielle). 6 fonds pour 13 enseignes.
const CHIP_BG: Record<StoreId, string> = {
  lidl: 'bg-chip-1',
  aldi: 'bg-chip-2',
  leclerc: 'bg-chip-3',
  intermarche: 'bg-chip-4',
  carrefour: 'bg-chip-5',
  auchan: 'bg-chip-6',
  netto: 'bg-chip-3',
  'super-u': 'bg-chip-1',
  'grand-frais': 'bg-chip-2',
  picard: 'bg-chip-5',
  franprix: 'bg-chip-4',
  monoprix: 'bg-chip-6',
  match: 'bg-chip-2',
};

export interface StoreChipProps {
  storeId: StoreId;
  /** Nom en clair : « E.Leclerc ». */
  name: string;
  /** Deux lettres : « EL ». */
  initials: string;
  size?: 'md' | 'sm';
  /** Masque le nom (la pastille garde un libellé accessible). */
  hideName?: boolean;
  className?: string;
}

export function StoreChip({
  storeId,
  name,
  initials,
  size = 'md',
  hideName = false,
  className,
}: StoreChipProps) {
  return (
    <span className={cx('inline-flex items-center gap-2 font-extrabold', className)}>
      <span
        className={cx(
          'text-raw-encre grid shrink-0 place-items-center font-black',
          CHIP_BG[storeId],
          size === 'md' ? 'h-9 w-9 rounded-[10px] text-[12px]' : 'h-7 w-7 rounded-lg text-[11px]',
        )}
        {...(hideName ? { role: 'img', 'aria-label': name } : { 'aria-hidden': true })}
      >
        {initials}
      </span>
      {hideName ? null : <span>{name}</span>}
    </span>
  );
}
