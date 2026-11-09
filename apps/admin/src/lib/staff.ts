import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { Database } from '@repas/core/database.types';
import { createClient } from './supabase/server';

export type StaffRole = Database['public']['Enums']['staff_role'];

export const ROLE_LABEL: Record<StaffRole, string> = {
  admin: 'Administrateur',
  moderateur_prix: 'Modération des prix',
  editeur: 'Édition',
  support: 'Support',
};

/** Rubriques du back-office et rôle minimum (docs/07). L'admin a accès à tout. */
export const SECTIONS = [
  { href: '/', label: 'Vue d’ensemble', roles: ['admin', 'moderateur_prix', 'editeur', 'support'] },
  { href: '/tickets', label: 'Tickets', roles: ['moderateur_prix'] },
  { href: '/prix', label: 'Prix', roles: ['moderateur_prix'] },
  { href: '/produits', label: 'Produits', roles: ['moderateur_prix'] },
  { href: '/recettes', label: 'Recettes', roles: ['editeur'] },
  { href: '/utilisateurs', label: 'Utilisateurs', roles: ['support'] },
  { href: '/enseignes', label: 'Enseignes', roles: ['admin'] },
  { href: '/seo', label: 'Contenu SEO', roles: ['editeur'] },
  { href: '/engagement', label: 'Engagement', roles: ['admin'] },
  { href: '/roles', label: 'Rôles et journal', roles: ['admin'] },
  { href: '/parametres', label: 'Paramètres', roles: ['admin'] },
] as const satisfies readonly { href: string; label: string; roles: readonly StaffRole[] }[];

export const canAccess = (role: StaffRole, roles: readonly StaffRole[]) =>
  role === 'admin' || roles.includes(role);

/** Membre du staff connecté (session + rôle). Sans session → connexion ; sans rôle → page d'accès refusé. */
export const getStaff = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');
  const { data: role } = await supabase.rpc('my_staff_role');
  return { supabase, user, role: (role ?? null) as StaffRole | null };
});

/** Garde d'une page : redirige vers l'accueil du back-office si le rôle ne suffit pas. */
export async function requireRole(roles: readonly StaffRole[]) {
  const staff = await getStaff();
  if (!staff.role) redirect('/acces-refuse');
  if (!canAccess(staff.role, roles)) redirect('/?acces=refuse');
  return { ...staff, role: staff.role };
}
