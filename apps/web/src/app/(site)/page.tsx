import type { Metadata } from 'next';
import type React from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { costPerServing, formatEuro } from '@repas/core';
import { Icon, Plat, TicketCard, type IconName } from '@repas/ui';
import couscousLegumes from '@/assets/photos/couscous-legumes.jpg';
import curryPoisChiches from '@/assets/photos/curry-pois-chiches-courge.jpg';
import familleCuisine from '@/assets/photos/famille-cuisine.jpg';
import legumesRotis from '@/assets/photos/legumes-rotis.jpg';
import bowlColore from '@/assets/photos/bowl-colore.jpg';
import veloutePotimarron from '@/assets/photos/veloute-potimarron.jpg';
import { Faq } from '@/components/site/faq';
import { HeroTicket } from '@/components/site/hero-ticket';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { StoreMarquee } from '@/components/site/store-marquee';
import {
  EXAMPLE_MY_STORE,
  EXAMPLE_STORES,
  EXAMPLE_WEEK,
  HOUSEHOLD_FACTORS,
  LANDING_FAQ,
  LANDING_RECIPES,
} from '@/lib/landing-data';
import { faqPageLd, JsonLd, organizationLd, softwareApplicationLd, webSiteLd } from '@/lib/seo/json-ld';
import { href, ROUTES } from '@/lib/site';

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
    text: 'Le total dans 6 enseignes, l’écart avec la tienne. Tu gardes la main.',
  },
];

const FACTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'horloge', title: 'Prix datés', text: 'Chaque total affiche la date de ses relevés.' },
  { icon: 'boite', title: 'Sources ouvertes', text: 'Open Prices et tickets de caisse de la communauté.' },
  {
    icon: 'check',
    title: 'Tu restes libre',
    text: 'Ton enseigne est respectée, même si elle est plus chère.',
  },
];

function PrimaryCta({ tone = 'brand' }: { tone?: 'brand' | 'light' }) {
  return (
    <Link
      href={href(ROUTES.commencer)}
      className={
        tone === 'brand'
          ? 'rounded-pill bg-brand text-brand-on inline-flex min-h-14 items-center gap-3 px-7 text-[17px] font-black no-underline shadow-[0_10px_30px_rgba(107,56,104,0.30)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none'
          : 'rounded-pill text-brand inline-flex min-h-14 items-center gap-3 bg-white px-7 text-[17px] font-black no-underline transition-transform hover:-translate-y-0.5 motion-reduce:transition-none'
      }
    >
      Créer mon plan gratuit
      <span aria-hidden="true">→</span>
    </Link>
  );
}

