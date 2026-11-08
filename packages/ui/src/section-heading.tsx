import type { ReactNode } from 'react';
import { cx } from './cx.ts';
import { animDelay as delay } from './surface.tsx';

/** Étiquette en pastille au-dessus d'un titre (« Comment ça marche », « Semaine 46 »…). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cx(
        'rounded-pill border-line text-ink-muted inline-flex border bg-white/70 px-3.5 py-1 text-[12px] font-black uppercase tracking-[1.2px] backdrop-blur',
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Titre avec accent typographique : le dernier mot (ou `accent`, une fin de titre) en serif italique.
 * Automatique pour un titre en texte d'au moins 2 mots, sauf si ce mot contient un chiffre.
 * `animate` : chaque mot monte de sous la ligne, en cascade (titres en haut de page).
 */
export function AccentTitle({
  title,
  accent,
  animate = false,
  baseDelay = 0,
}: {
  title: ReactNode;
  accent?: string | false;
  animate?: boolean;
  baseDelay?: number;
}) {
  if (typeof title !== 'string') return <>{title}</>;
  // Ponctuation isolée (« ? », « ! », « : ») rattachée au mot précédent.
  const words = title.split(' ').reduce<string[]>((acc, w) => {
    if (/^[?!:;»]+$/.test(w) && acc.length) acc[acc.length - 1] += ` ${w}`;
    else acc.push(w);
    return acc;
  }, []);
  let accentFrom = words.length;
  if (typeof accent === 'string' && title.endsWith(accent)) {
    accentFrom = words.length - accent.split(' ').filter((w) => !/^[?!:;»]+$/.test(w)).length;
  } else if (accent === undefined && words.length >= 2 && !/\d/.test(words.at(-1)!)) {
    accentFrom = words.length - 1;
  }
  return (
    <>
      {words.map((w, i) => {
        const accented = i >= accentFrom;
        const word = (
          <span className={cx('whitespace-nowrap', accented && 'font-accent text-brand')}>{w}</span>
        );
        const space = i < words.length - 1 ? ' ' : null;
        return animate ? (
          <span key={i}>
            <span className="anim-word-mask">
              <span className="anim-word" style={delay(baseDelay + i * 55)}>
                {word}
              </span>
            </span>
            {space}
          </span>
        ) : (
          <span key={i}>
            {word}
            {space}
          </span>
        );
      })}
    </>
  );
}

/** En-tête de section centré : étiquette, titre, phrase d'accroche. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  accent,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Fin du titre en serif italique (automatique : dernier mot), `false` pour aucune. */
  accent?: string | false;
}) {
  return (
    <div className="mx-auto max-w-[680px] text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display mt-5 text-[clamp(30px,3.8vw,46px)] font-extrabold leading-[1.08] tracking-[-1.2px]"
      >
        <AccentTitle title={title} accent={accent} />
      </h2>
      {lead ? <p className="text-ink-muted mt-4 text-[18px] leading-7">{lead}</p> : null}
    </div>
  );
}

/**
 * En-tête de page (espace client, back-office) : étiquette, grand titre, phrase, actions.
 * Entrée animée en cascade comme le hero de la page d'accueil.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
  className,
  accent,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Fin du titre en serif italique (automatique : dernier mot), `false` pour aucune. */
  accent?: string | false;
  lead?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cx('flex flex-wrap items-end justify-between gap-x-8 gap-y-5', className)}>
      <div className="min-w-0 flex-[1_1_420px]">
        {eyebrow ? (
          <div className="anim-rise" style={delay(0)}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        <h1 className="font-display mt-4 text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.04] tracking-[-1.4px]">
          {typeof title === 'string' ? (
            <AccentTitle title={title} accent={accent} animate baseDelay={90} />
          ) : (
            <span className="anim-rise block" style={delay(90)}>
              {title}
            </span>
          )}
        </h1>
        {lead ? (
          <p className="anim-rise text-ink-muted mt-3 max-w-[560px] text-[18px] leading-7" style={delay(180)}>
            {lead}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="anim-rise flex flex-wrap items-center gap-3" style={delay(260)}>
          {actions}
        </div>
      ) : null}
    </header>
  );
}
