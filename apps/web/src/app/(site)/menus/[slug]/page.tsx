import type { Metadata } from 'next';
import { RecipePhoto } from '@/components/recipes/recipe-photo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { costPerServing, formatEuro, type PlanFilters, type PlannerHousehold } from '@repas/core';
import { cx, Reveal, StoreChip } from '@repas/ui';
import { DAY_LONG } from '@/components/plan/labels';
import { CtaTicket, DemoBadge, H2, Panel, SeoHero } from '@/components/seo/blocks';
import { Faq } from '@/components/site/faq';
import { SitePage } from '@/components/site/site-page';
import { longDate } from '@/lib/dates';
import { MONTH_YEAR, referenceBasket, REFERENCE_HOUSEHOLD, storeName } from '@/lib/observatory';
import { breadcrumbLd, faqPageLd, JsonLd } from '@/lib/seo/json-ld';
import { href } from '@/lib/site';

export const revalidate = 86400;
export const dynamicParams = false;

/** Menus publiés : un foyer type, des filtres, un budget annoncé (vérifié sur les vrais totaux). */
const MENUS: Record<
  string,
  { label: string; budget: number | null; household: PlannerHousehold; filters?: PlanFilters }
> = {
  'menu-semaine-60-euros-4-personnes': {
    label: 'Semaine à moins de 60 €',
    budget: 6000,
    household: REFERENCE_HOUSEHOLD,
  },
  'menu-vegetarien-semaine-4-personnes': {
    label: 'Semaine végétarienne',
    budget: null,
    household: { ...REFERENCE_HOUSEHOLD, diet: 'vegetarien' },
    filters: { vegetarian: true },
  },
};
export const generateStaticParams = () => Object.keys(MENUS).map((slug) => ({ slug }));

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const m = MENUS[(await params).slug];
  if (!m) return {};
  return {
    title: `${m.label} pour 4 personnes : menu et liste de courses`,
    description:
      'Menu de 14 repas pour 2 adultes et 2 enfants, avec la liste de courses par rayon et son prix dans 6 enseignes.',
    alternates: { canonical: `/menus/${(await params).slug}` },
  };
}

