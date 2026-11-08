'use client';

import { useState, useTransition } from 'react';
import { Button } from '@repas/ui';
import { giftDays, resendLink } from './actions';

/** Actions support sur un compte (offrir des jours réservé aux admins). */
export function SupportActions({
  householdId,
  email,
  userId,
  canGift,
}: {
  householdId: string;
  email: string;
  userId: string;
  canGift: boolean;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  const run = (fn: () => Promise<{ ok: boolean; message: string }>) => start(async () => setMsg(await fn()));
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={pending || !canGift}
        onClick={() => run(() => giftDays(householdId))}
      >
        Offrir 7 jours de Premium
      </Button>
      {!canGift ? <p className="text-ink-muted text-[12px] font-bold">Réservé aux administrateurs.</p> : null}
      <Button
        variant="neutral"
        size="sm"
        disabled={pending}
        onClick={() => run(() => resendLink(email, userId))}
      >
        Renvoyer un lien de connexion
      </Button>
      <Button variant="neutral" size="sm" disabled>
        Exporter ses données (RGPD) · lot 13
      </Button>
      <Button variant="danger" disabled>
        Supprimer le compte · lot 13
      </Button>
      {msg ? (
        <p
          role={msg.ok ? 'status' : 'alert'}
          className={`text-[14px] font-extrabold ${msg.ok ? 'text-success' : 'text-danger'}`}
        >
          {msg.message}
        </p>
      ) : null}
    </div>
  );
}
