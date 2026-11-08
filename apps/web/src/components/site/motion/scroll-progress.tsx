'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** Fine barre de lecture en haut de page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden="true"
      className="bg-brand fixed inset-x-0 top-0 z-[60] h-[3px] origin-left motion-reduce:hidden"
      style={{ scaleX }}
    />
  );
}
