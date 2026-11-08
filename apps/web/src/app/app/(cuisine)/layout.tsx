import type { ReactNode } from 'react';
import { getAccount } from '@/lib/household';

// Mode cuisine : plein écran, sans la navigation de l'espace client (session obligatoire).
export default async function CuisineLayout({ children }: { children: ReactNode }) {
  await getAccount();
  return children;
}
