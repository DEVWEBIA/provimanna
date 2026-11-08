'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { cx } from '@repas/ui';

export interface BoNavItem {
  href: string;
  label: string;
  badge?: number;
}

/** Navigation latérale du back-office : rubrique active surlignée, compteurs « à traiter ». */
export function BoNav({ items }: { items: BoNavItem[] }) {
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
              'flex min-h-[42px] items-center gap-3 rounded-[12px] px-3 text-[14px] font-bold no-underline transition-colors',
              on ? 'bg-white/[0.12] text-white' : 'text-site-on-ink hover:bg-white/[0.06] hover:text-white',
            )}
          >
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
