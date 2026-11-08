import type { Metadata } from 'next';
import { PageHeader } from '@repas/ui';
import { Badge, Kpi, Later, Panel } from '@/components/bo-ui';
import { requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';
import { ChallengeToggle } from './challenge-toggle';

export const metadata: Metadata = { title: 'Engagement' };
export const dynamic = 'force-dynamic';

const RITUALS = [
  ['Ton menu est prêt', 'Chaque jeudi à 19 h · email et notification', 'lot 11'],
  ['Bienvenue', 'À l’inscription', 'lot 11'],
  ['Fin d’essai dans 3 jours', 'Essai J-3, sans faux compte à rebours', 'lot 11'],
  ['Récap du mois', 'Le 1er du mois', 'lot 11'],
  ['Reçu de paiement', 'Transactionnel, via Stripe', 'lot 7'],
] as const;

/** Engagement (maquette BOEngagement) : séries, défis, rendez-vous. Jamais de culpabilisation. */
export default async function EngagementPage() {
  await requireRole(['admin']);
  const admin = createAdminClient();
  const [{ data: challenges }, { data: streaks }, { data: progress }] = await Promise.all([
    admin.from('challenges').select('id, title, description, target, window_weeks, active').order('title'),
    admin.from('streaks').select('current_weeks, best_weeks'),
    admin.from('user_challenges').select('challenge_id, completed_at'),
  ]);
  const active = (streaks ?? []).filter((s) => s.current_weeks > 0);
  return (
    <>
      <PageHeader
        eyebrow="Rendez-vous du jeudi, défis, récaps · jamais de culpabilisation"
        title="Engagement"
      />
      <dl className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <Kpi
          index={0}
          label="SÉRIES EN COURS"
          value={active.length}
          hint="foyers avec au moins 1 semaine validée d’affilée"
        />
        <Kpi
          index={1}
          label="SÉRIE MOYENNE"
          value={
            active.length
              ? `${(active.reduce((s, x) => s + x.current_weeks, 0) / active.length).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} sem.`
              : '—'
          }
        />
        <Kpi index={2} label="DÉFIS RÉUSSIS" value={(progress ?? []).filter((p) => p.completed_at).length} />
      </dl>
      <Panel title="Défis">
        <ul className="flex flex-col">
          {(challenges ?? []).map((c) => {
            const participants = (progress ?? []).filter((p) => p.challenge_id === c.id).length;
            return (
              <li key={c.id} className="border-line flex flex-wrap items-center gap-4 border-t py-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-black">{c.title}</span>
                  <span className="text-ink-muted text-[14px]">
                    {c.description} · {participants} participant{participants > 1 ? 's' : ''}
                  </span>
                </span>
                {c.active ? <Badge tone="ok">En cours</Badge> : <Badge tone="neutral">Suspendu</Badge>}
                <ChallengeToggle id={c.id} active={c.active} />
              </li>
            );
          })}
        </ul>
      </Panel>
      <Panel title="Rendez-vous et emails">
        <ul className="flex flex-col">
          {RITUALS.map(([t, d, lot]) => (
            <li key={t} className="border-line flex items-center justify-between gap-3 border-t py-3">
              <span>
                <span className="block font-black">{t}</span>
                <span className="text-ink-muted text-[14px]">{d}</span>
              </span>
              <Badge tone="neutral">{lot}</Badge>
            </li>
          ))}
        </ul>
        <Later>Plafond : 2 notifications par semaine au maximum, hors actions de la famille (docs/05).</Later>
      </Panel>
    </>
  );
}
