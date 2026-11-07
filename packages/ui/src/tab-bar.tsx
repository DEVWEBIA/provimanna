import { cx } from './cx.ts';
import { Icon } from './icons.tsx';
import { DefaultLink, type LinkComponent } from './link.tsx';
import { TAB_NAV, type AppSection } from './nav.ts';

export interface TabBarProps {
  active: AppSection;
  Link?: LinkComponent;
  className?: string;
}

/** Barre d'onglets mobile (5 entrées), maquette MTabBar. */
export function TabBar({ active, Link = DefaultLink, className }: TabBarProps) {
  return (
    <nav
      aria-label="Navigation"
      className={cx(
        'border-line bg-surface-0 grid grid-cols-5 border-t px-1.5 pb-[max(18px,env(safe-area-inset-bottom))] pt-2',
        className,
      )}
    >
      {TAB_NAV.map((t) => {
        const on = t.id === active;
        return (
          <Link
            key={t.id}
            href={t.href}
            aria-current={on ? 'page' : undefined}
            className={cx(
              'min-h-tap flex flex-col items-center gap-[3px] text-[11px] font-black no-underline',
              on ? 'text-brand' : 'text-ink-muted',
            )}
          >
            <span className={cx('rounded-pill grid h-8 w-[52px] place-items-center', on && 'bg-brand-soft')}>
              <Icon name={t.icon} size={22} />
            </span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
