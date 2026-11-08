import Link from 'next/link';
import { href, ROUTES } from '@/lib/site';

const LINKS = [
  { href: ROUTES.commentCaMarche, label: 'Comment ça marche' },
  { href: ROUTES.recettes, label: 'Recettes' },
  { href: ROUTES.comparatif, label: 'Comparatif des prix' },
  { href: '/guide/batch-cooking', label: 'Guide batch cooking' },
  { href: ROUTES.methodologie, label: 'Méthodologie' },
  { href: ROUTES.mentionsLegales, label: 'Mentions légales' },
  { href: ROUTES.confidentialite, label: 'Confidentialité' },
  { href: '/cgu', label: 'CGU' },
];

/** Pied de page minimal. */
export function SiteFooter() {
  return (
    <footer className="text-ink-muted mx-auto max-w-[1000px] px-6 pb-12 pt-6 text-[14px]">
      <nav aria-label="Liens utiles">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-bold">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={href(l.href)}
                className="text-ink-muted hover:text-brand no-underline hover:underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-4 text-center text-[13px]">
        Les noms d’enseignes sont cités à titre de comparaison. Aucune affiliation.
      </p>
    </footer>
  );
}
