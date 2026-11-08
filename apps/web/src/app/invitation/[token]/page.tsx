import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GlassCard, Glow, Logo, PageHeader } from '@repas/ui';
import { getAccount } from '@/lib/household';
import { createAdminClient } from '@/lib/supabase/admin';
import { AcceptButton } from './accept-button';

export const metadata: Metadata = { title: 'Invitation', robots: { index: false, follow: false } };

/** Invitation encore utilisable : ni acceptée ni expirée. */
const isOpen = (i: { accepted_at: string | null; expires_at: string } | null) =>
  Boolean(i && !i.accepted_at && Date.parse(i.expires_at) > Date.now());

/** Invitation dans un foyer (lien valable 7 jours). Connexion demandée si besoin, puis acceptation. */
export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[0-9a-f]{48}$/.test(token)) notFound();
  await getAccount(`/invitation/${token}`);
  const { data: invite } = await createAdminClient()
    .from('household_invites')
    .select('accepted_at, expires_at, profiles!household_invites_invited_by_fkey(display_name)')
    .eq('token', token)
    .maybeSingle();
  const valid = isOpen(invite);
  const from = invite?.profiles?.display_name?.split(' ')[0] ?? 'Un proche';
  return (
    <div className="bg-surface-50 relative isolate min-h-screen overflow-x-clip">
      <Glow className="bg-raw-aubergine-clair -left-24 top-24 h-80 w-80" />
      <Glow className="bg-raw-peche bottom-10 right-0 h-72 w-72 opacity-70" />
      <main className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-center gap-8 px-6 py-10">
        <Link href="/" className="anim-rise self-start no-underline">
          <Logo />
        </Link>
        <GlassCard className="flex flex-col gap-6 p-8">
          {valid ? (
            <>
              <PageHeader
                eyebrow="Invitation"
                title={`${from} t’invite dans son foyer`}
                lead="Vous partagerez le plan de la semaine et la liste de courses, cochée en direct. Ton abonnement et ses factures restent privés."
              />
              <AcceptButton token={token} />
            </>
          ) : (
            <PageHeader
              eyebrow="Invitation"
              title="Ce lien a expiré ou a déjà servi."
              lead="Demande à la personne qui t’a invité de t’envoyer un nouveau lien."
            />
          )}
        </GlassCard>
      </main>
    </div>
  );
}
