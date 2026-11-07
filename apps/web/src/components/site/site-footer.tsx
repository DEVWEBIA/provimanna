import Link from 'next/link';
import { APP_NAME } from '@repas/ui';
import { ROUTES, href } from '@/lib/site';

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Recettes',
    links: [
      { href: `${ROUTES.recettes}?saison=1`, label: 'De saison' },
      { href: `${ROUTES.recettes}?regime=vegetarien`, label: 'Végétariennes' },
      { href: `${ROUTES.recettes}?temps=30`, label: 'Moins de 30 min' },
      { href: `${ROUTES.recettes}?pour=enfants`, label: 'Pour enfants' },
    ],
  },
  {
    title: 'Comparatifs',
    links: [
      { href: ROUTES.comparatif, label: 'Enseigne la moins chère' },
      { href: `${ROUTES.comparatif}#lidl-leclerc`, label: 'Lidl ou E.Leclerc' },
      { href: ROUTES.comparatif, label: 'Observatoire des prix' },
      { href: ROUTES.methodologie, label: 'Méthodologie' },
    ],
  },
  {
    title: 'L’appli',
    links: [
      { href: ROUTES.tarifs, label: 'Tarifs' },
      { href: ROUTES.commentCaMarche, label: 'Comment ça marche' },
      { href: ROUTES.mentionsLegales, label: 'Mentions légales' },
      { href: ROUTES.confidentialite, label: 'Confidentialité' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-raw-encre text-site-on-ink">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 px-6 pb-10 pt-16 text-[15px]">
        <div>
          <p className="mb-3 text-[18px] font-black text-white">{APP_NAME}</p>
          <p className="leading-[23px]">
            Planning de repas et comparateur de prix entre enseignes. Prix indicatifs, relevés via Open Prices
            et la communauté.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="mb-3 font-black text-white">{col.title}</p>
            <ul className="leading-[30px]">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={href(l.href)} className="text-site-on-ink no-underline hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="border-site-ink-line text-site-on-ink-faint mx-auto max-w-[1240px] border-t px-6 pb-8 pt-5 text-[13px]">
        Les noms d’enseignes sont cités à titre de comparaison. Aucune affiliation.
      </p>
    </footer>
  );
}
