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
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
