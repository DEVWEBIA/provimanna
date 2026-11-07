'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@repas/ui';
import { href } from '@/lib/site';

export interface MobileMenuProps {
  links: { href: string; label: string }[];
  loginHref: string;
}

/** Menu plein écran mobile (maquette MSite). Échap ferme, le focus revient sur le bouton. */
export function MobileMenu({ links, loginHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = openBtn.current;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={openBtn}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="grid h-11 w-11 place-items-center rounded-[12px] border border-white/30 text-white md:hidden"
      >
        <Icon name="menu" size={22} />
      </button>
      {open ? (
        <div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bg-raw-encre fixed inset-0 z-50 flex flex-col gap-1.5 px-5 py-4 text-white"
        >
          <div className="flex justify-end">
            <button
              ref={closeBtn}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="h-11 w-11 rounded-[12px] border border-white/30 text-[22px] font-black"
            >
              ×
            </button>
          </div>
          <nav aria-label="Menu mobile" className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={href(l.href)}
                onClick={() => setOpen(false)}
                className="font-display py-2.5 text-[32px] font-extrabold text-white no-underline"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={href(loginHref)}
              onClick={() => setOpen(false)}
              className="text-site-on-brand mt-4 py-2.5 text-[18px] font-extrabold no-underline"
            >
              Se connecter
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
