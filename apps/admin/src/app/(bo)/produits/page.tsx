import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { formatEuro, resolvePrice } from '@repas/core';
import { cx, glassClasses, inputClasses, PageHeader } from '@repas/ui';
import { recentObservations, STORES } from '@/lib/coverage';
import { requireRole } from '@/lib/staff';
import { MergeForm, ProductForm } from './product-forms';

export const metadata: Metadata = { title: 'Produits' };
export const dynamic = 'force-dynamic';

const STORE_SHORT: Record<string, string> = {
  lidl: 'LI',
  aldi: 'AL',
  leclerc: 'EL',
  intermarche: 'IN',
  carrefour: 'CA',
  auchan: 'AU',
};
const FILTERS = [
  ['tous', 'Tous'],
  ['sans-prix', 'Sans prix récent'],
  ['non-lies', 'Sans ingrédient lié'],
  ['doublons', 'Doublons probables'],
] as const;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Fiches produits (maquette BOProduits). */
export default async function ProduitsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = one(sp.q).trim();
  const filter = one(sp.filtre) || 'tous';
  const { supabase } = await requireRole(['moderateur_prix']);
  const now = new Date();
  const [{ data: products }, { data: links }, { data: aisles }, obs] = await Promise.all([
    supabase.from('products').select('id, name, brand, ean, quantity_label, aisle_id').order('name'),
    supabase
      .from('recipe_ingredients')
      .select('product_id, recipes(id, title)')
      .not('product_id', 'is', null),
    supabase.from('aisles').select('id, label'),
    recentObservations(supabase, now),
  ]);
  const all = (products ?? []).map((p) => {
    const used = (links ?? []).filter((l) => l.product_id === p.id);
    const fresh = STORES.map((s) => ({ store: s, price: resolvePrice(obs, p.id, s, now) }));
    const twin = (products ?? []).filter(
      (o) =>
        o.id !== p.id &&
        norm(o.name) === norm(p.name) &&
        (o.quantity_label ?? '') === (p.quantity_label ?? ''),
    );
    return { ...p, used, fresh, twins: twin, hasFresh: fresh.some((f) => f.price?.fresh) };
  });
  const counts = {
    tous: all.length,
    'sans-prix': all.filter((p) => !p.hasFresh).length,
    'non-lies': all.filter((p) => !p.used.length).length,
    doublons: all.filter((p) => p.twins.length).length,
  };
  const terms = norm(q).split(' ').filter(Boolean);
  const list = all
    .filter((p) => terms.every((t) => norm(`${p.name} ${p.brand ?? ''} ${p.ean ?? ''}`).includes(t)))
    .filter((p) =>
      filter === 'sans-prix'
        ? !p.hasFresh
        : filter === 'non-lies'
          ? !p.used.length
          : filter === 'doublons'
            ? p.twins.length > 0
            : true,
    );
  const sel = all.find((p) => p.id === one(sp.id)) ?? list[0];
  const aisle = (id: string | null) => aisles?.find((a) => a.id === id)?.label ?? '—';
  const qs = (patch: Record<string, string>) => {
    const u = new URLSearchParams({
      ...(q ? { q } : {}),
      ...(filter !== 'tous' ? { filtre: filter } : {}),
      ...patch,
    });
    for (const [k, v] of [...u]) if (!v) u.delete(k);
    return `/produits${u.toString() ? `?${u}` : ''}` as Route;
  };

  return (
    <>
      <PageHeader eyebrow={`${all.length} fiches`} title="Produits" />
      {one(sp.fait) === 'fusion' ? (
        <p role="status" className="bg-success-soft text-success rounded-[14px] px-4 py-3 font-black">
          Fiches fusionnées.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <form action="/produits" className="flex-1">
          <label htmlFor="q" className="sr-only">
            Rechercher un produit
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Nom, marque ou EAN"
            className={inputClasses(false, 'max-w-[420px]')}
          />
          {filter !== 'tous' ? <input type="hidden" name="filtre" value={filter} /> : null}
        </form>
        <nav aria-label="Filtres" className="flex flex-wrap gap-2">
          {FILTERS.map(([id, label]) => (
            <Link
              key={id}
              href={qs({ filtre: id === 'tous' ? '' : id, id: '' })}
              aria-current={filter === id ? 'page' : undefined}
              className={cx(
                'rounded-pill min-h-[40px] border-2 px-3.5 py-1.5 text-[14px] font-extrabold no-underline',
                filter === id ? 'border-brand bg-brand text-brand-on' : 'border-line text-ink bg-white',
              )}
            >
              {label} <span className="tabular-nums opacity-70">{counts[id]}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className={cx(glassClasses, 'overflow-x-auto p-2')}>
          <table className="w-full min-w-[700px] text-[14px]">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                {['PRODUIT', 'RAYON', 'PRIX PAR ENSEIGNE (< 7 J)', 'RECETTES', 'ÉTAT'].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr
                  key={p.id}
                  className={cx(
                    'border-line border-t',
                    sel?.id === p.id ? 'bg-brand-soft' : 'hover:bg-site-hover',
                  )}
                >
                  <td className="px-3 py-2.5">
                    <Link href={qs({ id: p.id })} className="text-ink font-extrabold">
                      {p.name}
                    </Link>
                    <span className="text-ink-muted block text-[12px]">
                      {[p.brand, p.quantity_label, p.ean ? `EAN ${p.ean}` : null].filter(Boolean).join(' · ')}
                    </span>
                  </td>
                  <td className="text-ink-muted px-3 py-2.5 font-bold">{aisle(p.aisle_id)}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex gap-1">
                      {p.fresh.map((f) => (
                        <span
                          key={f.store}
                          title={f.price ? formatEuro(f.price.cents) : 'aucun prix'}
                          className={cx(
                            'rounded-[6px] px-1 text-[11px] font-black',
                            f.price?.fresh
                              ? 'bg-success-soft text-success'
                              : f.price
                                ? 'bg-warning-soft text-warning'
                                : 'bg-site-track text-ink-muted',
                          )}
                        >
                          {STORE_SHORT[f.store]}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-bold tabular-nums">{p.used.length || '—'}</td>
                  <td className="px-3 py-2.5">
                    {p.twins.length ? (
                      <span className="bg-warning-soft text-warning rounded-pill px-2 py-0.5 text-[12px] font-black">
                        Doublon ?
                      </span>
                    ) : !p.hasFresh ? (
                      <span className="bg-danger-soft text-danger-ink rounded-pill px-2 py-0.5 text-[12px] font-black">
                        Sans prix
                      </span>
                    ) : (
                      <span className="bg-success-soft text-success rounded-pill px-2 py-0.5 text-[12px] font-black">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length ? (
            <p className="text-ink-muted p-6 text-center font-bold">Aucun produit ne correspond.</p>
          ) : null}
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-8">
          {sel ? (
            <section className={cx(glassClasses, 'flex flex-col gap-4 p-5')} aria-labelledby="fiche">
              <div>
                <h2 id="fiche" className="font-display text-[22px] font-extrabold">
                  {sel.name}
                </h2>
                <p className="text-ink-muted text-[14px] font-bold">
                  {[sel.brand, aisle(sel.aisle_id)].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-ink-muted text-[12px] font-black tracking-[1px]">DERNIERS PRIX</p>
                <ul className="mt-2 grid grid-cols-2 gap-1.5 text-[14px] tabular-nums">
                  {sel.fresh.map((f) => (
                    <li key={f.store} className="flex justify-between rounded-[10px] bg-white px-2.5 py-1.5">
                      <span className="font-black">{STORE_SHORT[f.store]}</span>
                      <span className={f.price && !f.price.fresh ? 'text-warning font-bold' : 'font-bold'}>
                        {f.price ? `${f.price.fresh ? '' : '≈ '}${formatEuro(f.price.cents)}` : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {sel.used.length ? (
                <div>
                  <p className="text-ink-muted text-[12px] font-black tracking-[1px]">UTILISÉ DANS</p>
                  <ul className="mt-1 flex flex-col">
                    {sel.used.map((u) =>
                      u.recipes ? (
                        <li key={u.recipes.id}>
                          <Link
                            href={`/recettes/${u.recipes.id}` as Route}
                            className="text-brand text-[14px] font-bold"
                          >
                            {u.recipes.title}
                          </Link>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </div>
              ) : null}
              {sel.twins.length ? (
                <div className="bg-warning-soft rounded-[16px] p-4">
                  <p className="text-warning font-black">Doublon probable</p>
                  <p className="text-warning mb-3 text-[14px]">Même nom et même format qu’une autre fiche.</p>
                  <MergeForm
                    keepId={sel.id}
                    candidates={sel.twins.map((t) => ({
                      id: t.id,
                      label: `${t.name}${t.ean ? ` · EAN ${t.ean}` : ''}`,
                    }))}
                  />
                </div>
              ) : null}
              <ProductForm
                values={{
                  id: sel.id,
                  name: sel.name,
                  brand: sel.brand,
                  quantity_label: sel.quantity_label,
                  aisle_id: sel.aisle_id,
                  ean: sel.ean,
                }}
              />
            </section>
          ) : null}
          <details className={cx(glassClasses, 'p-5')}>
            <summary className="min-h-tap flex cursor-pointer items-center font-black">
              Nouvelle fiche
            </summary>
            <div className="mt-3">
              <ProductForm />
            </div>
          </details>
        </aside>
      </div>
    </>
  );
}
