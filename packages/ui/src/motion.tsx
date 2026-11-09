'use client';

/**
 * Animations partagées (site, espace client, back-office, questionnaire) avec Motion (motion.dev).
 * À placer sous <MotionRoot> : si l'utilisateur demande à réduire les animations, les déplacements
 * disparaissent (seuls de courts fondus restent).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import { formatEuro } from '@repas/core';

const EASE = [0.22, 1, 0.36, 1] as const;

export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type Tag = 'div' | 'li' | 'section' | 'ul' | 'ol' | 'article' | 'aside';

/** Apparition au défilement avec un effet ressort. */
export function FadeUp({
  children,
  delay = 0,
  className,
  as = 'div',
  y = 32,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
  y?: number;
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay }}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: (gap: number) => ({ transition: { staggerChildren: gap, delayChildren: 0.05 } }),
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } },
};

/** Conteneur dont les enfants <StaggerItem> apparaissent en cascade (à l'arrivée à l'écran). */
export function Stagger({
  children,
  className,
  as = 'div',
  gap = 0.05,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  gap?: number;
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={staggerParent}
      custom={gap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -5% 0px' }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  );
}

/** Chiffre qui compte jusqu'à sa valeur à l'arrivée à l'écran (centimes pour `euro`). */
export function CountUp({
  value,
  format = 'int',
  prefix = '',
  duration = 1.2,
}: {
  value: number;
  format?: 'int' | 'euro';
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration, ease: EASE, onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value, duration]);
  const fmt = (n: number) => (format === 'euro' ? formatEuro(n) : new Intl.NumberFormat('fr-FR').format(n));
  return (
    <span ref={ref} className="tabular-nums">
      {/* Lecteurs d'écran : la valeur finale seulement (un aria-label sur un span est ignoré). */}
      <span className="sr-only">
        {prefix}
        {fmt(value)}
      </span>
      {/* Animations réduites : la valeur finale directement (choix en CSS, sans écart d'hydratation). */}
      <span aria-hidden="true" className="motion-reduce:hidden">
        {prefix}
        {fmt(shown)}
      </span>
      <span aria-hidden="true" className="hidden motion-reduce:inline">
        {prefix}
        {fmt(value)}
      </span>
    </span>
  );
}

/**
 * Entrée de page (à mettre dans un template.tsx : rejoué à chaque navigation).
 * Pas de `filter` : il casserait les éléments en position fixe de la page.
 */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Transition entre étapes (questionnaire) : l'étape sortante glisse vers la gauche, l'entrante arrive
 * de la droite (l'inverse quand on revient en arrière).
 */
export function StepTransition({
  stepKey,
  direction = 1,
  children,
  className,
}: {
  stepKey: string;
  direction?: 1 | -1;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={stepKey}
        className={className}
        custom={direction}
        initial={{ opacity: 0, x: 40 * direction }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 * direction }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Petite réaction au toucher / clic (boutons, tuiles). */
export function Pressable({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      className={className ?? 'inline-flex'}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Fond de la rubrique active qui glisse d'une entrée à l'autre (navigation de l'appli et du back-office).
 * À placer dans un parent `relative isolate` ; `group` identifie la navigation (une par barre).
 */
export function NavIndicator({ group, className }: { group: string; className?: string }) {
  return (
    <motion.span
      layoutId={`nav-indicator-${group}`}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, zIndex: -1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    />
  );
}
