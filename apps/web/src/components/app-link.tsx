import NextLink from 'next/link';
import type { Route } from 'next';
import type { LinkComponent } from '@repas/ui';

/** Adaptateur next/link pour les composants de @repas/ui (TabBar, AppShell…). */
export const AppLink: LinkComponent = ({ href, ...rest }) => <NextLink href={href as Route} {...rest} />;
