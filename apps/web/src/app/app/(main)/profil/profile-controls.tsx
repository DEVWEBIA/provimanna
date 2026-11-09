'use client';

import { useOptimistic, useTransition } from 'react';
import { cx } from '@repas/ui';
import { setNotifications, setTheme } from './actions';

const THEMES = [
  ['auto', 'Auto'],
  ['clair', 'Clair'],
  ['sombre', 'Sombre'],
] as const;

export function ThemeChooser({ value }: { value: 'auto' | 'clair' | 'sombre' }) {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useOptimistic(value);
  return (
    <div
      role="radiogroup"
      aria-label="Thème"
      className="bg-surface-50 rounded-pill border-line inline-flex border p-1"
    >
      {THEMES.map(([v, l]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={current === v}
          disabled={pending}
          onClick={() =>
            start(async () => {
              setCurrent(v);
              await setTheme(v);
            })
          }
          className={cx(
            'rounded-pill min-h-tap px-4 text-[14px] font-black',
            current === v ? 'bg-brand text-brand-on' : 'text-ink',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function NotificationToggles({ thursday, promos }: { thursday: boolean; promos: boolean }) {
  const [, start] = useTransition();
  const [state, setState] = useOptimistic({ notify_thursday: thursday, notify_promos: promos });
  const toggle = (k: 'notify_thursday' | 'notify_promos') =>
    start(async () => {
      const next = { ...state, [k]: !state[k] };
      setState(next);
      await setNotifications(next);
    });
  return (
    <ul className="flex flex-col">
      {(
        [
          ['notify_thursday', 'Ton menu est prêt', 'Le jeudi à 19 h'],
          ['notify_promos', 'Promos dans ton plan', 'Quand un ingrédient de ta semaine est en promo'],
        ] as const
      ).map(([k, t, d]) => (
        <li key={k} className="border-line flex items-center justify-between gap-4 border-t py-3">
          <span>
            <span className="block font-black">{t}</span>
            <span className="text-ink-muted text-[14px] font-bold">{d}</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={state[k]}
            aria-label={t}
            onClick={() => toggle(k)}
            className="grid h-11 w-14 shrink-0 place-items-center rounded-full"
          >
            {/* Piste de 32 px dans une cible de 44 px. */}
            <span
              aria-hidden="true"
              className={cx(
                'relative h-8 w-14 rounded-full transition-colors',
                state[k] ? 'bg-brand' : 'bg-toggle-off',
              )}
            >
              <span
                className={cx(
                  'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-[left]',
                  state[k] ? 'left-7' : 'left-1',
                )}
              />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
