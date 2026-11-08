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

/** En-tête de section centré : étiquette, titre, phrase d'accroche. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[680px] text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display mt-5 text-[clamp(30px,3.8vw,46px)] font-extrabold leading-[1.08] tracking-[-1.2px]"
      >
        {title}
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
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
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
        <h1
          className="anim-rise font-display mt-4 text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.04] tracking-[-1.4px]"
          style={delay(90)}
        >
          {title}
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
