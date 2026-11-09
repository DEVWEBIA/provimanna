'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { formatEuro } from '@repas/core';

/** Chiffre qui compte jusqu'à sa valeur quand il arrive à l'écran (centimes pour `euro`). */
export function CountUp({
  value,
  format = 'int',
  prefix = '',
}: {
  value: number;
  format?: 'int' | 'euro';
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, reduce, value]);
  const text = format === 'euro' ? formatEuro(shown) : String(shown);
  const final = format === 'euro' ? formatEuro(value) : String(value);
  return (
    <span ref={ref} className="tabular-nums">
      {/* Lecteurs d'écran : la valeur finale seulement (un aria-label sur un span est ignoré). */}
      <span className="sr-only">
        {prefix}
        {final}
      </span>
      {/* Animations réduites : la valeur finale directement (choix en CSS, sans écart d'hydratation). */}
      <span aria-hidden="true" className="motion-reduce:hidden">
        {prefix}
        {text}
      </span>
      <span aria-hidden="true" className="hidden motion-reduce:inline">
        {prefix}
        {final}
      </span>
    </span>
  );
}
