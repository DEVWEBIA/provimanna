'use client';

import { useActionState } from 'react';
import { Button, inputClasses } from '@repas/ui';
import { updateStore, type StoreState } from './actions';

export function StoreForm({
  store,
}: {
  store: { id: string; name: string; initials: string; drive_url: string | null; active: boolean };
}) {
  const [state, action, pending] = useActionState(updateStore, { status: 'idle' } as StoreState);
  return (
    <form action={action} className="flex flex-col gap-3" key={store.id}>
      <input type="hidden" name="id" value={store.id} />
      <div>
        <label htmlFor="s-name" className="mb-1 block text-[13px] font-black">
          Nom affiché
        </label>
        <input id="s-name" name="name" defaultValue={store.name} className={inputClasses()} />
      </div>
      <div>
        <label htmlFor="s-ini" className="mb-1 block text-[13px] font-black">
          Pastille (2 lettres)
        </label>
        <input
          id="s-ini"
          name="initials"
          defaultValue={store.initials}
          maxLength={2}
          className={inputClasses(false, 'w-24 uppercase')}
        />
      </div>
      <div>
        <label htmlFor="s-drive" className="mb-1 block text-[13px] font-black">
          Lien du drive
        </label>
        <input
          id="s-drive"
          name="drive_url"
          type="url"
          defaultValue={store.drive_url ?? ''}
          placeholder="https://"
          className={inputClasses()}
        />
      </div>
      <label className="min-h-tap flex items-center gap-2 text-[14px] font-bold">
        <input type="checkbox" name="active" defaultChecked={store.active} className="accent-brand h-5 w-5" />
        Enseigne active (comparée sur le site et dans l’appli)
      </label>
      {state.status !== 'idle' ? (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className={`text-[14px] font-extrabold ${state.status === 'error' ? 'text-danger' : 'text-success'}`}
        >
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        Enregistrer
      </Button>
    </form>
  );
}
