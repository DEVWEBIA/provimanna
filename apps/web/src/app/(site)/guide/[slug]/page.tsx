import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { costPerServing, formatEuro, recipeStoreTotals, type StoreId } from '@repas/core';
import { Reveal } from '@repas/ui';
import { CtaTicket, DemoBadge, H2, Panel, SeoHero } from '@/components/seo/blocks';
import { Faq } from '@/components/site/faq';
import { SitePage } from '@/components/site/site-page';
import { longDate } from '@/lib/dates';
import { MONTH_YEAR } from '@/lib/observatory';
import { loadPlanData, STORES, toRecipe } from '@/lib/plan';
import { breadcrumbLd, faqPageLd, JsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl, href, ROUTES, SITE_NAME } from '@/lib/site';
import { listStores } from '@/lib/stores';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => [{ slug: 'batch-cooking' }];

/** Les 5 dîners tirés des 3 bases du batch (recettes du catalogue). */
const DINNERS = [
  'dahl-lentilles-corail',
  'veloute-potimarron',
  'pates-tomate-basilic',
  'salade-lentilles-feta',
  'gratin-butternut',
];
const PUBLISHED = '2026-11-08';

export const metadata: Metadata = {
  title: 'Batch cooking : 5 repas en 2 heures, prix compris',
  description:
    '3 bases à préparer le dimanche pour 5 dîners de 4 personnes, avec le coût des courses dans les enseignes les moins chères.',
  alternates: { canonical: '/guide/batch-cooking' },
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  if ((await params).slug !== 'batch-cooking') notFound();
  const supabase = createPublicClient();
  const [data, stores] = await Promise.all([loadPlanData(supabase), listStores(supabase)]);
  const recipes = DINNERS.map((s) => data.catalogue.find((r) => r.slug === s)).filter((r) => r !== undefined);
  // Coût des 5 dîners pour 4 personnes, par enseigne (core) ; seules les enseignes qui vendent tout comptent.
  const totals = STORES.flatMap((store) => {
    const each = recipes.map(
      (r) => recipeStoreTotals(toRecipe(r), 4, [store], data.observations, data.now)[0]!,
    );
    return each.some((t) => t.partial) ? [] : [{ store, cents: each.reduce((sum, t) => sum + t.cents, 0) }];
  }).sort((a, b) => a.cents - b.cents);
  const name = (id: StoreId) => stores.find((s) => s.id === id)?.name ?? id;
  const best = totals[0]!;
  const parts = recipes.length * 4;
  const demo = data.observations.some((o) => o.source === 'manual');
  const faq = [
    {
      q: 'Combien de temps se gardent les plats préparés ?',
      a: '4 jours au réfrigérateur dans une boîte fermée, 3 mois au congélateur.',
    },
    {
      q: 'Faut-il beaucoup de matériel ?',
      a: 'Une grande casserole, une plaque de four et 8 boîtes hermétiques suffisent.',
    },
    {
      q: 'Combien coûte un batch pour 4 personnes ?',
      a: `${formatEuro(best.cents)} chez ${name(best.store)} pour 5 dîners, soit ${formatEuro(costPerServing(best.cents, parts))} par part.`,
    },
  ];
  const title = `Batch cooking : 5 repas en 2 heures pour ${formatEuro(best.cents)}`;
  const toc = [
    ['bases', 'Les 3 bases à préparer'],
    ['cout', 'Combien ça coûte'],
    ['semaine', 'La semaine qui en découle'],
    ['faq', 'Questions fréquentes'],
  ];

  return (
    <SitePage crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Guides' }, { label: 'Batch cooking' }]}>
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: 'Batch cooking', path: '/guide/batch-cooking' },
        ])}
      />
      <JsonLd data={faqPageLd(faq)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          url: absoluteUrl('/guide/batch-cooking'),
          datePublished: PUBLISHED,
          dateModified: data.now.toISOString().slice(0, 10),
          author: { '@type': 'Organization', name: SITE_NAME },
          publisher: { '@type': 'Organization', name: SITE_NAME },
        }}
      />
      <SeoHero
        eyebrow="Guide pratique · 8 min de lecture"
        badge={demo ? <DemoBadge /> : null}
        title={title}
        answer="En 2 heures le dimanche, tu prépares 3 bases qui donnent 5 dîners pour 4 personnes."
        meta={`Par l’équipe ${SITE_NAME} · publié le ${longDate(PUBLISHED)} · prix de ${MONTH_YEAR(data.now)}`}
      />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="flex flex-col gap-8">
          <Panel className="bg-site-highlight">
            <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">L’ESSENTIEL</p>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[16px] font-bold">
              <li>En 2 heures le dimanche, tu prépares 3 bases qui donnent 5 dîners pour 4 personnes.</li>
              <li>
                Coût total : {formatEuro(best.cents)} chez {name(best.store)}, soit{' '}
                {formatEuro(costPerServing(best.cents, parts))} par part.
              </li>
              <li>Les bases se gardent 4 jours au frigo, ou 3 mois au congélateur.</li>
            </ul>
          </Panel>
          <p className="text-[17px] leading-[28px]">
            Le batch cooking consiste à cuisiner en une seule fois les bases de plusieurs repas. On allume le
            four une fois, on lave la planche une fois, et on évite la tentation du plat préparé le mercredi
            soir.
          </p>
          <section id="bases" className="scroll-mt-24">
            <H2>Les 3 bases à préparer</H2>
            <p className="text-ink-muted mt-2 text-[16px]">
              Choisis des bases qui se déclinent : une légumineuse, un légume rôti, une sauce.
            </p>
            <ol className="mt-5 flex flex-col gap-3">
              {[
                ['0:00', 'Lentilles, 500 g', 'Pour un dahl et une salade. 25 min à couvert.'],
                ['0:10', 'Courges rôties, 1,5 kg', 'Pour un velouté et un gratin. 40 min à 200 °C.'],
                ['0:30', 'Sauce tomate maison, 1,5 L', 'Pour des pâtes et des lasagnes. 45 min à feu doux.'],
                ['1:30', 'Refroidir, étiqueter, ranger', 'Boîtes en verre, date du jour au marqueur.'],
              ].map(([t, h, d]) => (
                <li key={t} className="flex gap-4 rounded-[18px] bg-white/80 p-4">
                  <span className="font-display text-brand w-12 shrink-0 text-[18px] font-extrabold tabular-nums">
                    {t}
                  </span>
                  <span>
                    <strong className="block">{h}</strong>
                    <span className="text-ink-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <section id="cout" className="scroll-mt-24">
            <H2>Combien ça coûte</H2>
            <p className="text-ink-muted mt-2 text-[16px]">
              Pour 5 dîners de 4 personnes, voici le coût des courses dans les 3 enseignes les moins chères de
              notre{' '}
              <Link href={href(ROUTES.comparatif)} className="text-brand">
                observatoire
              </Link>
              .
            </p>
            <table className="mt-4 w-full text-[16px] tabular-nums">
              <thead>
                <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                  <th scope="col" className="pb-2">
                    ENSEIGNE
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    5 DÎNERS
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    PAR PART
                  </th>
                </tr>
              </thead>
              <tbody>
                {totals.slice(0, 3).map((x) => (
                  <tr key={x.store} className="border-line border-t">
                    <th scope="row" className="py-2.5 text-left font-extrabold">
                      {name(x.store)}
                    </th>
                    <td className="py-2.5 text-right font-black">{formatEuro(x.cents)}</td>
                    <td className="py-2.5 text-right font-bold">
                      {formatEuro(costPerServing(x.cents, parts))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section id="semaine" className="scroll-mt-24">
            <H2>La semaine qui en découle</H2>
            <ul className="mt-4 flex flex-col gap-2 text-[16px]">
              {recipes.map((r, i) => (
                <li key={r.id}>
                  <strong>{['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][i]} :</strong>{' '}
                  <Link href={href(`/recettes/${r.slug}`)} className="text-brand">
                    {r.title.charAt(0).toLowerCase() + r.title.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="bg-site-mint mt-5 rounded-[18px] p-4 text-[15px]">
              <strong>Astuce conservation.</strong> Congèle la sauce tomate en portions de 500 ml : elle
              décongèle en 10 minutes à la casserole.
            </p>
          </section>
          <Faq items={faq} eyebrow="Questions fréquentes" className="" />
        </article>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
          <nav
            aria-label="Sommaire"
            className="border-line rounded-[22px] border bg-white/80 p-5 backdrop-blur"
          >
            <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">SOMMAIRE</p>
            <ol className="mt-3 flex flex-col gap-1">
              {toc.map(([id, t]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-ink hover:text-brand min-h-tap flex items-center text-[15px] font-bold no-underline"
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="border-line rounded-[22px] border bg-white/80 p-5 backdrop-blur">
            <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">À LIRE AUSSI</p>
            <ul className="mt-2 flex flex-col">
              <li>
                <Link href={href(ROUTES.menus)} className="text-brand min-h-tap flex items-center font-bold">
                  Le menu de la semaine pour 4
                </Link>
              </li>
              <li>
                <Link
                  href={href(ROUTES.comparatif)}
                  className="text-brand min-h-tap flex items-center font-bold"
                >
                  Quel supermarché est le moins cher ?
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
      <Reveal>
        <CtaTicket
          title="On prépare ta liste de batch, au prix de ton enseigne."
          label="Essayer gratuitement"
        />
      </Reveal>
    </SitePage>
  );
}
