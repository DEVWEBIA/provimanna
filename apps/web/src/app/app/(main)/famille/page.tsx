import type { Metadata } from 'next';
import { animDelay, cx, glassClasses, Glow, PageHeader, Reveal, TicketCard } from '@repas/ui';
import { MAX_MEMBERS } from '@/lib/family';
import { getAccount } from '@/lib/household';
import { SITE_URL } from '@/lib/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { CopyReferral, InviteForm, MemberAction } from './family-forms';

export const metadata: Metadata = { title: 'Famille', robots: { index: false } };

/** Famille et parrainage (maquettes AppFamille / MFamille). */
export default async function FamillePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const left = (await searchParams).parti === '1';
  const { supabase, profile, household } = await getAccount();
  const now = new Date().toISOString();
  const [{ data: members }, { data: invites }, { count: referred }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, display_name, is_household_owner, created_at')
      .eq('household_id', household.id)
      .order('created_at'),
    supabase
      .from('household_invites')
      .select('id, email, expires_at')
      .is('accepted_at', null)
      .gt('expires_at', now)
      .order('expires_at'),
    // Filleuls hors du foyer (invisibles en RLS) : seul leur nombre est lu, avec la clé serveur.
    createAdminClient()
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by', profile.id),
  ]);
  const list = members ?? [];
  const count = list.length + (invites?.length ?? 0);
  const initials = (n: string | null) =>
    (n ?? '?')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      <PageHeader
        eyebrow="Ton foyer"
        title="Famille et parrainage"
        lead="Un abonnement par foyer. Tout le monde voit le plan et coche la liste en temps réel."
      />
      {left ? (
        <p role="status" className="bg-site-mint text-success rounded-[16px] px-4 py-3 font-black">
          Tu as quitté le foyer. Tu retrouves ton propre foyer, en formule gratuite.
        </p>
      ) : null}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Reveal as="section" className={cx(glassClasses, 'p-6')} aria-labelledby="foyer">
            <h2
              id="foyer"
              className="font-display flex items-center justify-between text-[22px] font-extrabold"
            >
              Ton foyer
              <span className="text-ink-muted text-[15px] font-black tabular-nums">
                {count} / {MAX_MEMBERS} membres
              </span>
            </h2>
            <ul className="mt-4">
              {list.map((m, i) => (
                <li
                  key={m.id}
                  className="anim-rise border-line flex items-center gap-3 border-t py-3"
                  style={animDelay(i * 60)}
                >
                  <span className="rounded-pill bg-brand text-brand-on grid h-11 w-11 shrink-0 place-items-center text-[14px] font-black">
                    {initials(m.display_name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-black">
                      {m.display_name ?? 'Membre'}
                      {m.id === profile.id ? ' (toi)' : ''}
                    </span>
                    <span className="text-ink-muted text-[13px] font-bold">
                      {m.is_household_owner ? 'Titulaire · gère l’abonnement' : 'Membre · plan et liste'}
                    </span>
                  </span>
                  {profile.is_household_owner && m.id !== profile.id ? (
                    <MemberAction kind="retirer" id={m.id} />
                  ) : null}
                  {!profile.is_household_owner && m.id === profile.id ? (
                    <MemberAction kind="quitter" />
                  ) : null}
                </li>
              ))}
              {(invites ?? []).map((iv) => (
                <li key={iv.id} className="border-line flex items-center gap-3 border-t py-3">
                  <span className="rounded-pill border-line text-ink-muted grid h-11 w-11 shrink-0 place-items-center border-2 border-dashed text-[18px] font-black">
                    +
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-black">{iv.email}</span>
                    <span className="text-ink-muted text-[13px] font-bold">
                      Invitation en attente · jusqu’au {new Date(iv.expires_at).toLocaleDateString('fr-FR')}
                    </span>
                  </span>
                  <MemberAction kind="annuler" id={iv.id} />
                </li>
              ))}
            </ul>
            <div className="border-line mt-4 border-t pt-5">
              <InviteForm disabled={count >= MAX_MEMBERS} />
            </div>
          </Reveal>
          <Reveal as="section" delay={80} className={cx(glassClasses, 'p-6')}>
            <h2 className="font-display text-[22px] font-extrabold">Ce que voient les membres</h2>
            <ul className="mt-3 flex flex-col gap-2 text-[16px] font-bold">
              {[
                'Le plan de la semaine et les recettes',
                'La liste de courses, cochée en direct',
                'Les prix dans ton enseigne',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="text-success" aria-hidden="true">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-ink-muted mt-3 text-[14px] font-bold">
              Ils ne voient ni ton abonnement ni tes factures.
            </p>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <TicketCard
            edge="surface-50"
            tone="brand"
            className="relative isolate overflow-hidden rounded-t-[28px] px-6 pb-10 pt-6"
          >
            <Glow className="-right-10 -top-10 h-40 w-40 bg-white/20" />
            <p className="text-site-lilac text-[12px] font-black tracking-[1.2px]">PARRAINAGE</p>
            <h2 className="font-display mt-2 text-[26px] font-extrabold leading-tight">
              Fais découvrir l’appli à tes proches.
            </h2>
            <p className="text-site-on-brand-muted mt-2 text-[15px] font-bold">
              Ton lien ouvre le questionnaire. La récompense du parrainage sera annoncée bientôt.
            </p>
            <div className="mt-5">
              <CopyReferral link={`${SITE_URL}/commencer?parrain=${profile.referral_code ?? ''}`} />
            </div>
            <p className="text-site-on-brand-muted mt-4 text-[14px] font-bold">
              {referred
                ? `${referred} personne${referred > 1 ? 's' : ''} inscrite${referred > 1 ? 's' : ''} grâce à toi.`
                : 'Personne pour l’instant.'}
            </p>
          </TicketCard>
        </Reveal>
      </div>
    </>
  );
}