export default async function MenuPage({ params }: { params: Params }) {
  const { slug } = await params;
  const menu = MENUS[slug];
  if (!menu) notFound();
  const b = await referenceBasket(menu.filters, menu.household);
  if (!b) throw new Error('Menu indisponible');
  const t = b.comparison.totals;
  const first = t[0]!;
  const last = t.at(-1)!;
  const name = (id: string) => storeName(b, id);
  const under = menu.budget ? t.filter((x) => x.cents <= menu.budget!).length : 0;
  const title = menu.budget
    ? first.cents <= menu.budget
      ? `La semaine à moins de ${menu.budget / 100} € pour 4 personnes`
      : `La semaine à ${formatEuro(first.cents)} pour 4 personnes`
    : 'La semaine végétarienne pour 4 personnes';
  const veg = b.meals.filter((m) => m.recipe.diets.includes('vegetarien')).length;
  const answer = `Ce menu de 14 repas pour 2 adultes et 2 enfants coûte ${formatEuro(first.cents)} chez ${name(first.storeId)}, soit ${formatEuro(costPerServing(first.cents, 56))} par part.${
    menu.budget
      ? ` Il reste sous ${menu.budget / 100} € dans ${under} enseigne${under > 1 ? 's' : ''} sur 6.`
      : ''
  }`;
  const faq = [
    {
      q: 'Peut-on vraiment nourrir 4 personnes avec ce budget ?',
      a: `Oui pour les déjeuners et dîners : ce menu coûte entre ${formatEuro(first.cents)} et ${formatEuro(last.cents)} selon l’enseigne. Petits-déjeuners et goûters ne sont pas inclus.`,
    },
    {
      q: 'Le menu change-t-il chaque semaine ?',
      a: 'Oui. Un nouveau menu est composé chaque semaine, avec les produits de saison et les prix de la semaine.',
    },
  ];
  const days = [1, 2, 3, 4, 5, 6, 7].map((d) => ({ d, meals: b.meals.filter((m) => m.day === d) }));

  return (
    <SitePage crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Menus' }, { label: menu.label }]}>
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: menu.label, path: `/menus/${slug}` },
        ])}
      />
      <JsonLd data={faqPageLd(faq)} />
      <SeoHero
        eyebrow={`Menu de la semaine · ${MONTH_YEAR(b.weekStart)}`}
        badge={b.demo ? <DemoBadge /> : null}
        title={title}
        answer={<strong className="text-ink">{answer}</strong>}
        meta={
          <>
            14 repas · {b.productCount} produits · {veg} recettes végé
            {b.pricesAt ? ` · prix relevés le ${longDate(b.pricesAt)}` : ''}
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveal>
          <Panel>
            <H2>Les 14 repas</H2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {days.map(({ d, meals }) => (
                <li key={d} className="rounded-[20px] bg-white p-4">
                  <p className="text-ink-muted text-[12px] font-black uppercase tracking-[1px]">
                    {DAY_LONG[d - 1]}
                  </p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {meals.map((m) => (
                      <li key={m.slot} className="flex items-center gap-3">
                        <RecipePhoto slug={m.recipe.slug} illustration={m.recipe.illustration} size={44} />
                        <Link
                          href={href(`/recettes/${m.recipe.slug}`)}
                          className="text-ink text-[15px] font-extrabold"
                        >
                          {m.recipe.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Panel>
        </Reveal>
        <aside className="border-line rounded-[24px] border bg-white/80 p-5 backdrop-blur lg:sticky lg:top-24">
          <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">CE MENU COÛTE…</p>
          <ul className="mt-3 flex flex-col gap-2">
            {t.map((x, i) => (
              <li
                key={x.storeId}
                className={cx(
                  'flex items-center justify-between rounded-[14px] px-3 py-2',
                  i === 0 ? 'bg-saving-soft' : 'bg-white',
                )}
              >
                <StoreChip
                  storeId={x.storeId}
                  name={name(x.storeId)}
                  initials={b.stores.find((s) => s.id === x.storeId)?.initials ?? '··'}
                  size="sm"
                  className="text-[15px]"
                />
                <span className="font-black tabular-nums">{formatEuro(x.cents)}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <Reveal>
        <Panel>
          <H2>La liste de courses, par rayon</H2>
          <table className="mt-5 w-full text-[15px] tabular-nums">
            <thead>
              <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                <th scope="col" className="pb-2">
                  RAYON
                </th>
                <th scope="col" className="pb-2 text-right">
                  PRODUITS
                </th>
                <th scope="col" className="pb-2 text-right">
                  CHEZ {name(first.storeId).toUpperCase()}
                </th>
              </tr>
            </thead>
            <tbody>
              {b.aisles.map((a) => (
                <tr key={a.id} className="border-line border-t">
                  <th scope="row" className="py-2.5 text-left font-extrabold">
                    {a.label}
                  </th>
                  <td className="py-2.5 text-right font-bold">{a.count}</td>
                  <td className="py-2.5 text-right font-bold">
                    {formatEuro(a.totals.find((x) => x.storeId === first.storeId)!.cents)}
                  </td>
                </tr>
              ))}
              <tr className="border-ink border-t-2 font-black">
                <th scope="row" className="py-2.5 text-left">
                  Total
                </th>
                <td className="py-2.5 text-right">{b.productCount}</td>
                <td className="py-2.5 text-right">{formatEuro(first.cents)}</td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </Reveal>

      <Reveal>
        <CtaTicket
          title="Adapte ce menu à ton foyer"
          text="Nombre de personnes, régime, enseigne : on recalcule tout, gratuitement."
          label="Utiliser ce menu"
        />
      </Reveal>
      <Reveal>
        <Faq items={faq} eyebrow="Questions fréquentes" className="" />
      </Reveal>
    </SitePage>
  );
}
