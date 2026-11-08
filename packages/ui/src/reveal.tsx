'use client';

import { useEffect, useRef, type ReactNode, type Ref } from 'react';

export interface RevealProps {
  children: ReactNode;
  /** Décalage en ms (cartes qui apparaissent l'une après l'autre). */
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}

/**
 * Fait apparaître son contenu en fondu au moment où il entre à l'écran (une seule fois).
 * Styles dans styles/motion.css : contenu visible d'emblée sans JavaScript ou si l'utilisateur réduit les animations.
 */
export function Reveal({ children, delay = 0, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.setAttribute('data-revealed', '');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as Ref<never>}
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
