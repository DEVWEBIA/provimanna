import type { Metadata } from 'next';
import { RecipePhoto } from '@/components/recipes/recipe-photo';
import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { costPerServing, discountPercent, formatEuro, sumCents, zonedDate, type StoreId } from '@repas/core';
import { animDelay, Glow, Reveal, TicketCard } from '@repas/ui';
import { DemoNotice } from '@/components/plan/demo-notice';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { RecipePriceTable, type PriceRow } from '@/components/recipes/recipe-price-table';
import { Faq } from '@/components/site/faq';
import { SitePage } from '@/components/site/site-page';
import { latest, longDate } from '@/lib/dates';
import {
  FAMILY_LABEL,
  getRecipe,
  ingredientLines,
  MONTHS,
  publicCatalogue,
  recipeTags,
  totalsByServings,
} from '@/lib/recipes';
import { breadcrumbLd, faqPageLd, JsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl, href, ROUTES } from '@/lib/site';
import { listStores } from '@/lib/stores';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 86400;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const { data } = await createPublicClient().from('recipes').select('slug').eq('published', true);
    return (data ?? []).map((r) => ({ slug: r.slug }));
  } catch {
    return []; // Base indisponible au build : pages générées à la première visite (ISR).
  }
}

async function load(slug: string) {
  const supabase = createPublicClient();
  const recipe = await getRecipe(supabase, slug);
  if (!recipe) return null;
  const now = new Date();
  const [{ recipes, observations }, stores] = await Promise.all([
    publicCatalogue(supabase, now),
    listStores(supabase),
  ]);
  return { recipe, recipes, observations, stores, now };
}

const DIET_LD: Record<string, string> = {
  vegetarien: 'https://schema.org/VegetarianDiet',
  vegan: 'https://schema.org/VeganDiet',
  sans_gluten: 'https://schema.org/GlutenFreeDiet',
  halal: 'https://schema.org/HalalDiet',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const d = await load((await params).slug);
  if (!d) return {};
  const t = d.recipes.find((r) => r.id === d.recipe.id);
  const cents = t?.cheapest.cents;
  const title = cents ? `${d.recipe.title} : ${formatEuro(cents)} pour 4` : d.recipe.title;
  const description = cents
    ? `${d.recipe.title} pour 4 personnes, de ${formatEuro(t.totals[0]!.cents)} à ${formatEuro(t.totals.at(-1)!.cents)} selon l’enseigne. Prix datés, 6 enseignes comparées.`
    : (d.recipe.description ?? undefined);
  return {
    title: title.length <= 60 ? title : d.recipe.title,
    description,
    alternates: { canonical: `/recettes/${d.recipe.slug}` },
    openGraph: { type: 'article', title, description, url: `/recettes/${d.recipe.slug}` },
  };
}

