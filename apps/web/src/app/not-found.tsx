import Link from 'next/link';
import { buttonClasses, inputClasses, Plat } from '@repas/ui';
import { SitePage } from '@/components/site/site-page';
import { href, ROUTES } from '@/lib/site';

/** Page introuvable (maquette Site404). */
export default function NotFound() {
  return (
    <SitePage>
      <section className="mx-auto flex max-w-[640px] flex-col items-center py-10 text-center">
        <div className="anim-ticket">
          <div className="anim-float">
            <Plat variant="salade" size={180} decorative />
          </div>
        </div>
        <h1 className="anim-rise font-display mt-8 text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.05] tracking-[-1.4px]">
          Cette page est partie faire les courses.
        </h1>
        <p className="anim-rise text-ink-muted mt-4 text-[18px]">
          Le lien est peut-être ancien, ou la recette a changé de nom. Cherche-la, ou repars d’ici :
        </p>
        <form
          action={ROUTES.recettes}
          method="get"
          role="search"
          className="anim-rise mt-7 flex w-full gap-2.5"
        >
          <label htmlFor="q404" className="sr-only">
            Rechercher une recette
          </label>
          <input
            id="q404"
            name="q"
            type="search"
            placeholder="Rechercher une recette"
            className={inputClasses(false, 'min-h-[54px]')}
          />
          <button type="submit" className={buttonClasses('primary')}>
            Rechercher
          </button>
        </form>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] font-black">
          <li>
            <Link href={href(`${ROUTES.recettes}?filtre=saison`)} className="text-brand">
              Recettes de saison →
            </Link>
          </li>
          <li>
            <Link href={href(ROUTES.menus)} className="text-brand">
              Menu de la semaine →
            </Link>
          </li>
          <li>
            <Link href="/" className="text-brand">
              Page d’accueil →
            </Link>
          </li>
        </ul>
      </section>
    </SitePage>
  );
}