/** Halo de couleur flou en arrière-plan (purement décoratif). */
function Glow({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-[100px] ${className}`}
    />
  );
}

export default function HomePage() {
  return (
    <div className="bg-surface-50 text-ink min-h-screen overflow-x-clip font-sans">
      <JsonLd data={organizationLd()} />
      <JsonLd data={webSiteLd()} />
      <JsonLd data={softwareApplicationLd()} />
      <JsonLd data={faqPageLd(LANDING_FAQ)} />

      <SiteHeader />

      <main>
        {/* HERO : fond sable, plat coloré détouré qui sort par la droite, ticket au premier plan. */}
        <section className="bg-surface-50 relative isolate -mt-[84px] overflow-hidden pt-[84px]">
          <Glow className="bg-raw-aubergine-clair -left-24 top-32 h-80 w-80" />
          <Glow className="bg-raw-peche right-0 top-1/3 h-[28rem] w-[28rem]" />

          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-12 gap-y-16 px-6 pb-32 pt-16">
            <div className="min-w-0 flex-[1_1_420px]">
              <p
                className="anim-rise rounded-pill text-ink inline-flex items-center gap-2 border border-white/70 bg-white/60 px-3.5 py-1.5 text-[13px] font-extrabold shadow-[0_4px_16px_rgba(42,26,40,0.06)] backdrop-blur"
                style={{ '--d': '0ms' } as React.CSSProperties}
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="rounded-pill bg-saving absolute inline-flex h-full w-full animate-ping opacity-60 motion-reduce:animate-none" />
                  <span className="rounded-pill bg-saving relative inline-flex h-2 w-2" />
                </span>
                Menus d’automne : potimarron, poireau, châtaigne
              </p>
              <h1 className="font-display mt-6 text-[clamp(44px,6vw,76px)] font-extrabold leading-[0.98] tracking-[-2px]">
                <span className="anim-line">
                  <span style={{ '--d': '120ms' } as React.CSSProperties}>Le même menu.</span>
                </span>
                <span className="anim-line">
                  <span style={{ '--d': '220ms' } as React.CSSProperties}>Six prix.</span>
                </span>
                <span className="anim-line">
                  <span
                    className="text-saving-ink relative"
                    style={{ '--d': '320ms' } as React.CSSProperties}
                  >
                    Tu choisis.
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 300 20"
                      preserveAspectRatio="none"
                      className="anim-draw text-saving absolute -bottom-1 left-0 h-[0.22em] w-full"
                    >
                      <path
                        d="M3 14 C 60 4, 140 4, 297 10"
                        pathLength={1}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </h1>
              <p
                className="anim-rise text-ink-muted mt-7 max-w-[440px] text-[19px] leading-[29px]"
                style={{ '--d': '450ms' } as React.CSSProperties}
              >
                On planifie tes repas de la semaine et on te montre ce que coûte ta liste de courses dans 6
                enseignes.
              </p>
              <div
                className="anim-rise mt-9 flex flex-wrap items-center gap-5"
                style={{ '--d': '560ms' } as React.CSSProperties}
              >
                <PrimaryCta />
                <a
                  href="#comment"
                  className="text-brand text-[15px] font-extrabold underline-offset-4 hover:underline"
                >
                  Voir comment ça marche
                </a>
              </div>
              <ul
                className="anim-rise text-ink-muted mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-bold"
                style={{ '--d': '680ms' } as React.CSSProperties}
              >
                {['Gratuit', 'Sans carte bancaire', 'Prêt en 2 minutes'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Icon name="check" size={16} strokeWidth={2.6} className="text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex min-w-0 flex-[1_1_380px] justify-center pt-24 sm:pt-0 lg:justify-start">
              {/* Le plat : visible et vif, mais derrière le ticket. */}
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-4 w-[220px] sm:-right-48 sm:top-1/2 sm:w-[560px] sm:-translate-y-1/2 lg:-right-[24rem] lg:w-[700px]"
              >
                <div>
                  <div className="anim-spin aspect-square overflow-hidden rounded-full shadow-[0_40px_80px_rgba(42,26,40,0.25)] ring-8 ring-white/60">
                    <Image
                      src={bowlColore}
                      alt=""
                      priority
                      placeholder="blur"
                      sizes="(min-width: 1024px) 700px, (min-width: 640px) 560px, 220px"
                      className="h-full w-full scale-105 object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="anim-ticket relative z-10">
                <div className="anim-float drop-shadow-[0_28px_44px_rgba(42,26,40,0.28)]">
                  <HeroTicket
                    stores={EXAMPLE_STORES}
                    myStore={EXAMPLE_MY_STORE}
                    households={HOUSEHOLD_FACTORS}
                    weekLabel={EXAMPLE_WEEK.label}
                    edge="cutout"
                  />
                </div>
              </div>
              {/* Étiquettes flottantes (décoratives, desktop) */}
              <div
                aria-hidden="true"
                className="anim-rise absolute -top-9 right-2 z-20 hidden lg:block"
                style={{ '--d': '1100ms' } as React.CSSProperties}
              >
                <div className="anim-float flex items-center gap-2.5 rounded-[18px] border border-white/70 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_30px_rgba(42,26,40,0.14)] backdrop-blur-xl [animation-delay:2s]">
                  <span className="text-success text-[15px] font-black">●●●</span>
                  <span className="text-[13px] font-extrabold leading-tight">
                    Prix relevés
                    <br />
                    <span className="text-ink-muted">il y a 2 jours</span>
                  </span>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="anim-rise absolute -bottom-10 -left-4 z-20 hidden lg:block"
                style={{ '--d': '1300ms' } as React.CSSProperties}
              >
                <div className="anim-float flex items-center gap-2.5 rounded-[18px] border border-white/70 bg-white/95 px-3 py-2 shadow-[0_12px_30px_rgba(42,26,40,0.14)] backdrop-blur-xl [animation-delay:3s]">
                  <Plat variant="soupe" size={40} decorative />
                  <span className="text-[13px] font-extrabold leading-tight">
                    14 repas
                    <br />
                    <span className="text-ink-muted">de saison</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <StoreMarquee stores={EXAMPLE_STORES} />

        {/* COMMENT ÇA MARCHE */}
        <section
          id="comment"
          aria-labelledby="comment-titre"
          className="relative isolate px-6 py-24 md:py-32"
        >
          <Glow className="bg-raw-aubergine-clair left-[8%] top-24 h-72 w-72" />
          <Reveal>
            <SectionHeading
              id="comment-titre"
              eyebrow="Comment ça marche"
              title="Tu règles ton foyer une fois. Le reste suit."
              lead="Chaque jeudi soir, la semaine suivante t’attend, prix compris."
            />
          </Reveal>
          <ol className="mx-auto mt-16 grid max-w-[1080px] gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 120}>
                <div className="border-line h-full rounded-[26px] border bg-white/70 p-7 shadow-[0_2px_20px_rgba(42,26,40,0.05)] backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="rounded-pill border-line bg-surface-50 text-brand grid h-11 w-11 place-items-center border text-[17px] font-black">
                      {i + 1}
                    </span>
                    <Icon name={s.icon} size={26} className="text-brand" />
                  </div>
                  <h3 className="mt-6 text-[20px] font-black">{s.title}</h3>
                  <p className="text-ink-muted mt-2 text-[16px] leading-6">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* PANNEAU : la confiance (photo + faits) */}
        <section aria-labelledby="confiance-titre" className="px-6 pb-24 md:pb-32">
          <Reveal>
            <div className="border-line relative isolate mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-14 gap-y-10 overflow-hidden rounded-[36px] border bg-white/50 p-[clamp(20px,4vw,48px)]">
              <Glow className="bg-raw-peche -right-20 -top-20 h-80 w-80" />
              <Image
                src={familleCuisine}
                alt="Une mère et sa fille préparent le repas ensemble dans leur cuisine"
                placeholder="blur"
                sizes="(min-width: 1080px) 440px, 100vw"
                className="aspect-square w-full min-w-0 flex-[1_1_300px] rounded-[26px] object-cover object-[68%_center] sm:max-w-[440px]"
              />
              <div className="min-w-0 flex-[1_1_360px]">
                <p className="rounded-pill bg-brand-soft text-brand inline-flex px-3 py-1 text-[12px] font-black uppercase tracking-[1.2px]">
                  Sans pression
                </p>
                <h2
                  id="confiance-titre"
                  className="font-display mt-4 text-[clamp(28px,3.2vw,40px)] font-extrabold leading-[1.1] tracking-[-1px]"
                >
                  Le prix est un repère, jamais une obligation.
                </h2>
                <ul className="mt-8 flex flex-col gap-5">
                  {FACTS.map((f) => (
                    <li key={f.title} className="flex gap-4">
                      <span className="text-brand grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white shadow-[0_2px_10px_rgba(42,26,40,0.06)]">
                        <Icon name={f.icon} size={22} />
                      </span>
                      <span>
                        <span className="block text-[17px] font-black">{f.title}</span>
                        <span className="text-ink-muted text-[15px]">{f.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* RECETTES */}
        <section
          id="recettes"
          aria-labelledby="recettes-titre"
          className="relative isolate scroll-mt-24 px-6 pb-24 md:pb-32"
        >
          <Glow className="bg-raw-peche right-[10%] top-40 h-72 w-72" />
          <Reveal>
            <SectionHeading
              id="recettes-titre"
              eyebrow="De saison"
              title="Des repas simples, prix compris."
              lead="Chaque recette affiche son coût par part dans ton enseigne."
            />
          </Reveal>
          <ul className="mx-auto mt-16 grid max-w-[1080px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {LANDING_RECIPES.map((r, i) => (
              <Reveal as="li" key={r.slug} delay={i * 100}>
                <article className="group">
                  <div className="relative overflow-hidden rounded-[22px]">
                    <Image
                      src={PHOTOS[r.slug]}
                      alt=""
                      sizes="(min-width: 768px) 260px, 50vw"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="rounded-pill absolute bottom-3 left-3 bg-white/85 px-2.5 py-1 text-[13px] font-black tabular-nums backdrop-blur">
                      {formatEuro(costPerServing(r.cents4, 4))}{' '}
                      <span className="text-ink-muted font-bold">/ part</span>
                    </span>
                  </div>
                  <h3 className="mt-3 text-[16px] font-black leading-snug">{r.title}</h3>
                  <p className="text-ink-muted mt-1 flex items-center gap-1.5 text-[13px] font-bold">
                    <Icon name="horloge" size={14} />
                    {r.minutes} min · {r.tag}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
          <p className="text-ink-muted mx-auto mt-6 max-w-[1080px] text-center text-[13px]">
            Exemples de prix chez Lidl, semaine {EXAMPLE_WEEK.week} · sources : Open Prices et tickets de la
            communauté
          </p>
        </section>

        <Reveal>
          <Faq items={LANDING_FAQ.slice(0, 4)} eyebrow="Questions fréquentes" />
        </Reveal>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-[1080px] px-6 pb-20 pt-8">
          <Reveal>
            <TicketCard
              edge="surface-50"
              tone="brand"
              className="relative isolate flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-t-[36px] px-[clamp(28px,5vw,64px)] pb-[clamp(44px,6vw,72px)] pt-[clamp(36px,5vw,64px)]"
            >
              <Glow className="-left-16 -top-24 h-72 w-72 bg-white/20" />
              <div className="flex-[1_1_380px]">
                <h2 className="font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-none tracking-[-1.4px]">
                  Ton menu de jeudi prochain t’attend.
                </h2>
                <p className="text-site-lilac mt-3 text-[17px]">
                  14 jours de Premium offerts, puis gratuit à vie.
                </p>
                <div className="mt-8">
                  <PrimaryCta tone="light" />
                </div>
              </div>
              <div className="flex gap-2 max-sm:hidden" aria-hidden="true">
                <Plat variant="soupe" size={96} decorative />
                <Plat variant="salade" size={96} decorative />
              </div>
            </TicketCard>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
