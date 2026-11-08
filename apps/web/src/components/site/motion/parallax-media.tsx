'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cx } from '@repas/ui';

/**
 * Image en parallaxe dans son cadre : elle glisse plus lentement que la page et se dévoile
 * (léger zoom arrière) en entrant à l'écran.
 */
export function ParallaxMedia({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.25, 1.12]);
  return (
    <div ref={ref} className={cx('relative overflow-hidden', className)}>
      <motion.div className="h-full w-full motion-reduce:![transform:none]" style={{ y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
