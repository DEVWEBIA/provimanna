import type { Route } from 'next';
import { APP_NAME } from '@repas/ui';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = APP_NAME;

/** URL absolue à partir d'un chemin (« /recettes » → « https://…/recettes »). */
export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Lien vers une route du site. typedRoutes refuse les routes pas encore créées (lots suivants) :
 * ce helper rend le cast explicite et localisé.
 */
export const href = (path: string) => path as Route;

/** Routes publiques du site (docs/07-ecrans-et-routes.md). */
export const ROUTES = {
  home: '/',
  commentCaMarche: '/comment-ca-marche',
  recettes: '/recettes',
  menus: '/menus/menu-semaine-60-euros-4-personnes',
  comparatif: '/comparatif-prix-supermarches',
  methodologie: '/methodologie',
  tarifs: '/tarifs',
  mentionsLegales: '/mentions-legales',
  confidentialite: '/confidentialite',
  connexion: '/connexion',
  commencer: '/commencer',
} as const;
