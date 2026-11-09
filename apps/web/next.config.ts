import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repas/core', '@repas/ui'],
  typedRoutes: true,
  experimental: {
    // Photos de tickets envoyées par une action serveur (10 Mo max, contrôlé par Zod dans l'action).
    serverActions: { bodySizeLimit: '11mb' },
  },
};

export default withNextIntl(nextConfig);
