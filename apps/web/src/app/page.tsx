import { getTranslations } from 'next-intl/server';
import { formatEuro } from '@repas/core';
import { APP_NAME } from '@repas/ui';

// Page d'attente : la landing (maquette Main) arrive au lot 3.
export default async function HomePage() {
  const t = await getTranslations('home');
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-4">
      <p className="text-overline text-brand uppercase">{APP_NAME}</p>
      <h1 className="font-display text-display text-ink">{t('title')}</h1>
      <p className="text-body text-ink-muted">{t('lead')}</p>
      <p className="text-body tabular-nums">
        {t('example', { lidl: formatEuro(406), auchan: formatEuro(496) })}
      </p>
    </main>
  );
}
