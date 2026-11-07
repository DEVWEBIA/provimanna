import type { ReactNode } from 'react';

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
      <p className="rounded-pill border-line text-ink-muted inline-flex border bg-white/70 px-3.5 py-1 text-[12px] font-black uppercase tracking-[1.2px]">
        {eyebrow}
      </p>
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
