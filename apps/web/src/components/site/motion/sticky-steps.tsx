'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { formatEuro, type StoreId } from '@repas/core';
import { cx, Icon, Plat, PLAT_VARIANTS, StoreChip, type IconName } from '@repas/ui';

export interface StepItem {
  icon: IconName;
  title: string;
  text: string;
}

export interface DemoStore {
  id: StoreId;
  name: string;
  initials: string;
  cents: number;
}

const SPRING = { type: 'spring', stiffness: 260, damping: 22 } as const;

/** Étape 1 : le foyer se décrit en quelques pastilles. */
function FoyerVisual() {
  const chips = ['2 adultes', '2 enfants', 'Sans porc', 'Moins de 30 min', 'Code postal 69003'];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-ink-muted text-[13px] font-black tracking-[1.2px]">TON FOYER</p>
      <div className="flex flex-wrap gap-2.5">
        {chips.map((c, i) => (
          <motion.span
            key={c}
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING, delay: 0.08 * i }}
            className={cx(
              'rounded-pill px-4 py-2 text-[16px] font-extrabold',
              i < 2 ? 'bg-brand text-brand-on' : 'border-line border-2 bg-white',
            )}
          >
            {c}
          </motion.span>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-ink-muted text-[15px] font-bold"
      >
        Une minute, une seule fois.
      </motion.p>
    </div>
  );
}

/** Étape 2 : la semaine se remplit, 7 jours × midi et soir. */
function PlanVisual() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  return (
    <div>
      <p className="text-ink-muted text-[13px] font-black tracking-[1.2px]">TA SEMAINE · 14 REPAS</p>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((d, di) => (
          <div key={d} className="flex flex-col items-center gap-2">
            <span className="text-ink-muted text-[12px] font-black">{d}</span>
            {[0, 1].map((slot) => {
              const k = di * 2 + slot;
              return (
                <motion.span
                  key={slot}
                  initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ ...SPRING, delay: 0.04 * k }}
                  className="grid aspect-square w-full place-items-center rounded-[14px] bg-white shadow-[0_2px_10px_rgba(42,26,40,0.06)]"
                >
                  <Plat variant={PLAT_VARIANTS[k % PLAT_VARIANTS.length]!} size={40} decorative />
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Étape 3 : les totaux des enseignes se rangent, la moins chère en orange. */
function CompareVisual({ stores }: { stores: DemoStore[] }) {
  const sorted = [...stores].sort((a, b) => a.cents - b.cents);
  const max = sorted.at(-1)?.cents ?? 1;
  return (
    <div>
      <p className="text-ink-muted text-[13px] font-black tracking-[1.2px]">LA MÊME LISTE, PARTOUT</p>
      <ul className="mt-4 flex flex-col gap-2">
        {sorted.map((s, i) => (
          <motion.li
            key={s.id}
            layout
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: 0.06 * i }}
            className={cx(
              'flex items-center gap-3 rounded-[14px] px-3 py-2',
              i === 0 ? 'bg-site-highlight' : 'bg-white/70',
            )}
          >
            <StoreChip
              storeId={s.id}
              name={s.name}
              initials={s.initials}
              size="sm"
              className="w-[130px] text-[14px]"
            />
            <span className="bg-site-track h-2 flex-1 overflow-hidden rounded-[9px]" aria-hidden="true">
              <motion.span
                className={cx('block h-full rounded-[9px]', i === 0 ? 'bg-saving' : 'bg-site-bar')}
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((s.cents / max) * 100)}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + 0.06 * i }}
              />
            </span>
            <span className="w-[76px] text-right text-[15px] font-black tabular-nums">
              {formatEuro(s.cents)}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ step, index, active }: { step: StepItem; index: number; active: boolean }) {
  return (
    <div
      className={cx(
        'rounded-[26px] border p-6 transition-[background-color,border-color,opacity,transform] duration-500 motion-reduce:transition-none',
        active
          ? 'border-line bg-white/80 opacity-100 shadow-[0_10px_40px_rgba(42,26,40,0.08)] backdrop-blur'
          : 'border-transparent opacity-45',
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cx(
            'rounded-pill grid h-11 w-11 shrink-0 place-items-center text-[17px] font-black transition-colors duration-500',
            active ? 'bg-brand text-brand-on' : 'bg-surface-0 text-brand border-line border',
          )}
        >
          {index + 1}
        </span>
        <h3 className="text-[22px] font-black">{step.title}</h3>
        <Icon name={step.icon} size={24} className="text-brand ml-auto" />
      </div>
      <p className="text-ink-muted mt-3 pl-[60px] text-[16px] leading-6">{step.text}</p>
    </div>
  );
}

/**
 * « Comment ça marche » : sur grand écran, la section reste à l'écran pendant que les 3 étapes défilent,
 * et l'illustration de droite change à chaque étape. Sur mobile ou sans animation : liste simple.
 */
export function StickySteps({ steps, stores }: { steps: StepItem[]; stores: DemoStore[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length * 0.999))));
  });

  const visuals = [
    <FoyerVisual key="f" />,
    <PlanVisual key="p" />,
    <CompareVisual key="c" stores={stores} />,
  ];

  const simple = (
    <ol className="mx-auto mt-14 grid max-w-[1080px] gap-5 md:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title}>
          <StepCard step={s} index={i} active />
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Mobile ou animations réduites : liste simple (choix fait en CSS, sans écart d'hydratation). */}
      <div className="lg:hidden motion-reduce:lg:block">{simple}</div>
      <div ref={ref} className="relative hidden h-[300vh] lg:block motion-reduce:lg:hidden">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[1080px] grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-14">
            <div className="relative">
              <span
                className="bg-line absolute bottom-6 left-[22px] top-6 w-[3px] rounded-full"
                aria-hidden="true"
              />
              <motion.span
                className="bg-brand absolute left-[22px] top-6 h-[calc(100%-48px)] w-[3px] origin-top rounded-full"
                style={{ scaleY: progress }}
                aria-hidden="true"
              />
              <ol className="relative flex flex-col gap-3">
                {steps.map((s, i) => (
                  <li key={s.title} aria-current={i === active ? 'step' : undefined}>
                    <StepCard step={s} index={i} active={i === active} />
                  </li>
                ))}
              </ol>
            </div>
            <div className="border-line relative min-h-[420px] overflow-hidden rounded-[32px] border bg-white/60 p-8 shadow-[0_30px_80px_rgba(42,26,40,0.12)] backdrop-blur-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {visuals[active]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
