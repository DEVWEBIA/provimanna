import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from './cx.ts';

/** Classes d'un champ de saisie (verre clair, anneau de focus aubergine). */
export function inputClasses(error?: boolean, className?: string) {
  return cx(
    'bg-white/85 text-ink placeholder:text-ink-muted focus:border-brand box-border min-h-[52px] w-full rounded-[16px] border-2 px-4 text-[16px] font-bold backdrop-blur transition-[border-color,box-shadow] focus:shadow-[0_0_0_4px_theme(colors.brand.soft)] focus:outline-none motion-reduce:transition-none dark:bg-surface-0',
    error ? 'border-danger' : 'border-line',
    className,
  );
}

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Libellé toujours visible (affiché en surtitre). */
  label: ReactNode;
  /** Message d'erreur : dit quoi corriger. */
  error?: string | undefined;
  hint?: ReactNode;
  id?: string;
}

export function Field({ label, error, hint, id, className, ...rest }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = [error ? `${inputId}-err` : null, hint ? `${inputId}-hint` : null]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="text-ink-muted mb-2 block text-[12px] font-black uppercase tracking-[0.8px]"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={inputClasses(Boolean(error))}
        {...rest}
      />
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-ink-muted mt-1.5 text-[13px] font-bold">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-err`} className="text-danger mt-1.5 text-[13px] font-extrabold">
          {error}
        </p>
      ) : null}
    </div>
  );
}
