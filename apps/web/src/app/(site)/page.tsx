import type { Metadata } from 'next';
import Link from 'next/link';
import { formatEuro, priceSpread } from '@repas/core';
import { Icon, Plat, type IconName, type PlatVariant } from '@repas/ui';
import { EmailCtaForm } from '@/components/site/email-cta-form';
import { Faq } from '@/components/site/faq';
import { HeroTicket } from '@/components/site/hero-ticket';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';
import {
  EXAMPLE_MY_STORE,
  EXAMPLE_STORES,
  EXAMPLE_WEEK,
  HOUSEHOLD_FACTORS,
  LANDING_FAQ,
} from '@/lib/landing-data';
import { faqPageLd, JsonLd, organizationLd, softwareApplicationLd, webSiteLd } from '@/lib/seo/json-ld';
import { ROUTES, href } from '@/lib/site';

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

const spread = priceSpread(EXAMPLE_STORES.map((s) => s.cents));

const FACTS: { icon: IconName; text: string }[] = [
  { icon: 'panier', text: '6 enseignes comparées à chaque plan' },
  { icon: 'horloge', text: 'Ton plan prêt chaque jeudi soir' },
  { icon: 'boite', text: 'Prix datés, sources ouvertes' },
  { icon: 'check', text: 'Tu restes libre de ton enseigne' },
];

const WEEK_COLORS = [
  'bg-food-curry',
  'bg-food-salade',
  'bg-food-soupe',
  'bg-food-pates',
  'bg-food-salade',
  'bg-food-tomate',
  'bg-food-curry',
  'bg-food-pates',
  'bg-food-soupe',
  'bg-food-salade',
  'bg-food-curry',
  'bg-food-tomate',
  'bg-food-pates',
  'bg-food-soupe',
];

const MENUS: {
  href: string;
  plat: PlatVariant;
  bg: string;
  overline: string;
  title: string;
  from: number;
  perServing: number;
}[] = [
  {
    href: ROUTES.menus,
    plat: 'curry',
    bg: 'bg-brand-soft',
    overline: 'FAMILLE DE 4 · 14 REPAS',
    title: 'La semaine à moins de 70 €',
    from: 6010,
    perServing: 107,
  },
  {
    href: `${ROUTES.recettes}?regime=vegetarien&saison=1`,
    plat: 'soupe',
    bg: 'bg-saving-soft',
    overline: 'VÉGÉTARIEN · DE SAISON',
    title: 'Novembre végé, 100 % saison',
    from: 5240,
    perServing: 94,
  },
  {
    href: `${ROUTES.recettes}?temps=30`,
    plat: 'pates',
    bg: 'bg-site-mint',
    overline: 'MOINS DE 30 MIN',
    title: 'La semaine express',
    from: 5890,
    perServing: 105,
  },
];

const sectionTitle =
  'font-display text-[clamp(36px,4.4vw,60px)] leading-none font-extrabold tracking-[-1.8px]';

function CheckItem({ children, tone }: { children: React.ReactNode; tone: 'brand' | 'saving' }) {
  return (
    <li className="flex gap-2.5">
      <Icon
        name="check"
        size={22}
        strokeWidth={2.4}
        className={tone === 'brand' ? 'text-brand shrink-0' : 'text-saving shrink-0'}
      />
      {children}
    </li>
  );
}

