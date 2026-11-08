import type { Metadata } from 'next';
import Link from 'next/link';
import { weekRangeLabel, type StoreId } from '@repas/core';
import { buttonClasses, EmptyState, glassClasses, Icon, PageHeader, Plat } from '@repas/ui';
import { ShareButton } from '@/components/list/share-button';
import { ShoppingList } from '@/components/list/shopping-list';
import { DemoNotice } from '@/components/plan/demo-notice';
import { listTotals, syncShoppingList } from '@/lib/list';
import { currentPlan } from '@/lib/plan';
import { absoluteUrl, href } from '@/lib/site';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Liste de courses', robots: { index: false } };

export default async function ListePage() {
  const { supabase, user, plan, view, stores, data } = await currentPlan();
  if (!plan || !view) {
    return (
      <EmptyState
        title="Ta liste arrive avec ton plan."
        description="Dès que ta semaine est composée, ta liste de courses se remplit toute seule, rayon par rayon."
        illustration={<Plat variant="salade" size={96} decorative />}
      />
    );
  }
  const store = plan.store_id as StoreId;
  // La liste suit toujours le plan (repas remplacés, enseigne choisie) : recalculée côté serveur.
  const { list, items } = await syncShoppingList(createAdminClient(), plan, store, data);
  const [{ data: aisles }, { data: members }, { data: storeRow }] = await Promise.all([
    supabase.from('aisles').select('id, label, position').order('position'),
    supabase.from('profiles').select('id, display_name'),
    supabase.from('stores').select('name, drive_url').eq('id', store).single(),
  ]);
  const totals = listTotals(plan, data);
  const best = totals[0]!;
  const name = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const storeName = storeRow?.name ?? name(store);

  return (
    <>
      <PageHeader
        eyebrow={`Semaine ${view.weekNumber} · ${weekRangeLabel(view.weekStart)} · chez ${storeName}`}
        title="Ma liste de courses"
        actions={
          <>
            {list.share_token ? (
              <ShareButton
                url={absoluteUrl(`/liste/${list.share_token}`)}
                title={`Ma liste de courses · ${storeName}`}
              />
            ) : null}
            {storeRow?.drive_url ? (
              <a
                href={storeRow.drive_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses('primary', 'md', 'no-underline')}
              >
                Ouvrir le drive {storeName} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </>
        }
      />
      {!view.validated ? (
        <p className="anim-rise border-line text-ink rounded-[16px] border bg-white/70 px-4 py-3 text-[15px] font-bold backdrop-blur">
          Ta liste est préparée chez {storeName}.{' '}
          <Link href={href('/app/comparateur')} className="text-brand font-black">
            Comparer les enseignes
          </Link>
        </p>
      ) : null}
      {view.demoPrices ? <DemoNotice /> : null}
      <ShoppingList
        listId={list.id}
        me={user.id}
        names={Object.fromEntries(
          (members ?? []).map((m) => [m.id, (m.display_name ?? '').split(' ')[0] || 'un proche']),
        )}
        aisles={[...(aisles ?? []), { id: 'divers', label: 'Divers', position: 99 }]}
        items={items.map((i) => ({
          id: i.id,
          label: i.label,
          quantity: i.quantity_label,
          aisleId: i.aisle_id,
          cents: i.est_cents,
          checked: i.checked,
          checkedBy: i.checked_by,
          addedBy: i.added_by,
          manual: i.manual,
        }))}
        cheaper={best.store !== store ? { name: name(best.store), cents: best.cents } : null}
        aside={
          <div className={`${glassClasses} p-5`}>
            <p className="font-display text-[20px] font-extrabold leading-tight">
              Après les courses, envoie ton ticket
            </p>
            <p className="text-ink-muted mt-1.5 text-[14px] font-bold">
              Tu aides la communauté à garder des prix frais, et tu gagnes 3 jours de Premium.
            </p>
            <Link
              href={href('/app/ticket')}
              className={buttonClasses('secondary', 'md', 'mt-4 w-full no-underline')}
            >
              <Icon name="ticket" size={18} /> Envoyer une photo du ticket
            </Link>
          </div>
        }
      />
    </>
  );
}
