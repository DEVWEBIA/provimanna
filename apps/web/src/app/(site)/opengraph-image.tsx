import { ImageResponse } from 'next/og';
import { formatEuro, priceSpread } from '@repas/core';
import { APP_NAME } from '@repas/ui';
import { EXAMPLE_WEEK, HERO_STORES } from '@/lib/landing-data';

export const alt = 'Le même menu. Treize prix. Tu choisis.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Couleurs brutes : les variables CSS ne sont pas disponibles dans ImageResponse (cf. raw.* du preset).
const C = { aubergine: '#6B3868', orange: '#EE7A30', encre: '#2A1A28', clair: '#EBDDE7' };

/** Image Open Graph avec le chiffre clé : l'écart de prix du panier d'exemple. */
export default function OpengraphImage() {
  const s = priceSpread(HERO_STORES.map((x) => x.cents));
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: C.aubergine,
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 800, color: C.clair }}>{APP_NAME}</div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 800, lineHeight: 1 }}>
        <span>Le même menu.</span>
        <span>Treize prix.</span>
        <span style={{ color: C.orange }}>Tu choisis.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 32, color: C.clair }}>
        <span
          style={{
            background: C.orange,
            color: C.encre,
            borderRadius: 18,
            padding: '8px 22px',
            fontWeight: 800,
          }}
        >
          {`${formatEuro(s.minCents)} → ${formatEuro(s.maxCents)}`}
        </span>
        <span>{`14 repas pour 4 · exemple sem. ${EXAMPLE_WEEK.week}`}</span>
      </div>
    </div>,
    size,
  );
}
