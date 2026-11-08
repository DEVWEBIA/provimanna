'use client';

import type { ReactNode } from 'react';
import { cx, Icon, type IconName } from '@repas/ui';
import { DAY_NAMES } from '@/lib/meal-days';

/** Pastille ronde d'icône des cartes du questionnaire. */
export function IconBubble({ name, size = 52 }: { name: IconName; size?: number }) {
  return (
    <span
      className="bg-brand-soft text-brand grid shrink-0 place-items-center rounded-full transition-colors"
      style={{ width: size, height: size }}
    >
      <Icon name={name} size={Math.round(size * 0.46)} />
    </span>
  );
}

const cardBase =
  'border-2 border-transparent bg-white shadow-[0_2px_18px_rgba(42,26,40,0.06)] transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 peer-checked:border-brand peer-checked:bg-raw-aubergine-clair peer-checked:shadow-[0_8px_24px_rgba(107,56,104,0.14)] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:hover:translate-y-0 motion-reduce:transition-none dark:bg-surface-0 dark:peer-checked:bg-surface-50';

interface ChoiceProps {
  type: 'checkbox' | 'radio';
  name: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

/** Coche ronde, visible quand la carte est choisie. */
function Tick() {
  return (
    <span
      aria-hidden="true"
      className="bg-brand text-brand-on absolute right-3 top-3 hidden h-6 w-6 place-items-center rounded-full peer-checked:grid"
    >
      <Icon name="check" size={14} strokeWidth={3} />
    </span>
  );
}

/** Carte en ligne : icône ronde, titre et précision (motivations, styles, budget…). */
export function OptionCard({
  icon,
  title,
  hint,
  ...input
}: ChoiceProps & { icon: IconName; title: ReactNode; hint?: ReactNode }) {
  return (
    <label className="relative block cursor-pointer">
      <input {...input} type={input.type} className="peer sr-only" />
      <span className={cx(cardBase, 'flex min-h-[84px] items-center gap-4 rounded-[24px] px-4 py-3.5 pr-12')}>
        <IconBubble name={icon} />
        <span className="min-w-0">
          <span className="block text-[18px] font-black leading-[23px]">{title}</span>
          {hint ? <span className="text-ink-muted mt-0.5 block text-[15px] font-bold">{hint}</span> : null}
        </span>
      </span>
      <Tick />
    </label>
  );
}

/** Tuile verticale : icône (ou logo) au-dessus du libellé (régimes, équipement, enseignes). */
export function OptionTile({
  visual,
  title,
  hint,
  ...input
}: ChoiceProps & { visual: ReactNode; title: ReactNode; hint?: ReactNode }) {
  return (
    <label className="relative block cursor-pointer">
      <input {...input} type={input.type} className="peer sr-only" />
      <span
        className={cx(
          cardBase,
          'flex min-h-[132px] flex-col items-center justify-center gap-2.5 rounded-[24px] px-3 py-4 text-center',
        )}
      >
        {visual}
        <span className="text-[17px] font-black leading-[21px]">{title}</span>
        {hint ? <span className="text-ink-muted -mt-1.5 text-[14px] font-bold">{hint}</span> : null}
      </span>
      <Tick />
    </label>
  );
}

/** Pastille cochable (ingrédients à éviter). */
export function ChipToggle({ label, ...input }: Omit<ChoiceProps, 'type'> & { label: string }) {
  return (
    <label className="cursor-pointer">
      <input {...input} type="checkbox" className="peer sr-only" />
      <span className="rounded-pill border-line text-ink peer-checked:border-brand peer-checked:bg-brand peer-checked:text-brand-on peer-focus-visible:outline-brand dark:bg-surface-0 inline-flex min-h-11 items-center gap-1.5 border-2 bg-white px-4 text-[15px] font-extrabold transition-colors peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2">
        {input.checked ? <Icon name="interdit" size={15} /> : null}
        {label}
      </span>
    </label>
  );
}

/** Encart d'information en bas d'étape (« Jamais d'exception », « Adapté à ta cuisine »…). */
export function InfoNote({ icon, title, children }: { icon: IconName; title?: string; children: ReactNode }) {
  return (
    <div className="bg-brand-soft mt-6 flex items-center gap-4 rounded-[22px] px-5 py-4">
      <span className="text-brand dark:bg-surface-0 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/70">
        <Icon name={icon} size={22} />
      </span>
      <p className="text-brand-soft-ink text-[15px] font-bold leading-[22px]">
        {title ? <strong className="text-brand block text-[16px] font-black">{title}</strong> : null}
        {children}
      </p>
    </div>
  );
}

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Grille de la semaine : un bouton par jour, une ligne par moment (midi, soir). */
export function WeekGrid({
  days,
  withLunch,
  onToggle,
}: {
  days: readonly number[];
  withLunch: boolean;
  onToggle: (day: number) => void;
}) {
  const rows: { id: string; label: string; icon: IconName }[] = [
    ...(withLunch ? [{ id: 'midi', label: 'Midi', icon: 'soleil' as const }] : []),
    { id: 'soir', label: 'Soir', icon: 'lune' },
  ];
  return (
    <div className="dark:bg-surface-0 rounded-[24px] bg-white p-3 shadow-[0_2px_18px_rgba(42,26,40,0.06)] sm:p-4">
      <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))] gap-1.5 sm:grid-cols-[64px_repeat(7,minmax(0,1fr))] sm:gap-2">
        <span />
        {DAY_LETTERS.map((l, i) => {
          const on = days.includes(i + 1);
          return (
            <button
              key={i}
              type="button"
              aria-pressed={on}
              aria-label={DAY_NAMES[i]}
              onClick={() => onToggle(i + 1)}
              className={cx(
                'min-h-11 rounded-[14px] text-[16px] font-black transition-colors motion-reduce:transition-none',
                on
                  ? 'bg-brand text-brand-on shadow-[0_6px_14px_rgba(107,56,104,0.25)]'
                  : 'bg-surface-50 text-ink-muted hover:text-ink',
              )}
            >
              {l}
            </button>
          );
        })}
        {rows.map((row) => (
          <div key={row.id} className="contents" aria-hidden="true">
            <span className="text-ink-muted self-center text-[12px] font-black uppercase tracking-[1px]">
              {row.label}
            </span>
            {DAY_LETTERS.map((_, i) => {
              const on = days.includes(i + 1);
              return (
                <span
                  key={i}
                  className={cx(
                    'grid h-10 place-items-center rounded-[12px] transition-colors',
                    on ? 'bg-brand-soft text-brand' : 'bg-surface-50 text-line',
                  )}
                >
                  <Icon name={row.icon} size={16} />
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
