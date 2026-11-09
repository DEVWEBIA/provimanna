'use client';

import { useState, useTransition } from 'react';
import { buttonClasses } from '@repas/ui';
import { runImport } from './actions';

export function RunImportButton() {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  return (
    <span className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await runImport();
            setMessage(res.ok ? res.message : res.error);
          })
        }
        className={buttonClasses('primary', 'md')}
      >
        {pending ? 'Import en cours…' : 'Lancer maintenant'}
      </button>
      {message ? (
        <span role="status" className="text-ink-muted text-[13px] font-bold">
          {message}
        </span>
      ) : null}
    </span>
  );
}
