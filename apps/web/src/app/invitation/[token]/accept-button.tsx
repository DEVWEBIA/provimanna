'use client';

import { useState, useTransition } from 'react';
import { Button } from '@repas/ui';
import { acceptInvite } from './actions';

export function AcceptButton({ token }: { token: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <Button
        disabled={pending}
        onClick={() => start(async () => setError((await acceptInvite(token)).error))}
      >
        Rejoindre ce foyer
      </Button>
      {error ? (
        <p role="alert" className="text-danger text-[15px] font-extrabold">
          {error}
        </p>
      ) : null}
    </div>
  );
}
