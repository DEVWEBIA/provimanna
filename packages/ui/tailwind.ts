import type { Config } from 'tailwindcss';
import preset from '../../design/tailwind-preset.ts';

/**
 * Config Tailwind partagée par apps/web et apps/admin.
 * Les polices viennent de next/font (variables --font-display / --font-sans posées dans globals.css).
 */
export function createTailwindConfig(content: string[]): Config {
  return {
    presets: [preset as Config],
    content: [...content, '../../packages/ui/src/**/*.{ts,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          display: ['var(--font-display)'],
          sans: ['var(--font-sans)'],
        },
      },
    },
  };
}
