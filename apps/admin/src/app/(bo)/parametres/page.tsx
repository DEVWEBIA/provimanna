import type { Metadata } from 'next';
import { DEFAULTS, formatEuro } from '@repas/core';
import { PageHeader } from '@repas/ui';
import { Later, Panel } from '@/components/bo-ui';
import { requireRole } from '@/lib/staff';

export const metadata: Metadata = { title: 'Paramètres' };

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="border-line flex items-center justify-between gap-4 border-t py-3">
    <dt className="font-bold">{label}</dt>
    <dd className="font-display text-[20px] font-extrabold tabular-nums">{value}</dd>
  </div>
);

/** Paramètres (maquette BOParametres) : valeurs en vigueur, lues dans le code (packages/core). */
export default async function ParametresPage() {
  await requireRole(['admin']);
  return (
    <>
      <PageHeader
        eyebrow="Réservé aux administrateurs"
        title="Paramètres"
        lead="Valeurs en vigueur. Elles sont pour l’instant fixées dans le code."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Modération des prix">
          <dl>
            <Row label="Prix frais (médiane)" value={`${DEFAULTS.freshDays} jours`} />
            <Row label="Repli en estimation (≈)" value={`${DEFAULTS.fallbackDays} jours`} />
            <Row label="Alerte prix aberrant au-delà de" value={`${DEFAULTS.aberrantThreshold * 100} %`} />
            <Row label="Validation automatique d’un ticket à partir de" value="85 % de confiance" />
          </dl>
        </Panel>
        <Panel title="Abonnement Premium">
          <dl>
            <Row label="Mensuel" value={formatEuro(499)} />
            <Row label="Annuel" value={formatEuro(3999)} />
            <Row label="Essai sans carte" value="14 jours" />
            <Row label="Bonus par ticket validé" value="+3 jours" />
          </dl>
        </Panel>
        <Panel title="Rendez-vous et rétention">
          <dl>
            <Row label="Plan prêt" value="jeudi, 19 h" />
            <Row label="Notifications max par semaine" value="2" />
          </dl>
        </Panel>
        <Panel title="Pays">
          <dl>
            <Row label="France" value="actif" />
            <Row label="Belgique, Suisse, Canada" value="phase 4" />
          </dl>
        </Panel>
      </div>
      <Later>
        Rendre ces valeurs modifiables depuis le back-office demande une table de réglages (migration à
        valider). Les prix Premium se règlent dans Stripe (lot 7).
      </Later>
    </>
  );
}
