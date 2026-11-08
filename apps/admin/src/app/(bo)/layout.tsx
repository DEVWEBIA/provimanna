import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Glow, LogoMark } from '@repas/ui';
import { BoNav } from '@/components/bo-nav';
import { canAccess, getStaff, ROLE_LABEL, SECTIONS } from '@/lib/staff';

/** Gabarit du back-office : session + rôle staff obligatoires, navigation filtrée par rôle. */
export default async function BoLayout({ children }: { children: ReactNode }) {
  const { supabase, user, role } = await getStaff();
  if (!role) redirect('/acces-refuse');
  // Compteurs « à traiter » (lus avec les droits du staff, RLS).
  const { count: aberrant } = canAccess(role, ['moderateur_prix'])
    ? await supabase
        .from('prices')
        .select('id', { count: 'exact', head: true })
        .eq('flagged_aberrant', true)
        .is('moderated_by', null)
    : { count: 0 };
  const name = String(user.user_metadata?.name ?? user.email ?? 'Staff');
  const items = SECTIONS.filter((s) => canAccess(role, s.roles)).map((s) => ({
    href: s.href,
    label: s.label,
    badge: s.href === '/prix' ? (aberrant ?? 0) : undefined,
  }));
  return (
    <div className="bg-surface-50 relative isolate flex min-h-screen overflow-x-clip">
      <Glow className="bg-raw-aubergine-clair -top-24 left-[30%] h-96 w-96" />
      <Glow className="bg-raw-peche right-0 top-[40vh] h-80 w-80 opacity-60" />
      <aside className="bg-raw-encre sticky top-0 flex h-screen w-[240px] shrink-0 flex-col gap-6 px-3 py-5 max-md:hidden">
        <p className="flex items-center gap-2.5 px-2 text-[15px] font-black text-white">
          <LogoMark size={26} tone="onBrand" />
          Back-office
        </p>
        <BoNav items={items} />
        <div className="mt-auto flex items-center gap-3 rounded-[14px] bg-white/[0.06] p-3">
          <span className="rounded-pill bg-brand grid h-9 w-9 shrink-0 place-items-center text-[13px] font-black text-white">
            {name.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-black text-white">{name}</span>
            <span className="text-site-on-ink-faint block text-[12px] font-bold">{ROLE_LABEL[role]}</span>
          </span>
        </div>
        <form action="/auth/deconnexion" method="post">
          <button
            type="submit"
            className="text-site-on-ink-faint min-h-tap w-full px-2 text-left text-[13px] font-bold hover:text-white"
          >
            Se déconnecter
          </button>
        </form>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="bg-raw-encre px-4 py-3 md:hidden">
          <BoNav items={items} />
        </div>
        <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
