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
  // Questionnaire et préférences (08/11/2026)
  retour: <path d="M15 5l-7 7 7 7" />,
  recherche: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  lune: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  soleil: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  idee: (
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  ),
  tirelire: (
    <>
      <path d="M5 11a7 6 0 0 1 12-3h2l-1 3 2 1v3l-2 1-1 3h-3v-2H9v2H6l-1-3a6 6 0 0 1 0-5z" />
      <path d="M12 4.5a2 2 0 1 1 2.5 1.9M15 11h.01" />
    </>
  ),
  feuille: <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8" />,
  eclair: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  toque: <path d="M7 14a4 4 0 0 1-1-7.9A5 5 0 0 1 12 3a5 5 0 0 1 6 3.1A4 4 0 0 1 17 14v6H7zM7 17h10" />,
  monde: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.5 5.7 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-5.7-3.5-9s1-6.3 3.5-9z" />
    </>
  ),
  pousse: <path d="M12 21v-9M12 12C12 7 9 5 4 5c0 5 3 7 8 7zM12 14c0-4 2.5-6 7-6 0 4-2.5 6-7 6z" />,
  balance: <path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z" />,
  four: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 8h18M7 5.5h.01M10 5.5h.01" />
      <rect x="7" y="11" width="10" height="6" rx="1" />
    </>
  ),
  plaques: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="2.5" />
      <circle cx="15.5" cy="8.5" r="2.5" />
      <circle cx="8.5" cy="15.5" r="2.5" />
      <circle cx="15.5" cy="15.5" r="2.5" />
    </>
  ),
  airfryer: (
    <>
      <path d="M6 21h12a1 1 0 0 0 1-1V9a7 7 0 0 0-14 0v11a1 1 0 0 0 1 1z" />
      <path d="M8 17h8M12 8v3" />
    </>
  ),
  poisson: (
    <>
      <path d="M3 12c3-4 7-5 11-5 3 0 5 2 7 5-2 3-4 5-7 5-4 0-8-1-11-5zM3 12l-1-4M3 12l-1 4" />
      <path d="M16 11h.01" />
    </>
  ),
  ble: (
    <path d="M12 21V9M12 13c-3 0-4-2-4-4 3 0 4 2 4 4zM12 13c3 0 4-2 4-4-3 0-4 2-4 4zM12 9c-2.5 0-3.5-2-3.5-4 2.5 0 3.5 2 3.5 4zM12 9c2.5 0 3.5-2 3.5-4-2.5 0-3.5 2-3.5 4zM4 4l16 16" />
  ),
  goutte: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11zM4 4l16 16" />,
  piment: <path d="M15 6c-3 0-4 3-5 6s-3 6-7 7c6 1 12-2 13-7 .5-2.5 0-4.5-1-6zM15 6c0-2 1-3 3-3" />,
  noix: (
    <>
      <path d="M12 3c4 0 7 3.5 7 9s-3 9-7 9-7-3.5-7-9 3-9 7-9zM12 3v18" />
      <path d="M8 9c1 .5 2 .5 3 0M13 13c1 .5 2 .5 3 0" />
    </>
  ),
  croissant: <path d="M4 15c0-6 4-10 8-10s8 4 8 10M4 15h16M4 15l2 3h12l2-3M9 10l1 5M15 10l-1 5" />,
  bouclier: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  pieces: (
    <>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7M3 11v4c0 1.7 2.7 3 6 3 1 0 2-.1 2.8-.4" />
      <circle cx="17" cy="16" r="4" />
    </>
  ),
  poubelle: <path d="M4 7h16M10 3h4M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  interdit: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </>
  ),
  personnes: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c1-3.5 3.6-5 7-5s6 1.5 7 5M16 4a3.5 3.5 0 0 1 0 7M18 15c2 .7 3.3 2.3 4 5" />
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
