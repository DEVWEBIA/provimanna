import type { Metadata } from 'next';
import Link from 'next/link';
import { completeTotals, formatEuro, STORE_COUNT, type StoreId } from '@repas/core';
import { cx, Reveal, StoreChip } from '@repas/ui';
import { CtaTicket, DemoBadge, H2, Panel, SeoHero } from '@/components/seo/blocks';
import { Faq } from '@/components/site/faq';
import { SitePage } from '@/components/site/site-page';
import { longDate } from '@/lib/dates';
import { MONTH_YEAR, referenceBasket, storeName } from '@/lib/observatory';
import { STORES } from '@/lib/plan';
import { breadcrumbLd, faqPageLd, JsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl, href, ROUTES, SITE_NAME } from '@/lib/site';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: 'Quel supermarché est le moins cher ? Observatoire des prix',
  description:
    'Coût d’un panier de 14 repas pour 4 personnes chez Lidl, Aldi, E.Leclerc, Super U, Carrefour, Auchan, Monoprix et 5 autres enseignes, mis à jour chaque semaine.',
  alternates: { canonical: ROUTES.comparatif },
};

export default async function ComparatifPage() {
  const b = await referenceBasket();
  if (!b) throw new Error('Panier type indisponible');
  const t = b.comparison.totals;
  // Classement sur les enseignes qui vendent tout le panier ; les totaux partiels viennent après, sans rang.
  const ranked = completeTotals(t);
  const [first, second, third] = ranked;
  const last = ranked.at(-1)!;
  const period = MONTH_YEAR(b.weekStart);
  const name = (id: StoreId) => storeName(b, id);
  const answer = `Sur notre panier type de 14 repas pour 4 personnes, ${name(first!.storeId)} est le moins cher à ${formatEuro(first!.cents)}, devant ${name(second!.storeId)} (${formatEuro(second!.cents)}) et ${name(third!.storeId)} (${formatEuro(third!.cents)}). ${name(last.storeId)} ferme la marche à ${formatEuro(last.cents)}, soit ${formatEuro(last.cents - first!.cents)} de plus par semaine.`;
  const faq = [
    { q: `Quel supermarché est le moins cher en ${period} ?`, a: answer },
    {
      q: 'Comment est composé le panier type ?',
      a: `14 déjeuners et dîners de saison pour 2 adultes et 2 enfants, soit ${b.productCount} produits équivalents d’une enseigne à l’autre, souvent en marque distributeur.`,
    },
    {
      q: 'Les prix sont-ils les mêmes dans tous les magasins ?',
      a: 'Non : les prix varient selon le magasin et les promotions locales. Nos totaux sont des repères calculés sur la médiane des relevés récents.',
    },
  ];
  const duels: [StoreId, StoreId][] = [
    ['lidl', 'leclerc'],
    ['aldi', 'lidl'],
    ['carrefour', 'auchan'],
    ['super-u', 'leclerc'],
    ['netto', 'lidl'],
    ['monoprix', 'franprix'],
  ];
  const total = (id: StoreId) => t.find((x) => x.storeId === id)!.cents;

  return (
    <SitePage
      crumbs={[
        { label: 'Accueil', href: '/' },
        { label: 'Comparatifs' },
        { label: `Observatoire ${period}` },
      ]}
    >
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: 'Comparatif des prix', path: ROUTES.comparatif },
        ])}
      />
      <JsonLd data={faqPageLd(faq)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: `Prix du panier de courses hebdomadaire pour 4 personnes — ${STORE_COUNT} enseignes`,
          description:
            'Coût d’un panier de 14 repas pour 4 personnes chez Lidl, Aldi, Netto, E.Leclerc, Super U, Intermarché, Carrefour, Auchan, Franprix et Monoprix, et sur les produits vendus chez Grand Frais et Picard.',
          url: absoluteUrl(ROUTES.comparatif),
          temporalCoverage: b.weekStart,
          spatialCoverage: { '@type': 'Place', name: 'France' },
          creator: { '@type': 'Organization', name: SITE_NAME },
          isBasedOn: 'https://prices.openfoodfacts.org',
          variableMeasured: 'Prix total du panier en euros',
          dateModified: (b.pricesAt ?? b.weekStart).slice(0, 10),
        }}
      />
      <SeoHero
        eyebrow={`Observatoire des prix · ${period}`}
        badge={b.demo ? <DemoBadge /> : null}
        title={`Quel supermarché est le moins cher en ${period} ?`}
        answer={answer}
        meta={
          <>
            {b.pricesAt ? `Prix relevés le ${longDate(b.pricesAt)} · ` : ''}
            {b.productCount} produits · {STORE_COUNT} enseignes · relevés de moins de 7 jours
          </>
        }
      />

      <Reveal>
        <Panel>
          <H2>Classement des enseignes</H2>
          <ol className="mt-6 flex flex-col gap-2.5">
            {t.map((x, i) => (
              <li
                key={x.storeId}
                className="flex flex-wrap items-center gap-4 rounded-[18px] bg-white px-4 py-3"
              >
                <span className="font-display w-8 text-[24px] font-extrabold">{x.partial ? '' : i + 1}</span>
                <StoreChip
                  storeId={x.storeId}
                  name={name(x.storeId)}
                  initials={b.stores.find((s) => s.id === x.storeId)?.initials ?? '··'}
                  className="w-[170px] text-[16px]"
                />
                <span
                  className={cx(
                    'h-3 min-w-[100px] flex-1 overflow-hidden rounded-[9px]',
                    !x.partial && 'bg-site-track',
                  )}
                  aria-hidden="true"
                >
                  {x.partial ? null : (
                    <span
                      className={cx('block h-full rounded-[9px]', i === 0 ? 'bg-saving' : 'bg-site-bar')}
                      style={{ width: `${Math.min(100, Math.round((x.cents / last.cents) * 100))}%` }}
                    />
                  )}
                </span>
                <span className="font-display w-[110px] text-right text-[22px] font-extrabold tabular-nums">
                  {x.partial ? '—' : formatEuro(x.cents)}
                </span>
                <span className="text-ink-muted w-[150px] text-right text-[14px] font-bold tabular-nums">
                  {x.partial ? (
                    `Partiel · ${Math.round(x.coverage * 100)} % du panier`
                  ) : (
                    <>
                      Indice {Math.round((x.cents / first!.cents) * 100)}
                      {i > 0 ? ` · +${formatEuro(x.cents - first!.cents)}` : ''}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </Reveal>

      <Reveal>
        <Panel>
          <H2>Rayon par rayon</H2>
          <p className="text-ink-muted mt-2 text-[15px] font-bold">
            Coût du panier type par rayon. En orange : l’enseigne la moins chère du rayon. « — » : rayon pas
            vendu en entier par l’enseigne.
          </p>
          <div
            className="mt-5 overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label="Coût du panier type par rayon"
          >
            <table className="w-full min-w-[1180px] text-[14px] tabular-nums">
              <thead>
                <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                  <th scope="col" className="pb-2">
                    RAYON
                  </th>
                  {STORES.map((s) => (
                    <th key={s} scope="col" className="pb-2 text-right">
                      {name(s).toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.aisles.map((a) => {
                  const min = Math.min(...a.totals.filter((x) => !x.partial).map((x) => x.cents));
                  return (
                    <tr key={a.id} className="border-line border-t">
                      <th scope="row" className="py-3 text-left font-extrabold">
                        {a.label}
                      </th>
                      {a.totals.map((x) => (
                        <td key={x.storeId} className="py-3 text-right">
                          <span
                            className={cx(
                              'rounded-pill px-2 py-0.5 font-bold',
                              !x.partial && x.cents === min && 'bg-saving text-raw-encre font-black',
                            )}
                          >
                            {x.partial ? '—' : formatEuro(x.cents)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr className="border-ink border-t-2 font-black">
                  <th scope="row" className="py-3 text-left">
                    Total
                  </th>
                  {STORES.map((s) => (
                    <td key={s} className="py-3 text-right">
                      {t.find((x) => x.storeId === s)!.partial ? '—' : formatEuro(total(s))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      </Reveal>

      <Reveal>
        <H2>Les duels les plus recherchés</H2>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {duels.map(([a, c]) => {
            const d = total(a) - total(c);
            const cheaper = d <= 0 ? a : c;
            return (
              <li
                key={`${a}-${c}`}
                className="border-line rounded-[22px] border bg-white/75 p-5 backdrop-blur"
              >
                <p className="text-[18px] font-black">
                  {name(a)} ou {name(c)} ?
                </p>
                <p className="text-ink-muted mt-1 text-[15px] font-bold">
                  {Math.abs(d) < 200
                    ? `Écart de ${formatEuro(Math.abs(d))} : quasi à égalité`
                    : `${name(cheaper)} moins cher de ${formatEuro(Math.abs(d))} par semaine`}
                </p>
                <Link
                  href={href(`/enseignes/${cheaper}`)}
                  className="text-brand min-h-tap mt-3 inline-flex items-center text-[14px] font-black"
                >
                  Voir {name(cheaper)} →
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal>
        <Panel>
          <H2>Comment on calcule ces prix</H2>
          <p className="text-ink-muted mt-2 text-[15px] font-bold">Méthode publique et reproductible.</p>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              [
                'Panier type',
                `14 repas pour 2 adultes et 2 enfants, ${b.productCount} produits équivalents d’une enseigne à l’autre.`,
              ],
              [
                'Sources',
                'Relevés Open Prices (Open Food Facts) et tickets de caisse vérifiés de la communauté.',
              ],
              ['Calcul', 'Prix médian des relevés de moins de 7 jours, en France métropolitaine.'],
              ['Limites', 'Les prix varient selon le magasin et les promos locales : ce sont des repères.'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[18px] bg-white p-4">
                <dt className="font-black">{k}</dt>
                <dd className="text-ink-muted mt-1 text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={href(ROUTES.methodologie)}
            className="text-brand min-h-tap mt-4 inline-flex items-center font-black"
          >
            Lire la méthodologie →
          </Link>
        </Panel>
      </Reveal>

      <Reveal>
        <Faq items={faq} eyebrow="Questions fréquentes" className="" />
      </Reveal>
      <Reveal>
        <CtaTicket title="Et ton panier à toi, il coûte combien ?" label="Calculer mon plan gratuit" />
      </Reveal>
    </SitePage>
  );
}
