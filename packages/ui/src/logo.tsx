import { APP_NAME } from './brand.ts';
import { cx } from './cx.ts';

/** Marque provisoire (logo définitif : point ouvert). */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <rect x="5" y="3" width="24" height="28" rx="5" className="fill-brand" />
      <path
        d="M10 11h14M10 16h10M10 21h7"
        className="stroke-brand-on"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="23" r="3.2" className="fill-saving" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('text-brand inline-flex items-center gap-2.5 text-[17px] font-black', className)}>
      <LogoMark />
      {APP_NAME}
    </span>
  );
}
