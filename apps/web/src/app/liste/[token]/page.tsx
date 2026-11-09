import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { weekRangeLabel } from '@repas/core';
import { animDelay, Glow, Logo, PageHeader } from '@repas/ui';
import { href, ROUTES } from '@/lib/site';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Liste de courses partagée',
  robots: { index: false, follow: false },
};

const sharedSchema = z.object({
  store: z.string(),
  week_start: z.string(),
  items: z.array(
    z.object({
      label: z.string(),
      quantity: z.string().nullable(),
      checked: z.boolean(),
      aisle: z.string(),
      position: z.number(),
    }),
  ),
});

type Params = Promise<{ token: string }>;

/** Liste partagée par lien : lecture seule, sans compte (fonction shared_list, migration 0006). */
export default async function SharedListPage({ params }: { params: Params }) {
  const { token } = await params;
  if (!/^[0-9a-f]{32,}$/.test(token)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.rpc('shared_list', { share: token });
  const parsed = sharedSchema.safeParse(data);
  if (!parsed.success) notFound();
  const list = parsed.data;
  const aisles = [...new Set(list.items.map((i) => i.aisle))];

  return (
    <div className="bg-surface-50 text-ink relative isolate min-h-screen overflow-x-clip font-sans">
      <Glow className="bg-raw-aubergine-clair -left-24 top-24 h-80 w-80" />
      <Glow className="bg-raw-peche right-0 top-1/2 h-72 w-72 opacity-70" />
      <main className="mx-auto flex max-w-[720px] flex-col gap-8 px-5 py-8">
        <Link href="/" className="anim-rise min-h-tap inline-flex items-center self-start no-underline">
          <Logo />
        </Link>
        <PageHeader
          eyebrow={`${weekRangeLabel(list.week_start)} · chez ${list.store}`}
          title="Liste de courses partagée"
          lead="Lecture seule : les cases se cochent dans l’appli de la personne qui t’a envoyé ce lien."
        />
        {aisles.map((aisle, i) => (
          <section
            key={aisle}
            className="anim-rise border-line overflow-hidden rounded-[22px] border bg-white/80 backdrop-blur"
            style={animDelay(200 + i * 80)}
          >
            <h2 className="bg-surface-50 px-5 py-3 text-[13px] font-black uppercase tracking-[1.2px]">
              {aisle}
            </h2>
            <ul>
              {list.items
                .filter((it) => it.aisle === aisle)
                .map((it) => (
                  <li
                    key={`${it.label}-${it.quantity}`}
                    className="border-line flex items-center gap-3 border-t px-5 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border-2 text-[12px] font-black ${it.checked ? 'border-brand bg-brand text-white' : 'border-line'}`}
                    >
                      {it.checked ? '✓' : ''}
                    </span>
                    <span
                      className={`flex-1 font-extrabold ${it.checked ? 'text-ink-muted line-through' : ''}`}
                    >
                      {it.label}{' '}
                      {it.quantity ? <span className="text-ink-muted font-bold">· {it.quantity}</span> : null}
                      <span className="sr-only">{it.checked ? ' (déjà pris)' : ''}</span>
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ))}
        <Link
          href={href(ROUTES.commencer)}
          className="rounded-pill bg-brand text-brand-on mx-auto inline-flex min-h-14 items-center gap-3 px-7 text-[17px] font-black no-underline shadow-[0_10px_30px_rgba(107,56,104,0.30)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
        >
          Créer mon plan gratuit <span aria-hidden="true">→</span>
        </Link>
      </main>
    </div>
  );
}
