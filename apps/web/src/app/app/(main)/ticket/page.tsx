import type { Metadata } from 'next';
import { RECEIPT_REWARD_DAYS, RECEIPT_REWARD_MONTHLY_CAP, storeDisplayName, type StoreId } from '@repas/core';
import { Badge, glassClasses, PageHeader, Reveal } from '@repas/ui';
import { StoreLogo } from '@/components/store-logo';
import { longDate } from '@/lib/dates';
import { getAccount } from '@/lib/household';
import { householdStores } from '@/lib/plan';
import { monthStart, rewardStatus } from '@/lib/receipts';
import { TicketUpload } from './ticket-upload';

export const metadata: Metadata = { title: 'Envoyer un ticket', robots: { index: false } };

const STATUS = {
  en_attente: { label: 'En attente', variant: 'draft' },
  en_revue: { label: 'En vérification', variant: 'draft' },
  valide: { label: 'Validé', variant: 'success' },
  rejete: { label: 'Non retenu', variant: 'rejected' },
} as const;

/** Envoi d'un ticket de caisse (maquettes AppTicket / MTicket) : photo, lecture, vérification par l'équipe. */
export default async function TicketPage() {
  const { supabase, household } = await getAccount('/app/ticket');
  const now = new Date();
  const [{ data: recent }, { data: month }] = await Promise.all([
    supabase
      .from('receipts')
      .select('id, store_id, purchased_at, created_at, status, reward_days, receipt_lines(count)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('receipts').select('reward_days').eq('status', 'valide').gte('created_at', monthStart(now)),
  ]);
  const sentThisMonth = (recent ?? []).filter((r) => r.created_at >= monthStart(now)).length;
  const reward = rewardStatus(month ?? []);
  const stores = householdStores(household).map((id) => ({ id, name: storeDisplayName(id) }));

  return (
    <>
      <PageHeader
        eyebrow="Tickets de caisse"
        title={`Envoie ton ticket, gagne ${RECEIPT_REWARD_DAYS} jours de Premium.`}
        accent={`${RECEIPT_REWARD_DAYS} jours de Premium.`}
        lead="Tes prix aident toute la communauté à comparer juste."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <TicketUpload stores={stores} nextReward={reward.next} />
        <aside className="flex flex-col gap-4">
          <Reveal className={`${glassClasses} p-5`}>
            <h2 className="text-[17px] font-black">Pour une lecture parfaite</h2>
            <ol className="mt-3 flex flex-col gap-3 text-[15px]">
              {[
                'Ticket à plat, en entier, bien éclairé',
                'Ticket de moins de 7 jours',
                'Un ticket long ? Envoie-le en 2 photos',
              ].map((t, i) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="rounded-pill bg-brand-soft text-brand grid h-7 w-7 shrink-0 place-items-center text-[13px] font-black">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 font-bold">{t}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <p className="text-ink-muted px-1 text-[14px] font-bold">
            Ce mois-ci : {sentThisMonth} ticket{sentThisMonth > 1 ? 's' : ''} envoyé
            {sentThisMonth > 1 ? 's' : ''}, {reward.earned} jour{reward.earned > 1 ? 's' : ''} gagné
            {reward.earned > 1 ? 's' : ''} (max. {RECEIPT_REWARD_MONTHLY_CAP} par mois).
          </p>
        </aside>
      </div>

      {recent?.length ? (
        <Reveal as="section" className={`${glassClasses} p-5`}>
          <h2 className="font-display text-[22px] font-extrabold">Tes derniers tickets</h2>
          <ul className="mt-3">
            {recent.map((r) => {
              const s = STATUS[r.status];
              const lines = r.receipt_lines[0]?.count ?? 0;
              return (
                <li key={r.id} className="border-line flex flex-wrap items-center gap-3 border-t py-3">
                  {r.store_id ? (
                    <StoreLogo id={r.store_id} name={storeDisplayName(r.store_id as StoreId)} size={36} />
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block font-black">
                      {r.store_id ? storeDisplayName(r.store_id) : 'Enseigne à reconnaître'}
                    </span>
                    <span className="text-ink-muted text-[14px] font-bold">
                      Envoyé le {longDate(r.created_at)} · {lines} ligne{lines > 1 ? 's' : ''} lue
                      {lines > 1 ? 's' : ''}
                    </span>
                  </span>
                  {r.status === 'valide' && r.reward_days > 0 ? (
                    <span className="text-brand text-[14px] font-black">+{r.reward_days} jours</span>
                  ) : null}
                  <Badge variant={s.variant}>{s.label}</Badge>
                </li>
              );
            })}
          </ul>
        </Reveal>
      ) : null}
    </>
  );
}
