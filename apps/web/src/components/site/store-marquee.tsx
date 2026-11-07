import { StoreChip } from '@repas/ui';
import type { ExampleStore } from '@/lib/landing-data';

/** Bandeau défilant des 6 enseignes (pastilles neutres, jamais de logo). Figé si mouvement réduit. */
export function StoreMarquee({ stores }: { stores: ExampleStore[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {[...stores, ...stores].map((s, i) => (
        <li key={`${s.id}-${i}`} className="text-[18px]">
          <StoreChip storeId={s.id} name={s.name} initials={s.initials} />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Enseignes comparées" className="py-10">
      <p className="text-ink-muted text-center text-[12px] font-black uppercase tracking-[1.4px]">
        6 enseignes comparées à chaque plan
      </p>
      <p className="sr-only">{stores.map((s) => s.name).join(', ')}</p>
      <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex w-max motion-reduce:animate-none" aria-hidden="true">
          {row(true)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
