import type { ComponentType, ReactNode } from 'react';

/** Composant de lien injectable (ex. `next/link`) pour garder packages/ui indépendant de Next.js. */
export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
  'aria-current'?: 'page' | undefined;
}>;

export const DefaultLink: LinkComponent = ({ href, className, children, ...rest }) => (
  <a href={href} className={className} {...rest}>
    {children}
  </a>
);
