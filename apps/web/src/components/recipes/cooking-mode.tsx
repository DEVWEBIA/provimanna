'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cx, Plat, type PlatVariant } from '@repas/ui';
import { href } from '@/lib/site';

export interface CookingModeProps {
  slug: string;
  title: string;
  illustration: PlatVariant;
  servings: number;
  steps: { text: string; minutes: number | null }[];
  ingredients: string[];
}

/** Minuteur proposé pour les étapes de cuisson d'au moins 3 minutes. */
const TIMER_MIN = 3;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Mode cuisine (maquette AppCuisine) : une étape à la fois en très grand, minuteur, grandes cibles,
 * écran maintenu allumé (Wake Lock) tant que la page est ouverte.
 */
export function CookingMode({ slug, title, illustration, servings, steps, ingredients }: CookingModeProps) {
  const [i, setI] = useState(0);
  const step = steps[i]!;
  const total = (step.minutes ?? 0) >= TIMER_MIN ? step.minutes! * 60 : 0;
  const [sec, setSec] = useState(total);
  const [run, setRun] = useState(false);
  const [awake, setAwake] = useState(false);
  const lock = useRef<WakeLockSentinel | null>(null);

  // Écran maintenu allumé, repris quand on revient sur l'onglet.
  useEffect(() => {
    const request = async () => {
      try {
        lock.current = await navigator.wakeLock?.request('screen');
        setAwake(Boolean(lock.current));
      } catch {
        setAwake(false);
      }
    };
    void request();
    const onVisible = () => document.visibilityState === 'visible' && void request();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      void lock.current?.release();
    };
  }, []);

  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [run]);
  const finished = run && sec === 0;

  const go = (j: number) => {
    setI(j);
    const m = steps[j]!.minutes ?? 0;
    setSec(m >= TIMER_MIN ? m * 60 : 0);
    setRun(false);
  };
  const last = i === steps.length - 1;

  return (
    <div className="bg-raw-encre flex min-h-screen flex-col text-white">
      <header className="flex items-center gap-4 px-[clamp(16px,4vw,48px)] py-4">
        <Plat variant={illustration} size={56} decorative />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-black">{title}</p>
          <p className="text-site-on-ink-faint text-[14px] font-bold">
            {servings} parts{awake ? ' · écran maintenu allumé' : ''}
          </p>
        </div>
        <Link
          href={href(`/app/recettes/${slug}`)}
          aria-label="Quitter le mode cuisine"
          className="rounded-pill grid h-14 w-14 place-items-center bg-white/10 text-[30px] font-bold text-white no-underline"
        >
          ×
        </Link>
      </header>
      <div className="flex gap-1.5 px-[clamp(16px,4vw,48px)]" aria-hidden="true">
        {steps.map((_, k) => (
          <span
            key={k}
            className={cx(
              'h-1.5 flex-1 rounded-full transition-colors',
              k < i ? 'bg-site-brand-light' : k === i ? 'bg-saving' : 'bg-site-ink-line',
            )}
          />
        ))}
      </div>

      <main className="flex flex-1 flex-wrap items-center gap-10 px-[clamp(16px,4vw,48px)] py-10">
        <section aria-live="polite" className="min-w-0 flex-[1_1_480px]" key={i}>
          <p className="anim-rise text-raw-peche text-[16px] font-black tracking-[1.4px]">
            ÉTAPE {i + 1} SUR {steps.length}
          </p>
          <p className="anim-rise font-display mt-4 text-[clamp(30px,4.4vw,56px)] font-extrabold leading-[1.15] tracking-[-1px]">
            {step.text}
          </p>
          {i === 0 && ingredients.length ? (
            <ul className="anim-rise mt-8 flex flex-wrap gap-2">
              {ingredients.map((g) => (
                <li key={g} className="rounded-pill bg-white/10 px-4 py-2 text-[16px] font-bold">
                  {g}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
        {total > 0 ? (
          <aside className="anim-rise flex flex-[0_1_320px] flex-col items-center gap-5 rounded-[32px] bg-white/[0.06] p-8">
            <p className="text-site-on-ink-faint text-[14px] font-black tracking-[1.4px]">MINUTEUR</p>
            <p
              role="timer"
              aria-label={`${Math.floor(sec / 60)} minutes ${sec % 60} secondes`}
              className={cx(
                'font-display text-[72px] font-extrabold tabular-nums leading-none',
                run ? 'text-raw-peche' : 'text-site-on-brand',
              )}
            >
              {Math.floor(sec / 60)}:{pad(sec % 60)}
            </p>
            {finished ? (
              <p className="text-raw-peche text-[18px] font-black" role="alert">
                C’est prêt !
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => (sec === 0 ? (setSec(total), setRun(true)) : setRun(!run))}
              className="rounded-pill min-h-[60px] w-full border-2 border-white/50 text-[18px] font-black text-white"
            >
              {run ? 'Pause' : sec < total && sec > 0 ? 'Reprendre' : `Lancer ${Math.round(total / 60)} min`}
            </button>
          </aside>
        ) : null}
      </main>

      <footer className="bg-raw-encre sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/10 px-[clamp(16px,4vw,48px)] pb-[max(24px,env(safe-area-inset-bottom))] pt-4">
        <button
          type="button"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          className="rounded-pill min-h-[64px] px-6 text-[18px] font-black text-white disabled:opacity-40"
        >
          ← Précédente
        </button>
        {last ? (
          <Link
            href={href(`/app/recettes/${slug}`)}
            className="rounded-pill text-raw-encre inline-flex min-h-[64px] items-center bg-white px-8 text-[18px] font-black no-underline"
          >
            Terminé, bon appétit
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => go(i + 1)}
            className="rounded-pill text-raw-encre min-h-[64px] bg-white px-8 text-[18px] font-black"
          >
            Étape suivante →
          </button>
        )}
      </footer>
    </div>
  );
}
