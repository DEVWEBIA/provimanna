'use client';

import { RecipePhoto } from '@/components/recipes/recipe-photo';
import Link from 'next/link';
import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import type { MealSlot } from '@repas/core';
import { animDelay, cx, Icon, Price } from '@repas/ui';
import { moveMealAction, replaceMealAction, toggleLockAction } from '@/app/app/(main)/plan/actions';
import type { PlanMealView } from '@/lib/plan';
import { href } from '@/lib/site';
import { DAY_LONG, DAY_SHORT, dayOfMonth, PLAT_TINT, SLOT_LABEL } from './labels';
import { ActionMessage, usePlanAction } from './use-plan-action';

export interface PlanBoardProps {
  planId: string;
  weekStart: string;
  /** Jour de la semaine affiché comme « aujourd'hui » (1 = lundi), null hors de la semaine. */
  today: number | null;
  meals: PlanMealView[];
  /** Jours planifiés du foyer (1 = lundi … 7). */
  days: number[];
  /** Midi + soir, ou soir seulement. */
  withLunch: boolean;
}

const recipeHref = (slug: string) => href(`/app/recettes/${slug}`);

/**
 * Grille des repas (desktop) et vue jour par jour (mobile), maquettes AppPlan / MPlan.
 * Seuls les jours et moments choisis par le foyer sont affichés (questionnaire du 08/11/2026).
 */
