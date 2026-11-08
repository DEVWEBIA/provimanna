'use client';

import { useActionState, useTransition } from 'react';
import { Button, inputClasses } from '@repas/ui';
import { grantRole, revokeRole, type RoleState } from './actions';

export function GrantRoleForm() {
  const [state, action, pending] = useActionState(grantRole, { status: 'idle' } as RoleState);
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[240px] flex-1">
        <label htmlFor="email" className="mb-1.5 block text-[14px] font-black">
          Email du compte
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClasses(state.status === 'error')}
        />
      </div>
      <div>
        <label htmlFor="role" className="mb-1.5 block text-[14px] font-black">
          Rôle
        </label>
        <select id="role" name="role" className={inputClasses(false, 'w-auto')}>
          <option value="moderateur_prix">Modération des prix</option>
          <option value="editeur">Édition</option>
          <option value="support">Support</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        Attribuer
      </Button>
      {state.status !== 'idle' ? (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className={
            state.status === 'error'
              ? 'text-danger w-full text-[14px] font-extrabold'
              : 'text-success w-full text-[14px] font-extrabold'
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function RevokeButton({ userId, label }: { userId: string; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => void (await revokeRole(userId)))}
      aria-label={`Retirer le rôle de ${label}`}
      className="text-danger min-h-tap px-2 text-[14px] font-black underline disabled:opacity-50"
    >
      Retirer
    </button>
  );
}
