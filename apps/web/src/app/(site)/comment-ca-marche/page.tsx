import type { Metadata } from 'next';
import { Icon, IconTile, Reveal, type IconName } from '@repas/ui';
import { CtaTicket, H2, SeoHero } from '@/components/seo/blocks';
import { SitePage } from '@/components/site/site-page';
import { breadcrumbLd, JsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl, ROUTES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Comment ça marche : ton plan de repas chiffré en 2 minutes',
  description:
    'Décris ton foyer, reçois 14 repas de saison chaque jeudi, compare la liste de courses dans 6 enseignes et choisis où faire tes courses.',
  alternates: { canonical: ROUTES.commentCaMarche },
};

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'famille',
    title: 'Tu décris ton foyer',
    text: 'Adultes, enfants, régime, temps de cuisine, enseigne habituelle et code postal. Une minute, une seule fois.',
  },
  {
    icon: 'plan',
    title: 'Ton menu arrive le jeudi',
    text: '14 repas de saison, midi et soir. Tu remplaces ce qui ne te plaît pas, tu verrouilles ce que tu gardes.',
  },
  {
    icon: 'panier',
    title: 'Tu compares les 6 enseignes',
    text: 'Le total de ta liste dans chaque enseigne, daté et avec sa fiabilité. Tu restes libre de garder la tienne.',
  },
  {
    icon: 'liste',
    title: 'Tu fais tes courses',
    text: 'La liste est rangée par rayon, partagée avec ta famille et cochée en temps réel, même en magasin.',
  },
];
const WEEK = [
  ['Jeudi 19 h', 'Le plan arrive'],
  ['Vendredi', 'Tu ajustes et compares'],
  ['Samedi', 'Courses, liste partagée'],
  ['Dimanche', 'Batch de 2 heures'],
  ['Fin du mois', 'Ton récap d’économies'],
];
const NEVER = [
  'De faux comptes à rebours pour te pousser à payer',
  'Une enseigne mieux classée parce qu’elle nous paie',
  'Tes données revendues',
  'Des notifications sans intérêt',
];

export default function CommentCaMarchePage() {
  return (
    <SitePage crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Comment ça marche' }]}>
      <JsonLd
        data={breadcrumbLd([
          { label: 'Accueil', path: '/' },
          { label: 'Comment ça marche', path: ROUTES.commentCaMarche },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'Planifier ses repas de la semaine et comparer le prix de ses courses',
          totalTime: 'PT2M',
          url: absoluteUrl(ROUTES.commentCaMarche),
          step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
        }}
      />
      <SeoHero
        eyebrow="Comment ça marche"
        title="Ta semaine de repas, planifiée et chiffrée en 2 minutes."
        answer="Tu décris ton foyer une fois. Chaque jeudi soir, on te propose 14 repas de saison avec leur liste de courses et leur prix dans 6 enseignes. Tu choisis où faire tes courses."
      />
      <ol className="-mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={i * 100}
            className="border-line rounded-[26px] border bg-white/75 p-6 backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-pill border-line bg-surface-50 text-brand grid h-11 w-11 place-items-center border text-[17px] font-black">
                {i + 1}
              </span>
              <IconTile>
                <Icon name={s.icon} size={22} />
              </IconTile>
            </div>
            <h2 className="mt-5 text-[19px] font-black">{s.title}</h2>
            <p className="text-ink-muted mt-1.5 text-[15px] leading-6">{s.text}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal>
        <H2>Une semaine type</H2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-5">
          {WEEK.map(([d, t], i) => (
            <li key={d} className="relative rounded-[20px] bg-white/75 p-4 backdrop-blur">
              <p className="text-brand text-[12px] font-black uppercase tracking-[1px]">{d}</p>
              <p className="mt-1 font-extrabold">{t}</p>
              {i < WEEK.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="text-ink-muted absolute -right-2.5 top-1/2 hidden -translate-y-1/2 sm:block"
                >
                  ›
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal className="border-line rounded-[28px] border bg-white/75 p-7 backdrop-blur">
        <H2>Ce que tu ne verras jamais</H2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {NEVER.map((n) => (
            <li key={n} className="flex items-center gap-3 text-[16px] font-bold">
              <span
                aria-hidden="true"
                className="bg-danger-soft text-danger-ink rounded-pill grid h-8 w-8 shrink-0 place-items-center font-black"
              >
                ×
              </span>
              {n}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal>
        <CtaTicket title="Prêt pour ton premier jeudi ?" />
      </Reveal>
    </SitePage>
  );
}
