import 'server-only';
import { cookies } from 'next/headers';

export type ThemeChoice = 'auto' | 'clair' | 'sombre';
export const THEME_COOKIE = 'theme';

/** Thème de l'espace client : choix enregistré dans un cookie (auto = celui du téléphone). */
export async function themeChoice(): Promise<ThemeChoice> {
  const v = (await cookies()).get(THEME_COOKIE)?.value;
  return v === 'clair' || v === 'sombre' ? v : 'auto';
}

/** Valeur de l'attribut data-theme : light / dark, ou system (suivi de prefers-color-scheme en CSS). */
export const dataTheme = (c: ThemeChoice) => (c === 'clair' ? 'light' : c === 'sombre' ? 'dark' : 'system');
