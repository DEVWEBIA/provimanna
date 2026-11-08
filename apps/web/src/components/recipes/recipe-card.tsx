import Link from 'next/link';
import { RecipePhoto } from '@/components/recipes/recipe-photo';
import type { Route } from 'next';
import { Icon, Price, type PlatVariant } from '@repas/ui';
import { PLAT_TINT } from '@/components/plan/labels';

export interface RecipeCardProps {
  href: string;
  title: string;
  illustration: PlatVariant;
  minutes: number;
  perServingCents: number | null;
  tags: string[];
  /** Action sous la carte (ex. « + Ajouter à ma semaine »). */
  action?: React.ReactNode;
}

/** Carte recette (maquettes SiteRecettes / AppRecettes) : illustration, étiquettes, temps, prix par part. */
export function RecipeCard({
  href,
  title,
  illustration,
  minutes,
  perServingCents,
  tags,
  action,
}: RecipeCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={href as Route} className="text-ink flex flex-1 flex-col no-underline">
        <div
          className={`relative grid aspect-[5/4] place-items-center overflow-hidden rounded-[22px] ${PLAT_TINT[illustration] ?? 'bg-surface-0'}`}
        >
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none">
            <RecipePhoto
              slug={href.split('/').pop() ?? ''}
              illustration={illustration}
              shape="cover"
              size={132}
            />
          </div>
          {tags.length ? (
            <ul className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((t) => (
                <li
                  key={t}
                  className="rounded-pill bg-white/85 px-2.5 py-0.5 text-[12px] font-black backdrop-blur"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <h3 className="mt-3 text-[17px] font-black leading-snug group-hover:underline">{title}</h3>
        <p className="text-ink-muted mt-1 flex items-center gap-1.5 text-[14px] font-bold">
          <Icon name="horloge" size={14} />
          {minutes} min · <Price cents={perServingCents} size="sm" suffix="/ part" className="text-ink" />
        </p>
      </Link>
      {action}
    </article>
  );
}
