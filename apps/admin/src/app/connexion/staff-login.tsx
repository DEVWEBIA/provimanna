'use client';

import { useActionState } from 'react';
import { animDelay, Button, inputClasses } from '@repas/ui';
import { requestStaffCode, verifyStaffCode, type StaffAuthState } from './actions';

/** Connexion du staff : email, puis code à 6 chiffres (ou lien reçu par email). */
export function StaffLogin({ linkError }: { linkError: boolean }) {
  const [sent, send, sending] = useActionState(requestStaffCode, { status: 'idle' } as StaffAuthState);
  const [checked, check, checking] = useActionState(verifyStaffCode, { status: 'idle' } as StaffAuthState);
  const email = sent.status === 'sent' ? sent.email : '';

  if (sent.status === 'sent') {
    return (
      <form action={check} className="anim-rise flex flex-col gap-3">
        <input type="hidden" name="email" value={email} />
        <p className="text-ink-muted text-[15px]" role="status">
          Si <strong className="text-ink">{email}</strong> a un accès staff, un code vient de partir.
        </p>
        <label htmlFor="code" className="text-[15px] font-black">
          Code reçu
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          className={inputClasses(checked.status === 'error', 'text-[20px] tabular-nums tracking-[4px]')}
        />
        {checked.status === 'error' ? (
          <p role="alert" className="text-danger text-[14px] font-extrabold">
            {checked.message}
          </p>
        ) : null}
        <Button type="submit" disabled={checking}>
          Se connecter
        </Button>
      </form>
    );
  }
  return (
    <form action={send} className="anim-rise flex flex-col gap-3" style={animDelay(120)}>
      {linkError ? (
        <p
          role="alert"
          className="bg-danger-soft text-danger-ink rounded-[14px] px-4 py-3 text-[14px] font-bold"
        >
          Ce lien a expiré ou a déjà servi. Demande un nouveau code.
        </p>
      ) : null}
      <label htmlFor="email" className="text-[15px] font-black">
        Adresse email professionnelle
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={sent.status === 'error' ? sent.email : ''}
        className={inputClasses(sent.status === 'error')}
      />
      {sent.status === 'error' ? (
        <p role="alert" className="text-danger text-[14px] font-extrabold">
          {sent.message}
        </p>
      ) : null}
      <Button type="submit" disabled={sending}>
        Recevoir mon code
      </Button>
    </form>
  );
}
