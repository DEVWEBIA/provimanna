'use client';

import { motion } from 'motion/react';
import { cx } from '@repas/ui';

export interface HeadlineLine {
  text: string;
  className?: string;
  /** Trait orange dessiné sous la ligne (« Tu choisis. »). */
  underline?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Titre du hero : chaque mot monte de sous la ligne, en cascade, puis le trait orange se dessine. */
export function SplitHeadline({ lines, className }: { lines: HeadlineLine[]; className?: string }) {
  let index = 0;
  return (
    <h1 className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          <span className={cx('relative inline-block', line.className)}>
            {line.text.split(' ').map((word, wi) => {
              const k = index++;
              return (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%', rotate: 6, opacity: 0 }}
                    animate={{ y: '0%', rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.1 + k * 0.07 }}
                  >
                    {word}
                  </motion.span>
                  {wi < line.text.split(' ').length - 1 ? ' ' : null}
                </span>
              );
            })}
            {line.underline ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                className="text-saving absolute -bottom-1 left-0 h-[0.22em] w-full overflow-visible"
              >
                <motion.path
                  d="M3 14 C 60 4, 140 4, 297 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 + index * 0.07 + 0.2 }}
                />
              </svg>
            ) : null}
          </span>
        </span>
      ))}
    </h1>
  );
}
