'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { Button, cx } from '@repas/ui';
import { webmailUrl } from '@/lib/auth/webmail';
import { href, ROUTES } from '@/lib/site';
import { requestLink, signInWithProvider, verifyCode, type AuthFormState } from './actions';

type Mode = 'connexion' | 'inscription';

const COPY: Record<
  Mode,
  { heading: string; sub: string; cta: string; switchText: string; switchCta: string }
> = {
  connexion: {
    heading: 'Content de te revoir.',
    sub: 'Ton plan de la semaine est peut-être déjà prêt.',
    cta: 'Recevoir mon lien de connexion',
    switchText: 'Pas encore de compte ?',
    switchCta: 'Créer un compte',
  },
  inscription: {
    heading: 'Crée ton compte.',
    sub: '14 jours de Premium offerts, sans carte bancaire.',
    cta: 'Créer mon compte',
    switchText: 'Déjà un compte ?',
    switchCta: 'Se connecter',
  },
};

const socialClass =
  'flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-pill border-2 border-line bg-surface-0 text-[16px] font-extrabold text-ink hover:border-brand';

function ProviderButton({
  provider,
  suite,
  onResult,
}: {
  provider: 'google' | 'apple';
  suite: string;
  onResult: (s: AuthFormState) => void;
}) {
  const [state, action, pending] = useActionState(signInWithProvider, { status: 'idle' });
  useEffect(() => onResult(state), [state, onResult]);
  return (
    <form action={action}>
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="suite" value={suite} />
      <button type="submit" className={socialClass} disabled={pending}>
        {provider === 'google' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12h6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
        {provider === 'google' ? 'Continuer avec Google' : 'Continuer avec Apple'}
      </button>
    </form>
  );
}

export interface ConnexionFormProps {
  initialMode: Mode;
  initialEmail: string;
  suite: string;
  linkError: boolean;
}

export function ConnexionForm({ initialMode, initialEmail, suite, linkError }: ConnexionFormProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [linkState, sendLink, sending] = useActionState(requestLink, { status: 'idle' });
  const [codeState, sendCode, verifying] = useActionState(verifyCode, { status: 'idle' });
  const [providerState, setProviderState] = useState<AuthFormState>({ status: 'idle' });
  const [editing, setEditing] = useState(false);
  const [now, setNow] = useState(0);

  const sent = linkState.status === 'sent' && !editing;
  const sentAt = linkState.status === 'sent' ? linkState.sentAt : 0;
  // Le renvoi devient possible 30 s après l'envoi (limite réelle côté Supabase, pas un faux compte à rebours).
  useEffect(() => {
    if (!sentAt) return;
    const t = setTimeout(() => setNow(Date.now()), Math.max(0, sentAt + 30_000 - Date.now()));
    return () => clearTimeout(t);
  }, [sentAt]);
  const canResend = sentAt > 0 && now >= sentAt + 30_000;

  const email =
    linkState.status === 'sent'
      ? linkState.email
      : linkState.status === 'error'
        ? (linkState.email ?? initialEmail)
        : initialEmail;
  const fieldError = (f: string) =>
    linkState.status === 'error' && linkState.field === f ? linkState.message : null;

  if (sent) {
    const webmail = webmailUrl(email);
    const codeError = codeState.status === 'error' ? codeState.message : null;
    return (
      <div>
        <div className="bg-saving-soft text-saving-ink mb-6 grid h-[72px] w-[72px] place-items-center rounded-[22px]">
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
        <h1 className="font-display text-[clamp(36px,3.6vw,52px)] font-extrabold leading-none tracking-[-1.6px]">
          Regarde tes emails.
        </h1>
        <p className="text-ink-muted mb-7 mt-3.5 text-[18px] leading-[27px]" role="status">
          On a envoyé un lien de connexion à <strong className="text-ink">{email}</strong>. Il est valable 15
          minutes.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {webmail ? (
            <a
              href={webmail}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill bg-brand text-brand-on flex min-h-[54px] flex-[1_1_180px] items-center justify-center font-black no-underline"
            >
              Ouvrir ma messagerie
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-pill border-line bg-surface-0 text-ink min-h-[54px] flex-[1_1_160px] border-2 text-[16px] font-extrabold"
          >
            Changer d’adresse
          </button>
        </div>

        <form action={sendCode} className="mt-8">
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
              className={cx(
                'bg-surface-0 box-border min-h-[56px] min-w-0 flex-1 rounded-[16px] border-2 px-[18px] text-[20px] font-extrabold tabular-nums tracking-[4px]',
                codeError ? 'border-danger' : 'border-line',
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

        <form action={sendLink} className="text-ink-muted mt-[22px] text-[14px]">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="mode" value="connexion" />
          <input type="hidden" name="suite" value={suite} />
          Rien reçu ? Regarde dans les spams, ou{' '}
          <button
            type="submit"
            disabled={!canResend || sending}
            className="text-brand disabled:text-ink-muted bg-transparent px-0.5 py-2 text-[14px] font-black underline disabled:no-underline"
          >
            renvoie le lien
          </button>{' '}
          dans 30 secondes.
        </form>
      </div>
    );
  }

  const c = COPY[mode];
  const globalError =
    (linkState.status === 'error' && linkState.field === 'global' && linkState.message) ||
    (providerState.status === 'error' && providerState.message) ||
    (linkError && linkState.status === 'idle'
      ? 'Ce lien a expiré ou a déjà servi. Demande-en un nouveau.'
      : null);
  const emailError = fieldError('email');
  const cguError = fieldError('cgu');

  return (
    <div>
      <h1 className="font-display text-[clamp(36px,3.6vw,52px)] font-extrabold leading-none tracking-[-1.6px]">
        {c.heading}
      </h1>
      <p className="text-ink-muted mb-8 mt-3.5 text-[18px] leading-[27px]">{c.sub}</p>
      {globalError ? (
        <p
          role="alert"
          className="bg-danger-soft text-danger-ink mb-5 rounded-[16px] px-4 py-3 text-[15px] font-bold"
        >
          {globalError}
        </p>
      ) : null}
      <div className="flex flex-col gap-2.5">
        <ProviderButton provider="google" suite={suite} onResult={setProviderState} />
        <ProviderButton provider="apple" suite={suite} onResult={setProviderState} />
      </div>
      <div className="text-ink-muted my-6 flex items-center gap-3.5 text-[14px] font-extrabold">
        <span className="bg-line h-px flex-1" />
        ou par email
        <span className="bg-line h-px flex-1" />
      </div>
      <form action={sendLink} noValidate onSubmit={() => setEditing(false)}>
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="suite" value={suite} />
        <label htmlFor="mail" className="mb-2 block text-[15px] font-black">
          Adresse email
        </label>
        <input
          id="mail"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={email}
          placeholder="ton@email.fr"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'mail-err' : undefined}
          className={cx(
            'bg-surface-0 text-ink box-border min-h-[56px] w-full rounded-[16px] border-2 px-[18px] text-[17px] font-bold',
            emailError ? 'border-danger' : 'border-line',
          )}
        />
        {emailError ? (
          <p id="mail-err" role="alert" className="text-danger mt-2 text-[14px] font-extrabold">
            {emailError}
          </p>
        ) : null}
        {mode === 'inscription' ? (
          <>
            <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] leading-[21px]">
              <input
                type="checkbox"
                name="cgu"
                aria-invalid={cguError ? true : undefined}
                className="accent-brand mt-px h-5 w-5 shrink-0"
              />
              <span>
                J’accepte les{' '}
                <Link href={href('/cgu')} className="text-brand underline">
                  conditions d’utilisation
                </Link>{' '}
                et la{' '}
                <Link href={href(ROUTES.confidentialite)} className="text-brand underline">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>
            {cguError ? (
              <p role="alert" className="text-danger mt-2 text-[14px] font-extrabold">
                {cguError}
              </p>
            ) : null}
          </>
        ) : null}
        <Button type="submit" className="mt-5 min-h-[58px] w-full text-[17px]" disabled={sending}>
          {c.cta}
        </Button>
        <p className="text-ink-muted mt-3.5 text-center text-[14px]">
          Pas de mot de passe : on t’envoie un lien de connexion.
        </p>
      </form>
      <p className="mt-7 text-center text-[15px] font-bold">
        {c.switchText}{' '}
        <button
          type="button"
          onClick={() => setMode(mode === 'inscription' ? 'connexion' : 'inscription')}
          className="text-brand bg-transparent px-1 py-2 text-[15px] font-black underline"
        >
          {c.switchCta}
        </button>
      </p>
    </div>
  );
}
