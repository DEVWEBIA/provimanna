import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import { OPEN_PRICES_CREDIT } from '@repas/core';
import { cx, glassClasses, PageHeader } from '@repas/ui';
import { Badge } from '@/components/bo-ui';
import { requireRole } from '@/lib/staff';
import { RunImportButton } from './run-import-button';

export const metadata: Metadata = { title: 'Imports de prix' };
export const dynamic = 'force-dynamic';
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const when = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
const duration = (a: string, b: string | null) => {
  if (!b) return '—';
  const s = Math.max(1, Math.round((Date.parse(b) - Date.parse(a)) / 1000));
  return s < 60 ? `${s} s` : `${Math.round(s / 60)} min`;
};

/** Imports de prix (maquette BOImports) : historique des imports Open Prices et détail d'un passage. */
export default async function ImportsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireRole(['moderateur_prix']);
  const { data: runs } = await supabase
    .from('import_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(30);
  const list = runs ?? [];
  const sel = list.find((r) => String(r.id) === sp.id) ?? list[0];

  return (
    <>
      <PageHeader
        eyebrow="Prix › Imports"
        title="Imports de prix"
        lead="Planifié chaque jour à 4 h une fois en ligne. Prix récupérés depuis Open Prices, convertis et contrôlés."
        actions={<RunImportButton />}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className={cx(glassClasses, 'overflow-x-auto p-5')} aria-label="Historique des imports">
          {list.length ? (
            <table className="w-full min-w-[560px] text-[14px] tabular-nums">
              <thead>
                <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                  <th scope="col" className="pb-2">
                    IMPORT
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    AJOUTÉS
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    ÉCARTÉS
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    DURÉE
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    ÉTAT
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr
                    key={r.id}
                    className={cx('border-line border-t', r.id === sel?.id && 'bg-brand-soft/40')}
                  >
                    <th scope="row" className="py-2.5 text-left">
                      <Link href={`/prix/imports?id=${r.id}` as Route} className="text-ink font-black">
                        Open Prices
                      </Link>
                      <span className="text-ink-muted block text-[12px] font-bold">{when(r.started_at)}</span>
                    </th>
                    <td className="py-2.5 text-right font-black">{r.imported}</td>
                    <td className="text-ink-muted py-2.5 text-right font-bold">{r.unmatched + r.skipped}</td>
                    <td className="text-ink-muted py-2.5 text-right font-bold">
                      {duration(r.started_at, r.finished_at)}
                    </td>
                    <td className="py-2.5 text-right">
                      {r.error ? (
                        <Badge tone="bad">Échec</Badge>
                      ) : r.finished_at ? (
                        <Badge tone="ok">Terminé</Badge>
                      ) : (
                        <Badge tone="warn">En cours</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-ink-muted font-bold">
              Aucun import pour l’instant. Lance le premier avec le bouton ci-dessus.
            </p>
          )}
        </section>

        {sel ? (
          <aside className={cx(glassClasses, 'p-5')} aria-label="Détail de l’import">
            <p className="text-ink-muted text-[12px] font-black tracking-[1px]">
              {when(sel.started_at)} · OPEN PRICES
            </p>
            <dl className="mt-3 flex flex-col">
              {[
                ['Prix lus', sel.fetched],
                ['Ajoutés', sel.imported],
                ['Dont signalés (écart > 40 %)', sel.aberrant],
                ['Produit ou enseigne non reconnus', sel.unmatched],
                ['Écartés (hors France, promo, déjà importés)', sel.skipped],
              ].map(([l, n]) => (
                <div
                  key={String(l)}
                  className="border-line flex justify-between gap-3 border-t py-2 text-[14px]"
                >
                  <dt className="font-bold">{l}</dt>
                  <dd className="font-black tabular-nums">{n}</dd>
                </div>
              ))}
            </dl>
            {sel.error ? (
              <p className="text-danger-ink mt-3 text-[14px] font-bold">Erreur : {sel.error}</p>
            ) : null}
            <p className="text-ink-muted mt-3 text-[13px] font-bold">
              Prix créés depuis le {sel.since ? when(sel.since) : '—'}. Non reconnus : produits sans
              code-barres ni catégorie de vrac renseignés, ou magasins hors des enseignes suivies.
            </p>
            {sel.aberrant ? (
              <Link href="/prix" className="text-brand min-h-tap mt-3 inline-flex items-center font-black">
                Voir les {sel.aberrant} alertes créées par cet import →
              </Link>
            ) : null}
          </aside>
        ) : null}
      </div>
      <p className="text-ink-muted text-[12px] font-bold">{OPEN_PRICES_CREDIT}</p>
    </>
  );
}
