import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import type { StoreId } from '@repas/core';
import { cx, glassClasses, PageHeader, StoreChip } from '@repas/ui';
import { Badge, Later } from '@/components/bo-ui';
import { coverageByStore, recentObservations } from '@/lib/coverage';
import { requireRole } from '@/lib/staff';
import { StoreForm } from './store-form';

export const metadata: Metadata = { title: 'Enseignes' };
export const dynamic = 'force-dynamic';

/** Enseignes et magasins (maquette BOEnseignes) : jamais de logo ni de couleur officielle. */
export default async function EnseignesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const { supabase } = await requireRole(['admin']);
  const now = new Date();
  const [{ data: stores }, { data: locations }, { data: ings }, obs] = await Promise.all([
    supabase.from('stores').select('id, name, initials, drive_url, active').order('name'),
    supabase.from('store_locations').select('store_id, city'),
    supabase.from('recipe_ingredients').select('product_id').not('product_id', 'is', null),
    recentObservations(supabase, now),
  ]);
  const coverage = coverageByStore([...new Set((ings ?? []).map((i) => i.product_id!))], obs, now);
  const sel = stores?.find((s) => s.id === sp.id) ?? stores?.[0];
  return (
    <>
      <PageHeader
        eyebrow="Jamais de logo ni de couleur officielle : une pastille neutre et le nom en clair"
        title="Enseignes et magasins"
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {(stores ?? []).map((s) => {
            const mags = (locations ?? []).filter((l) => l.store_id === s.id);
            const cov = coverage.find((c) => c.store === s.id)?.ratio ?? 0;
            return (
              <li key={s.id}>
                <Link
                  href={`/enseignes?id=${s.id}` as Route}
                  aria-current={sel?.id === s.id ? 'true' : undefined}
                  className={cx(
                    glassClasses,
                    'text-ink flex items-center gap-4 p-4 no-underline',
                    sel?.id === s.id && 'ring-brand ring-2',
                  )}
                >
                  <StoreChip storeId={s.id as StoreId} name={s.name} initials={s.initials} hideName />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-black">{s.name}</span>
                    <span className="text-ink-muted text-[13px] font-bold">
                      {mags.length} magasin{mags.length > 1 ? 's' : ''} ·{' '}
                      {[...new Set(mags.map((m) => m.city))].join(', ') || 'aucune zone'}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    {s.active ? <Badge tone="ok">Active</Badge> : <Badge tone="neutral">Inactive</Badge>}
                    <span className="text-[13px] font-black tabular-nums">
                      {Math.round(cov * 100)} % couvert
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {sel ? (
          <aside className={cx(glassClasses, 'flex flex-col gap-4 p-5 xl:sticky xl:top-8')}>
            <div className="flex items-center gap-3">
              <StoreChip storeId={sel.id as StoreId} name={sel.name} initials={sel.initials} hideName />
              <h2 className="font-display text-[22px] font-extrabold">{sel.name}</h2>
            </div>
            <StoreForm store={sel} />
            <Later>Zones de prix et nouveaux pays (Belgique, Suisse, Canada) : prévus en phase 4.</Later>
          </aside>
        ) : null}
      </div>
    </>
  );
}
