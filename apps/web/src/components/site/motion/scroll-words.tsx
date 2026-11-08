'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { cx } from '@repas/ui';

function Word({
  word,
  progress,
  range,
  accent,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={cx('inline-block motion-reduce:!opacity-100', accent && 'text-saving-ink')}
    >
      {word}
      {' '}
    </motion.span>
  );
}

/**
 * Phrase manifeste : les mots s'allument un à un pendant le défilement.
 * Le texte reste lisible en entier pour les lecteurs d'écran et si les animations sont réduites.
 */
export function ScrollWords({
  text,
  accent = [],
  className,
}: {
  text: string;
  accent?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word
            key={i}
            word={w}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            accent={accent.includes(w.replace(/[.,]/g, ''))}
          />
        ))}
      </span>
    </p>
  );
}
