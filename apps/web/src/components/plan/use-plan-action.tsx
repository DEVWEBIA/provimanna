'use client';

import { useState, useTransition } from 'react';
import { Toast } from '@repas/ui';
import type { PlanActionResult } from '@/app/app/(main)/plan/actions';

/** Lance une action serveur du plan dans une transition et garde son message d'erreur. */
export function usePlanAction() {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const run = (action: () => Promise<PlanActionResult>, onDone?: () => void) => {
    setMessage(null);
    start(async () => {
      const res = await action();
      if (!res.ok) setMessage(res.error);
      else onDone?.();
    });
  };
  return { run, pending, message, clear: () => setMessage(null) };
}

/** Message d'une action (en bas de l'écran, au-dessus de la barre d'onglets). */
export function ActionMessage({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="anim-rise fixed inset-x-4 bottom-28 z-30 mx-auto max-w-[520px] lg:bottom-8">
      <Toast
        action={
          <button
            type="button"
            onClick={onClose}
            className="min-h-tap text-raw-peche px-1 text-[14px] font-black"
          >
            OK
          </button>
        }
      >
        {message}
      </Toast>
    </div>
  );
}