export function PlanBoard({ planId, weekStart, today, meals, days, withLunch }: PlanBoardProps) {
  const { run, pending, message, clear } = usePlanAction();
  const SLOTS: MealSlot[] = withLunch ? ['dejeuner', 'diner'] : ['diner'];
  const shown = [1, 2, 3, 4, 5, 6, 7].filter((d) => days.includes(d));
  const [day, setDay] = useState(today && shown.includes(today) ? today : (shown[0] ?? 1));
  const [menu, setMenu] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const meal = (d: number, s: MealSlot) => meals.find((m) => m.day === d && m.slot === s);

  const replace = (m: PlanMealView) =>
    run(
      () => replaceMealAction(planId, { itemId: m.id }),
      () => setMenu(null),
    );
  const lock = (m: PlanMealView) =>
    run(
      () => toggleLockAction(planId, { itemId: m.id, locked: !m.locked }),
      () => setMenu(null),
    );

  const onDrop = (e: DragEvent, d: number, s: MealSlot) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    setDragging(null);
    setOver(null);
    if (itemId) run(() => moveMealAction(planId, { itemId, day: d, slot: s }));
  };

  return (
    <section
      aria-label="Grille des repas"
      className={cx('min-w-0', pending && 'opacity-70 transition-opacity')}
    >
      {/* Desktop : 7 jours × midi / soir */}
      <div className="hidden lg:block">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `52px repeat(${shown.length}, minmax(0, 1fr))` }}
        >
          <span />
          {shown
            .map((d) => [DAY_SHORT[d - 1]!, d - 1] as const)
            .map(([label, i]) => (
              <span
                key={label + i}
                className={cx(
                  'anim-rise rounded-[14px] py-2 text-center',
                  today === i + 1
                    ? 'bg-brand text-brand-on shadow-[0_8px_20px_rgba(107,56,104,0.3)]'
                    : 'text-ink',
                )}
                style={animDelay(i * 40)}
              >
                <span className="block text-[12px] font-black tracking-[1px]">{label}</span>
                <span className="font-display block text-[22px] font-extrabold">
                  {dayOfMonth(weekStart, i + 1)}
                </span>
              </span>
            ))}
          {SLOTS.map((slot, row) => (
            <Row key={slot} label={SLOT_LABEL[slot]}>
              {shown.map((d) => {
                const i = d - 1;
                const m = meal(d, slot);
                const cell = `${d}:${slot}`;
                return (
                  <div
                    key={cell}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOver(cell);
                    }}
                    onDragLeave={() => setOver((o) => (o === cell ? null : o))}
                    onDrop={(e) => onDrop(e, d, slot)}
                    className={cx(
                      'anim-rise relative min-w-0 rounded-[20px] transition-shadow',
                      over === cell && dragging && 'shadow-[0_0_0_3px_theme(colors.brand.DEFAULT)]',
                      // Chaque carte animée crée un contexte d'empilement : celle dont le menu est ouvert passe devant.
                      m && menu === m.id && 'z-30',
                    )}
                    style={animDelay(120 + row * 200 + i * 40)}
                  >
                    {m ? (
                      <MealCell
                        meal={m}
                        open={menu === m.id}
                        onToggle={() => setMenu(menu === m.id ? null : m.id)}
                        onClose={() => setMenu(null)}
                        onReplace={() => replace(m)}
                        onLock={() => lock(m)}
                        dragging={dragging === m.id}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', m.id);
                          e.dataTransfer.effectAllowed = 'move';
                          setDragging(m.id);
                          setMenu(null);
                        }}
                        onDragEnd={() => {
                          setDragging(null);
                          setOver(null);
                        }}
                      />
                    ) : (
                      <div className="border-line h-full min-h-[150px] rounded-[20px] border-2 border-dashed" />
                    )}
                  </div>
                );
              })}
            </Row>
          ))}
        </div>
        <p className="text-ink-muted mt-4 text-center text-[13px] font-bold">
          Glisse un repas pour le déplacer · clique pour le remplacer ou voir la recette
        </p>
      </div>

      {/* Mobile : un jour à la fois */}
      <div className="lg:hidden">
        <div role="tablist" aria-label="Jours" className="flex gap-1.5 pb-2">
          {shown.map((d) => {
            const i = d - 1;
            const label = DAY_SHORT[i]!;
            const on = day === d;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="jour-repas"
                onClick={() => setDay(i + 1)}
                className={cx(
                  'min-h-[62px] min-w-0 flex-1 rounded-[16px] transition-colors',
                  on
                    ? 'bg-brand text-brand-on shadow-[0_8px_20px_rgba(107,56,104,0.3)]'
                    : cx(
                        'text-ink border bg-white/80 backdrop-blur',
                        today === i + 1 ? 'border-brand' : 'border-line',
                      ),
                )}
              >
                <span className="block text-[11px] font-black">{label}</span>
                <span className="font-display block text-[20px] font-extrabold">
                  {dayOfMonth(weekStart, i + 1)}
                </span>
              </button>
            );
          })}
        </div>
        <div
          id="jour-repas"
          role="tabpanel"
          aria-label={DAY_LONG[day - 1]}
          key={day}
          className="mt-4 flex flex-col gap-3.5"
        >
          {SLOTS.map((slot, k) => {
            const m = meal(day, slot);
            if (!m) return null;
            return (
              <article
                key={m.id}
                className="anim-rise border-line overflow-hidden rounded-[22px] border bg-white/80 shadow-[0_2px_20px_rgba(42,26,40,0.05)] backdrop-blur"
                style={animDelay(k * 90)}
              >
                <Link
                  href={recipeHref(m.recipe.slug)}
                  className="text-ink flex items-center gap-4 p-3.5 no-underline"
                >
                  <span
                    className={cx(
                      'grid h-[96px] w-[96px] shrink-0 place-items-center rounded-[18px]',
                      PLAT_TINT[m.recipe.illustration],
                    )}
                  >
                    <RecipePhoto slug={m.recipe.slug} illustration={m.recipe.illustration} size={84} />
                  </span>
                  <span className="min-w-0">
                    <span className="text-ink-muted flex items-center gap-1.5 text-[12px] font-black tracking-[1px]">
                      {SLOT_LABEL[slot]}
                      {m.locked ? (
                        <>
                          <Icon name="verrou" size={13} />
                          <span className="sr-only">verrouillé</span>
                        </>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[18px] font-black leading-snug">{m.recipe.title}</span>
                    <span className="text-ink-muted mt-1 block text-[14px] font-bold tabular-nums">
                      {m.recipe.minutes} min ·{' '}
                      <Price cents={m.perServingCents} size="sm" suffix="/ part" className="text-ink" />
                    </span>
                  </span>
                </Link>
                <div className="border-line flex items-center border-t px-2">
                  <button
                    type="button"
                    onClick={() => replace(m)}
                    disabled={pending}
                    className="text-brand min-h-tap flex-1 text-[14px] font-black"
                  >
                    ↻ Remplacer
                  </button>
                  <span className="bg-line h-6 w-px" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => lock(m)}
                    disabled={pending}
                    aria-pressed={m.locked}
                    className={cx(
                      'min-h-tap flex-1 text-[14px] font-black',
                      m.locked ? 'text-brand' : 'text-ink-muted',
                    )}
                  >
                    {m.locked ? 'Verrouillé' : 'Verrouiller'}
                  </button>
                  <span className="bg-line h-6 w-px" aria-hidden="true" />
                  <Link
                    href={recipeHref(m.recipe.slug)}
                    className="text-ink min-h-tap flex flex-1 items-center justify-center text-[14px] font-black no-underline"
                  >
                    Voir la recette
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <ActionMessage message={message} onClose={clear} />
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <span className="text-ink-muted rotate-180 self-center justify-self-center text-[12px] font-black tracking-[1px] [writing-mode:vertical-rl]">
        {label}
      </span>
      {children}
    </>
  );
}

function MealCell(props: {
  meal: PlanMealView;
  open: boolean;
  dragging: boolean;
  onToggle: () => void;
  onClose: () => void;
  onReplace: () => void;
  onLock: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: () => void;
}) {
  const { meal: m, open, onClose } = props;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative h-full">
      <button
        type="button"
        draggable
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        onClick={props.onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cx(
          'border-line hover:border-brand flex h-full min-h-[150px] w-full cursor-grab flex-col items-center gap-1.5 rounded-[20px] border bg-white/80 px-2 pb-3 pt-2.5 text-center shadow-[0_2px_14px_rgba(42,26,40,0.05)] backdrop-blur transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(42,26,40,0.10)] active:cursor-grabbing motion-reduce:transition-none',
          open && 'border-brand',
          props.dragging && 'opacity-40',
        )}
      >
        {m.locked ? (
          <span className="text-brand absolute right-2 top-2" title="Verrouillé">
            <Icon name="verrou" size={14} />
            <span className="sr-only">Verrouillé</span>
          </span>
        ) : null}
        <RecipePhoto slug={m.recipe.slug} illustration={m.recipe.illustration} size={62} />
        <span className="line-clamp-3 text-[13px] font-black leading-tight">{m.recipe.title}</span>
        <Price
          cents={m.perServingCents}
          size="sm"
          suffix="/ part"
          className="text-ink-muted mt-auto whitespace-normal text-[12px] leading-tight"
        />
      </button>
      {open ? (
        // Positionnement (translate) et animation sur deux éléments : l'animation écraserait le translate.
        <div className="absolute left-1/2 top-[calc(100%+6px)] z-20 w-[200px] -translate-x-1/2">
          <div
            role="menu"
            aria-label={m.recipe.title}
            className="anim-pop border-line flex flex-col rounded-[18px] border bg-white p-1.5 shadow-[0_18px_40px_rgba(42,26,40,0.18)]"
          >
            <Link
              role="menuitem"
              href={recipeHref(m.recipe.slug)}
              className="text-ink hover:bg-surface-50 min-h-tap flex items-center rounded-[12px] px-3 text-[14px] font-extrabold no-underline"
            >
              Voir la recette
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={props.onReplace}
              className="text-ink hover:bg-surface-50 min-h-tap rounded-[12px] px-3 text-left text-[14px] font-extrabold"
            >
              ↻ Remplacer
            </button>
            <button
              role="menuitem"
              type="button"
              onClick={props.onLock}
              className="text-ink hover:bg-surface-50 min-h-tap flex items-center gap-2 rounded-[12px] px-3 text-left text-[14px] font-extrabold"
            >
              <Icon name="verrou" size={15} />
              {m.locked ? 'Déverrouiller' : 'Verrouiller'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
