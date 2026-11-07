/**
 * Preset Tailwind — Appli Repas. Couleurs exposées via variables CSS (design/tokens.css)
 * pour que le mode sombre bascule sans dupliquer les classes.
 *
 * Usage (apps/web/tailwind.config.ts) :
 *   import preset from '../../design/tailwind-preset';
 *   export default { presets: [preset], content: ['./src/**\/*.{ts,tsx}', '../../packages/ui/src/**\/*.{ts,tsx}'] };
 * et importer design/tokens.css dans app/globals.css.
 */
import type { Config } from 'tailwindcss';

const v = (name: string) => `var(--${name})`;

const preset: Partial<Config> = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: v('surface-0'), 0: v('surface-0'), 50: v('surface-50') },
        line: v('line'),
        ink: { DEFAULT: v('ink'), muted: v('ink-muted') },
        brand: { DEFAULT: v('brand'), on: v('on-brand'), soft: v('brand-soft'), 'soft-ink': v('brand-soft-ink') },
        // Orange = économies UNIQUEMENT, toujours avec text-ink (jamais text-white).
        saving: { DEFAULT: v('saving'), soft: v('saving-soft'), ink: v('saving-ink') },
        danger: v('danger'),
        success: { DEFAULT: '#2F6B2A', soft: '#E3F0DF' },
        // Pastilles d'enseignes : fonds pastel neutres, attribués par ordre, sans lien avec les couleurs officielles.
        chip: { 1: '#EFE3EC', 2: '#E6EEF2', 3: '#F5E9DC', 4: '#E3F0DF', 5: '#F2E6E6', 6: '#ECEAF4' },
        // Valeurs brutes (emails, OG images, cas où les variables CSS ne sont pas disponibles)
        raw: {
          aubergine: '#4A2545', orange: '#EE7A30', sable: '#F6F3EC', encre: '#2A1A28',
          peche: '#FCE3D3', 'peche-ink': '#9A420E', 'aubergine-clair': '#EFE3EC', ligne: '#E3DDD0', muted: '#625A60',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      fontSize: {
        'price-xl': ['40px', { lineHeight: '44px', fontWeight: '800', letterSpacing: '-1px' }],
        display: ['30px', { lineHeight: '35px', fontWeight: '800', letterSpacing: '-0.5px' }],
        title: ['26px', { lineHeight: '31px', fontWeight: '800', letterSpacing: '-0.5px' }],
        heading: ['18px', { lineHeight: '24px', fontWeight: '800' }],
        body: ['16px', { lineHeight: '24px' }],
        'body-strong': ['15px', { lineHeight: '21px', fontWeight: '700' }],
        label: ['13px', { lineHeight: '18px', fontWeight: '700' }],
        overline: ['12px', { lineHeight: '16px', fontWeight: '800', letterSpacing: '0.6px' }],
      },
      borderRadius: { sm: '12px', md: '18px', lg: '24px', xl: '32px', pill: '999px' },
      spacing: { 11: '44px', 'tap': '44px' },
      minHeight: { tap: '44px' },
      minWidth: { tap: '44px' },
      boxShadow: { float: v('shadow-float') },
      backgroundImage: {
        // Bord dentelé du « ticket de caisse » : appliquer sur un pseudo-élément de 12px de haut.
        'ticket-edge': 'radial-gradient(circle at 8px 0, transparent 7px, var(--surface-0) 7.5px)',
      },
      backgroundSize: { 'ticket-edge': '16px 12px' },
    },
  },
};

export default preset;
