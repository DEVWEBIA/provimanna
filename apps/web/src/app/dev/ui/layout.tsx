import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Catalogue UI', robots: { index: false, follow: false } };

// Catalogue de développement : désactivé en production.
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound();
  return children;
}
