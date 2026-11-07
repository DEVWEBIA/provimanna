import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { APP_NAME } from '@repas/ui';
import { bricolage, nunito } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: { default: `Back-office · ${APP_NAME}`, template: `%s · Back-office` },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr-FR" className={`${bricolage.variable} ${nunito.variable}`}>
      {/* Les extensions de navigateur (ex. ColorZilla) ajoutent des attributs sur <body> : on ignore ces écarts-là uniquement. */}
      <body suppressHydrationWarning>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
