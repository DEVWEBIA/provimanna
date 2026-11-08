import Image from 'next/image';
import { cx, Plat, type PlatVariant } from '@repas/ui';
import { RECIPE_PHOTOS } from '@/lib/recipe-photos';

export interface RecipePhotoProps {
  slug: string;
  illustration: PlatVariant;
  /** circle : assiette ronde détourée (comme le bol de l'accueil) ; cover : remplit son conteneur. */
  shape?: 'circle' | 'cover';
  /** Diamètre en pixels (forme ronde). */
  size?: number;
  /** Attribut sizes de next/image (forme cover). */
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Vraie photo du plat (Unsplash, crédits dans public/recettes/CREDITS.md), même traitement que le bol de
 * la page d'accueil. Sans photo, l'illustration <Plat> prend le relais.
 */
export function RecipePhoto({
  slug,
  illustration,
  shape = 'circle',
  size = 96,
  sizes,
  priority,
  className,
}: RecipePhotoProps) {
  const has = RECIPE_PHOTOS.has(slug);
  if (shape === 'cover') {
    return has ? (
      <Image
        src={`/recettes/${slug}.jpg`}
        alt=""
        fill
        sizes={sizes ?? '(min-width: 768px) 280px, 50vw'}
        priority={priority}
        className={cx('object-cover', className)}
      />
    ) : (
      <span className={cx('grid h-full w-full place-items-center', className)}>
        <Plat variant={illustration} size={Math.min(size, 132)} decorative />
      </span>
    );
  }
  if (!has) return <Plat variant={illustration} size={size} decorative className={className} />;
  return (
    <span
      className={cx(
        'relative block shrink-0 overflow-hidden rounded-full shadow-[0_10px_24px_rgba(42,26,40,0.18)] ring-white/70',
        size >= 80 ? 'ring-4' : 'ring-2',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/recettes/${slug}.jpg`}
        alt=""
        fill
        sizes={`${size * 2}px`}
        priority={priority}
        className="scale-105 object-cover"
      />
    </span>
  );
}
