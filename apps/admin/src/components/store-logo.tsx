import Image from 'next/image';

/**
 * Vrai logo de l'enseigne, en couleur (back-office uniquement, décision du propriétaire du 08/11/2026).
 * Fichiers : apps/admin/public/logos (copie de apps/web/src/assets/logos, sources dans SOURCES.md).
 * Sans fichier (Carrefour pour l'instant) : nom écrit en clair.
 */
const LOGOS: Record<string, { file: string; ratio: number }> = {
  lidl: { file: 'lidl.svg', ratio: 1.0 },
  aldi: { file: 'aldi.svg', ratio: 0.96 },
  leclerc: { file: 'leclerc.svg', ratio: 4.04 },
  intermarche: { file: 'intermarche.svg', ratio: 4.2 },
  auchan: { file: 'auchan.svg', ratio: 4.77 },
};

export function StoreLogo({ id, name, height = 28 }: { id: string; name: string; height?: number }) {
  const logo = LOGOS[id];
  if (!logo)
    return (
      <span className="text-ink font-black" style={{ fontSize: Math.round(height * 0.6) }}>
        {name}
      </span>
    );
  return (
    <Image
      src={`/logos/${logo.file}`}
      alt={name}
      width={Math.round(height * logo.ratio)}
      height={height}
      unoptimized
      className="h-auto max-w-full object-contain"
      style={{ height, width: 'auto' }}
    />
  );
}
