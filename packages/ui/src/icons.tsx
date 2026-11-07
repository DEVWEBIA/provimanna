import type { ReactElement, SVGProps } from 'react';

// Icônes de design/maquettes/Composants.dc.html : trait de 2 px, coins arrondis, jamais d'emoji.
const PATHS = {
  accueil: <path d="M3 11 12 4l9 7v9H3z" />,
  plan: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </>
  ),
  liste: <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  recettes: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  economies: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  famille: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M2 20c1-3.5 3.6-5 7-5s6 1.5 7 5M15 15c3 0 5 1.5 6 4" />
    </>
  ),
  notification: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" />,
  profil: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>
  ),
  panier: <path d="M3 9h18M5 9l1 11h12l1-11M9 9V6a3 3 0 0 1 6 0v3" />,
  ticket: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  favori: (
    <path d="M12 21s-7-4.4-9.3-9C1.2 8.8 3.3 5 7 5c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.7 0 5.8 3.8 4.3 7-2.3 4.6-9.3 9-9.3 9z" />
  ),
  telecharger: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  boite: <path d="M4 7h16v12H4zM4 7l2-3h12l2 3M9 12h6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  verrou: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
} satisfies Record<string, ReactElement>;

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: IconName;
  size?: number;
  /** Libellé accessible. Sans libellé, l'icône est décorative (aria-hidden). */
  label?: string;
}

export function Icon({ name, size = 24, label, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
