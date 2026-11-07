import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { APP_NAME } from '@repas/ui';
import { bricolage, nunito } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
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
