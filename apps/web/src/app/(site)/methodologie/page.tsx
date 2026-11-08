import type { Metadata } from 'next';
import { DEFAULTS } from '@repas/core';
import { Reliability, Reveal } from '@repas/ui';
import { CtaTicket, H2, Panel, SeoHero } from '@/components/seo/blocks';
import { SitePage } from '@/components/site/site-page';
import { breadcrumbLd, JsonLd } from '@/lib/seo/json-ld';
import { ROUTES, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Méthodologie : comment on calcule les prix',
  description: `Sources (Open Prices, tickets de caisse), médiane des relevés de moins de ${DEFAULTS.freshDays} jours, indice de fiabilité, contrôle des prix aberrants.`,
  alternates: { canonical: ROUTES.methodologie },
};

const STEPS = [
  ['Collecte', 'Import quotidien d’Open Prices. Tickets de caisse envoyés en photo par les utilisateurs.'],
  [
    'Contrôle',
    `Tout prix qui s’écarte de plus de ${DEFAULTS.aberrantThreshold * 100} % de la médiane est vérifié à la main par notre équipe.`,
  ],
  [
    'Calcul',
    'Médiane des relevés récents, par produit et par enseigne. Repli sur une estimation si aucun relevé récent.',
  ],
  [
    'Affichage',
    'Chaque total porte sa date et un indice de fiabilité. Les estimations sont signalées par ≈.',
  ],
];

export default function MethodologiePage() {
  return (
    <SitePage crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Méthodologie' }]}>
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: 'Méthodologie', path: ROUTES.methodologie },
        ])}
      />
      <SeoHero
        eyebrow="Méthodologie"
        title="Comment on calcule les prix"
        answer={
          <>
            <strong className="text-ink">
              Chaque prix affiché est la médiane des relevés de moins de {DEFAULTS.freshDays} jours pour un
              produit, dans une enseigne, près de chez toi.
            </strong>{' '}
            Les relevés viennent de la base ouverte Open Prices et des tickets de caisse envoyés par la
            communauté, vérifiés avant publication.
          </>
        }
      />
      <ol className="-mt-4 grid gap-4 md:grid-cols-4">
        {STEPS.map(([t, d], i) => (
          <Reveal
            as="li"
            key={t}
            delay={i * 90}
            className="border-line rounded-[24px] border bg-white/75 p-5 backdrop-blur"
          >
            <span className="rounded-pill bg-brand-soft text-brand grid h-10 w-10 place-items-center font-black">
              {i + 1}
            </span>
            <h2 className="mt-4 text-[19px] font-black">{t}</h2>
            <p className="text-ink-muted mt-1.5 text-[15px]">{d}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal>
        <Panel>
          <H2>L’indice de fiabilité</H2>
          <ul className="mt-5 flex flex-col gap-3 text-[16px]">
            <li className="flex items-center gap-3">
              <Reliability level="high" /> <strong>Élevée.</strong> Au moins 90 % des produits relevés il y a
              moins de {DEFAULTS.freshDays} jours.
            </li>
            <li className="flex items-center gap-3">
              <Reliability level="medium" /> <strong>Moyenne.</strong> Entre 60 et 90 %.
            </li>
            <li className="flex items-center gap-3">
              <Reliability level="low" /> <strong>Faible.</strong> Moins de 60 % : le total est une
              estimation.
            </li>
          </ul>
          <p className="text-ink-muted mt-4 text-[15px]">
            Sans relevé de moins de {DEFAULTS.freshDays} jours, on utilise la médiane des{' '}
            {DEFAULTS.fallbackDays} derniers jours, affichée avec ≈. Au-delà, le produit est signalé « prix
            inconnu » et sort du total.
          </p>
        </Panel>
      </Reveal>
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Panel className="h-full">
            <H2>Ce que nos prix ne disent pas</H2>
            <ul className="text-ink-muted mt-4 flex list-disc flex-col gap-2 pl-5 text-[16px]">
              <li>Les promos locales et les prix carte de fidélité.</li>
              <li>Les écarts entre deux magasins d’une même enseigne.</li>
              <li>
                Les produits de marque : on compare des produits équivalents, souvent en marque distributeur.
              </li>
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={100}>
          <Panel className="h-full">
            <H2>Sources</H2>
            <table className="mt-4 w-full text-[15px]">
              <thead>
                <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
                  <th scope="col" className="pb-2">
                    SOURCE
                  </th>
                  <th scope="col" className="pb-2">
                    CONTENU
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Open Prices', 'Prix relevés par la communauté Open Food Facts'],
                  ['Open Food Facts', 'Fiches produits, codes EAN'],
                  ['Tickets de la communauté', 'Prix lus sur les tickets, photos supprimées après lecture'],
                ].map(([s, c]) => (
                  <tr key={s} className="border-line border-t">
                    <th scope="row" className="py-2.5 text-left font-extrabold">
                      {s}
                    </th>
                    <td className="text-ink-muted py-2.5">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </Reveal>
      </div>
      <Reveal>
        <Panel>
          <H2>À propos</H2>
          <p className="text-ink-muted mt-3 max-w-[760px] text-[16px] leading-[26px]">
            {SITE_NAME} est né d’une question simple : pourquoi faut-il deux applis, une pour planifier ses
            repas et une pour comparer les prix ? On a réuni les deux, avec un plan gratuit pour de vrai.
          </p>
          <p className="mt-3 max-w-[760px] text-[16px] leading-[26px]">
            <strong>Indépendance :</strong> aucune enseigne ne nous paie pour apparaître ou être mieux
            classée. On vit des abonnements Premium.
          </p>
        </Panel>
      </Reveal>
      <Reveal>
        <CtaTicket title="Vois ces prix appliqués à ta semaine." />
      </Reveal>
    </SitePage>
  );
}
