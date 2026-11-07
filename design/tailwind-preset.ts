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
        brand: {
          DEFAULT: v('brand'),
          on: v('on-brand'),
          soft: v('brand-soft'),
          'soft-ink': v('brand-soft-ink'),
        },
        // Orange = économies UNIQUEMENT, toujours avec text-ink (jamais text-white).
        saving: { DEFAULT: v('saving'), soft: v('saving-soft'), ink: v('saving-ink') },
        danger: { DEFAULT: v('danger'), soft: '#FBE4E1', ink: '#7A1A12', line: '#F3C7C2' },
        success: { DEFAULT: '#2F6B2A', soft: '#E3F0DF', bright: '#B7DDB0' },
        // Statuts « brouillon » et fiabilité moyenne (●●○).
        warning: { DEFAULT: '#6B4A0E', soft: '#F6E7C8' },
        // Encart « prix incomplets » (fond pêche) : texte plus foncé que saving-ink pour le contraste AA.
        notice: { ink: '#5A2A0B' },
        skeleton: { DEFAULT: '#EFEAE0', shine: '#F8F5EF' },
        disabled: { DEFAULT: '#E3DDD0', ink: '#8A8088' },
        toggle: { off: '#D9D2DA' },
        // Site public (design/maquettes/Main.dc.html) : textes clairs sur aubergine / encre, barres du comparatif.
        site: {
          'on-brand': '#F3E6EF',
          'on-brand-muted': '#EBDDE7',
          'on-brand-faint': '#D9C6D4',
          lilac: '#E3CDE0',
          'on-ink': '#D9CCD6',
          'on-ink-faint': '#B9ADB6',
          'ink-line': '#3A2D37',
          'brand-light': '#C9A3C2',
          bar: '#D9CFDA',
          track: '#F1ECE2',
          highlight: '#FFF6EF',
          hover: '#FBF9F4',
          answer: '#4D444B',
          mint: '#E8F0DF',
        },
        // Couleurs des plats (mini-calendrier de la landing), reprises des illustrations Plat.
        food: { curry: '#E9A23B', salade: '#7DB043', soupe: '#E98A2E', pates: '#F4CF6A', tomate: '#C8382B' },
        // Pastilles d'enseignes : fonds pastel neutres, sans lien avec les couleurs officielles.
        // Valeurs de design/maquettes/Composants.dc.html, dans l'ordre des enseignes du seed :
        // 1 Lidl · 2 Aldi · 3 E.Leclerc · 4 Intermarché · 5 Carrefour · 6 Auchan.
        chip: { 1: '#E3ECF6', 2: '#E7EFE2', 3: '#ECE6F5', 4: '#F5E9DC', 5: '#E2EFEF', 6: '#F4E3E6' },
        // Valeurs brutes (emails, OG images, cas où les variables CSS ne sont pas disponibles)
        raw: {
          aubergine: '#4A2545',
          orange: '#EE7A30',
          sable: '#F6F3EC',
          encre: '#2A1A28',
          peche: '#FCE3D3',
          'peche-ink': '#9A420E',
          'aubergine-clair': '#EFE3EC',
          ligne: '#E3DDD0',
          muted: '#625A60',
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
      spacing: { 11: '44px', tap: '44px' },
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
