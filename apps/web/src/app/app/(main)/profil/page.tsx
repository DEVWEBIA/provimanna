import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  CUISINES,
  EQUIPMENT,
  formatEuro,
  PREFERENCES,
  preferencesFromHousehold,
  STYLES,
  trialDaysLeft,
} from '@repas/core';
import { Button, cx, glassClasses, Icon, PageHeader, Reveal, type IconName } from '@repas/ui';
import { daysSummary } from '@/lib/meal-days';
import { getAccount } from '@/lib/household';
import { href } from '@/lib/site';
import { listStores } from '@/lib/stores';
import { themeChoice } from '@/lib/theme';
import { NotificationToggles, ThemeChooser } from './profile-controls';
import { StoreLogo } from '@/components/store-logo';

export const metadata: Metadata = { title: 'Profil', robots: { index: false } };

const COOKING: Record<string, string> = {
  moins_30: 'moins de 30 min en semaine',
  '30_45': '30 à 45 min en semaine',
  peu_importe: 'temps de cuisine libre',
};

/** Profil (maquette MProfil) : réponses du questionnaire modifiables une à une, notifications, thème, abonnement. */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProfilPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).fait;
  const fait = typeof raw === 'string' ? raw : null;
  const { supabase, user, profile, household, subscription } = await getAccount();
  const stores = await listStores(supabase);
  const myStore = stores.find((s) => s.id === household.preferred_store_id);
  const prefs = preferencesFromHousehold(household.diet, household.exclusions).map(
    (p) => PREFERENCES.find((x) => x.id === p)?.label,
  );
  const days =
    subscription?.tier === 'trial' && subscription.trial_ends_at
      ? trialDaysLeft(subscription.trial_ends_at, subscription.bonus_days)
      : 0;
  const theme = await themeChoice();
  const { data: disliked } = household.disliked_product_ids.length
    ? await supabase.from('products').select('name').in('id', household.disliked_product_ids)
    : { data: [] };
  const people = household.adults + household.children;
  const meals = household.meal_days.length * (household.with_lunch ? 2 : 1);
  const styles = household.styles
    .map((id) => STYLES.find((x) => x.id === id)?.label)
    .filter(Boolean)
    .join(', ');
  const answers: { step: string; icon: IconName; label: string; value: ReactNode }[] = [
    {
      step: 'foyer',
      icon: 'famille',
      label: 'Foyer',
      value: `${household.adults} adulte${household.adults > 1 ? 's' : ''}, ${household.children} enfant${household.children > 1 ? 's' : ''}`,
    },
    {
      step: 'repas',
      icon: household.with_lunch ? 'soleil' : 'lune',
      label: 'Repas',
      value: `${meals} repas · ${household.with_lunch ? 'midi et soir' : 'le soir'} · ${daysSummary(household.meal_days).toLowerCase()}`,
    },
    {
      step: 'enseigne',
      icon: 'panier',
      label: 'Enseigne',
      value: myStore ? (
        <span className="flex items-center gap-2">
          <StoreLogo id={myStore.id} name={myStore.name} size={28} />
          {myStore.name} · {household.postal_code ?? '—'}
        </span>
      ) : (
        '—'
      ),
    },
    {
      step: 'budget',
      icon: 'pieces',
      label: 'Budget',
      value: household.weekly_budget_cents
        ? `${formatEuro(household.weekly_budget_cents)} par semaine pour ${people} personne${people > 1 ? 's' : ''}`
        : 'Pas de budget précis',
    },
    {
      step: 'regime',
      icon: 'bouclier',
      label: 'Régime et allergies',
      value: prefs.length ? prefs.join(', ') : 'Aucun',
    },
    {
      step: 'ambiance',
      icon: 'toque',
      label: 'Ambiance',
      value: `${styles || 'Pas de style préféré'} · ${COOKING[household.cooking_time] ?? ''}`,
    },
    {
      step: 'cuisines',
      icon: 'monde',
      label: 'Cuisines',
      value:
        household.cuisines
          .map((id) => CUISINES.find((c) => c.id === id)?.label)
          .filter(Boolean)
          .join(', ') || 'Toutes, en alternance',
    },
    {
      step: 'ingredients',
      icon: 'interdit',
      label: 'Ingrédients évités',
      value: disliked?.length ? disliked.map((p) => p.name).join(', ') : 'Aucun',
    },
    {
      step: 'equipement',
      icon: 'four',
      label: 'Équipement',
      value: household.equipment
        .map((id) => EQUIPMENT.find((e) => e.id === id)?.label)
        .filter(Boolean)
        .join(', '),
    },
  ];
  return (
    <>
      <PageHeader eyebrow={user.email ?? ''} title={profile.display_name ?? 'Profil'} />
      {fait ? (
        <p
          role="status"
          className="bg-site-mint text-success mb-6 flex items-center gap-2 rounded-[18px] px-4 py-3 text-[15px] font-black"
        >
          <Icon name="check" size={18} />
          {fait === 'recomposee'
            ? 'C’est enregistré. Ta semaine a été recomposée avec tes nouvelles réponses.'
            : fait === 'validee'
              ? 'C’est enregistré. Ta semaine est déjà validée : la prochaine en tiendra compte.'
              : 'C’est enregistré.'}
        </p>
      ) : null}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Reveal as="section" className={cx(glassClasses, 'p-6')}>
          <h2 className="font-display text-[22px] font-extrabold">Tes réponses</h2>
          <p className="text-ink-muted mt-1 text-[14px] font-bold">
            Touche une réponse pour la changer. Ta semaine se recompose si elle n’est pas encore validée.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {answers.map((a) => (
              <li key={a.step}>
                <Link
                  href={href(`/app/bienvenue?etape=${a.step}`)}
                  className="dark:bg-surface-50 group flex min-h-[68px] items-center gap-3.5 rounded-[18px] bg-white/80 px-3.5 py-2.5 no-underline transition-colors hover:bg-white"
                >
                  <span className="bg-brand-soft text-brand grid h-11 w-11 shrink-0 place-items-center rounded-full">
                    <Icon name={a.icon} size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-ink-muted block text-[12px] font-black uppercase tracking-[1px]">
                      {a.label}
                    </span>
                    <span className="text-ink mt-0.5 block text-[15px] font-black">{a.value}</span>
                  </span>
                  <span className="text-brand text-[14px] font-black group-hover:underline">
                    Modifier<span className="sr-only"> : {a.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
