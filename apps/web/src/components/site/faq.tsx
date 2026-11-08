import { SectionHeading } from '@repas/ui';

/** FAQ en <details> natif : accessible au clavier, sans JavaScript, contenu indexable. */
export function Faq({
  items,
  title = 'Tes questions, nos réponses.',
  eyebrow = 'Questions fréquentes',
  className = 'px-6 pb-24 md:pb-32',
}: {
  items: { q: string; a: string }[];
  title?: string;
  eyebrow?: string;
  /** Marges extérieures (la page d'accueil aère davantage). */
  className?: string;
}) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-titre"
      className={`mx-auto w-full max-w-[760px] scroll-mt-24 ${className}`}
    >
      <SectionHeading id="faq-titre" eyebrow={eyebrow} title={title} />
      <div className="mt-12 flex flex-col gap-3">
        {items.map((item, i) => (
          <details
            key={item.q}
            open={i === 0}
            className="border-line group rounded-[20px] border bg-white/70 px-5 shadow-[0_2px_14px_rgba(42,26,40,0.04)] open:bg-white"
          >
            <summary className="text-ink flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 text-[17px] font-extrabold">{item.q}</h3>
              <span
                aria-hidden="true"
                className="rounded-pill bg-brand-soft text-brand grid h-8 w-8 shrink-0 place-items-center text-[20px] font-bold transition-transform group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <p className="text-site-answer max-w-[640px] pb-5 text-[16px] leading-[26px]">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
