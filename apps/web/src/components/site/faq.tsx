/** FAQ en <details> natif : accessible au clavier, sans JavaScript, contenu indexable. */
export function Faq({
  items,
  title = 'Questions fréquentes',
}: {
  items: { q: string; a: string }[];
  title?: string;
}) {
  return (
    <section aria-labelledby="faq-titre" className="mx-auto max-w-[720px] px-6 py-16">
      <h2
        id="faq-titre"
        className="font-display mb-8 text-center text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[1.1] tracking-[-1px]"
      >
        {title}
      </h2>
      <div className="border-line border-t">
        {items.map((item, i) => (
          <details key={item.q} open={i === 0} className="border-line group border-b">
            <summary className="text-ink hover:bg-site-hover flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-2 py-[18px] text-[18px] font-extrabold [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 text-[18px] font-extrabold">{item.q}</h3>
              <span aria-hidden="true" className="text-brand text-[26px] font-semibold">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="text-site-answer max-w-[720px] px-2 pb-[22px] text-[17px] leading-[27px]">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
