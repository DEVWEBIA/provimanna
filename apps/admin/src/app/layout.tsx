import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { APP_NAME, MotionRoot } from '@repas/ui';
import { bricolage, instrumentSerif, nunito } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: { default: `Back-office · ${APP_NAME}`, template: `%s · Back-office` },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr-FR" className={`${bricolage.variable} ${nunito.variable} ${instrumentSerif.variable}`}>
      {/* Les extensions de navigateur (ex. ColorZilla) ajoutent des attributs sur <body> : on ignore ces écarts-là uniquement. */}
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <MotionRoot>{children}</MotionRoot>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
