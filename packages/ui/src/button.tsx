import type { ButtonHTMLAttributes } from 'react';
import { cx } from './cx.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'neutral' | 'saving' | 'link' | 'danger';
export type ButtonSize = 'md' | 'sm';

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed';

const VARIANTS: Record<ButtonVariant, string> = {
  // Un seul bouton « primary » par écran.
  primary:
    'rounded-pill bg-brand px-[26px] font-black text-brand-on shadow-[0_10px_30px_rgba(107,56,104,0.30)] hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:bg-disabled disabled:text-disabled-ink disabled:shadow-none',
  secondary:
    'rounded-pill border-2 border-brand bg-surface-0 px-6 font-black text-brand hover:bg-brand-soft disabled:border-disabled disabled:text-disabled-ink',
  neutral:
    'rounded-pill border-2 border-line bg-surface-0 px-[22px] font-extrabold text-ink hover:border-brand disabled:text-disabled-ink',
  // Orange = économies uniquement, toujours avec un texte foncé.
  saving:
    'rounded-pill bg-saving px-6 font-black text-raw-encre hover:opacity-90 disabled:bg-disabled disabled:text-disabled-ink',
  link: 'rounded-pill bg-transparent px-[18px] font-black text-brand underline hover:text-ink disabled:text-disabled-ink',
  danger:
    'rounded-[10px] border border-danger-line bg-surface-0 px-4 text-[14px] font-black text-danger hover:bg-danger-soft',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-[52px] text-[16px]',
  sm: 'min-h-tap text-[14px]',
};

/** Classes d'un bouton, pour styler un lien (`<a>`, `next/link`) comme un bouton. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cx(BASE, VARIANTS[variant], variant === 'danger' ? 'min-h-tap' : SIZES[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...rest} />;
}
