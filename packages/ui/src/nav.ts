import type { IconName } from './icons.tsx';

export type AppSection =
  'accueil' | 'plan' | 'liste' | 'recettes' | 'economies' | 'famille' | 'notifications' | 'profil';

export interface NavItem {
  id: AppSection;
  label: string;
  href: string;
  icon: IconName;
}

/** Navigation desktop : 8 entrées (docs/05 §3). */
export const APP_NAV: NavItem[] = [
  { id: 'accueil', label: 'Accueil', href: '/app', icon: 'accueil' },
  { id: 'plan', label: 'Mon plan', href: '/app/plan', icon: 'plan' },
  { id: 'liste', label: 'Liste de courses', href: '/app/liste', icon: 'liste' },
  { id: 'recettes', label: 'Recettes', href: '/app/recettes', icon: 'recettes' },
  { id: 'economies', label: 'Mes économies', href: '/app/economies', icon: 'economies' },
  { id: 'famille', label: 'Famille', href: '/app/famille', icon: 'famille' },
  { id: 'notifications', label: 'Notifications', href: '/app/notifications', icon: 'notification' },
  { id: 'profil', label: 'Profil', href: '/app/profil', icon: 'profil' },
];

/** Barre d'onglets mobile : 5 entrées (maquette MTabBar). */
export const TAB_NAV: NavItem[] = [
  { id: 'accueil', label: 'Accueil', href: '/app', icon: 'accueil' },
  { id: 'plan', label: 'Plan', href: '/app/plan', icon: 'plan' },
  { id: 'liste', label: 'Liste', href: '/app/liste', icon: 'liste' },
  { id: 'recettes', label: 'Recettes', href: '/app/recettes', icon: 'recettes' },
  { id: 'profil', label: 'Profil', href: '/app/profil', icon: 'profil' },
];
