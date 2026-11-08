'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { cx, NavIndicator } from '@repas/ui';

export interface BoNavItem {
  href: string;
  label: string;
  badge?: number;
}

/** Navigation latérale du back-office : rubrique active surlignée, compteurs « à traiter ». */
/** `group` : identifiant de la barre (latérale ou mobile), pour que chaque barre ait son propre indicateur. */
export function BoNav({ items, group = 'bo' }: { items: BoNavItem[]; group?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Back-office" className="flex flex-col gap-0.5">
      {items.map((it) => {
        const on = it.href === '/' ? pathname === '/' : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href as Route}
            aria-current={on ? 'page' : undefined}
            className={cx(
              'relative isolate flex min-h-[42px] items-center gap-3 rounded-[12px] px-3 text-[14px] font-bold no-underline transition-colors',
              on ? 'text-white' : 'text-site-on-ink hover:bg-white/[0.06] hover:text-white',
            )}
          >
            {on ? <NavIndicator group={group} className="rounded-[12px] bg-white/[0.12]" /> : null}
            <span className="flex-1">{it.label}</span>
            {it.badge ? (
              <span className="rounded-pill bg-saving text-raw-encre px-2 py-px text-[12px] font-black tabular-nums">
                <span className="sr-only">à traiter : </span>
                {it.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
