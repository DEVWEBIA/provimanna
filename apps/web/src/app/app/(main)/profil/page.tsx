import type { Metadata } from 'next';
import Link from 'next/link';
import { PREFERENCES, preferencesFromHousehold, trialDaysLeft } from '@repas/core';
import { Button, cx, glassClasses, PageHeader, Reveal } from '@repas/ui';
import { getAccount } from '@/lib/household';
import { href } from '@/lib/site';
import { listStores } from '@/lib/stores';
import { themeChoice } from '@/lib/theme';
import { NotificationToggles, ThemeChooser } from './profile-controls';

export const metadata: Metadata = { title: 'Profil', robots: { index: false } };

const COOKING: Record<string, string> = {
  moins_30: 'Moins de 30 minutes',
  '30_45': '30 à 45 minutes',
  peu_importe: 'Peu importe',
};

/** Profil (maquette MProfil) : foyer, préférences, notifications, thème, abonnement (lecture). */
export default async function ProfilPage() {
  const { supabase, user, profile, household, subscription } = await getAccount();
  const stores = await listStores(supabase);
  const prefs = preferencesFromHousehold(household.diet, household.exclusions).map(
    (p) => PREFERENCES.find((x) => x.id === p)?.label,
  );
  const days =
    subscription?.tier === 'trial' && subscription.trial_ends_at
      ? trialDaysLeft(subscription.trial_ends_at, subscription.bonus_days)
      : 0;
  const theme = await themeChoice();
  return (
    <>
      <PageHeader eyebrow={user.email ?? ''} title={profile.display_name ?? 'Profil'} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Reveal as="section" className={cx(glassClasses, 'p-6')}>
          <h2 className="font-display text-[22px] font-extrabold">Ton foyer</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[15px]">
            {[
              [
                'Personnes',
                `${household.adults} adulte${household.adults > 1 ? 's' : ''}, ${household.children} enfant${household.children > 1 ? 's' : ''}`,
              ],
              ['Enseigne', stores.find((s) => s.id === household.preferred_store_id)?.name ?? '—'],
              ['Code postal', household.postal_code ?? '—'],
              ['Temps de cuisine', COOKING[household.cooking_time] ?? '—'],
              ['Préférences', prefs.length ? prefs.join(', ') : 'Aucune'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[14px] bg-white/70 p-3">
                <dt className="text-ink-muted text-[12px] font-black uppercase tracking-[1px]">{k}</dt>
                <dd className="mt-0.5 font-black">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={href('/app/bienvenue')}
            className="text-brand min-h-tap mt-4 inline-flex items-center font-black"
          >
            Modifier mes réponses →
          </Link>
        </Reveal>
        <div className="flex flex-col gap-6">
          <Reveal as="section" delay={80} className={cx(glassClasses, 'p-6')}>
            <h2 className="font-display text-[22px] font-extrabold">Abonnement</h2>
            <p className="mt-2 text-[16px] font-bold">
              {subscription?.tier === 'premium'
                ? 'Premium'
                : days > 0
                  ? `Essai Premium : ${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`
                  : 'Formule gratuite, sans limite de durée'}
            </p>
            <p className="text-ink-muted mt-1 text-[14px] font-bold">Paiement et factures : bientôt ici.</p>
          </Reveal>
          <Reveal as="section" delay={140} className={cx(glassClasses, 'p-6')}>
            <h2 className="font-display text-[22px] font-extrabold">Notifications</h2>
            <p className="text-ink-muted mt-1 text-[14px] font-bold">
              2 par semaine au maximum, jamais d’urgence inventée.
            </p>
            <div className="mt-2">
              <NotificationToggles thursday={profile.notify_thursday} promos={profile.notify_promos} />
            </div>
          </Reveal>
          <Reveal
            as="section"
            delay={200}
            className={cx(glassClasses, 'flex flex-wrap items-center justify-between gap-4 p-6')}
          >
            <div>
              <h2 className="font-display text-[22px] font-extrabold">Apparence</h2>
              <p className="text-ink-muted text-[14px] font-bold">Auto suit le réglage de ton téléphone.</p>
            </div>
            <ThemeChooser value={theme} />
          </Reveal>
          <form action="/auth/deconnexion" method="post">
            <Button type="submit" variant="link">
              Se déconnecter
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