export default function HomePage() {
  return (
    <div className="bg-surface-50 text-ink min-h-screen font-sans">
      <JsonLd data={organizationLd()} />
      <JsonLd data={webSiteLd()} />
      <JsonLd data={softwareApplicationLd()} />
      <JsonLd data={faqPageLd(LANDING_FAQ)} />

      <header className="bg-brand text-white">
        <SiteNav />
        {/* HERO */}
        <section
          id="top"
          className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-14 px-6 pb-[112px] pt-10"
        >
          <div className="min-w-0 flex-[1_1_520px]">
            <p className="rounded-pill text-site-on-brand mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3.5 py-2 text-[13px] font-extrabold tracking-[0.4px]">
              <span className="rounded-pill bg-saving h-2 w-2" aria-hidden="true" />
              Menus d’automne : potimarron, poireau, châtaigne
            </p>
            <h1 className="font-display text-[clamp(46px,6.4vw,88px)] font-extrabold leading-[0.96] tracking-[-2.5px] text-white">
              Le même menu.
              <br />
              Six prix.
              <br />
              <span className="text-saving">Tu choisis.</span>
            </h1>
            <p className="text-site-on-brand-muted mt-7 max-w-[520px] text-[20px] leading-[30px]">
              On planifie tes repas de la semaine, on calcule ta liste de courses et on te montre ce qu’elle
              coûte chez Lidl, Aldi, E.Leclerc, Intermarché, Auchan et Carrefour.
            </p>
            <div id="attente" className="mt-9 max-w-[540px] scroll-mt-6">
              <EmailCtaForm id="mail-hero" label="Créer mon plan gratuit" tone="hero" />
            </div>
            <p className="text-site-on-brand-faint mt-3.5 text-[14px] font-bold">
              Gratuit à vie pour 1 plan par semaine · sans carte bancaire · prêt en 2 minutes
            </p>
          </div>
          <div className="relative flex min-w-0 flex-[1_1_440px] justify-center py-6">
            <div className="absolute -left-2.5 -top-1.5 hidden sm:block" aria-hidden="true">
              <Plat variant="soupe" size={132} decorative />
            </div>
            <div className="absolute -bottom-9 -right-4 hidden sm:block" aria-hidden="true">
              <Plat variant="salade" size={148} decorative />
            </div>
            <HeroTicket
              stores={EXAMPLE_STORES}
              myStore={EXAMPLE_MY_STORE}
              households={HOUSEHOLD_FACTORS}
              weekLabel={EXAMPLE_WEEK.label}
            />
          </div>
        </section>
      </header>

      <main>
        {/* EN BREF */}
        <section aria-label="En bref" className="border-line bg-surface-0 border-b">
          <ul className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-x-8 gap-y-3 px-6 py-[22px] text-[16px] font-extrabold">
            {FACTS.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5">
                <Icon name={f.icon} size={22} className="text-brand" />
                {f.text}
              </li>
            ))}
          </ul>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section id="comment" className="mx-auto max-w-[1240px] px-6 pb-10 pt-[112px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className={`${sectionTitle} max-w-[640px]`}>Trois étapes, puis tu n’y penses plus.</h2>
            <p className="text-ink-muted max-w-[380px] text-[18px] leading-[27px]">
              Tu règles ton foyer une fois. Ensuite, chaque jeudi soir, la semaine suivante t’attend.
            </p>
          </div>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5">
            <li className="border-line bg-surface-0 flex flex-col gap-5 rounded-[26px] border p-7">
              <span
                className="font-display text-brand text-[64px] font-extrabold leading-none tracking-[-2px]"
                aria-hidden="true"
              >
                01
              </span>
              <div className="bg-surface-50 flex flex-wrap gap-2 rounded-md p-[18px]" aria-hidden="true">
                <span className="rounded-pill bg-brand text-brand-on px-3.5 py-2 text-[14px] font-extrabold">
                  2 adultes
                </span>
                <span className="rounded-pill bg-brand text-brand-on px-3.5 py-2 text-[14px] font-extrabold">
                  2 enfants
                </span>
                <span className="rounded-pill bg-brand-soft text-brand px-3.5 py-2 text-[14px] font-extrabold">
                  Sans porc
                </span>
                <span className="rounded-pill bg-brand-soft text-brand px-3.5 py-2 text-[14px] font-extrabold">
                  Auchan · 69000
                </span>
              </div>
              <div>
                <h3 className="mb-1.5 text-[22px] font-black">Tu décris ton foyer</h3>
                <p className="text-ink-muted text-[16px] leading-6">
                  Adultes, enfants, régime, enseigne habituelle et code postal. Une minute, une seule fois.
                </p>
              </div>
            </li>
            <li className="border-line bg-surface-0 flex flex-col gap-5 rounded-[26px] border p-7">
              <span
                className="font-display text-brand text-[64px] font-extrabold leading-none tracking-[-2px]"
                aria-hidden="true"
              >
                02
              </span>
              <div
                className="bg-surface-50 grid grid-cols-7 gap-[5px] rounded-md p-[18px]"
                aria-hidden="true"
              >
                {WEEK_COLORS.map((c, i) => (
                  <span key={i} className={`h-[26px] rounded-[6px] ${c}`} />
                ))}
              </div>
              <div>
                <h3 className="mb-1.5 text-[22px] font-black">On compose ta semaine</h3>
                <p className="text-ink-muted text-[16px] leading-6">
                  14 repas, midi et soir, de saison. Tu remplaces un plat en un clic, le total suit.
                </p>
              </div>
            </li>
            <li className="border-line bg-surface-0 flex flex-col gap-5 rounded-[26px] border p-7">
              <span
                className="font-display text-brand text-[64px] font-extrabold leading-none tracking-[-2px]"
                aria-hidden="true"
              >
                03
              </span>
              <div className="bg-surface-50 flex flex-col gap-2 rounded-md p-[18px]" aria-hidden="true">
                {[
                  ['Lidl', 'bg-saving', 'w-[72%]'],
                  ['Leclerc', 'bg-site-bar', 'w-[78%]'],
                  ['Auchan', 'bg-brand', 'w-[86%]'],
                ].map(([name, bg, w]) => (
                  <span key={name} className="flex items-center gap-2 text-[13px] font-extrabold">
                    <span className="w-[52px]">{name}</span>
                    <span className={`h-2.5 rounded-[9px] ${bg} ${w}`} />
                  </span>
                ))}
              </div>
              <div>
                <h3 className="mb-1.5 text-[22px] font-black">Tu compares, tu choisis</h3>
                <p className="text-ink-muted text-[16px] leading-6">
                  Le total dans chaque enseigne, l’écart avec la tienne. Le prix est un repère, jamais une
                  obligation.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* COMPARATEUR */}
        <section className="px-6 py-[72px]">
          <div className="bg-raw-encre mx-auto flex max-w-[1240px] flex-wrap items-center gap-14 rounded-[36px] p-[clamp(28px,5vw,72px)] text-white">
            <div className="min-w-0 flex-[1_1_380px]">
              <p className="text-saving mb-4 text-[13px] font-black tracking-[1.4px]">LE COMPARATEUR</p>
              <h2 className="font-display text-[clamp(36px,4.2vw,58px)] font-extrabold leading-none tracking-[-1.6px]">
                Le même panier peut coûter <span className="text-saving">{spread.overPercent} %</span> de
                plus.
              </h2>
              <p className="text-site-on-ink mt-6 text-[18px] leading-7">
                Sur notre panier d’exemple (famille de 4, semaine {EXAMPLE_WEEK.week}), l’écart entre la moins
                chère et la plus chère des six enseignes atteint {formatEuro(spread.gapCents)}. Chaque total
                affiche sa date de relevé et un indice de fiabilité.
              </p>
              <Link
                href={href(ROUTES.comparatif)}
                className="border-saving mt-7 inline-flex items-center gap-2 border-b-2 pb-1 text-[16px] font-black text-white no-underline"
              >
                Voir le comparatif complet des enseignes →
              </Link>
            </div>
            <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-3.5">
              <table className="w-full border-separate border-spacing-y-3.5">
                <caption className="sr-only">
                  Coût du panier d’exemple (14 repas, 4 personnes, semaine {EXAMPLE_WEEK.week}) dans les 6
                  enseignes
                </caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Enseigne</th>
                    <th scope="col">Part relative</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {EXAMPLE_STORES.map((s, i) => (
                    <tr key={s.id}>
                      <th scope="row" className="w-[116px] text-left text-[16px] font-extrabold">
                        {s.name}
                      </th>
                      <td className="px-3.5">
                        <span
                          className="block h-[34px] overflow-hidden rounded-[10px] bg-white/[0.07]"
                          aria-hidden="true"
                        >
                          <span
                            className={`block h-[34px] rounded-[10px] ${i === 0 ? 'bg-saving' : s.id === EXAMPLE_MY_STORE ? 'bg-site-brand-light' : 'bg-white/[0.28]'}`}
                            style={{ width: `${Math.round((s.cents / spread.maxCents) * 100)}%` }}
                          />
                        </span>
                      </td>
                      <td className="font-display w-[92px] text-right text-[22px] font-extrabold tabular-nums">
                        {formatEuro(s.cents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-site-on-ink-faint text-[13px]">
                Exemple illustratif · prix relevés via Open Prices et tickets de la communauté
              </p>
            </div>
          </div>
        </section>

        {/* RITUEL */}
        <section className="mx-auto max-w-[1240px] px-6 py-[72px]">
          <h2 className={`${sectionTitle} mb-3 max-w-[760px]`}>
            Un petit rendez-vous qui fait de grosses économies.
          </h2>
          <p className="text-ink-muted mb-12 text-[18px]">
            Pas de compte à rebours, pas de culpabilité. Juste tes économies, visibles.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5">
            <article className="bg-brand flex min-h-[300px] flex-col gap-[18px] rounded-[26px] p-[26px] text-white">
              <p className="text-site-lilac text-[13px] font-black tracking-[1.2px]">JEUDI · 19 H</p>
              <div className="flex items-center gap-3 rounded-md border border-white/[0.18] bg-white/10 p-3.5">
                <span className="bg-saving h-9 w-9 shrink-0 rounded-[10px]" aria-hidden="true" />
                <span className="text-[14px] leading-5">
                  <strong className="block">Ton menu est prêt</strong>68 € cette semaine, 14 repas
                </span>
              </div>
              <h3 className="mt-auto text-[22px] font-black">Le plan arrive tout seul</h3>
            </article>
            <article className="border-line bg-surface-0 flex min-h-[300px] flex-col gap-[18px] rounded-[26px] border p-[26px]">
              <p className="text-ink-muted text-[13px] font-black tracking-[1.2px]">DEPUIS SEPTEMBRE</p>
              <p className="font-display text-[52px] font-extrabold tabular-nums leading-none tracking-[-2px]">
                {formatEuro(5830)}
              </p>
              <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
                {['h-[30%]', 'h-[42%]', 'h-[38%]', 'h-[55%]', 'h-[64%]', 'h-[72%]'].map((h) => (
                  <span key={h} className={`bg-saving-soft flex-1 rounded-[6px] ${h}`} />
                ))}
                <span className="bg-saving h-full flex-1 rounded-[6px]" />
              </div>
              <h3 className="mt-auto text-[22px] font-black">Le compteur d’économies</h3>
            </article>
            <article className="border-line bg-surface-0 flex min-h-[300px] flex-col gap-[18px] rounded-[26px] border p-[26px]">
              <p className="text-ink-muted text-[13px] font-black tracking-[1.2px]">SÉRIE EN COURS</p>
              <p className="font-display text-[52px] font-extrabold leading-none tracking-[-2px]">
                6 semaines
              </p>
              <div className="flex gap-2" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="rounded-pill bg-brand h-7 w-7" />
                ))}
                <span className="rounded-pill border-brand box-border h-7 w-7 border-2 border-dashed" />
              </div>
              <h3 className="mt-auto text-[22px] font-black">Un joker par mois pour les vacances</h3>
            </article>
            <article className="bg-saving-soft flex min-h-[300px] flex-col gap-[18px] rounded-[26px] p-[26px]">
              <p className="text-saving-ink text-[13px] font-black tracking-[1.2px]">DÉFI DE NOVEMBRE</p>
              <p className="font-display text-[34px] font-extrabold leading-[1.05] tracking-[-1px]">
                Moins de 70 € par semaine
              </p>
              <div className="bg-saving-ink/15 h-3 rounded-[9px]" aria-hidden="true">
                <div className="bg-saving h-3 w-3/4 rounded-[9px]" />
              </div>
              <h3 className="mt-auto text-[22px] font-black">3 semaines sur 4, un badge à la clé</h3>
            </article>
          </div>
        </section>

        {/* MENUS (maillage SEO) */}
        <section className="border-line bg-surface-0 border-y">
          <div className="mx-auto max-w-[1240px] px-6 py-24">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-1.4px]">
                Des menus prêts, prix compris
              </h2>
              <Link href={href(`${ROUTES.recettes}?saison=1`)} className="text-brand font-black">
                Toutes les recettes de saison →
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
              {MENUS.map((m) => (
                <Link
                  key={m.title}
                  href={href(m.href)}
                  className="bg-surface-50 text-ink flex flex-col gap-4 rounded-[26px] p-6 no-underline hover:underline"
                >
                  <div className={`flex justify-center rounded-[20px] py-[18px] ${m.bg}`}>
                    <Plat variant={m.plat} size={150} decorative />
                  </div>
                  <span className="text-ink-muted text-[13px] font-black tracking-[1px]">{m.overline}</span>
                  <span className="font-display text-[26px] font-extrabold leading-[1.1] tracking-[-0.6px]">
                    {m.title}
                  </span>
                  <span className="flex justify-between font-extrabold tabular-nums">
                    <span>dès {formatEuro(m.from)}</span>
                    <span className="rounded-pill bg-saving-soft text-saving-ink px-2.5 py-0.5 text-[14px]">
                      {formatEuro(m.perServing)} / part
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TARIFS */}
        <section id="tarifs" className="mx-auto max-w-[1240px] px-6 pb-[72px] pt-[112px]">
          <h2 className={`${sectionTitle} mb-3 text-center`}>Gratuit pour de vrai.</h2>
          <p className="text-ink-muted mx-auto mb-12 max-w-[560px] text-center text-[18px] leading-[27px]">
            Le plan de la semaine reste gratuit, sans limite de durée. Premium t’aide à aller plus loin.
          </p>
          <div className="mx-auto grid max-w-[920px] grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5">
            <article className="border-line bg-surface-0 flex flex-col gap-5 rounded-[28px] border p-[34px]">
              <h3 className="text-[20px] font-black">Gratuit</h3>
              <p className="font-display text-[60px] font-extrabold leading-none tracking-[-2px]">0 €</p>
              <ul className="flex flex-col gap-3 text-[16px] font-semibold">
                <CheckItem tone="brand">1 plan par semaine</CheckItem>
                <CheckItem tone="brand">Prix détaillés dans ton enseigne</CheckItem>
                <CheckItem tone="brand">Totaux des 5 autres enseignes</CheckItem>
                <CheckItem tone="brand">Liste de courses partageable</CheckItem>
              </ul>
              <Link
                href={href(ROUTES.connexion)}
                className="rounded-pill border-brand text-brand hover:bg-brand-soft mt-auto border-2 p-[15px] text-center text-[16px] font-black no-underline"
              >
                Commencer gratuitement
              </Link>
            </article>
            <article className="bg-brand relative flex flex-col gap-5 rounded-[28px] p-[34px] text-white">
              <span className="rounded-pill bg-saving text-raw-encre absolute right-7 top-7 px-3 py-1.5 text-[13px] font-black">
                14 jours offerts
              </span>
              <h3 className="text-[20px] font-black">Premium</h3>
              <p>
                <span className="font-display text-[60px] font-extrabold tabular-nums leading-none tracking-[-2px]">
                  {formatEuro(3999)}
                </span>
                <span className="text-site-lilac font-bold"> / an</span>
              </p>
              <p className="text-site-lilac -mt-2.5 text-[15px] font-bold">
                soit {formatEuro(333)} par mois · ou {formatEuro(499)} au mois
              </p>
              <ul className="flex flex-col gap-3 text-[16px] font-semibold">
                <CheckItem tone="saving">Détail produit par produit</CheckItem>
                <CheckItem tone="saving">Changement d’enseigne en un clic</CheckItem>
                <CheckItem tone="saving">Plans illimités et alertes promo</CheckItem>
                <CheckItem tone="saving">Partage famille en temps réel</CheckItem>
              </ul>
              <Link
                href={href(ROUTES.connexion)}
                className="rounded-pill text-brand mt-auto bg-white p-[17px] text-center text-[16px] font-black no-underline"
              >
                Essayer 14 jours, sans carte
              </Link>
            </article>
          </div>
        </section>

        <Faq items={LANDING_FAQ} />

        {/* CTA FINAL */}
        <section className="px-6 pb-24">
          <div className="bg-saving text-raw-encre mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-8 rounded-[36px] p-[clamp(32px,6vw,80px)]">
            <h2 className="font-display flex-[1_1_460px] text-[clamp(36px,4.6vw,64px)] font-extrabold leading-none tracking-[-2px]">
              Ton menu de jeudi prochain t’attend.
            </h2>
            <EmailCtaForm
              id="mail-cta"
              label="Rejoindre la liste"
              tone="final"
              className="flex-[1_1_380px]"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
