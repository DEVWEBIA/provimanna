import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import couscousLegumes from '@/assets/photos/couscous-legumes.jpg';
import curryPoisChiches from '@/assets/photos/curry-pois-chiches-courge.jpg';
import familleCuisine from '@/assets/photos/famille-cuisine.jpg';
import legumesRotis from '@/assets/photos/legumes-rotis.jpg';
import potironsAutomne from '@/assets/photos/potirons-automne.jpg';
import veloutePotimarron from '@/assets/photos/veloute-potimarron.jpg';
import { costPerServing, formatEuro } from '@repas/core';
import { Icon, Plat, TicketCard, type IconName } from '@repas/ui';
import { Faq } from '@/components/site/faq';
import { HeroTicket } from '@/components/site/hero-ticket';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import {
  EXAMPLE_MY_STORE,
  EXAMPLE_STORES,
  EXAMPLE_WEEK,
  HOUSEHOLD_FACTORS,
  LANDING_FAQ,
  LANDING_RECIPES,
} from '@/lib/landing-data';
import { href } from '@/lib/site';
import { faqPageLd, JsonLd, organizationLd, softwareApplicationLd, webSiteLd } from '@/lib/seo/json-ld';

const TITLE = 'Plan de repas de la semaine et prix dans 6 enseignes';
const DESCRIPTION =
  'On planifie tes repas, on calcule ta liste de courses et on te montre son prix chez Lidl, Aldi, E.Leclerc, Intermarché, Carrefour et Auchan. Gratuit.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', title: TITLE, description: DESCRIPTION, url: '/', locale: 'fr_FR' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

const SIGNUP = '/commencer';

// Photos sous licence Unsplash (crédits : src/assets/photos/CREDITS.md).
const PHOTOS: Record<(typeof LANDING_RECIPES)[number]['slug'], StaticImageData> = {
  'veloute-potimarron': veloutePotimarron,
  'curry-pois-chiches-courge': curryPoisChiches,
  'couscous-legumes': couscousLegumes,
  'legumes-rotis': legumesRotis,
};

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'famille',
    title: 'Tu décris ton foyer',
    text: 'Adultes, enfants, régime, enseigne habituelle. Une minute, une seule fois.',
  },
  {
    icon: 'plan',
    title: 'On compose ta semaine',
    text: '14 repas de saison, midi et soir. Ton plan arrive chaque jeudi soir.',
  },
  {
    icon: 'panier',
    title: 'Tu compares, tu choisis',
    text: 'Le total dans 6 enseignes. Le prix est un repère, jamais une obligation.',
  },
];

function PrimaryCta({ tone = 'brand' }: { tone?: 'brand' | 'light' }) {
  return (
    <Link
      href={href(SIGNUP)}
      className={
        tone === 'brand'
          ? 'rounded-pill bg-brand text-brand-on inline-flex min-h-14 items-center gap-3 px-7 text-[17px] font-black no-underline hover:opacity-90'
          : 'rounded-pill text-brand inline-flex min-h-14 items-center gap-3 bg-white px-7 text-[17px] font-black no-underline hover:opacity-90'
      }
    >
      Créer mon plan gratuit
      <span aria-hidden="true">→</span>
    </Link>
  );
}

const sectionTitle =
  'font-display text-[clamp(28px,3.4vw,40px)] leading-[1.1] font-extrabold tracking-[-1px]';