export default async function RecettePage({ params }: { params: Params }) {
  const d = await load((await params).slug);
  if (!d) notFound();
  const { recipe, recipes, observations, stores, now } = d;
  const m = Number(zonedDate(now).iso.slice(5, 7));
  const minutes = recipe.prepMinutes + recipe.cookMinutes;
  const name = (id: StoreId) => stores.find((s) => s.id === id)?.name ?? id;
  const byServings = totalsByServings(recipe, observations, now);
  const rows: Record<number, PriceRow[]> = Object.fromEntries(
    Object.entries(byServings).map(([n, totals]) => [
      n,
      totals.map((t) => ({
        id: t.storeId,
        name: name(t.storeId),
        initials: stores.find((s) => s.id === t.storeId)?.initials ?? '··',
        cents: t.cents,
        perServing: costPerServing(t.cents, Number(n)),
        diff: t.cents - totals[0]!.cents,
        estimate: t.freshRatio < 1,
        reliability: t.reliability,
      })),
    ]),
  );
  const base = byServings[4]!;
  const cheapest = base[0]!;
  const priciest = base.at(-1)!;
  const perPart = costPerServing(cheapest.cents, 4);
  const lines = ingredientLines(recipe, recipe.servings, cheapest.storeId, observations, now);
  const pricesAt = latest(base.map((t) => t.latestObservedAt));
  const inSeason = recipe.seasonMonths.length < 12 && recipe.seasonMonths.includes(m);
  const veg = recipe.diets.includes('vegetarien');
  const tags = recipeTags({ ...recipe, minutes }, m);
  const related = recipes
    .filter((r) => r.id !== recipe.id && (r.family === recipe.family || r.seasonMonths.includes(m)))
    .sort(
      (a, b) =>
        Number(b.family === recipe.family) - Number(a.family === recipe.family) ||
        a.perServing - b.perServing,
    )
    .slice(0, 4);
  const lower = recipe.title.charAt(0).toLowerCase() + recipe.title.slice(1);
  const answer = `Pour 4 personnes, cette recette coûte ${formatEuro(cheapest.cents)} chez ${name(cheapest.storeId)}, soit ${formatEuro(perPart)} par part.`;
  const faq = [
    {
      q: `Combien coûte ${lower} pour 4 personnes ?`,
      a: `${formatEuro(cheapest.cents)} chez ${name(cheapest.storeId)} et ${formatEuro(priciest.cents)} chez ${name(priciest.storeId)}${pricesAt ? `, prix relevés le ${longDate(pricesAt)}` : ''}. Soit de ${formatEuro(perPart)} à ${formatEuro(costPerServing(priciest.cents, 4))} la part.`,
    },
    {
      q: 'Combien de temps faut-il ?',
      a: `${minutes} minutes au total : ${recipe.prepMinutes} minutes de préparation${recipe.cookMinutes ? ` et ${recipe.cookMinutes} minutes de cuisson` : ''}.`,
    },
    {
      q: 'Est-ce une recette végétarienne ou sans gluten ?',
      a: `${veg ? 'Oui, elle est végétarienne' : 'Non, elle contient de la viande ou du poisson'}. ${recipe.diets.includes('sans_gluten') ? 'Elle est aussi sans gluten.' : 'Elle contient du gluten.'}`,
    },
  ];
  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: 'Recettes', path: ROUTES.recettes },
    { label: recipe.title, path: `/recettes/${recipe.slug}` },
  ];

  return (
    <SitePage
      crumbs={[
        { label: 'Accueil', href: '/' },
        { label: 'Recettes', href: ROUTES.recettes },
        { label: recipe.title },
      ]}
    >
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqPageLd(faq)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: recipe.title,
          description: `${recipe.title} pour 4 personnes, de ${formatEuro(cheapest.cents)} chez ${name(cheapest.storeId)} à ${formatEuro(priciest.cents)} chez ${name(priciest.storeId)}.`,
          url: absoluteUrl(`/recettes/${recipe.slug}`),
          recipeYield: `${recipe.servings} portions`,
          prepTime: `PT${recipe.prepMinutes}M`,
          cookTime: `PT${recipe.cookMinutes}M`,
          totalTime: `PT${minutes}M`,
          recipeCategory: FAMILY_LABEL[recipe.family] ?? 'Plat',
          recipeCuisine: 'Française',
          ...(recipe.diets.some((x) => DIET_LD[x])
            ? { suitableForDiet: recipe.diets.filter((x) => DIET_LD[x]).map((x) => DIET_LD[x]!) }
            : {}),
          recipeIngredient: recipe.ingredients.map((i) => i.label),
          recipeInstructions: recipe.steps.map((s) => ({ '@type': 'HowToStep', text: s.text })),
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: (cheapest.cents / 100).toFixed(2),
          },
          dateModified: (pricesAt ?? recipe.updatedAt).slice(0, 10),
        }}
      />

      <section className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <ul className="anim-rise flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t}
                className="rounded-pill border-line border bg-white/70 px-3 py-1 text-[13px] font-black backdrop-blur"
              >
                {t === 'De saison' ? `De saison · ${MONTHS[m - 1]}` : t}
              </li>
            ))}
          </ul>
          <h1
            className="anim-rise font-display mt-5 text-[clamp(38px,5vw,60px)] font-extrabold leading-[1.02] tracking-[-1.6px]"
            style={animDelay(80)}
          >
            {recipe.title}
          </h1>
          <p className="anim-rise text-ink-muted mt-5 text-[19px] leading-[29px]" style={animDelay(160)}>
            <strong className="text-ink">{answer}</strong> Elle est prête en {minutes} minutes
            {veg ? ', végétarienne' : ''}
            {inSeason ? `, et de saison en ${MONTHS[m - 1]}` : ''}.
          </p>
          <dl className="anim-rise mt-7 grid max-w-[460px] grid-cols-3 gap-3" style={animDelay(240)}>
            {[
              ['TEMPS', `${minutes} min`],
              ['PARTS', String(recipe.servings)],
              ['DÈS', `${formatEuro(perPart)} / part`],
            ].map(([k, v]) => (
              <div key={k} className="border-line rounded-[18px] border bg-white/75 px-4 py-3 backdrop-blur">
                <dt className="text-ink-muted text-[12px] font-black tracking-[1px]">{k}</dt>
                <dd className="mt-0.5 text-[17px] font-black tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          {pricesAt ? (
            <p className="anim-rise text-ink-muted mt-4 text-[14px] font-bold" style={animDelay(300)}>
              Prix relevés le {longDate(pricesAt)} ·{' '}
              <Link href={href(ROUTES.methodologie)} className="text-brand">
                méthodologie
              </Link>
            </p>
          ) : null}
        </div>
        <div className="anim-ticket relative mx-auto">
          <Glow className="bg-raw-peche left-10 top-10 h-64 w-64" />
          <div className="anim-float drop-shadow-[0_30px_50px_rgba(42,26,40,0.22)]">
            <RecipePhoto slug={recipe.slug} illustration={recipe.illustration} size={320} priority />
          </div>
          {discountPercent(cheapest.cents, priciest.cents) > 0 ? (
            <span className="bg-saving text-raw-encre rounded-pill absolute bottom-6 right-0 px-4 py-2 text-[15px] font-black shadow-[0_10px_24px_rgba(238,122,48,0.35)]">
              −{discountPercent(cheapest.cents, priciest.cents)} % vs la plus chère
            </span>
          ) : null}
        </div>
      </section>
      {observations.some((o) => o.source === 'manual') ? <DemoNotice /> : null}

      <Reveal
        as="section"
        className="border-line rounded-[28px] border bg-white/75 p-[clamp(20px,3vw,32px)] backdrop-blur"
      >
        <h2 id="prix-t" className="font-display text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.8px]">
          Combien coûte cette recette dans chaque enseigne ?
        </h2>
        <div className="mt-5">
          <RecipePriceTable byServings={rows} />
        </div>
        <p className="text-ink-muted mt-4 text-[13px] font-bold">
          Prix indicatifs, médiane des relevés de moins de 7 jours (Open Prices et tickets de la communauté).
        </p>
      </Reveal>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Reveal className="border-line rounded-[28px] border bg-white/75 p-6 backdrop-blur">
          <h2 className="font-display text-[26px] font-extrabold">Ingrédients</h2>
          <p className="text-ink-muted mt-1 text-[14px] font-bold">Pour {recipe.servings} parts</p>
          <ul className="mt-4 flex flex-col">
            {lines.map((l) => (
              <li
                key={l.label}
                className="border-line flex items-center justify-between gap-3 border-t py-2.5 text-[15px]"
              >
                <span className="font-bold">
                  {l.label}
                  {l.pantry ? <span className="text-ink-muted"> · placard</span> : null}
                </span>
                {l.cents !== null ? (
                  <span className="text-ink-muted font-bold tabular-nums">{formatEuro(l.cents)}</span>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="border-line mt-2 flex justify-between border-t-2 border-dashed pt-3 font-black tabular-nums">
            <span>Total chez {name(cheapest.storeId)}</span>
            <span>{formatEuro(sumCents(lines.map((l) => l.cents)))}</span>
          </p>
        </Reveal>
        <Reveal delay={100} className="border-line rounded-[28px] border bg-white/75 p-6 backdrop-blur">
          <h2 className="font-display text-[26px] font-extrabold">Préparation</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {recipe.steps.map((s, i) => (
              <li key={s.text} className="flex gap-4">
                <span className="rounded-pill bg-brand-soft text-brand grid h-9 w-9 shrink-0 place-items-center font-black">
                  {i + 1}
                </span>
                <p className="pt-1 text-[16px] leading-[25px]">
                  {s.text}
                  {s.minutes ? <span className="text-ink-muted font-bold"> · {s.minutes} min</span> : null}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <Reveal>
        <TicketCard
          edge="surface-50"
          tone="brand"
          className="relative isolate flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-t-[32px] px-[clamp(24px,4vw,48px)] pb-12 pt-9"
        >
          <Glow className="-left-16 -top-20 h-64 w-64 bg-white/20" />
          <div>
            <h2 className="font-display text-[clamp(26px,3vw,36px)] font-extrabold tracking-[-0.8px]">
              Ajoute-la à ton plan de la semaine
            </h2>
            <p className="text-site-lilac mt-2 text-[16px]">
              On calcule ta liste de courses et le total dans ton enseigne.
            </p>
          </div>
          <Link
            href={href(ROUTES.commencer)}
            className="rounded-pill text-brand inline-flex min-h-14 items-center gap-3 bg-white px-7 text-[17px] font-black no-underline transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
          >
            Créer mon plan gratuit <span aria-hidden="true">→</span>
          </Link>
        </TicketCard>
      </Reveal>

      <Reveal>
        <Faq items={faq} eyebrow="Questions sur cette recette" title={recipe.title} className="" />
      </Reveal>

      {related.length ? (
        <section aria-labelledby="autres-titre">
          <h2 id="autres-titre" className="font-display text-[28px] font-extrabold tracking-[-0.6px]">
            D’autres recettes{' '}
            {FAMILY_LABEL[recipe.family] ? `· ${FAMILY_LABEL[recipe.family]!.toLowerCase()}` : ''}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 80}>
                <RecipeCard
                  href={`/recettes/${r.slug}` as Route}
                  title={r.title}
                  illustration={r.illustration}
                  minutes={r.minutes}
                  perServingCents={r.perServing}
                  tags={recipeTags(r, m)}
                />
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}
    </SitePage>
  );
}
