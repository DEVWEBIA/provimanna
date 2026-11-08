'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { animDelay, Button, inputClasses } from '@repas/ui';
import { EmailSent } from '@/components/auth/email-sent';
import { href, ROUTES } from '@/lib/site';
import { requestLink, signInWithProvider, type AuthFormState } from './actions';

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
  'flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-pill border-2 border-line bg-white/80 text-[16px] font-extrabold text-ink backdrop-blur transition-[border-color,transform] hover:-translate-y-0.5 hover:border-brand motion-reduce:transition-none';

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
  const [providerState, setProviderState] = useState<AuthFormState>({ status: 'idle' });
  const [editing, setEditing] = useState(false);

  const sent = linkState.status === 'sent' && !editing;

  const email =
    linkState.status === 'sent'
      ? linkState.email
      : linkState.status === 'error'
        ? (linkState.email ?? initialEmail)
        : initialEmail;
  const fieldError = (f: string) =>
    linkState.status === 'error' && linkState.field === f ? linkState.message : null;

  if (sent && linkState.status === 'sent') {
    return (
      <EmailSent
        email={linkState.email}
        suite={suite}
        sentAt={linkState.sentAt}
        onChangeEmail={() => setEditing(true)}
      />
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
    <div key={mode}>
      <h1 className="anim-line font-display text-[clamp(36px,3.6vw,52px)] font-extrabold leading-none tracking-[-1.6px]">
        <span style={animDelay(80)}>{c.heading}</span>
      </h1>
      <p className="anim-rise text-ink-muted mb-8 mt-3.5 text-[18px] leading-[27px]" style={animDelay(180)}>
        {c.sub}
      </p>
      {globalError ? (
        <p
          role="alert"
          className="bg-danger-soft text-danger-ink mb-5 rounded-[16px] px-4 py-3 text-[15px] font-bold"
        >
          {globalError}
        </p>
      ) : null}
      <div className="anim-rise flex flex-col gap-2.5" style={animDelay(260)}>
        <ProviderButton provider="google" suite={suite} onResult={setProviderState} />
        <ProviderButton provider="apple" suite={suite} onResult={setProviderState} />
      </div>
      <div className="anim-rise text-ink-muted my-6 flex items-center gap-3.5 text-[14px] font-extrabold">
        <span className="bg-line h-px flex-1" />
        ou par email
        <span className="bg-line h-px flex-1" />
      </div>
      <form
        action={sendLink}
        noValidate
        onSubmit={() => setEditing(false)}
        className="anim-rise"
        style={animDelay(340)}
      >
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
          className={inputClasses(Boolean(emailError), 'min-h-[56px] px-[18px] text-[17px]')}
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
