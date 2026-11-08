'use client';

import { useActionState, useEffect, useState } from 'react';
import { animDelay, Button, buttonClasses, inputClasses } from '@repas/ui';
import { requestLink, verifyCode, type AuthFormState } from '@/app/connexion/actions';
import { webmailUrl } from '@/lib/auth/webmail';

export interface EmailSentProps {
  email: string;
  suite: string;
  sentAt: number;
  onChangeEmail: () => void;
}

/** « Regarde tes emails. » : lien envoyé, saisie du code à 6 chiffres, renvoi après 30 s. */
export function EmailSent({ email, suite, sentAt: firstSentAt, onChangeEmail }: EmailSentProps) {
  const [codeState, sendCode, verifying] = useActionState(verifyCode, { status: 'idle' } as AuthFormState);
  const [resendState, resend, resending] = useActionState(requestLink, { status: 'idle' } as AuthFormState);
  const [now, setNow] = useState(0);

  const sentAt = resendState.status === 'sent' ? resendState.sentAt : firstSentAt;
  // Renvoi possible 30 s après l'envoi (limite réelle côté Supabase, pas un faux compte à rebours).
  useEffect(() => {
    const t = setTimeout(() => setNow(Date.now()), Math.max(0, sentAt + 30_000 - Date.now()));
    return () => clearTimeout(t);
  }, [sentAt]);
  const canResend = now >= sentAt + 30_000;

  const webmail = webmailUrl(email);
  const codeError = codeState.status === 'error' ? codeState.message : null;

  return (
    <div>
      <div className="anim-ticket bg-saving-soft text-saving-ink mb-6 grid h-[72px] w-[72px] place-items-center rounded-[22px] shadow-[0_12px_30px_rgba(238,122,48,0.25)]">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </div>
      <h1 className="anim-line font-display text-[clamp(36px,3.6vw,52px)] font-extrabold leading-none tracking-[-1.6px]">
        <span style={animDelay(120)}>Regarde tes emails.</span>
      </h1>
      <p
        className="anim-rise text-ink-muted mb-7 mt-3.5 text-[18px] leading-[27px]"
        style={animDelay(220)}
        role="status"
      >
        On a envoyé un lien de connexion à <strong className="text-ink">{email}</strong>. Il est valable 15
        minutes.
      </p>
      <div className="anim-rise flex flex-wrap gap-2.5" style={animDelay(320)}>
        {webmail ? (
          <a
            href={webmail}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('primary', 'md', 'min-h-[54px] flex-[1_1_180px] no-underline')}
          >
            Ouvrir ma messagerie
          </a>
        ) : null}
        <button
          type="button"
          onClick={onChangeEmail}
          className={buttonClasses('neutral', 'md', 'min-h-[54px] flex-[1_1_160px] bg-white/80')}
        >
          Changer d’adresse
        </button>
      </div>

      <form action={sendCode} className="anim-rise mt-8" style={animDelay(420)}>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="suite" value={suite} />
        <label htmlFor="code" className="mb-2 block text-[15px] font-black">
          Ou saisis le code reçu
        </label>
        <div className="flex gap-2.5">
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="482 913"
            aria-invalid={codeError ? true : undefined}
            aria-describedby={codeError ? 'code-err' : undefined}
            className={inputClasses(
              Boolean(codeError),
              'min-h-[56px] w-auto min-w-0 flex-1 px-[18px] text-[20px] font-extrabold tabular-nums tracking-[4px]',
            )}
          />
          <Button type="submit" variant="secondary" disabled={verifying}>
            Valider
          </Button>
        </div>
        {codeError ? (
          <p id="code-err" role="alert" className="text-danger mt-2 text-[14px] font-extrabold">
            {codeError}
          </p>
        ) : null}
      </form>

      <form action={resend} className="text-ink-muted mt-[22px] text-[14px]">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="mode" value="connexion" />
        <input type="hidden" name="suite" value={suite} />
        Rien reçu ? Regarde dans les spams, ou{' '}
        <button
          type="submit"
          disabled={!canResend || resending}
          className="text-brand disabled:text-ink-muted bg-transparent px-0.5 py-2 text-[14px] font-black underline disabled:no-underline"
        >
          renvoie le lien
        </button>{' '}
        dans 30 secondes.
      </form>
    </div>
  );
}
