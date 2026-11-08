'use client';

import { useActionState, useState, useTransition } from 'react';
import { Button, inputClasses, Toast } from '@repas/ui';
import { inviteMember, leaveHousehold, removeMember, revokeInvite, type FamilyState } from './actions';

export function InviteForm({ disabled }: { disabled: boolean }) {
  const [state, action, pending] = useActionState(inviteMember, { status: 'idle' } as FamilyState);
  const [copied, setCopied] = useState(false);
  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="invite" className="text-[15px] font-black">
        Inviter par email
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id="invite"
          name="email"
          type="email"
          required
          placeholder="prenom@email.fr"
          className={inputClasses(state.status === 'error', 'min-w-[220px] flex-1')}
        />
        <Button type="submit" disabled={pending || disabled}>
          Créer l’invitation
        </Button>
      </div>
      {state.status === 'error' ? (
        <p role="alert" className="text-danger text-[14px] font-extrabold">
          {state.message}
        </p>
      ) : null}
      {state.status === 'ok' && state.link ? (
        <div role="status" className="bg-site-mint rounded-[16px] p-4">
          <p className="text-success text-[14px] font-black">{state.message}</p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={state.link}
              aria-label="Lien d’invitation"
              className={inputClasses(false, 'min-h-[44px] flex-1 text-[13px]')}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void navigator.clipboard?.writeText(state.link!).then(() => setCopied(true))}
            >
              {copied ? 'Copié' : 'Copier'}
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  );
}

export function MemberAction({ kind, id }: { kind: 'retirer' | 'quitter' | 'annuler'; id?: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const run = () =>
    start(async () => {
      if (kind === 'annuler') return void (await revokeInvite(id));
      const res = kind === 'retirer' ? await removeMember(id) : await leaveHousehold();
      if (res.status !== 'idle') setMsg(res.message);
    });
  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={run}
        className="text-danger min-h-tap px-2 text-[14px] font-black underline disabled:opacity-50"
      >
        {kind === 'retirer' ? 'Retirer' : kind === 'quitter' ? 'Quitter ce foyer' : 'Annuler'}
      </button>
      {msg ? (
        <div className="fixed inset-x-4 bottom-28 z-30 mx-auto max-w-[480px] lg:bottom-8" role="status">
          <Toast>{msg}</Toast>
        </div>
      ) : null}
    </>
  );
}

export function CopyReferral({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <input
        readOnly
        value={link}
        aria-label="Ton lien de parrainage"
        className={inputClasses(false, 'min-h-[48px] flex-1 text-[14px]')}
      />
      <button
        type="button"
        onClick={() => void navigator.clipboard?.writeText(link).then(() => setCopied(true))}
        className="rounded-pill text-brand min-h-[48px] bg-white px-5 text-[15px] font-black"
      >
        {copied ? 'Copié' : 'Copier le lien'}
      </button>
    </div>
  );
}
