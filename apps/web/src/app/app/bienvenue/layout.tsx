import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = { title: 'Bienvenue', robots: { index: false } };

export default function BienvenueLayout({ children }: { children: ReactNode }) {
  return children;
}
