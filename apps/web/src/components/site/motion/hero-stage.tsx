'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

const SPRING = { stiffness: 120, damping: 20, mass: 0.6 };

/**
 * Scène du hero : le plat et le ticket réagissent à la souris (profondeurs différentes) et au défilement
 * (le plat tourne et descend, le ticket remonte). Rien ne bouge si l'utilisateur réduit les animations.
 */
export function HeroStage({
  bowl,
  ticket,
  badges,
}: {
  bowl: ReactNode;
  ticket: ReactNode;
  badges?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bowlRotate = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const bowlY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const ticketY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const bowlX = useTransform(sx, (v) => v * -28);
  const bowlYMouse = useTransform(sy, (v) => v * -20);
  const ticketRotY = useTransform(sx, (v) => v * 8);
  const ticketRotX = useTransform(sy, (v) => v * -6);
  const badgeX = useTransform(sx, (v) => v * 18);
  const badgeY = useTransform(sy, (v) => v * 14);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex min-w-0 flex-[1_1_380px] justify-center pt-24 [perspective:1200px] sm:pt-0 lg:justify-start"
    >
      {/* Le cadre garde son positionnement Tailwind (translate) ; les mouvements sont sur les éléments internes. */}
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-4 w-[220px] sm:-right-48 sm:top-1/2 sm:w-[560px] sm:-translate-y-1/2 lg:-right-[24rem] lg:w-[700px]"
      >
        <motion.div className="motion-reduce:![transform:none]" style={{ rotate: bowlRotate, y: bowlY }}>
          <motion.div className="motion-reduce:![transform:none]" style={{ x: bowlX, y: bowlYMouse }}>
            {bowl}
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="relative z-10 motion-reduce:![transform:none]"
        initial={{ opacity: 0, y: 60, rotate: -6, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.35 }}
      >
        <motion.div className="motion-reduce:![transform:none]" style={{ y: ticketY }}>
          <motion.div
            style={{ rotateX: ticketRotX, rotateY: ticketRotY, transformStyle: 'preserve-3d' }}
            className="drop-shadow-[0_28px_44px_rgba(42,26,40,0.28)] motion-reduce:![transform:none]"
          >
            {ticket}
          </motion.div>
        </motion.div>
      </motion.div>
      {badges ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 hidden motion-reduce:![transform:none] lg:block"
          style={{ x: badgeX, y: badgeY }}
        >
          {badges}
        </motion.div>
      ) : null}
    </div>
  );
}
