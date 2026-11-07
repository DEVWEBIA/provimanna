import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { costPerServing, formatEuro } from '@repas/core';
import { Icon, Plat, TicketCard, type IconName } from '@repas/ui';
import couscousLegumes from '@/assets/photos/couscous-legumes.jpg';
import curryPoisChiches from '@/assets/photos/curry-pois-chiches-courge.jpg';
import familleCuisine from '@/assets/photos/famille-cuisine.jpg';
import legumesRotis from '@/assets/photos/legumes-rotis.jpg';
import potironsAutomne from '@/assets/photos/potirons-automne.jpg';
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
        {/* HERO : photo de fond sous un voile sable, en-tête flottant par-dessus. */}
        <section className="relative isolate -mt-[76px] overflow-hidden pt-[76px]">
          <Image
            src={potironsAutomne}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="-z-20 object-cover object-bottom md:object-[center_78%]"
          />
          <div
            aria-hidden="true"
            className="from-raw-sable/95 via-raw-sable/90 to-raw-sable/30 md:from-raw-sable md:via-raw-sable/85 md:to-raw-sable/10 absolute inset-0 -z-10 bg-gradient-to-b via-55% md:bg-gradient-to-r"
          />
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-12 gap-y-14 px-6 pb-28 pt-16">
            <div className="min-w-0 flex-[1_1_420px]">
              <p className="rounded-pill text-ink inline-flex items-center gap-2 border border-white/70 bg-white/60 px-3.5 py-1.5 text-[13px] font-extrabold backdrop-blur">
                <span className="rounded-pill bg-saving h-2 w-2" aria-hidden="true" />
                Menus d’automne : potimarron, poireau, châtaigne
              </p>
              <h1 className="font-display mt-6 text-[clamp(44px,6vw,72px)] font-extrabold leading-[0.98] tracking-[-2px]">
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
              <div className="mt-9">
                <PrimaryCta />
              </div>
              <p className="text-ink-muted mt-4 text-[14px] font-bold">
                Gratuit · sans carte bancaire · prêt en 2 minutes
              </p>
            </div>
            <div className="flex min-w-0 flex-[1_1_380px] justify-center">
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
        <section aria-labelledby="recettes-titre" className="relative isolate px-6 pb-24 md:pb-32">
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
