import { cx } from '@repas/ui';
import { ROUTES } from '@/lib/site';

export interface EmailCtaFormProps {
  id: string;
  label: string;
  /** Variante visuelle : hero (sur aubergine) ou final (sur orange). */
  tone: 'hero' | 'final';
  className?: string;
}

/**
 * Formulaire email → page de connexion pré-remplie (lien magique au lot 4).
 * Sans JavaScript : simple GET, donc fonctionne partout.
 */
export function EmailCtaForm({ id, label, tone, className }: EmailCtaFormProps) {
  const hero = tone === 'hero';
  return (
    <form action={ROUTES.connexion} method="get" className={cx('flex flex-wrap gap-2.5', className)}>
      <label htmlFor={id} className="sr-only">
        Ton adresse email
      </label>
      <input
        id={id}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="ton@email.fr"
        className={cx(
          'rounded-pill text-raw-encre placeholder:text-ink-muted box-border flex-[1_1_240px] bg-white px-[22px] text-[17px] font-semibold',
          hero ? 'min-h-14 border-2 border-transparent' : 'border-raw-encre min-h-[58px] border-2',
        )}
      />
      <button
        type="submit"
        className={cx(
          'rounded-pill px-7 text-[17px] font-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2',
          hero
            ? 'bg-saving text-raw-encre min-h-14 focus-visible:outline-white'
            : 'bg-raw-encre focus-visible:outline-raw-encre min-h-[58px] text-white',
        )}
      >
        {label}
      </button>
    </form>
  );
}
