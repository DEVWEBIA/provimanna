import type { ReactNode } from 'react';
import Link from 'next/link';
import { animDelay, Eyebrow, Glow, TicketCard } from '@repas/ui';
import { href, ROUTES } from '@/lib/site';

/** En-tête des pages éditoriales : étiquette, question en titre, réponse directe chiffrée et datée. */
export function SeoHero({
  eyebrow,
  title,
  answer,
  meta,
  badge,
}: {
  eyebrow: string;
  title: ReactNode;
  answer: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <section className="max-w-[820px]">
      <div className="anim-rise flex flex-wrap items-center gap-2">
        <Eyebrow>{eyebrow}</Eyebrow>
        {badge}
      </div>
      <h1
        className="anim-rise font-display mt-5 text-[clamp(38px,5vw,60px)] font-extrabold leading-[1.03] tracking-[-1.6px]"
        style={animDelay(80)}
      >
        {title}
      </h1>
      <p className="anim-rise text-ink-muted mt-5 text-[19px] leading-[29px]" style={animDelay(160)}>
        {answer}
      </p>
      {meta ? (
        <p className="anim-rise text-ink-muted mt-4 text-[14px] font-bold" style={animDelay(220)}>
          {meta}
        </p>
      ) : null}
    </section>
  );
}

/** Étiquette « Données d'exemple » tant que des prix de démonstration entrent dans les totaux. */
export const DemoBadge = () => (
  <span className="rounded-pill bg-saving-soft text-notice-ink px-3 py-1 text-[12px] font-black">
    Données d’exemple
  </span>
);

/** Carte de section (fond verre). */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`border-line rounded-[28px] border bg-white/75 p-[clamp(20px,3vw,32px)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}

export const H2 = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h2
    id={id}
    className="font-display text-[clamp(26px,3vw,34px)] font-extrabold leading-[1.1] tracking-[-0.8px]"
  >
    {children}
  </h2>
);

/** Appel final : ticket aubergine, comme la page d'accueil. */
export function CtaTicket({
  title,
  text,
  label = 'Créer mon plan gratuit',
}: {
  title: string;
  text?: string;
  label?: string;
}) {
  return (
    <TicketCard
      edge="surface-50"
      tone="brand"
      className="relative isolate flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-t-[32px] px-[clamp(24px,4vw,48px)] pb-12 pt-9"
    >
      <Glow className="-left-16 -top-20 h-64 w-64 bg-white/20" />
      <div>
        <h2 className="font-display text-[clamp(26px,3vw,36px)] font-extrabold tracking-[-0.8px]">{title}</h2>
        {text ? <p className="text-site-lilac mt-2 text-[16px]">{text}</p> : null}
      </div>
      <Link
        href={href(ROUTES.commencer)}
        className="rounded-pill text-brand inline-flex min-h-14 items-center gap-3 bg-white px-7 text-[17px] font-black no-underline transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        {label} <span aria-hidden="true">→</span>
      </Link>
    </TicketCard>
  );
}