export default function HomePage() {
  return (
    <div className="bg-surface-50 text-ink min-h-screen font-sans">
      <JsonLd data={organizationLd()} />
      <JsonLd data={webSiteLd()} />
      <JsonLd data={softwareApplicationLd()} />
      <JsonLd data={faqPageLd(LANDING_FAQ)} />

      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative isolate -mt-[92px] overflow-hidden pt-[92px]">
          <Image
            src={potironsAutomne}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="-z-20 object-cover object-bottom md:object-[center_78%]"
          />
          {/* Voile sable : garantit la lisibilité du texte sur la photo. */}
          <div
            aria-hidden="true"
            className="from-raw-sable/95 via-raw-sable/90 via-55% to-raw-sable/30 md:from-raw-sable md:via-raw-sable/85 md:to-raw-sable/10 absolute inset-0 -z-10 bg-gradient-to-b md:bg-gradient-to-r"
          />
          <div className="mx-auto flex max-w-[1000px] flex-wrap items-center gap-x-12 gap-y-14 px-6 pb-24 pt-8">
            <div className="min-w-0 flex-[1_1_420px]">
              <h1 className="font-display text-[clamp(44px,6vw,72px)] font-extrabold leading-[0.98] tracking-[-2px]">
                Le même menu.
                <br />
                Six prix.
                <br />
                <span className="text-saving-ink">Tu choisis.</span>
              </h1>
              <p className="text-ink-muted mt-6 max-w-[440px] text-[19px] leading-[29px]">
                On planifie tes repas de la semaine et on te montre ce que coûte ta liste de courses dans 6
                enseignes.
              </p>
              <div className="mt-8">
                <PrimaryCta />
              </div>
              <p className="text-ink-muted mt-4 text-[14px] font-bold">
                Gratuit · sans carte bancaire · prêt en 2 minutes
              </p>
            </div>
            <div className="flex min-w-0 flex-[1_1_380px] flex-col items-center gap-3">
              <div className="drop-shadow-[0_24px_40px_rgba(42,26,40,0.22)]">
                <HeroTicket
                  stores={EXAMPLE_STORES}
                  myStore={EXAMPLE_MY_STORE}
                  households={HOUSEHOLD_FACTORS}
                  weekLabel={EXAMPLE_WEEK.label}
                  edge="cutout"
                />
              </div>
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section
          id="comment"
          aria-labelledby="comment-titre"
          className="mx-auto flex max-w-[1000px] flex-wrap items-center gap-x-14 gap-y-10 px-6 py-16"
        >
          <Image
            src={familleCuisine}
            alt="Une mère et sa fille préparent le repas ensemble dans leur cuisine"
            placeholder="blur"
            sizes="(min-width: 1000px) 420px, 100vw"
            className="aspect-square w-full min-w-0 flex-[1_1_320px] rounded-[28px] object-cover object-[68%_center] sm:max-w-[420px]"
          />
          <div className="min-w-0 flex-[1_1_380px]">
            <h2 id="comment-titre" className={`${sectionTitle} mb-10`}>
              Comment ça marche ?
            </h2>
            <ol className="flex flex-col gap-7">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex items-start gap-5">
                  <span
                    className="rounded-pill bg-brand-soft text-brand grid h-14 w-14 shrink-0 place-items-center"
                    aria-hidden="true"
                  >
                    <Icon name={s.icon} size={24} />
                  </span>
                  <div className="pt-1">
                    <h3 className="flex items-center gap-2.5 text-[19px] font-black">
                      <span
                        className="rounded-pill bg-brand text-brand-on grid h-7 w-7 place-items-center text-[13px]"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      {s.title}
                    </h3>
                    <p className="text-ink-muted mt-1 text-[16px] leading-6">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* RECETTES */}
        <section aria-labelledby="recettes-titre" className="mx-auto max-w-[1000px] px-6 py-16">
          <h2 id="recettes-titre" className={sectionTitle}>
            Des repas de saison, prix compris.
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {LANDING_RECIPES.map((r) => (
              <li
                key={r.slug}
                className="bg-surface-0 flex items-center gap-4 rounded-[20px] p-3 pr-6 shadow-[0_2px_12px_rgba(42,26,40,0.06)]"
              >
                <Image
                  src={PHOTOS[r.slug]}
                  alt=""
                  sizes="88px"
                  className="h-[88px] w-[88px] shrink-0 rounded-[14px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-black">{r.title}</p>
                  <p className="text-ink-muted mt-1 flex items-center gap-2.5 text-[14px] font-bold">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="horloge" size={15} />
                      {r.minutes} min
                    </span>
                    <span className="rounded-pill bg-brand-soft text-brand px-2.5 py-0.5 text-[12px] font-black">
                      {r.tag}
                    </span>
                  </p>
                </div>
                <p className="text-right">
                  <span className="block text-[18px] font-black tabular-nums">
                    {formatEuro(costPerServing(r.cents4, 4))}
                  </span>
                  <span className="text-ink-muted text-[12px] font-bold">par part</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="text-ink-muted mt-4 text-[13px]">
            Exemples de prix chez Lidl, semaine {EXAMPLE_WEEK.week} · sources : Open Prices et tickets de la
            communauté
          </p>
        </section>

        <Faq items={LANDING_FAQ.slice(0, 4)} />

        {/* CTA FINAL */}
        <section className="mx-auto max-w-[1000px] px-6 pb-16">
          <TicketCard
            edge="surface-50"
            tone="brand"
            className="flex flex-wrap items-center justify-between gap-8 rounded-t-[32px] px-[clamp(28px,5vw,56px)] pb-[clamp(40px,5vw,64px)] pt-[clamp(32px,5vw,56px)] text-white"
          >
            <div className="flex-[1_1_380px]">
              <h2 className="font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-none tracking-[-1.4px]">
                Ton menu de jeudi prochain t’attend.
              </h2>
              <p className="text-site-lilac mt-3 text-[17px]">
                14 jours de Premium offerts, puis gratuit à vie.
              </p>
              <div className="mt-7">
                <PrimaryCta tone="light" />
              </div>
            </div>
            <div className="flex gap-2 max-sm:hidden" aria-hidden="true">
              <Plat variant="soupe" size={96} decorative />
              <Plat variant="salade" size={96} decorative />
            </div>
          </TicketCard>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
