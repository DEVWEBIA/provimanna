'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react';

/**
 * Bandeau défilant qui accélère quand on fait défiler la page (et repart dans l'autre sens si on remonte).
 * Le contenu est répété deux fois ; figé si l'utilisateur réduit les animations.
 */
export function VelocityMarquee({ children, speed = 3 }: { children: ReactNode; speed?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * (speed / 100) * (delta / 16) * 0.35;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * Math.abs(f);
    base.set(base.get() - move);
  });

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div className="flex w-max" style={{ x }} aria-hidden="true">
        {children}
        {children}
      </motion.div>
    </div>
  );
}
